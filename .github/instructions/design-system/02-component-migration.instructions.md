---
name: Component Migration Instructions
applyTo: "src/components/ui/**.tsx, src/components/**.tsx"
enforceMode: strict
phase: 1-core-components
priority: P0-critical
source_of_truth: docs/design-architecture.md#8-component-system
---

# 🧩 Component Migration Rules

## STRICT REQUIREMENTS

Every migrated component MUST satisfy **ALL** these criteria before marking complete:

### ✅ 1. Design Tokens
- [ ] No hardcoded colors (scan for `#` hex codes)
- [ ] Uses CSS variables from design-architecture.md
- [ ] No Tailwind arbitrary values for colors (e.g., `bg-[#0C4A79]`)
- [ ] All spacing uses design system scale

### ✅ 2. Component Library
- [ ] Uses HeroUI base component
- [ ] NextUI imports **removed** (no `@nextui-org/react`)
- [ ] shadcn/ui patterns preserved but upgraded
- [ ] Wrapped with ARIA semantics

### ✅ 3. Accessibility (WCAG AA Minimum)
- [ ] Keyboard navigable (Tab, Enter, Space, Escape, Arrows)
- [ ] Focus visible (2px ring, `--accent-400`)
- [ ] ARIA attributes complete:
  - `role` (if non-semantic HTML)
  - `aria-label` or `aria-labelledby`
  - `aria-describedby` (for help text)
  - `aria-invalid` (for errors)
  - `aria-disabled` (not just `disabled` attribute)
- [ ] Screen reader tested
- [ ] Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI elements

### ✅ 4. Glassmorphism
- [ ] Uses `.glass` utility class or equivalent
- [ ] Backdrop blur with `prefers-reduced-motion` fallback
- [ ] Subtle border `rgba(255,255,255,0.06)`
- [ ] Soft shadow `var(--shadow-soft)`

### ✅ 5. Reduced Motion
- [ ] All animations wrapped in `@media (prefers-reduced-motion: no-preference)`
- [ ] Fallback states for reduced motion users

### ✅ 6. Testing
- [ ] Storybook story created
- [ ] Accessibility addon validates (0 violations)
- [ ] Visual regression baseline captured
- [ ] Unit tests pass

---

## 📋 Component Migration Checklist

### Priority 1: Core UI Components (Foundation Layer)

#### 🔘 Button
**Component File:** `src/components/ui/button.tsx`  
**Migration Status:** ✅ Complete  
**Estimated Effort:** 12 hours  
**Completion Date:** 2026-02-12  
**Blockers:** None

**Requirements:**
- [x] HeroUI Button patterns referenced
- [x] Design tokens applied:
  - [x] `--accent-500` (primary variant)
  - [x] `--accent-400` (hover state)
  - [x] `--glass-01` through `--glass-04` (glass variant backgrounds)
  - [x] `--error-500` (danger variant)
  - [x] `--radius-md` (border radius)
- [x] Variants implemented:
  - [x] `primary` (solid accent background with glass overlay)
  - [x] `secondary` (subtle glass with muted accent)
  - [x] `glass` (prominent glassmorphism effect)
  - [x] `outline` (minimal border-only)
  - [x] `ghost` (transparent with hover)
  - [x] `danger` (error/destructive actions)
  - [x] `danger-soft` (muted danger variant)
  - [x] `link` (underlined text style)
- [x] Sizes implemented: `sm`, `md`, `lg`, `xl`, `icon`, `icon-sm`, `icon-lg`
- [x] Accessibility:
  - [x] `role="button"` support via asChild prop
  - [x] `aria-pressed` support for toggle buttons
  - [x] `aria-disabled` when disabled
  - [x] `aria-busy` for loading state
  - [x] Focus ring visible (2px solid `--accent-400`)
  - [x] Prefers-reduced-motion support
- [x] Loading state with spinner
- [x] Icon support (startIcon/endIcon)
- [x] Glassmorphism with backdrop blur
- [x] Compound pattern support (Button.Icon, Button.Label)
- [x] Press feedback animation (scale on active)
- [x] Legacy compatibility (default/destructive variants)

**Files Updated:**
- [x] `src/components/ui/button.tsx` - Complete rewrite with glassmorphism
- [x] `src/components/examples/button-showcase.tsx` - Comprehensive showcase

**Showcase Created:**
Path: `src/components/examples/button-showcase.tsx`
Demonstrates: All 8 variants, loading states, icons, compound pattern, accessibility

