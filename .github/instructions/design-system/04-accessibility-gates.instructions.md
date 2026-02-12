---
name: Accessibility Gates & WCAG Compliance
applyTo: "**/*.tsx, **/*.ts"
enforceMode: strict
phase: all-phases
priority: P0-critical
source_of_truth: docs/design-architecture.md#9-accessibility-aria-implementation-guide
wcag_level: AA-minimum
---

# ♿ Accessibility Gates & WCAG AA Compliance

## CRITICAL RULE: WCAG AA IS MANDATORY

**NO EXCEPTIONS:** Every component, page, and feature MUST meet WCAG 2.1 Level AA before merging.

**CI ENFORCEMENT:** PRs with accessibility violations will be **BLOCKED**.

---

## 📋 Accessibility Checklist (Per Component/Page)

### ✅ Gate 1: Semantic HTML
- [ ] Use semantic elements (`<button>`, `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>`)
- [ ] Headings in logical order (H1 → H2 → H3, no skipping levels)
- [ ] Lists use `<ul>`/`<ol>` + `<li>` (not `<div>` styled as list)
- [ ] Forms use `<form>`, `<fieldset>`, `<legend>`, `<label>`
- [ ] Tables use `<table>`, `<thead>`, `<tbody>`, `<th scope="...">`, `<caption>`
- [ ] Links use `<a href="...">` (not `<div onClick>`)
- [ ] Buttons use `<button>` (not `<div onClick>`)

**Validation:**
```bash
npm run design-system:check-semantics
```

---

### ✅ Gate 2: Keyboard Navigation
- [ ] All interactive elements focusable via Tab key
- [ ] Tab order follows logical reading order (left-to-right, top-to-bottom)
- [ ] Focus visible (2px ring, `--accent-400`, contrast ≥ 3:1)
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals, dropdowns, popovers
- [ ] Arrow keys navigate:
  - Radio groups (Left/Right or Up/Down)
  - Select dropdowns (Up/Down)
  - Tabs (Left/Right)
  - Data tables (Arrow keys between cells)
  - Seat grids (Arrow keys between seats)
- [ ] No keyboard traps (focus can always exit)
- [ ] Skip links present (`<a href="#main">Skip to main content</a>`)

**Manual Test:**
1. Disconnect mouse
2. Tab through entire page
3. Verify all actions achievable via keyboard alone

**Validation:**
```bash
npm run design-system:check-keyboard
```

---

### ✅ Gate 3: ARIA Attributes
- [ ] `role` specified when semantic HTML insufficient
- [ ] `aria-label` or `aria-labelledby` on interactive elements without visible text
- [ ] `aria-describedby` for help text and error messages
- [ ] `aria-invalid="true"` on inputs with errors
- [ ] `aria-required="true"` on required form fields
- [ ] `aria-disabled="true"` on disabled elements (in addition to `disabled`)
- [ ] `aria-expanded` on toggles (accordions, dropdowns, menus)
- [ ] `aria-haspopup` on elements that trigger popups
- [ ] `aria-controls` linking trigger to controlled element
- [ ] `aria-live` regions for dynamic updates:
  - `aria-live="polite"` for non-critical (search results count)
  - `aria-live="assertive"` for critical (errors, time-sensitive alerts)
- [ ] `aria-checked` on checkboxes and radio buttons (if custom-styled)
- [ ] `aria-selected` on tabs and selectable items
- [ ] `aria-pressed` on toggle buttons
- [ ] `aria-current` on current page in navigation
- [ ] `aria-hidden="true"` on decorative icons (with visible text alternative)
- [ ] `aria-modal="true"` on dialogs

**Forbidden ARIA Misuse:**
- ❌ `role="button"` on `<button>` (redundant)
- ❌ `aria-label` on `<div>` without role
- ❌ `aria-labelledby` pointing to non-existent ID
- ❌ Multiple `aria-live` on same element

**Validation:**
```bash
npm run design-system:check-aria
```

---

### ✅ Gate 4: Color Contrast (WCAG AA)

**Requirements:**
- [ ] Body text (< 18pt regular, < 14pt bold): **≥ 4.5:1** contrast
- [ ] Large text (≥ 18pt regular, ≥ 14pt bold): **≥ 3:1** contrast
- [ ] UI components (buttons, inputs, icons): **≥ 3:1** contrast
- [ ] Focus indicators: **≥ 3:1** contrast against adjacent colors
- [ ] Disabled text: maintain **≥ 3:1** (reduced opacity acceptable if still meets ratio)

**Design Token Compliance:**
```css
/* These token combinations are pre-validated for WCAG AA */

/* ✅ SAFE: High Contrast (≥ 4.5:1) */
--text-primary on --bg-900     /* 15.2:1 */
--text-primary on --bg-800     /* 13.8:1 */
--accent-500 on --bg-900       /* 4.8:1 */

/* ✅ SAFE: Medium Contrast (≥ 3:1) */
--muted-100 on --bg-900        /* 4.2:1 */
--accent-400 on --bg-800       /* 5.1:1 */

/* ⚠️ CAUTION: Low Contrast (< 3:1, decorative only) */
--glass-01 on --bg-900         /* 1.2:1 - use for backgrounds only */
--border-subtle on --bg-900    /* 1.5:1 - use for dividers only */
```

