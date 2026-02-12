---
name: Page Migration Instructions
applyTo: "src/app/**/page.tsx"
enforceMode: strict
phase: 2-page-migration
priority: P1-high
source_of_truth: docs/design-architecture.md
---

# 📄 Page Migration Tracker

## Migration Sequence (Strategic Order)

**Rationale:** Operator Dashboard first → benefits immediately from conservative design. Consumer pages second → requires brand decision.

---

## 🎯 Page Migration Checklist

### Phase 2A: Operator Dashboard (Week 6-7) — 40 hours

#### 🏢 Operator Dashboard
**File:** `src/app/operator/dashboard/page.tsx`  
**Status:** ❌ Not Started  
**Effort:** 40 hours  
**Priority:** P0 Critical (benefits most from glassmorphism)

**Requirements:**
- [ ] **Layout:**
  - [ ] Glass sidebar navigation with blur
  - [ ] Main content area with `--bg-900` background
  - [ ] Dashboard cards with `--glass-01` + `--shadow-soft`
  - [ ] Responsive grid (12-col desktop, 8-col tablet, 1-col mobile)
- [ ] **Widgets:**
  - [ ] Occupancy stat card (with percentage progress ring)
  - [ ] Revenue card (with sparkline chart)
  - [ ] Upcoming trips card (list with glass dividers)
  - [ ] Quick actions card (glass buttons)
- [ ] **Data Tables:**
  - [ ] Bookings table with glass header row
  - [ ] Keyboard navigation (arrow keys navigate cells)
  - [ ] Row selection with checkboxes
  - [ ] Sort controls with `aria-sort`
  - [ ] Export manifest button (opens confirmation dialog)
- [ ] **Accessibility:**
  - [ ] Skip to main content link
  - [ ] Landmark regions (`<main>`, `<nav>`, `<aside>`)
  - [ ] `aria-label` on navigation
  - [ ] Screen reader announces stat changes
  - [ ] Focus management (sidebar → main content)
- [ ] **Charts:**
  - [ ] Use design tokens for chart colors (no hardcoded)
  - [ ] `<figure>` + `<figcaption>` for accessibility
  - [ ] `aria-label` describing data trend

**Components Used:**
- [ ] Card (glass variant)
- [ ] Button (primary, secondary)
- [ ] Table (with sorting & selection)
- [ ] Dialog (for confirmations)
- [ ] Badge (status indicators)
- [ ] Progress (circular for occupancy)
- [ ] Tabs (dashboard sections)

**Design Tokens:**
- [ ] `--bg-900` (page background)
- [ ] `--glass-01` (card backgrounds)
- [ ] `--accent-500` (CTAs)
- [ ] `--success-500`, `--warning-500`, `--danger-500` (status badges)
- [ ] `--shadow-soft` (card elevation)
- [ ] `--blur-md` (sidebar glass)

**Validation:**
```bash
npm run design-system:validate-page operator-dashboard
```

**Success Criteria:**
- [ ] 0 hardcoded colors
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader navigation works
- [ ] WCAG AA contrast ratios met
- [ ] Lighthouse accessibility score ≥ 95

---

### Phase 2B: Booking Flow (Week 8-9) — 40 hours

#### 🎫 Book (Search & Browse)
**File:** `src/app/book/page.tsx`  
**Status:** ❌ Not Started  
**Effort:** 20 hours

**Requirements:**
- [ ] **Search Section:**
  - [ ] Glass search card with backdrop blur
  - [ ] Input fields (departure, destination, date, passengers)
  - [ ] Associated labels (no placeholder-only)
  - [ ] Search button (primary variant)
  - [ ] Filter controls (dropdowns, checkboxes)
- [ ] **Results Grid:**
  - [ ] Trip cards with glass effect
  - [ ] Featured trip badge (accent color)
  - [ ] Price tier display (clear typography hierarchy)
  - [ ] Availability indicators (semantic colors)
  - [ ] Book button (primary CTA)
- [ ] **Accessibility:**
  - [ ] Search inputs have labels
  - [ ] Results announced with `aria-live="polite"`
  - [ ] Filter changes update accessible count
  - [ ] Trip cards are keyboard navigable
- [ ] **Seat Selection:**
  - [ ] Seat grid with ARIA grid pattern
  - [ ] Keyboard navigation (arrow keys)
  - [ ] Selected seats announced to screen reader
  - [ ] Alternative list view for non-visual users

