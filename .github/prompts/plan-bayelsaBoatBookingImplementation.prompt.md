# Bayelsa Boat Club: Bayelsa Boat Booking Platform - Implementation Plan

## Executive Summary

**Project**: Online boat cruise booking system for Bayelsa State, Nigeria  
**Timeline**: 12 weeks to MVP (February 12 - May 6, 2026)  
**Budget**: ₦12.84M (~$19.2K USD) first year (25% cost savings vs traditional stack)  
**Tech Stack**: Next.js, Supabase (Auth + PostgreSQL), Prisma, Redis, Vercel  
**Architecture**: Hybrid (Supabase Auth + Custom API Routes with direct DB access)  
**Revenue Model**: 8% commission per booking  

---

## Technology Stack

| Category | Technology | Purpose | Why Chosen |
|----------|-----------|---------|------------|
| **Frontend** | Next.js 16 (App Router) | Web application | SSR, API routes, React 19, TypeScript |
| **Authentication** | Supabase Auth | User signup/login/logout | No custom auth needed, saves 2 weeks dev time |
| **Database** | Supabase PostgreSQL | Data storage | Managed PostgreSQL, automatic backups |
| **ORM** | Prisma | Database access | Type-safe queries, migrations, direct connection |
| **Caching/Locks** | Upstash Redis | Seat locking, caching | Serverless, low latency, global replication |
| **Storage** | Supabase Storage | Files, QR codes, manifests | S3-compatible, integrated with Supabase |
| **Hosting** | Vercel | Next.js deployment | Automatic scaling, preview deployments, edge functions |
| **Payments** | MetaTickets + Paystack | Payment processing | Local Nigerian PSPs, fallback redundancy |
| **Email** | SendGrid/Resend | Transactional emails | Reliable delivery, templates |
| **SMS** | Twilio/Termii | Booking confirmations | Nigerian phone support, international fallback |
| **Monitoring** | Sentry + Vercel Analytics | Error tracking, performance | Real-time alerts, web vitals |
| **Testing** | Jest + Playwright | Unit + E2E tests | Industry standard, great DX |

**Key Decision: Hybrid Architecture**
- ✅ Supabase handles ALL authentication (no custom auth API routes)
- ✅ Prisma provides direct database access for complex business logic
- ✅ Next.js API routes for booking engine, webhooks, manifests
- ✅ Best of both worlds: managed auth + full control over business logic

---

## Phase 1: Planning & Requirements (Weeks 1-2)
**Duration**: Feb 12 - Feb 25, 2026

### Key Activities

#### 1.1 Project Initiation
- [ ] Develop business case with market size estimation
- [ ] Create revenue projections (Year 1-3)
- [ ] Identify stakeholders (Green, Stella/MetaTickets, operators, Ministry of Marine)
- [ ] Draft project charter with vision, success criteria, constraints
- [ ] Initialize risk register

#### 1.2 Requirements Documentation
- [ ] Document 5 core business requirements (BR-001 to BR-005)
- [ ] Document 20 functional requirements (FR-001 to FR-020)
  - User management (registration, login, booking history)
  - Booking flow (search, seat selection, real-time capacity, QR tickets)
  - Operator portal (schedule creation, dynamic pricing, manifests)
  - Safety & compliance (passenger data, liability waivers, certifications)
  - Check-in system (QR scanning, manual fallback)
- [ ] Document 21 non-functional requirements (NFR-001 to NFR-021)
  - Performance: <2s page load, <5s booking completion
  - Security: PCI-DSS, TLS 1.3, bcrypt passwords, rate limiting
  - Reliability: 99.5% uptime, 6-hour backups
  - Usability: Mobile-first, English + Pidgin, WCAG 2.1 AA
  - Scalability: Horizontal scaling, CDN, connection pooling

#### 1.3 Feasibility Analysis
- [ ] **Technical**: Confirm MetaTickets API availability with Stella
- [ ] **Operational**: Assess dock internet connectivity (backup solutions needed)
- [ ] **Economic**: Validate break-even at 250 bookings/month
- [ ] **Legal**: Register with NITDA for data protection compliance

### Deliverables
1. Product Requirements Document (PRD) - 15-20 pages
2. Technical Requirements Specification (TRS) - 10-15 pages
3. Gantt chart with 12-week timeline
4. Risk assessment matrix with mitigation strategies
5. Resource allocation plan

---

## Phase 2: Analysis & Design (Weeks 2-4)
**Duration**: Feb 18 - Mar 11, 2026

### Key Activities

#### 2.1 Use Case Development
- [ ] UC-001: Customer Books Cruise (12-step main flow + alternatives)
- [ ] UC-002: Operator Creates Trip Schedule
- [ ] UC-003: Staff Checks In Passenger
- [ ] UC-004: System Processes Refund
- [ ] UC-005: Operator Exports Manifest
- [ ] Develop 15-20 total use cases with actors, preconditions, flows

#### 2.2 Data Flow Diagrams
- [ ] Level 0: Context diagram (external entities)
- [ ] Level 1: Major processes (6 core processes)
- [ ] Level 2: Detailed DFDs for each process

#### 2.3 Architecture Design

