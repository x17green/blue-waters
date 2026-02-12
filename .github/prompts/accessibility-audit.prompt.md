---
name: Accessibility Audit Prompt Template
description: Systematic accessibility review following WCAG 2.1 AA standards
enforceMode: strict
source_of_truth: docs/design-architecture.md#9-accessibility-aria-implementation-guide
wcag_level: AA-minimum
---

# ♿ Accessibility Audit Prompt

Use this prompt to perform comprehensive accessibility review of a component, page, or feature.

---

## Audit Target

**Component/Page:** _______________  
**File Path:** _______________  
**URL (Storybook/dev):** _______________

---

## Automated Testing

### Step 1: Run Axe-core
```bash
npm run design-system:check-a11y -- --component=<name>
```

**Document Results:**
```
Violations Found: ___
  Critical: ___
  Serious: ___
  Moderate: ___
  Minor: ___
```

---

### Step 2: Run Lighthouse
```bash
npm run design-system:lighthouse -- --url=<storybook-url>
```

**Scores:**
- Performance: ___
- Accessibility: ___ (target ≥ 95)
- Best Practices: ___
- SEO: ___

---

## Manual Testing Checklist

### ✅ Gate 1: Semantic HTML
- [ ] Semantic elements used (`<button>`, `<nav>`, `<main>`, `<article>`)
- [ ] Heading hierarchy logical (H1 → H2 → H3, no skipping)
- [ ] Lists use `<ul>`/`<ol>` + `<li>`
- [ ] Forms use `<form>`, `<fieldset>`, `<legend>`, `<label>`
- [ ] Links use `<a href="">` (not `<div onClick>`)
- [ ] Buttons use `<button>` (not `<div onClick>`)

**Issues Found:**
```
-
```

---

### ✅ Gate 2: Keyboard Navigation
**Test:** Disconnect mouse, navigate with keyboard only

- [ ] All interactive elements focusable (Tab key)
- [ ] Tab order follows visual order (left-to-right, top-to-bottom)
- [ ] Focus visible (2px ring, contrast ≥ 3:1)
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals, dropdowns
- [ ] Arrow keys work (radio groups, dropdowns, tabs, grids)
- [ ] No keyboard traps
- [ ] Skip links present

**Navigation Path:**
```
1. Tab → ___
2. Tab → ___
3. Enter → ___ (action performed)
4. Escape → ___ (modal closed)
```

**Issues Found:**
```
-
```

---

### ✅ Gate 3: ARIA Attributes
Inspect elements in DevTools:

- [ ] `role` specified when semantic HTML insufficient
- [ ] `aria-label` or `aria-labelledby` on interactive elements without visible text
- [ ] `aria-describedby` for help text and errors
- [ ] `aria-invalid="true"` on inputs with errors
- [ ] `aria-required="true"` on required fields
- [ ] `aria-disabled="true"` on disabled elements
- [ ] `aria-expanded` on toggles
- [ ] `aria-haspopup` on elements triggering popups
- [ ] `aria-live` regions for dynamic updates
- [ ] `aria-modal="true"` on dialogs
- [ ] No redundant ARIA (e.g., `role="button"` on `<button>`)

**Missing ARIA:**
```
Element: ___
Issue: ___
Fix: ___
```

---

### ✅ Gate 4: Color Contrast
**Tool:** Chrome DevTools → Inspect → Accessibility pane

Check all text and UI elements:

| Element | Foreground | Background | Ratio | Target | Pass? |
|---------|------------|------------|-------|--------|-------|
| Body text | | | | 4.5:1 | [ ] |
| Heading | | | | 4.5:1 | [ ] |
| Button text | | | | 4.5:1 | [ ] |
| Muted text | | | | 4.5:1 | [ ] |
| Focus ring | | | | 3:1 | [ ] |
| UI components | | | | 3:1 | [ ] |

**Contrast Failures:**
```
Element: ___
Current ratio: ___
Required: ___
Fix: Use --text-primary (15.2:1) or --accent-500 (4.8:1)
```

---

### ✅ Gate 5: Screen Reader Support
**Tool:** NVDA (Windows), VoiceOver (Mac), TalkBack (Android)

Enable screen reader and navigate:

1. **Headings:** Do headings announce correctly?
   - [ ] Yes [ ] No  
   **Issue:** ___

2. **Forms:** Do inputs announce labels?
   - [ ] Yes [ ] No  
   **Issue:** ___

3. **Errors:** Do error messages announce?
   - [ ] Yes [ ] No  
   **Issue:** ___

4. **Dynamic Content:** Do live regions announce updates?
   - [ ] Yes [ ] No  
   **Issue:** ___

5. **Images:** Do images have descriptive alt text?
   - [ ] Yes [ ] No  
   **Issue:** ___

6. **Icon-only Buttons:** Do they announce purpose?
   - [ ] Yes [ ] No  
   **Issue:** ___

