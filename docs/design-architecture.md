# Yenagoa Boat Club — Product Design Documentation

**Dark-first · Glassmorphism · shadcn/ui · Pictogrammers (Material Icons) · Full ARIA compliance**

> Purpose: A concise, professional product-design spec for _Yenagoa Boat Club_ — the Bayelsa Boat Cruise booking app.  
> Audience: product designers, frontend engineers, accessibility specialists, and stakeholders.

---

# Table of contents

1. Design Principles
    
2. Brand & Visual Language
    
3. Design Tokens
    
4. Layout, Spacing & Typography
    
5. Color Palette & Usage Guidelines
    
6. Glassmorphism System (dark-first)
    
7. Iconography (Pictogrammers — Material Design Icons)
    
8. Component System — shadcn/ui + Implementations
    
    - Buttons
        
    - Inputs & Forms
        
    - Cards & Trip Tiles
        
    - Navigation (site + operator)
        
    - Modals / Dialogs / Confirmations
        
    - Ticket / Booking Row & Checkout flow
        
    - Check-in Scanner UI
        
    - Operator Dashboard widgets
        
9. Accessibility & ARIA Implementation Guide
    
10. Keyboard Interaction Patterns & Focus Management
    
11. Motion, Animation & Reduced Motion
    
12. Content & Microcopy Guidelines

---

# 📊 Current Implementation Status

**Last Updated:** February 14, 2026  
**Design System Progress:** 6% Complete (34/525 items)

## ✅ **COMPLETED COMPONENTS**
- **Design Tokens:** 125 tokens implemented (`src/design-system/tokens.ts`)
- **Core Components:** Button, Input, Card migrated to shadcn/ui
- **Admin Panel:** Complete implementation with 6 routes (dashboard, users, payments, audit-logs, reports, settings)
- **Authentication:** Full auth flow with Supabase integration
- **Database:** Prisma schema with comprehensive relationships

## 🚧 **IN PROGRESS**
- **Design System Migration:** Phase 1 (Foundation) - 3/8 tasks complete
- **Page Migration:** Operator dashboard redesigned, booking flow in progress
- **Validation Scripts:** Token validation (✅), component validation (available), accessibility checks (pending)

## 🎯 **PRODUCTION READY**
- **Admin Panel:** TypeScript errors resolved, security audited, performance optimized
- **API Routes:** All admin endpoints functional with proper error handling
- **Build Status:** `npm run build` passes successfully
- **Security:** Double-layered authentication, comprehensive audit logging

## 📈 **METRICS**
- **Route Completion:** 47% (41/87 routes implemented)
- **TypeScript Coverage:** 100% error-free in admin panel
- **Design Token Compliance:** ✅ No hardcoded colors found
- **Accessibility:** WCAG AA targeted (infrastructure in place)

---
    
13. Design Review Checklist & QA Tests
    
14. Appendix: Code Examples & Tokens
    

---

# 1. Design Principles

- **Clarity over flourish.** Users must be able to book, check in, and operate fast and confidently.
    
- **Calm & Conservative.** Deep neutrals with subtle muted accents to reflect government/official credibility.
    
- **Dark-first & legible.** Interfaces target a dark environment (outdoor/night cruises, docks at dusk).
    
- **Accessible by default.** WCAG AA (minimum) across all patterns, strive for AAA where feasible for key flows.
    
- **Contextual trust.** Emphasize safety & compliance metadata (permits, life-jacket counts, manifest snapshots).
    
- **Progressive disclosure.** Show only what’s necessary in micro flows (seat selection, add-ons, payment) with clear affordances.
    

---

# 2. Brand & Visual Language

- **Tone:** Professional, warm, and reassuring.
    
- **Persona:** Responsible host — informed, helpful, punctual.
    
- **Visual cues:** subtle glass surfaces, soft shadows, low-contrast separators, restrained vibrancy for CTAs and notifications.
    
- **Imagery:** panoramic hero shots at dusk, subtle motion (water ripples) in marketing but not in booking flows.
    

---

# 3. Design Tokens

Define tokens as CSS variables (dark-first). Use `--` naming. Keep tokens available in a `:root` / `[data-theme="dark"]` so light mode can invert as needed.

```css
:root {
  /* Color tokens */
  --bg-900: #0b0f12;
  --bg-800: #0f171b;
  --panel-800: rgba(255,255,255,0.03);
  --glass-01: rgba(255,255,255,0.03);
  --glass-02: rgba(255,255,255,0.06);
  --muted-100: #9aa4ab;
  --accent-500: #6da7c8;       /* muted teal-blue */
  --accent-400: #89b6d2;
  --danger-500: #e06c75;
  --success-500: #67d17f;

  /* Typography */
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  --text-base: 16px;
  --text-1: 14px;
  --text-2: 12px;

  /* Elevation / shadow */
  --shadow-soft: 0 6px 20px rgba(4,8,16,0.6);

  /* Border radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
}
```

