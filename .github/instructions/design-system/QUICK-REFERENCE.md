# Design System Migration: Quick Reference

> **Keep this open while working** - Essential commands, token reference, and validation checklist

## ⚡ Quick Commands

```bash
# Check overall progress
npm run migration:report

# Validate tokens (scan for hardcoded colors)
npm run design-system:check-tokens

# Validate a component
npm run design-system:validate-component button

# Update tracker after completing work
npm run migration:update-tracker

# Run all checks
npm run design-system:validate-all
```

## 🎨 Design Token Quick Reference

### Colors

```css
/* Background layers */
--bg-950    /* Deepest (app background) */
--bg-900    /* Cards, containers */
--bg-800    /* Elevated panels */
--bg-700    /* Hover states */

/* Accent (muted nautical blue) */
--accent-900   /* Darkest */
--accent-500   /* Primary */
--accent-400   /* Hover */
--accent-300   /* Active */

/* Neutrals */
--fg            /* Primary text */
--fg-muted      /* Secondary text */
--fg-subtle     /* Tertiary text */
--border-default
--border-subtle

/* Status */
--success-500
--warning-500
--error-500
--info-500
```

### Spacing

```css
--space-0_5    /* 0.125rem (2px) */
--space-1      /* 0.25rem (4px) */
--space-2      /* 0.5rem (8px) */
--space-3      /* 0.75rem (12px) */
--space-4      /* 1rem (16px) - base */
--space-6      /* 1.5rem (24px) */
--space-8      /* 2rem (32px) */
--space-12     /* 3rem (48px) */
```

### Border Radius

```css
--radius-sm    /* 0.25rem (4px) */
--radius-md    /* 0.5rem (8px) */
--radius-lg    /* 0.75rem (12px) */
--radius-full  /* 9999px */
```

### Glassmorphism

```css
.glass           /* blur(8px) - base */
.glass-subtle    /* blur(4px) - cards */
.glass-strong    /* blur(12px) - dropdowns */
.glass-modal     /* blur(16px) - modals */
```

### Z-Index Layers

```css
--z-tooltip: 1600
--z-modal: 1400
--z-popover: 1200
--z-dropdown: 1000
--z-header: 800
--z-sticky: 600
--z-overlay: 400
--z-elevated: 200
--z-default: 1
--z-base: 0
```

## ✅ Component Migration Checklist

Copy this for each component:

```markdown
Component: _________________

[ ] 1. Design Tokens
    [ ] No hex colors (#...)
    [ ] No rgb/rgba (except glass white/black)
    [ ] No hsl/hsla
    [ ] No Tailwind arbitrary values (bg-[...])
    [ ] Uses CSS variables: var(--accent-500)
    [ ] Uses token-based Tailwind: bg-bg-900, text-fg

[ ] 2. HeroUI Library
    [ ] Uses CVA for variants (import { cva } from 'class-variance-authority')
    [ ] Follows HeroUI patterns
    [ ] Proper Tailwind class composition

[ ] 3. Accessibility (WCAG AA)
    [ ] Semantic HTML (<button>, not <div onClick>)
    [ ] ARIA attributes (aria-label, aria-describedby, role)
    [ ] Keyboard support (onKeyDown for Space/Enter)
    [ ] Focus styles (focus-visible:ring-2)
    [ ] Labels associated with inputs (htmlFor)
    [ ] Color contrast ≥4.5:1 for text, ≥3:1 for UI

[ ] 4. Glassmorphism (if applicable)
    [ ] Card/Modal/Dropdown/Nav uses glass utility
    [ ] backdrop-filter present
    [ ] Reduced motion fallback:
        @media (prefers-reduced-motion: reduce) {
          backdrop-filter: none;
          background: var(--bg-900); /* solid fallback */
        }

[ ] 5. Icons
    [ ] Pictogrammers (@mdi/react or @mdi/js)
    [ ] No Lucide React
    [ ] No emojis (⛵🌊🎫🚢)
    [ ] Decorative icons: aria-hidden="true"
    [ ] Icon-only buttons: aria-label="..."

[ ] 6. Storybook
    [ ] Story file exists: src/stories/<Component>.stories.tsx
    [ ] 6+ variants shown (default, variants, states, dark mode)

[ ] 7. Validation
    [ ] npm run design-system:validate-component <name> passes
    [ ] No CI failures on PR

[ ] 8. Documentation
    [ ] Checkbox marked in 02-component-migration.instructions.md
    [ ] npm run migration:update-tracker executed
    [ ] Changes committed
```

## 🚫 Common Violations (Will Block CI)