**Storybook:**
- [ ] Story created: `src/stories/Button.stories.tsx`
- [ ] All variants documented
- [ ] Accessibility tests passing
- [ ] Interactive controls (color, size, disabled, loading)

**Validation:**
```bash
npm run design-system:validate-component button
```

---

#### 📝 Input
**Component File:** `src/components/ui/input.tsx`  
**Migration Status:** ❌ Not Started  
**Estimated Effort:** 16 hours  
**Blockers:** None

**Requirements:**
- [ ] HeroUI Input base used
- [ ] Design tokens applied:
  - [ ] `--bg-800` (input background)
  - [ ] `--glass-02` (focus overlay)
  - [ ] `--muted-100` (placeholder color)
  - [ ] `--accent-500` (focus border)
  - [ ] `--danger-500` (error border)
  - [ ] `--border-default` (default border)
- [ ] Field structure:
  - [ ] Associated `<label>` (no placeholder-only)
  - [ ] Optional help text with `aria-describedby`
  - [ ] Error message with `role="alert"` + `aria-live="assertive"`
- [ ] States:
  - [ ] Default
  - [ ] Focus (glass overlay + accent border)
  - [ ] Error (danger border + error icon)
  - [ ] Disabled (reduced opacity + `aria-disabled`)
  - [ ] Read-only
- [ ] Accessibility:
  - [ ] `<label htmlFor="id">` association
  - [ ] `aria-describedby` for help text and errors
  - [ ] `aria-invalid="true"` when error present
  - [ ] `aria-required` for required fields
  - [ ] `inputMode` for mobile keyboards (email, tel, numeric)
  - [ ] `autoComplete` attributes

**Advanced Features:**
- [ ] Icon support (start/end decorators)
- [ ] Clear button (X icon) when value present
- [ ] Password visibility toggle (eye icon)
- [ ] Character counter for `maxLength`
- [ ] Input mask support (phone numbers, credit cards)

**Files to Update:**
- [ ] `src/components/ui/input.tsx`
- [ ] `src/app/page.tsx` (hero search inputs)
- [ ] `src/app/signup/page.tsx` (registration form)
- [ ] `src/app/login/page.tsx` (auth form)
- [ ] `src/app/checkout/page.tsx` (payment form)

**Storybook:**
- [ ] Story created with all states
- [ ] Error state examples
- [ ] Icon decorator examples
- [ ] Accessibility validation passing

**Validation:**
```bash
npm run design-system:validate-component input
```

---

#### 🃏 Card
**Component File:** `src/components/ui/card.tsx`  
**Migration Status:** ❌ Not Started  
**Estimated Effort:** 12 hours  
**Blockers:** None

**Requirements:**
- [ ] HeroUI Card base used (if available, else custom)
- [ ] Design tokens applied:
  - [ ] `--glass-01` (card background)
  - [ ] `--border-subtle` (card border)
  - [ ] `--shadow-soft` (elevation)
  - [ ] `--radius-md` (border radius)
- [ ] Glassmorphism:
  - [ ] `backdrop-filter: blur(var(--blur-md))`
  - [ ] `background: var(--glass-01)`
  - [ ] Subtle border for definition
- [ ] Composite pattern preserved:
  - [ ] `Card` (root)
  - [ ] `CardHeader`
  - [ ] `CardContent` / `CardBody`
  - [ ] `CardFooter`
  - [ ] `CardTitle`
  - [ ] `CardDescription`
- [ ] Accessibility:
  - [ ] Semantic HTML (`<article>` for content cards)
  - [ ] `aria-labelledby` pointing to title
  - [ ] Keyboard navigable if interactive (entire card clickable)
  - [ ] Focus visible if clickable
- [ ] Variants:
  - [ ] Default (glass)
  - [ ] Elevated (stronger shadow)
  - [ ] Bordered (no glass, solid border)
  - [ ] Flat (no shadow, no glass)

**Files to Update:**
- [ ] `src/components/ui/card.tsx`
- [ ] `src/components/featured-trips.tsx` (trip tiles)
- [ ] `src/app/dashboard/page.tsx` (stat cards)
- [ ] `src/app/operator/dashboard/page.tsx` (dashboard widgets)

**Storybook:**
- [ ] Story with all composite parts
- [ ] Glassmorphism showcase
- [ ] Interactive card example
- [ ] Accessibility validation