---

# 4. Layout, Spacing & Typography

- **Type scale:**
    
    - H1: 28–32px (700)
        
    - H2: 22–24px (600)
        
    - H3: 18–20px (600)
        
    - Body: 16px (400)
        
    - Small: 12–14px (400)
        
- **Spacing scale** (base = 8px): `0, 4, 8, 16, 24, 32, 48, 64`. Use these consistently for padding & margins.
    
- **Grids & breakpoints:** 12-column grid at large, 8-column at medium, single column on mobile. Content width: 1200px max.
    
- **Cards & containers:** use `padding: 16px–24px`, `border-radius: var(--radius-md)`, and glass background with subtle border.
    

---

# 5. Color Palette & Usage Guidelines

**Primary neutral scale (dark-first):**

- `--bg-900` #0B0F12 (app background)
    
- `--bg-800` #0F171B (page panels)
    
- `--muted-100` #9AA4AB (muted text, placeholders)
    
- `--muted-70` rgba(255,255,255,0.06) (dividers)
    

**Accent (conservative, muted):**

- `--accent-500` #6DA7C8 (primary CTA)
    
- `--accent-400` #89B6D2 (hover/secondary)
    
- `--success-500` #67D17F
    
- `--danger-500` #E06C75
    
- `--warning-500` #E0B55A
    

**Semantic rules:**

- Primary CTA: use `--accent-500` with solid border and glass backdrop behind.
    
- Secondary actions: ghost buttons with ring on focus.
    
- Danger: actions that **cancel**, **refund**, or **void** must use `--danger-500` and an extra confirmation step.
    
- Text: main body text should meet at least 4.5:1 contrast against `--bg-900`. Muted copy can be 3:1 only for non-critical elements.
    

**Contrast targets (WCAG):**

- Body text: ≥ 4.5:1 (AA) against background.
    
- UI components (large text/labels): ≥ 3:1 acceptable for 18pt+ or 14pt bold.
    
- Icons and disabled text: at least 3:1 recommended.
    

---

# 6. Glassmorphism System (dark-first)

Glass design principles for _Yenagoa Boat Club_:

- **Subtlety** — glass panels must be functional; no over-saturation.
    
- **Legibility** — backdrop blur with careful overlay opacity so text remains high-contrast.
    
- **Depth** — layered glass surfaces to indicate hierarchy (cards, modals, nav).
    
- **Responsiveness** — glass effects degrade on low-power devices or when `prefers-reduced-motion` is set.
    

**Core glass CSS util (example):**
```css
.glass {
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
  backdrop-filter: blur(8px) saturate(100%);
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: var(--shadow-soft);
  border-radius: var(--radius-md);
}
```

**Layering guidance**

- Primary surface (shell): low blur (~4–6px), lower opacity.
    
- Secondary cards: blur 8–12px, stronger border and drop shadow.
    
- Modal sheets: strong blur 16px, higher opacity mask behind.   
---

# 7. Iconography (Pictogrammers — Material Design Icons)

- Use **Pictogrammers** (Material Design icons) for clear, universal metaphors — ticket, boat, calendar, map, QR code, wallet, settings, bell.
    
- Use icons as supportive visuals only; always include accessible label text (`aria-hidden="true"` when purely decorative, otherwise `aria-label` or hidden text for assistive tech).
    
- Icon sizes (dark UI): 20px (text buttons), 24px (primary actions), 32px (feature tiles).
    
- Maintain consistent stroke width and rounded or sharp style across the app.
    

**Usage example:**
```css
<button class="btn btn-primary" aria-label="Open bookings">
  <span class="icon" aria-hidden="true"><svg><!-- pictogrammers/ticket.svg --></svg></span>
  <span class="label">Book now</span>
</button>
```

---

# 8. Component System — shadcn/ui + Implementations

We rely on shadcn/ui as a design-component library; all components must be wrapped with ARIA semantics and augmented where shadcn/ui lacks accessibility defaults.

### Buttons

- **Primary**: solid, accent color, high contrast, `role="button"`, keyboard focus visible (2px ring), `aria-pressed` for toggles.
    
- **Secondary**: ghost button, clear border, subtle glass background.
    
- **Disabled**: lower opacity but maintain contrast > 3:1 for readability; `aria-disabled="true"`.
    

**Primary Button example (HTML + Tailwind-like classes):**

```css
<button class="btn btn-primary glass" role="button" aria-label="Proceed to payment">
  <span class="icon" aria-hidden="true"><svg><!-- icon --></svg></span>
  Proceed to payment
</button>
```

**Interaction states:** default / hover / active / focus / disabled. Ensure focus has clear outline, not only color change.

---

### Inputs & Forms