**Hybrid Architecture** (Supabase Auth + Custom Business Logic):
```
┌──────────────────────────────────────────────────────────┐
│ FRONTEND (Next.js)                                        │
│                                                           │
│  Authentication              Business Logic              │
│       ↓                             ↓                     │
│  @supabase/supabase-js      Next.js API Routes          │
│  (signUp, signIn, signOut)  (fetch /api/*)              │
│  No backend routes needed!                               │
└──────────────────────────────────────────────────────────┘
         ↓                             ↓
┌────────────────────┐    ┌──────────────────────────────┐
│  Supabase Auth     │    │  Custom API Routes           │
│  (Managed Service) │    │  (Next.js /app/api/*)        │
│                    │    │                              │
│  - JWT tokens      │    │  - Verify JWT (middleware)   │
│  - Email verify    │    │  - Booking engine            │
│  - Password reset  │    │  - Payment webhooks          │
│  - Social login    │    │  - Manifest generation       │
└────────────────────┘    │  - Complex business logic    │
         ↓                 └──────────────────────────────┘
         ↓                              ↓
┌──────────────────────────────────────────────────────────┐
│  DATA TIER                                                │
│  ┌──────────────────┐  ┌─────────┐  ┌────────────────┐  │
│  │ Supabase         │  │ Redis   │  │ Supabase       │  │
│  │ PostgreSQL       │  │ (Upstash│  │ Storage        │  │
│  │                  │  │ /AWS)   │  │ (S3-compatible)│  │
│  │ • auth.users     │  │         │  │                │  │
│  │ • users (custom) │  │ • Locks │  │ • QR codes     │  │
│  │ • bookings       │  │ • Cache │  │ • Manifests    │  │
│  │ • trips          │  │         │  │ • Images       │  │
│  └──────────────────┘  └─────────┘  └────────────────┘  │
│                                                           │
│  Access Method: Prisma (type-safe, direct connection)    │
└──────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────┐
│  EXTERNAL INTEGRATIONS                                    │
│  - MetaTickets API (Primary Payment)                     │
│  - Paystack API (Fallback Payment)                       │
│  - Twilio/Termii (SMS Notifications)                     │
│  - SendGrid/Resend (Email Notifications)                 │
└──────────────────────────────────────────────────────────┘
```

**Key Architecture Decisions**:
- ✅ **No custom auth API routes** - Supabase handles all authentication
- ✅ **Direct database access** - Prisma connects directly to Supabase PostgreSQL
- ✅ **JWT verification** - Supabase tokens verified in API route middleware
- ✅ **Hybrid approach** - Best of managed auth + custom business logic

#### 2.3.1 Hybrid Approach: Benefits & Considerations

**✅ Benefits**:

1. **Reduced Development Time**
   - No need to build auth endpoints (signup, login, password reset, email verification)
   - Social login (Google, Facebook) out-of-the-box
   - JWT token management handled automatically
   - **Saves: ~2 weeks of development time**

2. **Enhanced Security**
   - Supabase Auth is battle-tested and maintained by experts
   - Automatic security updates and patches
   - Built-in protection against common auth vulnerabilities
   - Row Level Security (RLS) available if needed

3. **Better Developer Experience**
   - Type-safe database queries with Prisma
   - Full control over business logic
   - Easy local development with Supabase CLI
   - Real-time subscriptions available for live updates

4. **Cost Effective**
   - Supabase free tier: 50,000 monthly active users
   - No separate server costs for auth service
   - Managed database backups included
   - **Estimated savings: ₦100K-150K/month vs self-hosted**

5. **Scalability**
   - Supabase Auth scales automatically
   - Next.js API routes can scale independently (Vercel Edge Functions)
   - Database connection pooling handled by Supabase

**⚠️ Considerations**:

1. **Vendor Lock-in (Mitigated)**
   - Auth tied to Supabase, but data remains in standard PostgreSQL
   - Can migrate to self-hosted Supabase or other providers
   - Prisma ORM makes database migration easier

2. **Row Level Security (RLS) Limitations**
   - Direct Prisma access bypasses Supabase RLS policies
   - Must implement authorization manually in API routes
   - **Solution**: Create reusable authorization middleware

3. **auth.users Table Restrictions**
   - Cannot modify Supabase's managed auth.users schema
   - Must create separate users table for extended profile data
   - **Solution**: Database trigger keeps tables in sync automatically

4. **Debugging Complexity**
   - Auth issues require checking both Supabase logs and app logs
   - **Solution**: Comprehensive logging in API route middleware

**Architecture Decision Record**:
```markdown
# ADR-001: Hybrid Architecture (Supabase Auth + Custom API Routes)

Date: 2026-02-12
Status: Accepted

## Context
Need authentication + complex booking business logic.
Options: 
1. Full custom backend (Node.js/Express)
2. Full Supabase (PostgREST + RLS)
3. Hybrid (Supabase Auth + custom API routes)

## Decision
Choose hybrid approach (#3).

## Rationale
- Faster development (no auth endpoints)
- Full control over business logic
- Type-safe queries with Prisma
- Better testing (mock Prisma vs mocking Supabase SDK)
- Familiar Next.js API routes pattern

## Consequences
Positive:
- 2-week time savings on auth
- Better developer experience
- Lower infrastructure costs

Negative:
- Must manually implement authorization
- Cannot use Supabase RLS policies
- Requires JWT verification middleware
```

#### 2.4 Database Design
- [ ] Create ER diagrams with 15+ tables
- [ ] Normalize to 3NF
- [ ] Design indexing strategy:
  - Composite indexes for common queries
  - Full-text search for trip discovery
  - Partial indexes for conditional filters
- [ ] Plan partitioning strategy (monthly for bookings table)
- [ ] Define backup strategy:
  - Continuous WAL archiving to S3
  - Daily full backups at 2 AM WAT
  - 7 daily + 4 weekly + 3 monthly retention
  - Monthly restore tests

**Core Tables**:
- users, user_roles, organizations
- vessels, trips, trip_schedules, price_tiers
- bookings, booking_items, passengers
- payments, webhook_events
- safety_checklists, checkin_records