**Validation:**
```bash
npm run design-system:validate-component card
```

---

### Priority 2: Form Components (Week 3-4)

#### Select
**File:** `src/components/ui/select.tsx`  
**Status:** ❌ Not Started | **Effort:** 14 hours

**Requirements:**
- [ ] HeroUI Select with ARIA combobox pattern
- [ ] Keyboard navigation (Up/Down arrows, Enter, Escape)
- [ ] `aria-expanded`, `aria-controls`, `aria-activedescendant`
- [ ] Search/filter functionality
- [ ] Multi-select support
- [ ] Glass dropdown panel

**Files to Update:**
- [ ] `src/app/book/page.tsx` (trip selection)
- [ ] `src/app/search/page.tsx` (filter controls)

---

#### Checkbox & Radio
**Files:** `src/components/ui/checkbox.tsx`, `src/components/ui/radio-group.tsx`  
**Status:** ❌ Not Started | **Effort:** 10 hours (combined)

**Requirements:**
- [ ] Custom styled with glass effects
- [ ] `aria-checked` states
- [ ] Focus visible (ring)
- [ ] Label association (`htmlFor`)
- [ ] Group semantics (`<fieldset>` + `<legend>`)

**Files to Update:**
- [ ] `src/app/checkout/page.tsx` (terms acceptance)
- [ ] `src/app/book/page.tsx` (seat selection checkboxes)

---

#### TextArea
**File:** `src/components/ui/textarea.tsx`  
**Status:** ❌ Not Started | **Effort:** 8 hours

**Requirements:**
- [ ] Same accessibility as Input
- [ ] Auto-resize option
- [ ] Character counter
- [ ] Glass background

---

### Priority 3: Navigation Components (Week 4-5)

#### Breadcrumbs
**File:** `src/components/ui/breadcrumb.tsx`  
**Status:** ❌ Not Started | **Effort:** 6 hours

**Requirements:**
- [ ] `<nav aria-label="Breadcrumb">`
- [ ] Structured list with separators
- [ ] Current page `aria-current="page"`

---

#### Tabs
**File:** `src/components/ui/tabs.tsx`  
**Status:** ❌ Not Started | **Effort:** 12 hours

**Requirements:**
- [ ] ARIA tabs pattern (`role="tablist"`, `role="tab"`, `role="tabpanel"`)
- [ ] Keyboard navigation (Left/Right arrows)
- [ ] `aria-selected`, `aria-controls`, `tabindex`
- [ ] Glass indicator for active tab

**Files to Update:**
- [ ] `src/app/dashboard/page.tsx` (dashboard sections)

---

#### Navigation Menu
**File:** `src/components/ui/navigation-menu.tsx`  
**Status:** ❌ Not Started | **Effort:** 16 hours

**Requirements:**
- [ ] Accessible dropdown menus
- [ ] Keyboard navigation
- [ ] Mobile responsive (hamburger menu)
- [ ] Glass background for dropdowns
- [ ] Skip links (`<a href="#main">Skip to content</a>`)

**Files to Update:**
- [ ] `src/app/layout.tsx` (main navigation)
- [ ] `src/app/operator/dashboard/page.tsx` (operator nav)

---

### Priority 4: Feedback Components (Week 5)

#### Dialog / Modal
**File:** `src/components/ui/dialog.tsx`  
**Status:** ❌ Not Started | **Effort:** 14 hours

**Requirements:**
- [ ] `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [ ] Focus trap (keyboard trapped inside)
- [ ] Escape key closes modal
- [ ] Return focus to trigger element after close
- [ ] Backdrop with glass blur (`--blur-xl`)
- [ ] Confirmation dialogs use `role="alertdialog"`

**Files to Update:**
- [ ] `src/app/book/page.tsx` (booking confirmation)
- [ ] `src/app/checkout/page.tsx` (payment processing)
- [ ] `src/app/operator/dashboard/page.tsx` (delete confirmation)

---

#### Alert / Toast
**Files:** `src/components/ui/alert.tsx`, `src/components/ui/sonner.tsx`  
**Status:** ❌ Not Started | **Effort:** 10 hours

**Requirements:**
- [ ] `role="alert"` or `role="status"`
- [ ] `aria-live="polite"` (info) or `aria-live="assertive"` (error)
- [ ] Icon + semantic color (success, warning, danger, info)
- [ ] Dismissible with accessible close button

---

#### Progress & Skeleton
**Files:** `src/components/ui/progress.tsx`, `src/components/ui/skeleton.tsx`  
**Status:** ❌ Not Started | **Effort:** 8 hours

**Requirements:**
- [ ] `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- [ ] Visual feedback for loading states
- [ ] Accessible labels (`aria-label="Loading bookings..."`)
- [ ] Skeleton uses glass effect for shimmer