- **Labeling**: every input must have an associated `<label for="...">`. Use `aria-describedby` for helper text & `aria-invalid="true"` for errors.
    
- **Error messages**: inline and programmatically associated via `aria-describedby`. Example:
    
```html
<label for="passenger_name">Passenger name</label>
<input id="passenger_name" aria-describedby="passenger_name_help passenger_name_err" />
<div id="passenger_name_help">As shown on ID</div>
<div id="passenger_name_err" role="alert" aria-live="assertive">This field is required</div>
```

- **Field grouping**: use `<fieldset>` and `<legend>` for grouped inputs (e.g., passenger list).
    
- **Autocomplete & inputmode** for phone numbers, emails.
    

---

### Cards & Trip Tiles

- Use glass card with subtle left accent for featured trips.
    
- Cards must expose semantic structure: `<article aria-labelledby="trip-title-xxx">`.
    
- Tickets within cards: show price tier, availability badge, and quick CTA.
    

**Trip Card structure:**

```html
<article class="card glass" aria-labelledby="trip-title-1">
  <header>
    <h3 id="trip-title-1">Sunset Creek Cruise</h3>
    <p class="muted">3 hours • 6:00 PM</p>
  </header>
  <div class="card-body">
    <p class="desc">Live music, dinner, shore stop.</p>
  </div>
  <footer>
    <button class="btn btn-primary">Book</button>
  </footer>
</article>
```

---
### Navigation (site + operator)

- **Primary nav**: `<nav role="navigation" aria-label="Primary">` with keyboard-focusable items.
    
- **Breadcrumbs**: use `<nav aria-label="Breadcrumb">` and structured list elements.
    
- **Operator nav**: collapsible sidebar with `aria-expanded` states and skip links for assistive tech.
    
- **Skip-to-content**: include a visually-hidden but keyboard-visible link at top: `<a href="#main" class="skip">Skip to main content</a>`.
    

---

### Modals / Dialogs / Confirmations

- Use an accessible dialog pattern:
    
    - Root: `<div role="dialog" aria-modal="true" aria-labelledby="title">`
        
    - Trap keyboard focus inside modal while open.
        
    - Escape key closes modal unless `data-no-close`.
        
    - Return focus to the element that opened the modal after closing.
        
- All dialogs must include `role="alertdialog"` for destructive actions (refunds, cancellations).
    

---

### Ticket / Booking Row & Checkout flow

- **Booking row**: list of booking items with least cognitive load. Each booking item is selectable and expandable (`aria-expanded`).
    
- **Seat selection**: if using a seat map, provide alternate non-graphical selection (list) for screen reader users. Seat map must be keyboard-operable (arrow keys navigate, Enter selects).
    
- **Checkout accessibility**: make payment fields accessible; declare `aria-live` regions for processing status. On payment success/failure, announce result with polite/assertive live region depending on severity.
    

**Seat map keyboard pattern:**

- Tab into seat grid → focus lands on first seat.
    
- Arrow keys move focus among seats (left/right/up/down).
    
- Space/Enter toggles selection.
    
- `aria-checked="true|false"` on selectable seats.
    
- Unavailable seats: `aria-disabled="true"`.
    

---

### Check-in Scanner UI

- Primary use case: dock staff scanning QR codes via mobile or tablet.
    
- Provide large tappable verify button, quick search fallback, and manual override with supervisor confirmation.
    
- Check-in verification should expose `role="status"` or `aria-live="assertive"` on success/failure.
    

---

### Operator Dashboard widgets

- Cards for occupancy, revenue, upcoming trips; each card should be keyboard-focusable and have semantic header.
    
- Charts must have accessible descriptions: either `aria-label` or `<figure><figcaption>`.
    
- Export manifest button must confirm via dialog (showing count and date), with `role="dialog"`.
    

---

# 9. Accessibility & ARIA Implementation Guide

- **WCAG baseline**: meet **WCAG 2.1 AA** everywhere. For key financial/safety screens strive for AAA where possible.
    
- **Keyboard navigation**: full app operable via keyboard alone.
    
- **ARIA patterns**: follow WAI-ARIA Authoring Practices (dialog, menu, grid, tree, toolbar).
    
- **Live regions**: use `aria-live="polite"` for non-critical messages (e.g., “seat held”), `aria-live="assertive"` for errors.
    
- **Forms**: programmatic names for inputs; errors announced via `role="alert"`.
    
- **Contrast testing**: run Axe or Lighthouse color-contrast checks on each screen state. Maintain contrast ≥ 4.5:1 for text.
    
- **Accessible images**: hero images have `alt` text; decorative images `alt=""`.
    
- **Accessible icons**: decorative icons `aria-hidden="true"`, interactive icons include `aria-label` or visible text alternatives.
    
- **Skip links**: support skip links and logical tab order.
    