```tsx
// ❌ WRONG - Hardcoded hex color
<div className="bg-[#0C4A79]">

// ✅ CORRECT - Design token
<div className="bg-accent-500">

// ❌ WRONG - Hardcoded RGB
<div style={{ backgroundColor: 'rgb(12, 74, 121)' }}>

// ✅ CORRECT - CSS variable
<div style={{ backgroundColor: 'var(--accent-500)' }}>

// ❌ WRONG - Lucide icon
import { Calendar } from 'lucide-react'

// ✅ CORRECT - Pictogrammers
import { mdiCalendar } from '@mdi/js'
import Icon from '@mdi/react'

// ❌ WRONG - Emoji
<span>⛵ Book a cruise</span>

// ✅ CORRECT - Pictogrammers icon
<Icon path={mdiFerry} aria-hidden="true" />

// ❌ WRONG - Glass without reduced-motion fallback
<div className="backdrop-blur-lg bg-white/5">

// ✅ CORRECT - Glass with fallback
<div className="glass motion-reduce:backdrop-blur-none motion-reduce:bg-bg-900">
```

## 📋 Accessibility Quick Checks

```tsx
// Buttons
<button 
  className="focus-visible:ring-2 focus-visible:ring-accent-500"
  aria-label="Close" // Required if icon-only
>

// Inputs
<label htmlFor="email" className="text-fg">Email</label>
<input 
  id="email" 
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
<span id="email-error" className="text-error-500">Invalid email</span>

// Images
<img src="..." alt="Descriptive text" /> // Never empty alt

// Icon buttons
<button aria-label="Delete booking">
  <Icon path={mdiDelete} aria-hidden="true" />
</button>

// Live regions
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Modals
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Booking</h2>
  {/* ... */}
</div>
```

## 🧪 Test Checklist Before PR

```markdown
[ ] Keyboard navigation
    [ ] Tab through all interactive elements
    [ ] Enter/Space activate buttons
    [ ] Escape closes modals/dropdowns
    [ ] Arrow keys work in lists/menus

[ ] Screen reader (NVDA/VoiceOver)
    [ ] All text announced
    [ ] Form labels read correctly
    [ ] Buttons have clear names
    [ ] Status changes announced (aria-live)

[ ] Visual
    [ ] Glass effects visible on dark bg
    [ ] No hardcoded colors
    [ ] Consistent spacing (use tokens)
    [ ] Icons professional (no emojis)

[ ] Performance
    [ ] Animations ≤300ms
    [ ] Reduced motion works (disable animations in OS settings)
    [ ] Glass effects don't cause lag

[ ] Validation
    [ ] npm run design-system:validate-component <name> passes
    [ ] npm run design-system:check-tokens passes
    [ ] CI checks pass on PR
```

## 🎯 Strategic Migration Order

### Phase 1: Core Components (Do First)
1. Button
2. Input
3. Card
4. Badge
5. Alert

### Phase 2: Forms & Navigation
6. Select
7. Checkbox
8. Radio Group
9. Switch
10. Dropdown Menu
11. Navigation Menu
12. Tabs

### Phase 3: Pages
1. Operator Dashboard (40h, complex)
2. Book page (20h, seat selection)
3. Checkout (20h, payment form)
4. Login/Signup (10h each)
5. Landing (20h, needs brand decision)

## 🔗 Quick Links

- **Master Tracker:** `.github/instructions/design-system/00-MASTER-TRACKER.instructions.md`
- **Component Migration:** `.github/instructions/prompts/migrate-component.prompt.md`
- **Token Definitions:** `.github/instructions/design-system/01-design-tokens.instructions.md`
- **A11y Gates:** `.github/instructions/design-system/04-accessibility-gates.instructions.md`
- **Glass System:** `.github/instructions/design-system/05-glassmorphism-system.instructions.md`
- **Icon Mapping:** `.github/instructions/design-system/06-iconography-migration.instructions.md`

## 💾 Commit Convention

```bash
# Component migration
git commit -m "feat(design-system): migrate Button component to HeroUI"

# Token replacement
git commit -m "refactor(design-system): replace hardcoded colors with tokens in Card"

# Accessibility fix
git commit -m "fix(a11y): add keyboard support to Dropdown component"

# Icon replacement
git commit -m "refactor(icons): replace Lucide Calendar with Pictogrammers mdiCalendar"

# Page migration
git commit -m "feat(design-system): migrate Operator Dashboard to glass layout"

# Tracker update
git commit -m "docs(design-system): update migration tracker progress"
```

## 🆘 Emergency Fixes

**CI failing with token violations?**
```bash
npm run design-system:check-tokens
# Fix each violation shown
# Replace hex/rgb with tokens from this cheatsheet
```

**Component validation failing?**
```bash
npm run design-system:validate-component <name>
# Fix each failed check
# Re-run until all pass
```

**Accessibility violations?**
```bash
# Check checklist above
# Test with keyboard (Tab, Enter, Escape)
# Test with NVDA screen reader
# Add ARIA attributes as needed
```

**Glass effects not working?**
```css
/* Ensure these are present */
.glass {
  backdrop-filter: blur(8px);
  background: rgba(12, 74, 121, 0.05); /* Token-based alpha */
}

@media (prefers-reduced-motion: reduce) {
  .glass {
    backdrop-filter: none;
    background: var(--bg-900); /* Solid fallback */
  }
}
```

---

**Last Updated:** February 2025  
**Print this or keep it open in a side panel while coding**