**Tools:**
- Chrome DevTools: Inspect element → Accessibility pane → Contrast ratio
- Axe DevTools extension: Automated contrast checks
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Validation:**
```bash
npm run design-system:check-contrast
```

---

### ✅ Gate 5: Screen Reader Support

**Requirements:**
- [ ] All content accessible to screen readers (NVDA, JAWS, VoiceOver)
- [ ] Images have `alt` text (empty `alt=""` for decorative)
- [ ] Icon-only buttons have `aria-label` or `sr-only` text
- [ ] Form inputs announced with labels
- [ ] Error messages announced (via `role="alert"` + `aria-live="assertive"`)
- [ ] Dynamic content changes announced (`aria-live`)
- [ ] Page title updates on navigation (`<title>`)
- [ ] Language declared (`<html lang="en">`)

**Testing:**
- **Windows:** NVDA (free) or JAWS
- **macOS:** VoiceOver (Cmd + F5)
- **Mobile:** TalkBack (Android), VoiceOver (iOS)

**Test Script:**
1. Enable screen reader
2. Navigate entire page with Tab and arrow keys
3. Verify all content announced clearly
4. Submit forms, check errors announced
5. Trigger dynamic updates, verify announcements

**Validation:**
```bash
npm run design-system:check-screen-reader
```

---

### ✅ Gate 6: Forms & Input Accessibility

**Requirements:**
- [ ] Every `<input>` has associated `<label>`:
  ```html
  <label htmlFor="email">Email address</label>
  <input id="email" type="email" />
  ```
- [ ] NO placeholder-only inputs (placeholders disappear on focus)
- [ ] Help text programmatically associated:
  ```html
  <input aria-describedby="email-help email-error" />
  <div id="email-help">We'll never share your email</div>
  ```
- [ ] Error messages in `role="alert"` + `aria-live="assertive"`:
  ```html
  <div id="email-error" role="alert" aria-live="assertive">
    Email is required
  </div>
  ```
- [ ] `aria-invalid="true"` when input has error
- [ ] `aria-required="true"` on required inputs
- [ ] `autocomplete` attributes for personal data:
  - `name`, `email`, `tel`, `address-line1`, `postal-code`, etc.
- [ ] `inputMode` for mobile keyboards:
  - `numeric` for numbers, `email` for emails, `tel` for phones
- [ ] Grouped inputs use `<fieldset>` + `<legend>`:
  ```html
  <fieldset>
    <legend>Passenger information</legend>
    <label>Name <input /></label>
    <label>Age <input /></label>
  </fieldset>
  ```

**Forbidden Patterns:**
- ❌ `<input placeholder="Email" />` (no label)
- ❌ `<div>Email</div><input />` (not associated)
- ❌ Error shown with color only (must have icon + text)

**Validation:**
```bash
npm run design-system:check-forms
```

---

### ✅ Gate 7: Focus Management