- **Language & semantics**: set document language (`<html lang="en">`).
    

---

# 10. Keyboard Interaction Patterns & Focus Management

- **Focus ring**: 2px solid ring with contrast color (use accent-400/darker overlay), not just color change.
    
- **Modal trap**: when modal opens, focus to first tabbable element; on close, return to previously focused element.
    
- **Menu keyboard rules**: Arrow keys to move, Enter to select, Esc to close.
    
- **Data tables**: use `<table>` with `aria-describedby` and keyboard navigation for row selection (support arrow keys + Enter).
    
- **Seat grid**: see seat map rules above.
    
- **Bulk actions**: checkboxes selected via space; indicate selection count with `aria-live`.
    

---

# 11. Motion, Animation & Reduced Motion

- Default: subtle motion (fade, translate y <= 8px, duration 180–240ms) for microinteractions.
    
- Respect `prefers-reduced-motion`: halt non-essential animations, prefer transform/opacity instead of layout-affecting animations.
    
- Do not use parallax or heavy motion in core booking flows.
    

---

# 12. Content & Microcopy Guidelines

- **Tone:** clear, short, action-oriented. Example: “Reserve 2 seats” vs “You’ve got options”.
    
- **Error copy:** explain _why_ and offer _how to fix_. Avoid technical terms. Example: “Payment failed — please check your card details or try a different payment method.”
    
- **Safety copy:** clearly display manifest & safety instructions. E.g., “Life jackets available per passenger: 1 — Crew certified: Yes (MMSI #…).”
    
- **Confirmation:** after booking: show clear CTA and next steps (email, QR, check-in instruction). Use bold for key dates/times.
    

---

# 13. Design Review Checklist & QA Tests

For each screen / component:

-  All interactive elements reachable by keyboard in logical order.
    
-  All images have alt text or are `alt=""` if decorative.
    
-  Contrast ratios meet WCAG targets.
    
-  ARIA attributes applied correctly (roles, `aria-describedby`, `aria-live`).
    
-  Focus management validated for modals and page navigation.
    
-  Prefers-reduced-motion honored and tested.
    
-  Error states and validation messages exist and are accessible.
    
-  Screen reader walkthrough passes core flows: booking, payment, check-in.
    

Usability tests:

- 5–8 users for early prototyping; include users who rely on keyboard or screen readers.
    
- Run accessibility automated checks (Axe, Pa11y), plus manual audits.
    

---

# 14. Appendix: Code Examples & Tokens

### Design token JSON (example)
```json
{
  "color": {
    "bg-900": "#0B0F12",
    "bg-800": "#0F171B",
    "accent-500": "#6DA7C8",
    "muted-100": "#9AA4AB"
  },
  "radius": {
    "sm": "6px",
    "md": "12px",
    "lg": "20px"
  },
  "shadow": {
    "soft": "0 6px 20px rgba(4,8,16,0.6)"
  }
}
```

### Accessible dialog skeleton (vanilla JS + ARIA)
```html
<!-- trigger -->
<button id="openDialog" aria-haspopup="dialog">Cancel booking</button>

<!-- dialog -->
<div id="dialog" role="dialog" aria-modal="true" aria-labelledby="dlgTitle" hidden>
  <h2 id="dlgTitle">Confirm cancellation</h2>
  <p>Are you sure you want to cancel this booking? Refunds take up to 7 days.</p>
  <button id="confirmCancel">Yes, cancel</button>
  <button id="closeDialog">No, go back</button>
</div>
<script>
  const open = document.getElementById('openDialog');
  const dlg = document.getElementById('dialog');
  const close = document.getElementById('closeDialog');
  open.addEventListener('click', ()=> {
    dlg.hidden = false;
    dlg.querySelector('button').focus(); // initial focus
  });
  close.addEventListener('click', ()=> {
    dlg.hidden = true;
    open.focus(); // return focus to trigger
  });
  // add keydown handler for Esc and focus trap for full implementation
</script>
```

### Seat grid (ARIA pattern)

```html
<div role="grid" aria-label="Seat selection" tabindex="0">
  <div role="row">
    <button role="gridcell" aria-label="Seat A1" aria-checked="false">A1</button>
    <button role="gridcell" aria-label="Seat A2" aria-checked="true">A2</button>
  </div>
</div>
```

---

# Final notes & next steps

1. **Design system repo:** Extract tokens, components, and examples into a shared `design-system` package (Tailwind + shadcn/ui wrappers).
    
2. **Component documentation:** For each UI component, create a Storybook story that includes accessibility knobs (aria props, keyboard simulations).
    
3. **Accessibility acceptance tests:** Add automated checks into CI; include manual screen-reader smoke tests in release checklist.
    
4. **Pilot testing:** Run a pilot with one operator and include accessibility test participants representative of your user base.