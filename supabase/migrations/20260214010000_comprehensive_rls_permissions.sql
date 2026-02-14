-- ============================================
-- COMPREHENSIVE RLS & PERMISSIONS MIGRATION
-- ============================================
-- 
-- Purpose: Fix "permission denied for schema public" error
-- Root Cause: Prisma migrations don't grant Supabase role permissions
-- 
-- This migration:
-- 1. Grants schema USAGE to Supabase roles (authenticator, authenticated, anon)
-- 2. Grants table-level permissions to authenticated/anon roles
-- 3. Enables RLS on ALL tables
-- 4. Creates comprehensive RLS policies for each table
-- 5. Sets up default privileges for future tables
--
-- Security Model:
-- - authenticated: Full CRUD access controlled by RLS policies
-- - anon: Read-only access to public data (trips, schedules)
-- - authenticator: Connection role that inherits from authenticated/anon
-- ============================================

-- ============================================
-- PHASE 1: SCHEMA-LEVEL PERMISSIONS
-- ============================================

-- Grant USAGE on public schema (CRITICAL - fixes 42501 error)
GRANT USAGE ON SCHEMA public TO authenticator, authenticated, anon;

-- ============================================
-- PHASE 2: TABLE-LEVEL PERMISSIONS
-- ============================================

-- Grant permissions on ALL existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant sequence usage (for auto-increment IDs if any)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Set default privileges for FUTURE tables (preserves permissions after Prisma migrations)
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated, anon;

-- ============================================
-- PHASE 3: ENABLE RLS ON ALL TABLES
-- ============================================

-- Core user tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Operator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vessel" ENABLE ROW LEVEL SECURITY;

-- Trip management tables
ALTER TABLE "Trip" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TripSchedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PriceTier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TripSeat" ENABLE ROW LEVEL SECURITY;

-- Booking tables
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Passenger" ENABLE ROW LEVEL SECURITY;

-- Check-in and seat management
ALTER TABLE "Checkin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SeatLock" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Manifest" ENABLE ROW LEVEL SECURITY;

-- Enhancement tables
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PromoCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebhookEvent" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PHASE 4: RLS POLICIES - USER TABLES
-- ============================================

-- users: Users can only see and update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON "users";
CREATE POLICY "Users can view own profile"
  ON "users"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON "users";
CREATE POLICY "Users can update own profile"
  ON "users"
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevent users from modifying their role or isActive status
    AND role = (SELECT role FROM "users" WHERE id = auth.uid())
    AND "isActive" = (SELECT "isActive" FROM "users" WHERE id = auth.uid())
  );

-- Operator: Users can view their own operator profile
DROP POLICY IF EXISTS "Users view own operator profile" ON "Operator";
CREATE POLICY "Users view own operator profile"
  ON "Operator"
  FOR SELECT
  TO authenticated
  USING (
    "userId" = auth.uid() OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "Operators update own profile" ON "Operator";
CREATE POLICY "Operators update own profile"
  ON "Operator"
  FOR UPDATE
  TO authenticated
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());

-- Staff/admins can view all operators
DROP POLICY IF EXISTS "Staff view all operators" ON "Operator";
CREATE POLICY "Staff view all operators"
  ON "Operator"
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ============================================
-- PHASE 5: RLS POLICIES - TRIP TABLES (PUBLIC READ)
-- ============================================

-- Trip: Public read access, operator write access
DROP POLICY IF EXISTS "Anyone can view active trips" ON "Trip";
CREATE POLICY "Anyone can view active trips"
  ON "Trip"
  FOR SELECT
  TO authenticated, anon
  USING ("isActive" = true OR "deletedAt" IS NULL);

