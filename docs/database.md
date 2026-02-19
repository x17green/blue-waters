# 🧮 Database Schema (Supabase PostgreSQL)

## Overview

The database uses **Supabase PostgreSQL** accessed via **Prisma ORM** for type-safe queries. The schema supports the booking lifecycle — from trip creation and seat reservation to payment confirmation and boarding verification.

## Database Access Strategy

**Hybrid Approach**:
- **Supabase Auth** manages the `auth.users` table (read-only for us)
- **Prisma ORM** provides direct access to all other tables
- **Database trigger** syncs `auth.users` → `public.users` automatically

**Why Prisma over Supabase SDK?**
- ✅ Type-safe queries prevent runtime errors
- ✅ Better performance for complex joins/transactions
- ✅ Full control over business logic
- ✅ Easy testing with mock clients
- ✅ Familiar ORM patterns

## Core Tables

### Authentication Tables

| Table | Managed By | Description |
|-------|-----------|-------------|
| `auth.users` | **Supabase Auth** (read-only) | Core authentication data (email, password hash, etc.). |
| `public.users` | **Our application** (via Prisma) | Extended user profiles (name, phone, role, preferences). |

⚠️ **Important**: `auth.users` is managed by Supabase Auth. We **cannot** directly modify it. Instead, we maintain `public.users` and sync via database trigger.

**Sync Trigger**:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Business Tables

| Table | Description |
|--------|-------------|
| `users` | Extended user profiles (synced with auth.users via trigger). |
| `operators` | Vessel owners or event organizers (linked to users). |
| `vessels` | Registered boats with capacity data. |
| `trips` | Defined cruise types (e.g. "Sunset Bay Tour"). |
| `trip_schedules` | Individual dated cruise sessions with real-time capacity. |
| `price_tiers` | Ticket categories and prices (General, VIP, Cabin). |
| `bookings` | Top-level booking entities per user. |
| `booking_items` | Individual tickets linked to bookings. |
| `passengers` | Passenger details for manifest compliance. |
| `payments` | MetaTickets/Paystack transaction logs. |
| `webhook_events` | Raw inbound webhook payload storage (idempotency). |
| `checkin_records` | Boarding records via QR code scanning. |
| `seat_locks` | Temporary seat reservations (10-min TTL via Redis). |

## Transactional Flow (with Prisma)

```typescript
// Example: Booking creation with Prisma transaction
import { prisma } from '@/lib/prisma'
import { redisClient } from '@/lib/redis'

const booking = await prisma.$transaction(async (tx) => {
  // 1. Check real-time capacity
  const schedule = await tx.tripSchedule.findUnique({
    where: { id: scheduleId },
    select: { capacity: true, bookedSeats: true }
  })
  
  if (schedule.bookedSeats >= schedule.capacity) {
    throw new Error('Trip is sold out')
  }
  
  // 2. Create booking (status: held)
  const booking = await tx.booking.create({
    data: {
      userId: user.id,
      tripScheduleId: scheduleId,
      status: 'held',
      totalAmountKobo: 25000,
      holdExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min
    }
  })
  
  // 3. Reserve seat with Redis lock (outside transaction)
  await redisClient.setex(
    `seat_lock:${scheduleId}:${user.id}`,
    600, // 10 minutes
    booking.id
  )
  
  // 4. Generate MetaTickets checkout URL
  const checkoutUrl = await createMetaTicketsSession(booking)
  
  return { booking, checkoutUrl }
})
```