#### 2.5 API Design
- [ ] Create OpenAPI 3.0 specification
- [ ] Design RESTful endpoints (Next.js API Routes):
  - **Public**: GET /api/trips, GET /api/vessels/[id]
  - **Authenticated**: POST /api/bookings, GET /api/bookings/[id], POST /api/bookings/[id]/cancel
  - **Operator**: POST /api/operator/trips, GET /api/operator/manifests/[schedule_id]
  - **Webhook**: POST /api/webhooks/metatickets, POST /api/webhooks/paystack
  - **Internal**: POST /api/checkin/verify, GET /api/checkin/status/[schedule_id]
- [ ] **NO auth endpoints needed** - Supabase Auth handles signup/login/logout
- [ ] Create JWT verification middleware for protected routes
- [ ] Design pagination, filtering, sorting standards
- [ ] Document error response formats

**Authentication Flow**:
```typescript
// Frontend: Direct Supabase Auth (no API call)
import { supabase } from '@/lib/supabase'

// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com', 
  password: 'password'
})

// Logout
const { error } = await supabase.auth.signOut()
```

**Protected API Route Pattern**:
```typescript
// src/app/api/bookings/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  // 1. Verify JWT from Supabase
  const token = req.headers.get('authorization')?.split('Bearer ')[1]
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  // 2. Business logic with Prisma (direct DB access)
  const booking = await prisma.booking.create({
    data: { userId: user.id, ... }
  })
  
  return Response.json({ booking })
}
```

#### 2.6 UI/UX Design

**Design System**:
- **Colors**: Primary #0066CC, Secondary #FFB900, Success #10B981
- **Typography**: Inter (Headings: Bold 28/24/20px, Body: Regular 16px)
- **Components**: Buttons, inputs, cards, modals, alerts

**Key Screens**:
1. Homepage (hero search, featured trips, how it works)
2. Trip Listing (filters, grid, pagination)
3. Trip Detail (gallery, pricing tiers, availability calendar)
4. Booking Flow (5-step: tier selection → passenger details → review → payment → confirmation)
5. Operator Dashboard (stats, upcoming trips, revenue chart)
6. Check-in Interface (QR scanner, manual search, live count)

- [ ] Create low-fidelity wireframes (Week 2)
- [ ] Design high-fidelity mockups in Figma (Week 3)
- [ ] Build interactive prototype (Week 4)
- [ ] Generate CSS tokens for handoff (Week 4)

#### 2.7 Security Design
- [ ] Implement JWT-based auth with refresh tokens
- [ ] Design role-based access control (Customer, Operator, Staff, Admin)
- [ ] Plan data encryption:
  - TLS 1.3 in transit
  - PostgreSQL TDE at rest
  - AES-256 for PII
  - bcrypt (cost 12) for passwords
- [ ] Create threat model with mitigations:
  - SQL Injection → Parameterized queries
  - XSS → Sanitization + CSP headers
  - CSRF → Tokens + SameSite cookies
  - DDoS → Cloudflare + rate limiting
  - Payment fraud → 3DS, velocity checks
  - Double booking → Optimistic locking
- [ ] Plan NDPR compliance (privacy policy, DPO, breach notification)

### Deliverables
1. System Architecture Document (25-30 pages)
2. Database Schema with ER diagrams (10-15 pages)
3. API Specification (OpenAPI YAML + auto-generated docs)
4. UI/UX Design System (Figma file + documentation)
5. Security & Compliance Plan (15-20 pages)
6. Infrastructure Diagram (AWS architecture)

---

## Phase 3: Development (Weeks 4-10)
**Duration**: Mar 4 - Apr 15, 2026

### Development Environment Setup
- [ ] Initialize Supabase project (local + cloud)
- [ ] Set up Prisma with Supabase PostgreSQL connection
- [ ] Create Docker Compose for local dev (Redis for caching/locks)
- [ ] Configure Gitflow branching (main → develop → feature branches)
- [ ] Implement Conventional Commits
- [ ] Set up ESLint + Prettier
- [ ] Configure TypeScript strict mode

**Environment Variables**:
```env
# Supabase (Authentication + Database)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # Client-side
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # Server-side (JWT verification)

# Database (Direct Connection via Prisma)
DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

# Redis (Upstash or AWS ElastiCache)
REDIS_URL=redis://default:[PASSWORD]@[HOST]:6379

# Payment Providers
METATICKETS_API_KEY=xxx
METATICKETS_WEBHOOK_SECRET=xxx
PAYSTACK_SECRET_KEY=sk_live_xxx
PAYSTACK_PUBLIC_KEY=pk_live_xxx

# Notifications
SENDGRID_API_KEY=SG.xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TERMII_API_KEY=TLxxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Prisma Setup**:
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma with PostgreSQL
npx prisma init --datasource-provider postgresql

# Sync schema with Supabase database
npx prisma db pull

# Generate Prisma Client
npx prisma generate
```

### Sprint Planning (2-week sprints)

#### Sprint 1 (Weeks 4-5): Foundation
**Mar 4 - Mar 17**
- [ ] Initialize Supabase project (create project on supabase.com)
- [ ] Set up Supabase Auth (configure email provider, social logins)
- [ ] Integrate @supabase/supabase-js in frontend
- [ ] Set up Prisma with Supabase PostgreSQL connection
- [ ] Run Prisma migrations (sync with existing Supabase schema)
- [ ] Create database trigger to sync auth.users → users table
- [ ] Create JWT verification middleware for API routes
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Test framework setup (Jest + Supertest)

**Acceptance Criteria**:
- User can register via Supabase Auth (email/password)
- User can login and receive JWT token from Supabase
- JWT token automatically stored in cookies/localStorage
- Protected API routes verify JWT using Supabase service role key
- User profile created in custom users table via trigger
- All tests pass with >80% coverage