**Components:**
- [ ] Input, Select, Button
- [ ] Card (trip tiles)
- [ ] Badge (availability, featured)
- [ ] Dialog (seat selection modal)
- [ ] Alert (search errors)

**Validation:**
```bash
npm run design-system:validate-page book
```

---

#### 💳 Checkout
**File:** `src/app/checkout/page.tsx`  
**Status:** ❌ Not Started  
**Effort:** 20 hours

**Requirements:**
- [ ] **Booking Summary:**
  - [ ] Glass panel showing trip details
  - [ ] Seat numbers listed
  - [ ] Price breakdown (clear labels)
  - [ ] Edit links (return to previous step)
- [ ] **Passenger Form:**
  - [ ] Fieldset with legend "Passenger Information"
  - [ ] Input fields with labels, help text, error states
  - [ ] ID verification field (as shown on ID)
  - [ ] Accessibility: `aria-describedby`, `aria-invalid`, `aria-required`
- [ ] **Payment Form:**
  - [ ] Secure fields (autocomplete attributes)
  - [ ] Card number input (input mask)
  - [ ] CVC field (type="password", inputMode="numeric")
  - [ ] Processing state with spinner
  - [ ] Success/failure with `aria-live` announcement
- [ ] **Confirmation:**
  - [ ] Success page with booking reference
  - [ ] QR code display (with alt text)
  - [ ] Email sent notification
  - [ ] Download ticket button

**Components:**
- [ ] Input, Button, Card
- [ ] Alert (payment errors)
- [ ] Progress (payment processing)
- [ ] Dialog (confirm cancellation)

**Validation:**
```bash
npm run design-system:validate-page checkout
```

---

### Phase 2C: Authentication (Week 9) — 20 hours

#### 🔐 Login
**File:** `src/app/login/page.tsx`  
**Status:** ❌ Not Started  
**Effort:** 10 hours

**Requirements:**
- [ ] **Form Structure:**
  - [ ] Glass card centered on page
  - [ ] Email input (type="email", autoComplete="email")
  - [ ] Password input (type="password", toggle visibility)
  - [ ] Remember me checkbox
  - [ ] Submit button (primary, full-width)
  - [ ] Forgot password link (muted link style)
- [ ] **Accessibility:**
  - [ ] Form labeled with `aria-labelledby`
  - [ ] Inputs have associated labels
  - [ ] Error messages in `role="alert"`
  - [ ] Loading state announced
- [ ] **Error Handling:**
  - [ ] Invalid credentials message (clear, actionable)
  - [ ] Network error fallback
  - [ ] Field-level validation

**Components:**
- [ ] Input, Button, Card
- [ ] Alert (error messages)
- [ ] Link (forgot password, signup)

---

#### ✍️ Signup
**File:** `src/app/signup/page.tsx`  
**Status:** ❌ Not Started  
**Effort:** 10 hours

**Requirements:**
- [ ] **Form Structure:**
  - [ ] Glass card
  - [ ] Name, email, phone, password fields
  - [ ] Password strength indicator
  - [ ] Terms acceptance checkbox (linked to terms page)
  - [ ] Submit button
- [ ] **Validation:**
  - [ ] Real-time validation (email format, password strength)
  - [ ] `aria-invalid` on validation failure
  - [ ] Helpful error messages
- [ ] **Accessibility:**
  - [ ] All inputs labeled
  - [ ] Password requirements announced
  - [ ] Terms checkbox properly labeled

**Components:**
- [ ] Input, Button, Card, Checkbox
- [ ] Alert, Progress (password strength)

---

### Phase 2D: Landing Page (Week 10) — 20 hours

#### 🏠 Home / Landing
**File:** `src/app/page.tsx`  
**Status:** ❌ Not Started  
**Effort:** 20 hours  
**Note:** Requires brand decision (conservative vs. vibrant)

**Requirements:**
- [ ] **Hero Section:**
  - [ ] Large headline with conservative typography
  - [ ] Subtitle (muted color)
  - [ ] Search card with glass effect
  - [ ] Background: subtle gradient or image with dark overlay
  - [ ] Emoji icons **removed** (replace with Pictogrammers SVG)
- [ ] **Featured Trips:**
  - [ ] Card grid (3-4 columns desktop)
  - [ ] Trip tiles with glass effect
  - [ ] Image with dark overlay for text legibility
  - [ ] Book button (accent color)