**Screen Reader Test Script:**
```
1. Navigate to component
2. Tab through all interactive elements
3. Verify each element announces its name, role, state
4. Trigger error state, verify announcement
5. Trigger dynamic update, verify announcement
```

**Issues Found:**
```
-
```

---

### ✅ Gate 6: Forms & Inputs
- [ ] Every `<input>` has associated `<label>`
- [ ] NO placeholder-only inputs
- [ ] Help text uses `aria-describedby`
- [ ] Errors use `role="alert"` + `aria-live="assertive"`
- [ ] `aria-invalid="true"` when error present
- [ ] `aria-required="true"` on required fields
- [ ] `autocomplete` attributes for personal data
- [ ] `inputMode` for mobile keyboards
- [ ] Grouped inputs use `<fieldset>` + `<legend>`

**Form Structure:**
```html
<!-- Document actual implementation -->
<label htmlFor="___">___</label>
<input
  id="___"
  aria-describedby="___"
  aria-invalid="___"
  aria-required="___"
/>
```

**Issues Found:**
```
-
```

---

### ✅ Gate 7: Focus Management
- [ ] Focus visible at all times
- [ ] Focus indicator ≥ 3:1 contrast
- [ ] Focus order follows visual layout
- [ ] Modals trap focus
- [ ] Closing modal returns focus to trigger
- [ ] Disabled elements not focusable
- [ ] Skip links allow bypassing repetitive content

**Focus Flow Test:**
```
1. Tab into component → Focus lands on: ___
2. Tab through all elements → Order correct: [ ] Yes [ ] No
3. Open modal → Focus trapped: [ ] Yes [ ] No
4. Close modal → Focus returns to trigger: [ ] Yes [ ] No
```

**Issues Found:**
```
-
```

---

### ✅ Gate 8: Motion & Animation
**Test:** Enable "Reduce motion" in OS settings

- [ ] All animations respect `prefers-reduced-motion`
- [ ] NO parallax effects
- [ ] NO auto-playing video/animation
- [ ] Transitions ≤ 300ms
- [ ] Infinite animations have pause control

**Before (reduce motion OFF):**
```
Animation observed: ___
Duration: ___
```

**After (reduce motion ON):**
```
Animation result: [ ] Disabled [ ] Simplified [ ] Still animates (FAIL)
```

**Issues Found:**
```
-
```

---

### ✅ Gate 9: Responsive & Mobile
**Test:** Resize browser, test on mobile device

- [ ] Touch targets ≥ 44×44px
- [ ] Adequate spacing between interactive elements (≥ 8px)
- [ ] No horizontal scroll
- [ ] Text resizable up to 200% without loss
- [ ] Zoom enabled (no `user-scalable=no`)
- [ ] Mobile keyboard types (`inputMode="email"`, etc.)
- [ ] All gestures have keyboard/single-tap alternative

**Mobile Test (iPhone/Android):**
```
Screen size: ___
Touch target sizes: [ ] Pass (all ≥ 44px) [ ] Fail
Zoom test: [ ] Pass [ ] Fail
Keyboard types: [ ] Pass [ ] Fail
```

**Issues Found:**
```
-
```

---

### ✅ Gate 10: Content & Microcopy
- [ ] Headings describe content (not generic)
- [ ] Link text descriptive (not "click here")
- [ ] Button labels action-oriented
- [ ] Error messages specific and actionable
- [ ] Success messages clear
- [ ] Loading states announced

**Copy Review:**
```
❌ Bad: "Invalid input"
✅ Good: "Email must include @ symbol"

❌ Bad: "Click here"
✅ Good: "View trip details"

❌ Bad: "Submit"
✅ Good: "Book now"
```

**Issues Found:**
```
-
```

---

## Summary Report

### Statistics
- **Total Issues Found:** ___
- **Critical (P0):** ___
- **High (P1):** ___
- **Medium (P2):** ___
- **Low (P3):** ___

### Top Issues (Priority Order)
1. ___
2. ___
3. ___

### Quick Fixes (< 1 hour each)
```
-
```

### Major Refactors (> 4 hours)
```
-
```

---

## Action Items

Create GitHub issues for each critical issue:

**Issue Template:**
```markdown
## [A11Y] <Component>: <Brief Description>

**Severity:** Critical / High / Medium / Low
**WCAG Criterion:** <e.g., 1.3.1 Info and Relationships>
**Impact:** <Screen reader / Keyboard / Color blind users>

### Current Behavior
<Describe the issue>

### Expected Behavior
<What should happen>

### Steps to Reproduce
1. ___
2. ___
3. ___

### Suggested Fix
<Code example or approach>

### References
- WCAG Quick Ref: <link>
- ARIA Pattern: <link>
```

---

## Follow-Up

Schedule follow-up audit after fixes:
- **Date:** _______________
- **Re-test:** Run this prompt again
- **Target:** 0 critical violations, Lighthouse ≥ 95

---

**Audit completed:** [ ] Yes  
**Date:** _______________  
**Auditor:** _______________  
**Status:** [ ] Pass [ ] Fail (__ issues)