**Requirements:**
- [ ] Focus visible at all times (no `outline: none` without replacement)
- [ ] Focus indicator has ≥ 3:1 contrast
- [ ] Focus order follows visual layout
- [ ] Modals trap focus (keyboard can't escape to page behind)
- [ ] Closing modal returns focus to trigger element
- [ ] Disabled elements not focusable (`tabindex="-1"`)
- [ ] Skip links allow bypassing repetitive content

**Focus Trap Example (Modal):**
```typescript
import { useFocusTrap } from '@/hooks/use-focus-trap';

function Modal({ isOpen, onClose }) {
  const modalRef = useFocusTrap(isOpen);
  
  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {/* Focus trapped here while open */}
    </div>
  );
}
```

**Skip Link Example:**
```html
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
<main id="main">
  <!-- Page content -->
</main>
```

**Validation:**
```bash
npm run design-system:check-focus
```

---

### ✅ Gate 8: Motion & Animation

**Requirements:**
- [ ] All animations respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: no-preference) {
    .animated {
      animation: fadeIn 300ms ease-in-out;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animated {
      animation: none;
      /* Instant state change instead */
    }
  }
  ```
- [ ] NO parallax effects (cause motion sickness)
- [ ] NO auto-playing video/animation (provide play control)
- [ ] Transitions ≤ 300ms for UI interactions
- [ ] Infinite animations have pause control

**Framer Motion Example:**
```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();

<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
>
```

**Test:**
1. Enable "Reduce motion" in OS settings
2. Verify animations disabled or simplified
3. Verify functionality still works

**Validation:**
```bash
npm run design-system:check-motion
```

---

### ✅ Gate 9: Responsive & Mobile Accessibility

**Requirements:**
- [ ] Touch targets ≥ 44×44px (WCAG 2.5.5)
- [ ] Adequate spacing between interactive elements (≥ 8px)
- [ ] No horizontal scroll on mobile (max-width: 100vw)
- [ ] Text resizable up to 200% without loss of content
- [ ] Zoom enabled (no `user-scalable=no`)
- [ ] Mobile keyboard types:
  - `inputMode="email"` for email inputs
  - `inputMode="tel"` for phone numbers
  - `inputMode="numeric"` for numbers
- [ ] All gestures have keyboard/single-tap alternative

**Validation:**
```bash
npm run design-system:check-responsive
```

---

### ✅ Gate 10: Content & Microcopy

**Requirements:**
- [ ] Headings describe content (not generic "Section 1")
- [ ] Link text descriptive (not "click here", "read more")
- [ ] Button labels action-oriented ("Book now" not "Submit")
- [ ] Error messages specific and actionable:
  - ❌ "Invalid input"
  - ✅ "Email must include @ symbol"
- [ ] Success messages clear:
  - ✅ "Booking confirmed! Check your email for QR code."
- [ ] Loading states announced:
  - `<div role="status" aria-live="polite">Loading bookings...</div>`

---

## 🚨 Automated Testing Tools

### Axe-core (CI Integration)
```bash
npm run design-system:check-a11y
```

**Output:**
```
╔══════════════════════════════════════════════════════════════╗
║              ACCESSIBILITY AUDIT REPORT                      ║
╚══════════════════════════════════════════════════════════════╝

Component: Button
URL: http://localhost:6006/?path=/story/button--primary

VIOLATIONS FOUND: 2

  [critical] button-name
    Buttons must have discernible text
    Impact: critical
    Affected elements: 1
      - button.icon-only
    Fix: Add aria-label or visible text

  [serious] color-contrast
    Elements must have sufficient color contrast
    Impact: serious
    Contrast ratio: 2.8:1 (needs 4.5:1)
    Affected elements: 1
      - button.ghost span
    Fix: Increase contrast to 4.5:1

❌ AUDIT FAILED — Fix violations before merging
```

### Pa11y (CLI Testing)
```bash
npm run design-system:check-a11y-pa11y -- src/app/page.tsx
```

### Lighthouse (Performance + Accessibility)
```bash
npm run design-system:lighthouse
```

**Target Scores:**
- Performance: ≥ 85
- Accessibility: ≥ 95 (aim for 100)
- Best Practices: ≥ 95
- SEO: ≥ 90

---

## 📊 Accessibility Progress Tracker

### Current Issues (from ui-ux-analysis-report.md)

**Priority 0 (Critical) — 5 issues:**
- [ ] Hero search inputs lack `<label>` elements
- [ ] Emoji icons (⛵, 🌊) lack `aria-label`
- [ ] No skip links present
- [ ] Featured trip cards not keyboard navigable (entire card clickable)
- [ ] Form errors not programmatically associated

**Priority 1 (High) — 6 issues:**
- [ ] No reduced motion support (all Framer Motion unconditional)
- [ ] Color-only status indicators (needs icon + text)
- [ ] Focus indicator not visible on all elements
- [ ] Manual star rating lacks ARIA (should be `aria-label="4 out of 5 stars"`)
- [ ] Dashboard stat cards lack semantic structure
- [ ] External images lack descriptive alt text

**Priority 2 (Medium) — 3 issues:**
- [ ] Inconsistent heading hierarchy (some pages skip H2 → H4)
- [ ] Some buttons have insufficient touch target size (< 44×44px)
- [ ] Loading states not announced to screen readers

**Total Issues:** 14  
**Resolved:** 0 of 14 (0%)

---

## 🔄 Accessibility Fix Workflow

For each accessibility violation:

1. **Identify issue:** Run `npm run design-system:check-a11y`
2. **Reproduce manually:** Test with keyboard, screen reader
3. **Consult ARIA patterns:** https://www.w3.org/WAI/ARIA/apg/patterns/
4. **Fix code:**
   - Add semantic HTML
   - Add ARIA attributes
   - Fix contrast
   - Add keyboard support
5. **Re-test manually**
6. **Re-run automation:** `npm run design-system:check-a11y`
7. **Mark resolved in this file**
8. **Commit:** `git commit -m "a11y(design-system): fix <component> <issue>"`
9. **Update tracker:** `npm run migration:update-tracker`

---

## 🎯 Acceptance Criteria

**WCAG AA Compliance Achieved When:**
- [ ] 0 critical violations (axe-core)
- [ ] 0 serious violations (axe-core)
- [ ] Lighthouse accessibility score ≥ 95
- [ ] All 14 current issues resolved
- [ ] Manual keyboard test passed
- [ ] Manual screen reader test passed (NVDA or JAWS)
- [ ] Reduced motion test passed
- [ ] Contrast ratio test passed (all ≥ 4.5:1 for text)
- [ ] External accessibility audit passed (optional but recommended)

---

## 📚 Resources

- **WCAG 2.1 Quick Reference:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/patterns/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Axe DevTools:** https://www.deque.com/axe/devtools/
- **NVDA Screen Reader:** https://www.nvaccess.org/download/
- **MDN ARIA:** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA

---

**Status:** 🔴 14 critical accessibility issues  
**Last Updated:** 2026-02-12  
**Next Action:** Begin fixing P0 issues (hero labels, emoji icons, skip links)