**Key Files to Create**:
```typescript
// src/lib/supabase.ts (Already exists - Client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// src/lib/supabase-server.ts (NEW - Server-side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// src/lib/prisma.ts (NEW - Database access)
export const prisma = new PrismaClient()

// src/middleware/auth.ts (NEW - JWT verification)
export async function verifyAuth(req: NextRequest) {
  const token = req.headers.get('authorization')?.split('Bearer ')[1]
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) throw new Error('Unauthorized')
  return user
}
```

**Database Trigger** (Supabase SQL Editor):
```sql
-- Sync auth.users with public.users table
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

#### Sprint 2 (Weeks 5-6): Trip Management
**Mar 18 - Mar 31**
- [ ] Create API routes for trip CRUD (POST /api/operator/trips, GET /api/trips)
- [ ] Implement Prisma queries for trip operations
- [ ] Add JWT verification to operator-only routes
- [ ] Vessel management (operator portal)
- [ ] Trip schedule creation with capacity tracking
- [ ] Pricing tier configuration (General, VIP, Cabin)
- [ ] Trip search API with filters (date, location, capacity)
- [ ] Trip detail page frontend
- [ ] Integrate with Prisma for data fetching

**Acceptance Criteria**:
- Operator (verified JWT) can create and publish trips via API
- Trips appear in public search (no auth required)
- Filters work correctly (date, price range) using Prisma queries
- Trip detail shows all information + availability
- API routes properly verify operator role from JWT

**Example API Route**:
```typescript
// src/app/api/operator/trips/route.ts
import { verifyAuth } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req) // Verify JWT
  
  // Check if user is an operator
  const operator = await prisma.operator.findUnique({
    where: { userId: user.id }
  })
  
  if (!operator) {
    return Response.json({ error: 'Not an operator' }, { status: 403 })
  }
  
  const body = await req.json()
  const trip = await prisma.trip.create({
    data: {
      operatorId: operator.id,
      ...body
    }
  })
  
  return Response.json({ trip }, { status: 201 })
}
```

#### Sprint 3 (Weeks 6-7): Booking Engine
**Apr 1 - Apr 14**
- [ ] Seat locking mechanism with Redis (10-min TTL)
- [ ] Booking creation with hold logic
- [ ] Real-time capacity checks (prevent overselling)
- [ ] Booking state machine (pending → held → paid → confirmed)
- [ ] Passenger details collection form
- [ ] Booking summary/review page

**Acceptance Criteria**:
- Concurrent bookings don't oversell
- Seat hold expires after 10 minutes
- Booking shows countdown timer
- Passenger validation (name + phone required)

#### Sprint 4 (Weeks 7-8): Payment Integration
**Apr 15 - Apr 28**
- [ ] MetaTickets API integration (or Paystack)
- [ ] Webhook endpoint with HMAC signature verification
- [ ] Payment event processing (success, failure, pending)
- [ ] Idempotency handling (duplicate webhook prevention)
- [ ] QR code generation (node-qrcode)
- [ ] Email notification service (SendGrid/Mailgun)
- [ ] SMS notifications (Twilio/Termii)

**Acceptance Criteria**:
- Payment webhook verified and processed
- Duplicate webhooks ignored (idempotent)
- QR code generated and emailed on payment success
- SMS sent with booking confirmation
- Failed payment releases seat hold

#### Sprint 5 (Weeks 8-9): Manifest & Check-in
**Apr 29 - May 12**
- [ ] Manifest generation (PDF/CSV export)
- [ ] Safety checklist templates
- [ ] QR scanner implementation (frontend camera access)
- [ ] Check-in verification endpoint
- [ ] Live boarding status dashboard
- [ ] Manual check-in fallback (search by phone/booking ID)

**Acceptance Criteria**:
- QR scan checks in passenger
- Duplicate scan prevented
- Manual search finds passenger
- Live count updates in real-time
- Manifest exports all passenger data

#### Sprint 6 (Weeks 9-10): Polish & Operator Tools
**May 13 - May 26**
- [ ] Operator analytics dashboard (revenue, bookings, occupancy)
- [ ] Refund processing workflow
- [ ] Cancellation policies enforcement
- [ ] Trip listing page with filters (frontend)
- [ ] Responsive mobile optimization
- [ ] Performance optimization:
  - Lazy loading images
  - Redis caching for trip listings
  - Database query optimization (N+1 elimination)
  - CDN setup for static assets

**Acceptance Criteria**:
- Dashboard shows accurate metrics
- Refund processed within policy window
- Mobile experience is smooth (no layout shifts)
- Page load <2s on 3G connection
- API latency <500ms (P95)

### Code Quality Standards
- [ ] Set up code review checklist:
  - TypeScript strict mode compliance
  - JSDoc comments on all functions
  - No hardcoded secrets
  - Error handling for all async operations
  - Input validation on all endpoints
  - Unit tests >80% coverage
  - Integration tests for APIs
  - Parameterized DB queries
  - Logging for critical operations

### Testing Strategy
**Unit Tests** (70% coverage target):
- [ ] Test all service layer business logic
- [ ] Mock external dependencies (APIs, DB)
- [ ] Test edge cases and error conditions

**Integration Tests**:
- [ ] Test all API endpoints with Supertest
- [ ] Test database operations
- [ ] Test webhook processing

**E2E Tests** (Playwright/Cypress):
- [ ] Complete booking flow (search → book → pay → confirm)
- [ ] Operator trip creation flow
- [ ] Check-in flow

**Load Testing** (k6):
- [ ] 50 concurrent users for 5 minutes
- [ ] Ramp up to 100 users
- [ ] Target: P95 <500ms, error rate <1%

### CI/CD Pipeline
- [ ] GitHub Actions workflow:
  - Lint on PR
  - Unit tests on PR
  - Integration tests on PR
  - Build Docker image on merge to develop
  - Deploy to staging on merge to develop
  - Deploy to production on merge to main (with approval)
  - Upload coverage to Codecov

### Deliverables
1. Functional application (all MVP features)
2. Test suite with >70% code coverage
3. API documentation (Swagger/ReDoc)
4. CI/CD pipeline with automated testing
5. Docker images pushed to registry
6. Database migration scripts
7. Environment configuration templates

---

## Phase 4: Testing (Weeks 10-11)
**Duration**: May 13 - May 26, 2026

### 4.1 Functional Testing

**Test Case Development**:
- [ ] Authentication (20 test cases)
- [ ] Booking Flow (40 test cases)
- [ ] Payment Processing (30 test cases)
- [ ] Manifest Generation (15 test cases)
- [ ] Check-in Operations (20 test cases)
- [ ] Operator Portal (25 test cases)

**Test Execution**:
- [ ] Execute all 150+ test cases
- [ ] Track pass/fail rates
- [ ] Log defects in Linear/Jira with severity

### 4.2 Non-Functional Testing

**Performance Testing**:
- [ ] Load Test: 100 concurrent users
  - Target: 95% requests <500ms
- [ ] Stress Test: 500 concurrent users
  - Target: Graceful degradation, no data loss
- [ ] Spike Test: Sudden 1000 user spike
  - Target: Auto-scaling within 2 minutes

**Security Testing**:
- [ ] OWASP Top 10 penetration testing:
  - SQL Injection
  - XSS
  - CSRF
  - Broken Authentication
  - Security Misconfiguration
- [ ] Vulnerability scanning (npm audit, Snyk)
- [ ] Review rate limiting effectiveness

**Usability Testing**:
- [ ] Task success rate (target: 95%)
- [ ] Time on task (target: <4 minutes for booking)
- [ ] Error rate (target: <5%)
- [ ] User satisfaction (target: >4/5)

**Accessibility Testing**:
- [ ] Automated testing (axe DevTools)
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA)
- [ ] High contrast mode testing
- [ ] WCAG 2.1 AA compliance verification

**Compatibility Testing**:
- [ ] Test on Chrome 121+, Safari 17+, Firefox 122+, Edge 121+
- [ ] Test on mobile devices:
  - iPhone 13/14/15 (iOS 17)
  - Samsung Galaxy S23 (Android 14)
  - Google Pixel 7 (Android 13)

### 4.3 User Acceptance Testing (UAT)

**Participants**:
- 3 boat operators
- 10 end customers
- 2 dock staff

**Test Scenarios**:
1. [ ] Operator creates and publishes trip (30 mins)
2. [ ] Customer books VIP ticket (15 mins)
3. [ ] Staff checks in passengers (20 mins)

**Feedback Collection**:
- [ ] Conduct UAT sessions
- [ ] Document feedback
- [ ] Prioritize enhancement requests
- [ ] Get sign-off from stakeholders

### 4.4 Defect Management

**Bug Tracking**:
- [ ] Set up Linear/Jira project
- [ ] Define severity levels:
  - Critical: 4-hour resolution
  - High: 24-hour resolution
  - Medium: 3-day resolution
  - Low: Next sprint
- [ ] Track all defects to closure
- [ ] Verify fixes with regression testing

### Deliverables
1. Test plan document (15-20 pages)
2. Test cases (150+ documented)
3. Test execution report (pass/fail rates, coverage)
4. Performance test results (k6 reports)
5. Security audit report (penetration test findings)
6. UAT sign-off document (stakeholder approvals)
7. Bug tracking export (all defects and resolutions)
8. Test automation suite (regression scripts)

---

## Phase 5: Deployment (Weeks 11-12)
**Duration**: May 20 - Jun 2, 2026

### 5.1 Infrastructure Provisioning

**Modern Serverless Stack** (Supabase + Vercel):

#### Step 1: Supabase Setup
- [ ] Create Supabase project at supabase.com
  - Select region: EU West (London) - closest to Nigeria
  - Choose organization tier: Pro ($25/month)
- [ ] Configure database:
  - Enable connection pooling (PgBouncer)
  - Set up automated backups (built-in)
  - Enable Point-in-Time Recovery
- [ ] Set up Supabase Auth:
  - Enable email auth provider
  - Configure email templates (verification, password reset)
  - Optional: Enable Google/Facebook OAuth
- [ ] Configure Supabase Storage:
  - Create bucket: `manifests` (private)
  - Create bucket: `qr-codes` (private)
  - Create bucket: `vessel-images` (public)
  - Set size limits and CORS policies
- [ ] Get credentials:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `DATABASE_URL` (direct connection string)

#### Step 2: Upstash Redis Setup
- [ ] Create Upstash account at upstash.com
- [ ] Create Redis database:
  - Select region: EU West
  - Enable TLS
- [ ] Get `REDIS_URL` connection string

#### Step 3: Vercel Setup
- [ ] Import GitHub repository to Vercel
- [ ] Configure build settings:
  - Framework: Next.js
  - Root directory: `/`
  - Build command: `npm run build`
  - Output directory: `.next`
- [ ] Add environment variables (production):
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  DATABASE_URL
  REDIS_URL
  METATICKETS_API_KEY
  METATICKETS_WEBHOOK_SECRET
  PAYSTACK_SECRET_KEY
  PAYSTACK_PUBLIC_KEY
  SENDGRID_API_KEY
  TWILIO_ACCOUNT_SID
  TWILIO_AUTH_TOKEN
  TERMII_API_KEY
  ```