---

### Priority 5: Advanced Components (Week 6-7)

#### Table
**File:** `src/components/ui/table.tsx`  
**Status:** ❌ Not Started | **Effort:** 16 hours

**Requirements:**
- [ ] Semantic `<table>` with proper headers
- [ ] `<th scope="col">` for column headers
- [ ] `<caption>` for table description
- [ ] Sortable columns with `aria-sort`
- [ ] Row selection with checkboxes
- [ ] Keyboard navigation (arrow keys for cells)
- [ ] Glass background for header row

**Files to Update:**
- [ ] `src/app/operator/dashboard/page.tsx` (bookings table)

---

#### Dropdown Menu
**File:** `src/components/ui/dropdown-menu.tsx`  
**Status:** ❌ Not Started | **Effort:** 14 hours

**Requirements:**
- [ ] ARIA menu pattern
- [ ] Keyboard navigation (Up/Down, Enter, Escape)
- [ ] `aria-haspopup="menu"`, `aria-expanded`
- [ ] Glass panel for menu

---

#### Popover & Tooltip
**Files:** `src/components/ui/popover.tsx`, `src/components/ui/tooltip.tsx`  
**Status:** ❌ Not Started | **Effort:** 12 hours

**Requirements:**
- [ ] `role="tooltip"` for tooltips
- [ ] `aria-describedby` pointing to tooltip
- [ ] Keyboard trigger (focus shows tooltip)
- [ ] Escape closes popover
- [ ] Glass background

---

## 📊 Migration Progress

### Overall Status
**Components Migrated:** 0 of 48 (0%)

**By Priority:**
- Priority 1 (Core): 0 of 3 (0%)
- Priority 2 (Forms): 0 of 9 (0%)
- Priority 3 (Navigation): 0 of 6 (0%)
- Priority 4 (Feedback): 0 of 8 (0%)
- Priority 5 (Advanced): 0 of 12 (0%)
- Priority 6 (Misc): 0 of 10 (0%)

---

## 🚨 Validation Commands

Validate specific component:
```bash
npm run design-system:validate-component <component-name>
```

Validate all components:
```bash
npm run design-system:validate-all-components
```

Check component for hardcoded colors:
```bash
npm run design-system:check-tokens --filter=<component-name>
```

Run accessibility tests:
```bash
npm run design-system:check-a11y --component=<component-name>
```

---

## 🔄 Migration Workflow

For each component:

1. **Read instructions** (this file + design-architecture.md)
2. **Create branch:** `git checkout -b feat/migrate-<component>`
3. **Backup current:** `git stash` (rollback if needed)
4. **Migrate code:**
   - Replace library imports (NextUI → HeroUI)
   - Apply design tokens (remove hardcoded colors)
   - Add glassmorphism effects
   - Implement ARIA attributes
   - Add keyboard navigation
   - Support reduced motion
5. **Create Storybook story:** `src/stories/<Component>.stories.tsx`
6. **Run validation:** `npm run design-system:validate-component <name>`
7. **Fix violations** until validation passes
8. **Manual test:**
   - Keyboard navigation
   - Screen reader (NVDA/JAWS)
   - Reduced motion (enable in OS)
   - Focus visible
9. **Update this file:** Mark checkboxes complete
10. **Commit:** `git commit -m "feat(design-system): migrate <Component> with WCAG AA"`
11. **Update tracker:** `npm run migration:update-tracker`
12. **Create PR:** CI will validate compliance
13. **Review & merge**

---

## 📚 References

- **Source of Truth:** [design-architecture.md § 8](../../../docs/design-architecture.md#8-component-system)
- **ARIA Patterns:** https://www.w3.org/WAI/ARIA/apg/patterns/
- **HeroUI Docs:** https://v3.heroui.com/docs/react/getting-started
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/

---

**Status:** 🔴 Not Started (0 of 48 components migrated)  
**Last Updated:** 2026-02-12  
**Next Action:** Begin with Button component migration