DROP POLICY IF EXISTS "Operators manage own trips" ON "Trip";
CREATE POLICY "Operators manage own trips"
  ON "Trip"
  FOR ALL
  TO authenticated
  USING (
    "operatorId" IN (SELECT id FROM "Operator" WHERE "userId" = auth.uid()) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- TripSchedule: Public read, operator manage
DROP POLICY IF EXISTS "Anyone can view trip schedules" ON "TripSchedule";
CREATE POLICY "Anyone can view trip schedules"
  ON "TripSchedule"
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Operators manage own schedules" ON "TripSchedule";
CREATE POLICY "Operators manage own schedules"
  ON "TripSchedule"
  FOR ALL
  TO authenticated
  USING (
    "tripId" IN (
      SELECT id FROM "Trip" WHERE "operatorId" IN (
        SELECT id FROM "Operator" WHERE "userId" = auth.uid()
      )
    ) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- PriceTier: Public read, operator manage
DROP POLICY IF EXISTS "Anyone can view price tiers" ON "PriceTier";
CREATE POLICY "Anyone can view price tiers"
  ON "PriceTier"
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Operators manage price tiers" ON "PriceTier";
CREATE POLICY "Operators manage price tiers"
  ON "PriceTier"
  FOR ALL
  TO authenticated
  USING (
    "tripScheduleId" IN (
      SELECT id FROM "TripSchedule" WHERE "tripId" IN (
        SELECT id FROM "Trip" WHERE "operatorId" IN (
          SELECT id FROM "Operator" WHERE "userId" = auth.uid()
        )
      )
    ) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- TripSeat: Public read, operator manage
DROP POLICY IF EXISTS "Anyone can view seats" ON "TripSeat";
CREATE POLICY "Anyone can view seats"
  ON "TripSeat"
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Operators manage seats" ON "TripSeat";
CREATE POLICY "Operators manage seats"
  ON "TripSeat"
  FOR ALL
  TO authenticated
  USING (
    "tripScheduleId" IN (
      SELECT id FROM "TripSchedule" WHERE "tripId" IN (
        SELECT id FROM "Trip" WHERE "operatorId" IN (
          SELECT id FROM "Operator" WHERE "userId" = auth.uid()
        )
      )
    ) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- Vessel: Operators see own vessels, public see active vessels
DROP POLICY IF EXISTS "Anyone can view vessels" ON "Vessel";
CREATE POLICY "Anyone can view vessels"
  ON "Vessel"
  FOR SELECT
  TO authenticated, anon
  USING ("deletedAt" IS NULL);

DROP POLICY IF EXISTS "Operators manage own vessels" ON "Vessel";
CREATE POLICY "Operators manage own vessels"
  ON "Vessel"
  FOR ALL
  TO authenticated
  USING (
    "operatorId" IN (SELECT id FROM "Operator" WHERE "userId" = auth.uid()) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ============================================
-- PHASE 6: RLS POLICIES - BOOKING TABLES
-- ============================================

-- Booking: Users see own bookings, operators see their schedule bookings
DROP POLICY IF EXISTS "Users view own bookings" ON "Booking";
CREATE POLICY "Users view own bookings"
  ON "Booking"
  FOR SELECT
  TO authenticated
  USING (
    "userId" = auth.uid() OR
    "operatorId" IN (SELECT id FROM "Operator" WHERE "userId" = auth.uid()) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "Users create own bookings" ON "Booking";
CREATE POLICY "Users create own bookings"
  ON "Booking"
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = auth.uid());

DROP POLICY IF EXISTS "Users update own bookings" ON "Booking";
CREATE POLICY "Users update own bookings"
  ON "Booking"
  FOR UPDATE
  TO authenticated
  USING (
    "userId" = auth.uid() OR
    "operatorId" IN (SELECT id FROM "Operator" WHERE "userId" = auth.uid()) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- BookingItem: Same access as parent Booking
DROP POLICY IF EXISTS "Users view own booking items" ON "BookingItem";
CREATE POLICY "Users view own booking items"
  ON "BookingItem"
  FOR SELECT
  TO authenticated
  USING (
    "bookingId" IN (
      SELECT id FROM "Booking" WHERE "userId" = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM "Booking" b
      JOIN "Operator" o ON b."operatorId" = o.id
      WHERE b.id = "BookingItem"."bookingId" AND o."userId" = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "Users manage own booking items" ON "BookingItem";
CREATE POLICY "Users manage own booking items"
  ON "BookingItem"
  FOR ALL
  TO authenticated
  USING (
    "bookingId" IN (SELECT id FROM "Booking" WHERE "userId" = auth.uid()) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- Payment: Users see own payments, operators see their bookings' payments
DROP POLICY IF EXISTS "Users view own payments" ON "Payment";
CREATE POLICY "Users view own payments"
  ON "Payment"
  FOR SELECT
  TO authenticated
  USING (
    "bookingId" IN (SELECT id FROM "Booking" WHERE "userId" = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM "Booking" b
      JOIN "Operator" o ON b."operatorId" = o.id
      WHERE b.id = "Payment"."bookingId" AND o."userId" = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "System creates payments" ON "Payment";
CREATE POLICY "System creates payments"
  ON "Payment"
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Payments created by payment webhooks/server actions

-- Passenger: Same access as Booking
DROP POLICY IF EXISTS "Users view own passengers" ON "Passenger";
CREATE POLICY "Users view own passengers"
  ON "Passenger"
  FOR SELECT
  TO authenticated
  USING (
    "bookingId" IN (SELECT id FROM "Booking" WHERE "userId" = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM "Booking" b
      JOIN "Operator" o ON b."operatorId" = o.id
      WHERE b.id = "Passenger"."bookingId" AND o."userId" = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "Users manage own passengers" ON "Passenger";
CREATE POLICY "Users manage own passengers"
  ON "Passenger"
  FOR ALL
  TO authenticated
  USING (
    "bookingId" IN (SELECT id FROM "Booking" WHERE "userId" = auth.uid()) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- ============================================
-- PHASE 7: RLS POLICIES - CHECK-IN & SEAT LOCKS
-- ============================================

-- Checkin: Operators/staff check in passengers
DROP POLICY IF EXISTS "Operators view checkins" ON "Checkin";
CREATE POLICY "Operators view checkins"
  ON "Checkin"
  FOR SELECT
  TO authenticated
  USING (
    "bookingId" IN (
      SELECT id FROM "Booking" WHERE "userId" = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM "Booking" b
      JOIN "Operator" o ON b."operatorId" = o.id
      WHERE b.id = "Checkin"."bookingId" AND o."userId" = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('operator', 'staff', 'admin'))
  );

DROP POLICY IF EXISTS "Operators create checkins" ON "Checkin";
CREATE POLICY "Operators create checkins"
  ON "Checkin"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('operator', 'staff', 'admin'))
  );

-- SeatLock: Users lock seats during booking, auto-expire
DROP POLICY IF EXISTS "Users manage own seat locks" ON "SeatLock";
CREATE POLICY "Users manage own seat locks"
  ON "SeatLock"
  FOR ALL
  TO authenticated
  USING (
    "lockedById" = auth.uid() OR
    "bookingId" IN (SELECT id FROM "Booking" WHERE "userId" = auth.uid()) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- Manifest: Operators generate manifests for their trips
DROP POLICY IF EXISTS "Operators view manifests" ON "Manifest";
CREATE POLICY "Operators view manifests"
  ON "Manifest"
  FOR SELECT
  TO authenticated
  USING (
    "tripScheduleId" IN (
      SELECT id FROM "TripSchedule" WHERE "tripId" IN (
        SELECT id FROM "Trip" WHERE "operatorId" IN (
          SELECT id FROM "Operator" WHERE "userId" = auth.uid()
        )
      )
    ) OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "Operators create manifests" ON "Manifest";
CREATE POLICY "Operators create manifests"
  ON "Manifest"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('operator', 'staff', 'admin'))
  );

-- ============================================
-- PHASE 8: RLS POLICIES - ENHANCEMENT TABLES
-- ============================================

-- AuditLog: Staff/admin only
DROP POLICY IF EXISTS "Staff view audit logs" ON "AuditLog";
CREATE POLICY "Staff view audit logs"
  ON "AuditLog"
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "System creates audit logs" ON "AuditLog";
CREATE POLICY "System creates audit logs"
  ON "AuditLog"
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Created by server actions

-- EmailLog: Users see own emails, staff see all
DROP POLICY IF EXISTS "Users view own email logs" ON "EmailLog";
CREATE POLICY "Users view own email logs"
  ON "EmailLog"
  FOR SELECT
  TO authenticated
  USING (
    "userId" = auth.uid() OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "System creates email logs" ON "EmailLog";
CREATE POLICY "System creates email logs"
  ON "EmailLog"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Review: Public read, users write own reviews
DROP POLICY IF EXISTS "Anyone can view public reviews" ON "Review";
CREATE POLICY "Anyone can view public reviews"
  ON "Review"
  FOR SELECT
  TO authenticated, anon
  USING ("isPublic" = true);

DROP POLICY IF EXISTS "Users view own reviews" ON "Review";
CREATE POLICY "Users view own reviews"
  ON "Review"
  FOR SELECT
  TO authenticated
  USING ("userId" = auth.uid());

DROP POLICY IF EXISTS "Users create own reviews" ON "Review";
CREATE POLICY "Users create own reviews"
  ON "Review"
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = auth.uid());

DROP POLICY IF EXISTS "Users update own reviews" ON "Review";
CREATE POLICY "Users update own reviews"
  ON "Review"
  FOR UPDATE
  TO authenticated
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());

-- PromoCode: Public read active codes, staff manage
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON "PromoCode";
CREATE POLICY "Anyone can view active promo codes"
  ON "PromoCode"
  FOR SELECT
  TO authenticated, anon
  USING (
    "isActive" = true 
    AND "validFrom" <= NOW() 
    AND "validUntil" >= NOW()
  );

DROP POLICY IF EXISTS "Staff manage promo codes" ON "PromoCode";
CREATE POLICY "Staff manage promo codes"
  ON "PromoCode"
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- WebhookEvent: System/staff only
DROP POLICY IF EXISTS "Staff view webhook events" ON "WebhookEvent";
CREATE POLICY "Staff view webhook events"
  ON "WebhookEvent"
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

DROP POLICY IF EXISTS "System creates webhook events" ON "WebhookEvent";
CREATE POLICY "System creates webhook events"
  ON "WebhookEvent"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- PHASE 9: VERIFICATION QUERY
-- ============================================

-- Verify RLS and permissions are active
SELECT 
  '✓ Schema Permissions' as check_type,
  COUNT(*) as count
FROM (
  SELECT 1 FROM pg_namespace n
  WHERE n.nspname = 'public'
    AND has_schema_privilege('authenticated', n.oid, 'USAGE')
) verified

UNION ALL

SELECT 
  '✓ Table Grants (authenticated)' as check_type,
  COUNT(DISTINCT table_name) as count
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee = 'authenticated'
  AND privilege_type = 'SELECT'

UNION ALL

SELECT 
  '✓ RLS Enabled Tables' as check_type,
  COUNT(*) as count
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relrowsecurity = true

UNION ALL

SELECT 
  '✓ RLS Policies Created' as check_type,
  COUNT(*) as count
FROM pg_policies
WHERE schemaname = 'public';