- [ ] Configure custom domain:
  - Add domain: bayelsaboats.com
  - Configure DNS (A/CNAME records)
  - Enable automatic SSL (Let's Encrypt)
- [ ] Set up deployment branches:
  - `main` → Production
  - `develop` → Preview (staging)
  - Feature branches → Preview URLs

**No Terraform/Docker/K8s needed!** Everything is serverless and auto-scales.

### 5.2 Environment Configuration

**Development Environment**:
```bash
# .env.local (local development)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
REDIS_URL=redis://localhost:6379

# Start Supabase locally
supabase start

# Run Prisma migrations
npx prisma migrate dev

# Start Next.js dev server
npm run dev
```

**Staging Environment** (Vercel Preview):
- [ ] Automatically deployed on PR to `develop`
- [ ] Uses separate Supabase project (staging)
- [ ] Preview URL: `https://bayelsaboats-git-develop-yourteam.vercel.app`
- [ ] Test with staging API keys

**Production Environment**:
- [ ] Deployed on merge to `main`
- [ ] Uses production Supabase project
- [ ] Custom domain: `https://bayelsaboats.com`
- [ ] Production API keys and secrets

### 5.3 Deployment Strategy

**Vercel Deployment** (Zero-downtime by default):

1. **Automatic Deployments**:
   ```yaml
   # Vercel handles this automatically:
   PR → develop: Create preview deployment
   Merge → develop: Deploy to staging
   Merge → main: Deploy to production (with approval)
   ```

2. **Preview Deployments** (Every PR):
   - Unique URL for each PR
   - Full environment with preview Supabase
   - Perfect for stakeholder review
   - No infrastructure setup needed

3. **Production Deployment Flow**:
   ```bash
   # 1. Code reaches main branch
   git checkout main
   git merge develop
   git push origin main
   
   # 2. Vercel automatically:
   #    - Runs build
   #    - Runs tests
   #    - Creates production build
   #    - Deploys to edge network (global CDN)
   #    - No downtime (atomic deployment)
   
   # 3. Instant rollback if needed:
   #    - Click "Rollback" in Vercel dashboard
   #    - Or redeploy previous commit
   ```

4. **Database Migrations** (Before deployment):
   ```bash
   # Run migrations in production
   # Option 1: Via Prisma (recommended)
   npx prisma migrate deploy
   
   # Option 2: Via Supabase CLI
   supabase db push
   
   # Option 3: Manual SQL (Supabase Dashboard)
   # For complex migrations
   ```

**Rollback Strategy**:
- Vercel: Click "Rollback to Previous" (instant)
- Database: Use Supabase Point-in-Time Recovery
- Files: Versioned in Supabase Storage (soft delete)

### 5.4 Go-Live Checklist

**Pre-Deployment (T-7 days)**:
- [ ] All UAT sign-offs received
- [ ] Performance tests passed (>95% SLA)
- [ ] Security scan clean (0 high/critical vulnerabilities)
- [ ] Supabase backups verified (test restore via dashboard)
- [ ] SSL automatically managed by Vercel (check certificate)
- [ ] DNS configured (A record to Vercel)
- [ ] Sentry monitoring configured
- [ ] On-call rotation scheduled
- [ ] Rollback plan tested (redeploy previous version)

**Deployment Day (T-0)**:
- [ ] Notify stakeholders (scheduled maintenance window)
- [ ] Freeze code changes (protect main branch)
- [ ] Run database migrations:
   ```bash
   # Production database migration
   DATABASE_URL=$PROD_DB_URL npx prisma migrate deploy
   ```
- [ ] Merge to main (triggers Vercel production deployment)
- [ ] Monitor deployment progress in Vercel dashboard
- [ ] Run post-deployment smoke tests:
   ```bash
   npm run test:e2e:prod
   ```
- [ ] Monitor error rates in Sentry (2 hours)
- [ ] Send all-clear notification

**Post-Deployment (T+1 hour)**:
- [ ] Verify critical flows (booking, payment, check-in)
- [ ] Test payment webhook with real transaction (₦100 test booking)
- [ ] Monitor Supabase dashboard (connections, query performance)
- [ ] Verify email/SMS notifications (check logs)
- [ ] Check SSL/security headers (securityheaders.com)
- [ ] Review Vercel Functions logs
- [ ] Review Sentry error dashboard

**Post-Deployment (T+24 hours)**:
- [ ] Review metrics dashboard
- [ ] Check customer support tickets
- [ ] Compare pre vs post performance
- [ ] Celebrate with team 🎉

### 5.5 Monitoring & Alerting

**Vercel Monitoring** (Built-in):
- [ ] Enable Vercel Analytics (Web Vitals, Performance)
- [ ] Set up function invocation alerts
- [ ] Monitor bandwidth usage
- [ ] Track build failures

**Supabase Monitoring** (Built-in dashboard):
- [ ] Database connections (alert if >80%)
- [ ] Query performance (slow queries)
- [ ] Storage usage (alert at 80% capacity)
- [ ] Auth usage (MAU tracking)
- [ ] API requests per second

**Sentry (Error Tracking)**:
- [ ] Configure Sentry for Next.js
  ```typescript
  // sentry.client.config.ts
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // Filter out 404s
      if (event.exception?.values?.[0]?.value?.includes('NotFound')) {
        return null
      }
      return event
    }
  })
  ```
- [ ] Set up error grouping and notifications
- [ ] Configure Slack/email alerts for critical errors
- [ ] Track booking funnel drop-offs

**Uptime Monitoring**:
- [ ] Set up external monitoring (BetterUptime, Pingdom)
- [ ] Monitor critical endpoints:
  - GET /api/trips (home page)
  - POST /api/bookings (booking creation)
  - POST /api/webhooks/metatickets (payment webhooks)
- [ ] Alert on >1% error rate or >5s response time

**Custom Alerts** (Vercel Cron + email):
```typescript
// app/api/cron/health-check/route.ts
export async function GET() {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkSupabaseAuth(),
    checkPaymentProviders()
  ])
  
  const failures = checks.filter(c => !c.healthy)
  if (failures.length > 0) {
    await sendAlert(failures)
  }
  
  return Response.json({ checks })
}
```

**Dashboard Setup**:
- [ ] Vercel: Real-time function logs, performance metrics
- [ ] Supabase: Database queries, connection pool, auth usage
- [ ] Sentry: Error rates, affected users, release tracking
- [ ] Custom: Revenue dashboard (bookings, MRR, conversion rate)

### Deliverables
1. **Supabase project** (production + staging configured)
2. **Vercel deployment** (automatic deployments from GitHub)
3. **Environment configurations** (dev, staging, prod) in Vercel
4. **Monitoring setup** (Sentry, Vercel Analytics, BetterUptime)
5. **Runbook** (incident response procedures)
6. **Deployment checklist** (step-by-step deployment guide)
7. **Rollback procedures** (Vercel + Supabase recovery)

**No Terraform/Docker/K8s needed!** Everything managed by platforms.

---

## Phase 6: Maintenance & Support (Ongoing)
**Duration**: Post-launch (Jun 3, 2026 onwards)

### 6.1 Support Structure

**Tier 1 - Customer Support** (Response: 4 hours):
- [ ] Hire 2 FTE customer service reps
- [ ] Set up Zendesk/Intercom
- [ ] Create knowledge base and FAQs
- [ ] Handle: booking inquiries, refunds, password resets

**Tier 2 - Technical Support** (Response: 2 hours):
- [ ] Assign 2 developers on rotation
- [ ] Investigate: webhook failures, booking bugs, performance issues
- [ ] Tools: Vercel dashboard, Supabase dashboard, Sentry, database access

**Tier 3 - Engineering** (Response: 30 min for critical):
- [ ] Senior developers on-call
- [ ] Handle: system outages, data corruption, security breaches
- [ ] Tools: Full Vercel/Supabase admin access, PagerDuty

**SLA Definitions**:
- P0 (Critical): 15 min response, 2 hour resolution
- P1 (High): 1 hour response, 8 hour resolution
- P2 (Medium): 4 hour response, 48 hour resolution
- P3 (Low): 24 hour response, 1 week resolution

### 6.2 Incident Management

**Incident Response**:
- [ ] Create incident playbook
- [ ] Set up PagerDuty alerts
- [ ] Create Slack #incident channel template
- [ ] Document escalation procedures
- [ ] Design post-mortem template

**Monitoring**:
- [ ] Weekly error log review
- [ ] Weekly backup verification
- [ ] Monthly performance review
- [ ] Monthly security patch updates
- [ ] Quarterly disaster recovery drills

### 6.3 Maintenance Activities

**Weekly**:
- [ ] Review error logs (Sentry, CloudWatch)
- [ ] Check disk usage
- [ ] Verify backup completion
- [ ] Update security patches
- [ ] Review performance metrics

**Monthly**:
- [ ] Database optimization (VACUUM ANALYZE)
- [ ] SSL certificate check (30 days before expiry)
- [ ] Archive old logs (>90 days)
- [ ] Dependency updates (npm audit fix)
- [ ] Capacity planning review
- [ ] Vulnerability scan

**Quarterly**:
- [ ] Database performance tuning (slow query analysis)
- [ ] Infrastructure cost optimization
- [ ] Disaster recovery drill
- [ ] Security audit (penetration testing)
- [ ] User feedback review
- [ ] Technical debt assessment

### 6.4 Continuous Improvement

**Feature Roadmap**:

**Q2 2026 (Months 4-6)**:
- [ ] Mobile app (React Native) with offline check-in
- [ ] Dynamic pricing (demand, weather)
- [ ] Multi-language support (Yoruba, Igbo, Pidgin)
- [ ] Group booking discounts
- [ ] Loyalty program

**Q3 2026 (Months 7-9)**:
- [ ] Corporate booking accounts
- [ ] API for third-party travel agents
- [ ] Waitlist for sold-out trips
- [ ] Trip insurance add-on
- [ ] In-app chat support

**Q4 2026 (Months 10-12)**:
- [ ] Fleet management module
- [ ] Crew scheduling and payroll
- [ ] Predictive analytics (demand forecasting)
- [ ] Expansion to Lagos, Port Harcourt
- [ ] Partnership with hotels/restaurants

**Performance Optimization Backlog**:
- [ ] Implement GraphQL for flexible data fetching
- [ ] Add Redis caching layer for trip listings
- [ ] Optimize database queries (N+1 elimination)
- [ ] Implement CDN for API responses
- [ ] PWA offline capabilities
- [ ] Image optimization (WebP, lazy loading)

### Deliverables
1. Support documentation (user guides, FAQs)
2. Incident response playbook
3. Runbook (common tasks, troubleshooting)
4. Monthly maintenance reports
5. Performance optimization reports
6. Feature roadmap updates
7. Customer feedback analysis

---

## Critical Success Factors

### Technical
- **Hybrid Architecture**: Supabase Auth + Prisma for optimal balance
- Prevent double-booking with Redis locks (10-min TTL)
- Idempotent webhook processing (HMAC verification)
- Zero-downtime deployments (Vercel with preview environments)
- Sub-500ms API response time (P95)
- 99.5% uptime SLA
- JWT verification middleware for all protected routes

### Business
- 60% booking conversion rate
- 8% commission on all bookings
- Break-even at 250 bookings/month
- Launch within 12 weeks

### Compliance
- Nigerian maritime passenger manifests
- NDPR data protection compliance
- PCI-DSS via payment service providers
- WCAG 2.1 AA accessibility
- Supabase data residency compliance

### User Experience
- <3 clicks from homepage to checkout
- Mobile-first responsive design
- <2s page load on 3G
- QR code tickets with offline check-in fallback
- Seamless authentication via Supabase (social login support)

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| MetaTickets API unavailable | High | Medium | Paystack fallback integration |
| Dock internet connectivity poor | Medium | High | PWA offline check-in capability |
| Double booking during peak | High | Medium | Redis optimistic locking + atomic operations |
| Payment webhook delays | High | Medium | Retry logic with exponential backoff |
| Database connection pool exhaustion | High | Low | Monitor pool utilization, auto-scale |
| Data breach | Critical | Low | Encryption, regular security audits, incident response plan |
| Regulatory changes | Medium | Medium | Legal advisor on retainer, quarterly compliance review |

---

## Budget Summary

### Development Costs (3 months)
- Backend Developer (Senior): ₦4.5M
- Frontend Developer: ₦3M
- UI/UX Designer: ₦1.6M
- QA Engineer: ₦1.2M
- DevOps Engineer: **₦0.8M** (Reduced - less infrastructure setup)
**Subtotal: ₦11.1M ($16.6K USD)**

### Infrastructure (Monthly)
**Supabase Stack** (Significantly cheaper than AWS ECS):
- Supabase Pro Plan: ₦20K (~$25/month)
  - PostgreSQL database (8GB storage)
  - Auth (50K+ MAU)
  - Storage (100GB bandwidth)
  - Automated backups
- Vercel Pro: ₦30K (~$20/month with team)
  - Next.js hosting
  - Automatic scaling
  - Preview deployments
  - Edge Functions
- Upstash Redis: ₦15K (~$10/month)
  - 10K requests/day free tier
  - Global low-latency
- Monitoring (Sentry): ₦20K (~$26/month)
- Domain + SSL: ₦10K
**Subtotal: ₦95K/month** (↓₦275K savings vs AWS)

### Third-party Services (Monthly)
- SendGrid (emails): ₦20K
- Twilio/Termii (SMS): ₦30K
- Transaction fees: Variable (1.5% per booking)
**Subtotal: ₦50K + transaction fees**

### Total First-Year Cost
₦11.1M (dev) + ₦95K × 12 (infra) + ₦50K × 12 (services) = **₦12.84M (~$19.2K USD)**

**Cost Savings vs Original Plan**: ₦4.3M (~$6.4K USD) - 25% reduction!

### Pricing Tiers (As You Scale)

**Supabase**:
- Free: $0/month (Good for development/staging)
- Pro: $25/month (Production - up to 100K MAU)
- Team: $599/month (When you hit 500K+ MAU)

**Vercel**:
- Hobby: Free (Development)
- Pro: $20/month (Production)
- Enterprise: Custom (High traffic)

**Cost Breakdown by Phase**:
| Phase | Monthly Cost | Notes |
|-------|-------------|-------|
| Development (Month 1-3) | ₦40K | Free tiers only |
| Launch (Month 4-6) | ₦95K | Pro plans activated |
| Growth (Month 7-12) | ₦95-150K | Scale as traffic grows |
| Scale (Year 2+) | ₦200-300K | Team/Enterprise plans |

### Third-party Services (Monthly)
- SendGrid (emails): ₦20K
- Twilio/Termii (SMS): ₦30K
- Transaction fees: Variable (1.5% per booking)
**Subtotal: ₦50K + transaction fees**

### Total First-Year Cost
₦12.1M (dev) + ₦370K × 12 (infra) + ₦50K × 12 (services) = **₦17.14M (~$26K USD)**

---

## Next Steps

1. **Immediate Actions** (This Week):
   - [ ] Confirm MetaTickets API access with Stella
   - [ ] Register domain (bayelsaboats.com)
   - [ ] Set up GitHub repository
   - [ ] Create project management board (Linear/Jira)
   - [ ] Schedule kickoff meeting with stakeholders

2. **Week 1 Priorities**:
   - [ ] Finalize PRD with stakeholder sign-off
   - [ ] Start database schema design
   - [ ] Begin UI/UX wireframes
   - [ ] Set up development environment

3. **Dependencies to Resolve**:
   - MetaTickets API documentation and credentials
   - Boat operator contact list for UAT
   - Ministry of Marine regulatory requirements
   - NITDA data protection registration process

---

## Success Metrics

### Launch Metrics (Week 12)
- All 150+ test cases passing
- 0 critical/high severity bugs
- <2s page load time
- >70% code coverage
- UAT sign-off from 3 operators

### Month 1 Post-Launch
- 100+ bookings processed
- 99%+ uptime
- <5 customer support tickets/day
- 0 payment processing failures

### Month 3 Post-Launch
- 250+ bookings/month (break-even)
- 60%+ conversion rate
- 4+ user satisfaction score
- 0 security incidents

---

## Documentation Standards

### Code Documentation
- JSDoc comments on all public functions
- README.md in each service directory
- Architecture Decision Records (ADR) for major decisions
- API documentation (Swagger/OpenAPI)

### Operational Documentation
- Runbook for common operations
- Incident response playbook
- Deployment procedures
- Database backup/restore procedures
- Disaster recovery plan

### User Documentation
- User guide (customer-facing)
- Operator manual (trip management)
- Staff guide (check-in procedures)
- FAQ and troubleshooting

---

## Quality Gates

### Sprint Gates
- [ ] All user stories completed
- [ ] All acceptance criteria met
- [ ] Unit tests >80% coverage
- [ ] Code review completed
- [ ] No critical bugs

### Phase Gates
- [ ] All deliverables completed
- [ ] Stakeholder sign-off
- [ ] Quality metrics met
- [ ] Documentation updated
- [ ] Next phase ready to start

### Launch Gate
- [ ] All UAT scenarios passed
- [ ] Performance tests passed
- [ ] Security audit clean
- [ ] Monitoring configured
- [ ] Rollback plan tested
- [ ] Support team trained
- [ ] Go-live checklist complete

---

*This implementation plan is a living document and should be updated as the project progresses. Review and refine weekly during sprint planning.*