- [ ] **How It Works:**
  - [ ] 3-step process showcase
  - [ ] Icons (Pictogrammers, monochrome accent)
  - [ ] Glass cards for each step
- [ ] **Testimonials:**
  - [ ] Quote cards with glass effect
  - [ ] Avatar images (DiceBear or local)
  - [ ] Star ratings (accessible: `aria-label="4 out of 5 stars"`)
- [ ] **Footer:**
  - [ ] 5-column grid (links, social, contact, legal)
  - [ ] Muted link color
  - [ ] Accessible link focus states

**Components:**
- [ ] Card, Button, Input
- [ ] Badge, Avatar
- [ ] Custom: Hero, FeaturedTrips, HowItWorks, Testimonials, Footer

**Design Decision Required:**
- [ ] **Option A:** Full conservative (muted photos, minimal gradients)
- [ ] **Option B:** Hybrid (warm photos, conservative UI controls)
- [ ] **Option C:** Dark overlay on vibrant photos (compromise)

**Validation:**
```bash
npm run design-system:validate-page home
```

---

#### 🔍 Search
**File:** `src/app/search/page.tsx`  
**Status:** ❌ Not Started  
**Effort:** 10 hours

**Requirements:**
- [ ] Filter sidebar (glass panel, sticky on scroll)
- [ ] Results grid (same as book page)
- [ ] No results state (helpful message + clear filters CTA)
- [ ] Pagination or infinite scroll
- [ ] Filter state announced to screen readers

---

## 📊 Page Migration Progress

**Pages Migrated:** 0 of 8 (0%)

| Page | Status | Effort | Priority |
|------|--------|--------|----------|
| Operator Dashboard | ❌ Not Started | 40h | P0 |
| Book | ❌ Not Started | 20h | P0 |
| Checkout | ❌ Not Started | 20h | P0 |
| Login | ❌ Not Started | 10h | P1 |
| Signup | ❌ Not Started | 10h | P1 |
| Home | ❌ Not Started | 20h | P1 |
| Search | ❌ Not Started | 10h | P2 |
| Dashboard (User) | ❌ Not Started | 10h | P2 |

---

## 🚨 Validation Commands

Validate specific page:
```bash
npm run design-system:validate-page <page-name>
```

Validate all pages:
```bash
npm run design-system:validate-all-pages
```

Check page for accessibility:
```bash
npm run design-system:check-a11y --page=<page-name>
```

Generate page migration report:
```bash
npm run migration:report --pages
```

---

## 🔄 Migration Workflow

For each page:

1. **Read page requirements** (this file)
2. **Create branch:** `git checkout -b feat/migrate-page-<name>`
3. **Audit current implementation:**
   - List all components used
   - Identify hardcoded colors
   - Note accessibility gaps
4. **Migrate components first** (ensure all page components are migrated)
5. **Apply design tokens:**
   - Replace background colors
   - Update text colors
   - Apply glass effects to cards/panels
6. **Update layout:**
   - Responsive grid
   - Spacing (design system scale)
   - Glass effects
7. **Enhance accessibility:**
   - Add skip links
   - Fix form labels
   - Add ARIA landmarks
   - Test keyboard navigation
8. **Remove emoji icons:** Replace with Pictogrammers SVG
9. **Test:**
   - Visual regression
   - Keyboard navigation
   - Screen reader
   - Lighthouse audit
10. **Run validation:** `npm run design-system:validate-page <name>`
11. **Fix violations**
12. **Update this file:** Mark checkboxes
13. **Commit:** `git commit -m "feat(design-system): migrate <Page> page"`
14. **Update tracker:** `npm run migration:update-tracker`
15. **Create PR**

---

## 📚 References

- **Source of Truth:** [design-architecture.md](../../../docs/design-architecture.md)
- **Component Migration:** [02-component-migration.instructions.md](02-component-migration.instructions.md)
- **Accessibility Gates:** [04-accessibility-gates.instructions.md](04-accessibility-gates.instructions.md)
- **Glassmorphism System:** [05-glassmorphism-system.instructions.md](05-glassmorphism-system.instructions.md)

---

**Status:** 🔴 Not Started (0 of 8 pages migrated)  
**Last Updated:** 2026-02-12  
**Next Action:** Begin with Operator Dashboard (40 hours)