**Webhook Flow** (Payment confirmation):
```typescript
// POST /api/webhooks/metatickets
export async function POST(req: NextRequest) {
  // 1. Verify HMAC signature
  const signature = req.headers.get('x-metatickets-signature')
  if (!verifyWebhookSignature(signature, await req.text())) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const event = await req.json()
  
  // 2. Idempotency check (prevent duplicate processing)
  const existing = await prisma.webhookEvent.findUnique({
    where: { providerEventId: event.id }
  })
  if (existing?.processed) {
    return Response.json({ message: 'Already processed' })
  }
  
  // 3. Store webhook event
  await prisma.webhookEvent.create({
    data: {
      provider: 'metatickets',
      providerEventId: event.id,
      eventType: event.type,
      payload: event,
      processed: false
    }
  })
  
  // 4. Update booking status
  if (event.type === 'payment.succeeded') {
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: event.metadata.booking_id },
        data: { status: 'paid' }
      })
      
      await tx.payment.create({
        data: {
          bookingId: event.metadata.booking_id,
          amountKobo: event.amount,
          status: 'succeeded',
          providerTransactionId: event.transaction_id
        }
      })
      
      // Mark webhook as processed
      await tx.webhookEvent.update({
        where: { providerEventId: event.id },
        data: { processed: true }
      })
    })
    
    // 5. Generate QR code ticket
    await generateQRCodeTicket(event.metadata.booking_id)
    
    // 6. Send confirmation email/SMS
    await sendBookingConfirmation(event.metadata.booking_id)
  }
  
  return Response.json({ received: true })
}
```

## Indexes (Performance Optimization)

```sql
-- Optimize trip search queries
CREATE INDEX idx_trip_schedules_search 
ON trip_schedules(start_time, capacity) 
WHERE capacity > 0;

-- Optimize user booking lookups
CREATE INDEX idx_bookings_user_status 
ON bookings(user_id, status) 
INCLUDE (created_at, total_amount_kobo);

-- Prevent duplicate webhook processing
CREATE UNIQUE INDEX idx_webhook_events_provider_event 
ON webhook_events(provider, provider_event_id);

-- Optimize manifest generation
CREATE INDEX idx_checkin_records_schedule 
ON checkin_records(trip_schedule_id, checked_in_at);

-- Full-text search for trips
CREATE INDEX idx_trips_fulltext 
ON trips USING gin(to_tsvector('english', title || ' ' || description));
```  

## Data Integrity Rules

**Referential Integrity**:
- Cascading deletes from parent entities (e.g., delete user → cascade to bookings)
- Foreign keys enforced at database level
- Prisma schema validates relationships at compile time

**Concurrency Control**:
- Optimistic locking for seat reservations (check capacity in transaction)
- Redis distributed locks prevent double-booking during checkout
- Idempotent webhook processing (unique constraint on `provider_event_id`)

**Data Consistency**:
- `auth.users` and `public.users` synced via database trigger
- Booking totals calculated and validated in application layer
- Prisma transactions ensure atomic operations

**Backup & Recovery**:
- Supabase automatic backups (daily)

---

### Schema changes: Trip canonical route (new)
- Migration: `prisma/migrations/20260219000000_add_trip_route_fields/migration.sql` adds `departurePort`, `arrivalPort`, `routeName` columns to `Trip`.
- Seed/backfill: `prisma/seed.ts` now backfills trip-level route fields from the earliest `TripSchedule` when schedules have port data.
- API/UX: server APIs now accept and return trip-level route fields; frontend prefers `trip.departurePort`/`trip.arrivalPort` when present.

Rollout steps:
1. Apply migration: `npx prisma migrate deploy` (or `npx prisma migrate dev` locally).
2. Run seed/backfill: `node prisma/seed.ts` (or `pnpm prisma db seed`).
3. Regenerate Prisma client: `npx prisma generate`.
4. Restart services and verify public trip pages show canonical routes.

Rollback:
- If required, revert the migration using `npx prisma migrate resolve --applied "20260219000000_add_trip_route_fields"` and restore database from backup.

Notes:
- The migration is additive and safe; backfill follows deterministic rule (earliest schedule wins).
- After migration, run `scripts/check-trip-route-backfill.js` to validate backfill results.
- Point-in-Time Recovery (PITR) enabled
- 7-day backup retention

## ORM Configuration

See `/prisma/schema.prisma` for the complete Prisma schema definition.

**Key Prisma Features Used**:
- Type-safe queries with auto-completion
- Database migrations (`prisma migrate`)
- Seed scripts for development data
- Relation queries with eager/lazy loading
- Transaction support for complex operations

**Connection String** (environment variable):
```bash
# Direct connection (for migrations)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# Connection pooling (for production API routes)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```
