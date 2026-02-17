---
name: Glassmorphism System Implementation
applyTo: "**/*.css, **/*.tsx"
enforceMode: strict
phase: 1-foundation
priority: P1-high
source_of_truth: docs/design-architecture.md#6-glassmorphism-system
---

# 🔮 Glassmorphism System (Dark-First)

## Design Philosophy

**Glassmorphism** creates depth through layered translucent surfaces with backdrop blur. In Bayelsa Boat Club, glass effects provide:
1. **Visual hierarchy** (modals > cards > panels > background)
2. **Contextual depth** (floating elements appear above content)
3. **Professional restraint** (subtle, not over-saturated)
4. **Dark environment optimization** (docks at dusk, night cruises)

---

## 🎨 Glass Utility Classes

### Base Glass Effect
```css
/* src/styles/glassmorphism.css */

.glass {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  backdrop-filter: blur(8px) saturate(100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: var(--shadow-soft);
  border-radius: var(--radius-md);
}

/* Reduced motion fallback */
@media (prefers-reduced-motion: reduce) {
  .glass {
    backdrop-filter: none;
    background: var(--glass-01);
  }
}
```

### Glass Variants

```css
/* Subtle Glass (Primary Surface) */
.glass-subtle {
  background: var(--glass-01);
  backdrop-filter: blur(4px) saturate(100%);
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 2px 8px rgba(4, 8, 16, 0.4);
}

/* Strong Glass (Secondary Cards) */
.glass-strong {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.04) 100%
  );
  backdrop-filter: blur(12px) saturate(110%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: var(--shadow-medium);
}

/* Modal Glass (Strongest Blur) */
.glass-modal {
  background: rgba(15, 23, 27, 0.85);
  backdrop-filter: blur(16px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-strong);
}

/* Glass Hover State */
.glass-hover:hover {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.03) 100%
  );
  border-color: rgba(255, 255, 255, 0.08);
}

/* Glass Focus State (Accessibility) */
.glass:focus-visible {
  outline: 2px solid var(--accent-400);
  outline-offset: 2px;
  border-color: var(--accent-500);
}
```

---

## 📐 Layering Hierarchy

```
Z-Index Layer Structure:
  
  [1600] Tooltip         (glass-modal, blur(16px))
  [1500] Popover         (glass-modal, blur(16px))
  [1400] Modal Content   (glass-modal, blur(16px))
  [1300] Modal Backdrop  (glass-strong, blur(12px))
  [1200] Fixed Elements  (glass-strong, blur(12px))
  [1100] Sticky Nav      (glass, blur(8px))
  [1000] Dropdown Menu   (glass-strong, blur(12px))
  [0]    Cards           (glass-subtle, blur(4px))
  [0]    Page Background (--bg-900, no blur)
```

**Rule:** Stronger blur = higher z-index (more "above" the page)

---

## 🎯 Component-Specific Glass Patterns

### Cards (Featured Trips, Dashboard Stats)
```tsx
<Card className="glass-subtle hover:glass-hover transition-all">
  <CardHeader className="border-b border-subtle">
    <CardTitle>Sunset Creek Cruise</CardTitle>
  </CardHeader>
  <CardContent className="pt-4">
    {/* Content */}
  </CardContent>
</Card>
```

**CSS:**
```css
.card-glass {
  @apply glass-subtle rounded-md;
}

.card-glass:hover {
  @apply glass-hover;
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .card-glass:hover {
    transform: none;
  }
}
```

---

### Navigation (Sticky Header)
```tsx
<nav className="glass sticky top-0 z-sticky">
  <div className="container mx-auto px-4 py-3">
    {/* Nav content */}
  </div>
</nav>
```

**CSS:**
```css
.nav-glass {
  @apply glass;
  backdrop-filter: blur(12px) saturate(110%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

### Modals (Dialog, Confirmation)
```tsx
<Dialog open={isOpen}>
  {/* Backdrop */}
  <div className="fixed inset-0 z-modal-backdrop glass-strong" />
  
  {/* Modal Content */}
  <DialogContent className="glass-modal z-modal">
    <DialogTitle>Confirm Cancellation</DialogTitle>
    <DialogDescription>
      Are you sure you want to cancel this booking?
    </DialogDescription>
  </DialogContent>
</Dialog>
```

**CSS:**
```css
.modal-backdrop {
  @apply glass-strong;
  background: rgba(11, 15, 18, 0.8);
  backdrop-filter: blur(8px);
}

.modal-content {
  @apply glass-modal;
  max-width: 90vw;
  max-height: 90vh;
}
```

---

### Sidebar (Operator Dashboard)
```tsx
<aside className="glass-strong h-screen sticky top-0">
  <nav>
    {/* Sidebar navigation */}
  </nav>
</aside>
```

**CSS:**
```css
.sidebar-glass {
  @apply glass-strong;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(100%);
}
```

---

### Dropdown Menus
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="glass-strong z-dropdown">
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Bookings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**CSS:**
```css
.dropdown-glass {
  @apply glass-strong;
  min-width: 200px;
  padding: 4px;
  backdrop-filter: blur(12px) saturate(110%);
}

.dropdown-item {
  @apply rounded-sm px-2 py-1.5;
  transition: background 150ms ease-in-out;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
}
```

---

### Input Fields (Focus State)
```tsx
<Input
  className="bg-bg-800 focus:glass-subtle transition-all"
  placeholder="Departure location"
/>
```

**CSS:**
```css
.input-glass {
  background: var(--bg-800);
  border: 1px solid var(--border-default);
  transition: all 200ms ease-in-out;
}

.input-glass:focus {
  @apply glass-subtle;
  border-color: var(--accent-500);
  outline: none;
  box-shadow: 0 0 0 3px rgba(109, 167, 200, 0.1);
}
```

---

## 🚨 Common Mistakes & Fixes

### ❌ MISTAKE 1: Over-Saturation
```css
/* ❌ TOO MUCH GLASS */
.card {
  backdrop-filter: blur(24px) saturate(180%);
  background: rgba(255, 255, 255, 0.15);
  /* Too strong, text becomes illegible */
}
```

**✅ FIX:**
```css
.card {
  backdrop-filter: blur(8px) saturate(100%);
  background: var(--glass-01);
  /* Subtle, professional */
}
```

---

### ❌ MISTAKE 2: No Reduced Motion Fallback
```css
/* ❌ ACCESSIBILITY VIOLATION */
.glass {
  backdrop-filter: blur(12px);
  /* Causes motion sickness for some users */
}
```

**✅ FIX:**
```css
.glass {
  backdrop-filter: blur(12px);
}

@media (prefers-reduced-motion: reduce) {
  .glass {
    backdrop-filter: none;
    background: var(--glass-01);
  }
}
```

---

### ❌ MISTAKE 3: Poor Contrast
```css
/* ❌ TEXT NOT READABLE */
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.5);
  /* Contrast ratio 2.1:1, fails WCAG AA */
}
```

**✅ FIX:**
```css
.glass-card {
  background: var(--glass-01);
  color: var(--text-primary);
  /* Contrast ratio 15.2:1, passes WCAG AAA */
}
```

---

### ❌ MISTAKE 4: Nested Glass Effects
```html
<!-- ❌ GLASS INSIDE GLASS (LOOKS BAD) -->
<div class="glass">
  <div class="glass">
    <p>Content</p>
  </div>
</div>
```

**✅ FIX:**
```html
<div class="glass">
  <div class="bg-transparent">
    <p>Content</p>
  </div>
</div>
```

---

## 🧪 Testing Glassmorphism

### Visual Regression Tests
```bash
npm run test:visual -- --component=glass
```

**Checks:**
- Blur renders consistently across browsers
- Glass effects degrade gracefully on unsupported browsers
- Reduced motion fallback works

### Browser Compatibility
```css
/* Fallback for browsers without backdrop-filter support */
@supports not (backdrop-filter: blur(8px)) {
  .glass {
    background: var(--bg-800);
    opacity: 0.95;
  }
}
```

**Supported:**
- Chrome 76+
- Firefox 103+
- Safari 9+ (with `-webkit-` prefix)
- Edge 79+

**Fallback:**
- Solid background with slight transparency

---

## 📋 Glassmorphism Migration Checklist

**Components to Apply Glass Effects:**
- [ ] Card (`glass-subtle`)
- [ ] Dialog (`glass-modal`)
- [ ] Modal backdrop (`glass-strong`)
- [ ] Navigation header (`glass`, sticky)
- [ ] Sidebar (`glass-strong`)
- [ ] Dropdown menus (`glass-strong`)
- [ ] Popover (`glass-modal`)
- [ ] Tooltip (`glass-modal`)
- [ ] Input focus state (`glass-subtle`)
- [ ] Search bar (hero section) (`glass`)
- [ ] Featured trip cards (`glass-subtle`)
- [ ] Dashboard stat cards (`glass-subtle`)
- [ ] Operator dashboard panels (`glass`)

**Components WITHOUT Glass:**
- [ ] Buttons (solid backgrounds for CTA clarity)
- [ ] Alerts/Toasts (solid for critical visibility)
- [ ] Badges (solid for status clarity)
- [ ] Progress bars (solid for measurement clarity)
- [ ] Page background (`--bg-900`, no blur)

---

## 🎨 Tailwind Integration

Add glass utilities to Tailwind config:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      backdropSaturate: {
        100: '100%',
        110: '110%',
        120: '120%',
      },
    },
  },
  plugins: [
    // Custom glass plugin
    function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(8px) saturate(100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'var(--shadow-soft)',
        },
        '.glass-subtle': {
          background: 'var(--glass-01)',
          backdropFilter: 'blur(4px) saturate(100%)',
          border: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 2px 8px rgba(4,8,16,0.4)',
        },
        '.glass-strong': {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(12px) saturate(110%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'var(--shadow-medium)',
        },
        '.glass-modal': {
          background: 'rgba(15,23,27,0.85)',
          backdropFilter: 'blur(16px) saturate(120%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'var(--shadow-strong)',
        },
      });
    },
  ],
};
```

---

## 🔍 Validation

```bash
# Check all glass implementations
npm run design-system:validate-glass

# Expected output:
# ✅ All glass effects have reduced-motion fallbacks
# ✅ No nested glass effects
# ✅ All glass text has ≥ 4.5:1 contrast
# ✅ Browser fallbacks present
```

---

## 📊 Progress Tracker

**Glass Implementation Status:**
- [ ] Glass utilities created (`src/styles/glassmorphism.css`)
- [ ] Tailwind integration complete
- [ ] Reduced motion fallbacks added
- [ ] Browser compatibility fallbacks added
- [ ] Components updated to use glass (0 of 13)
- [ ] Visual regression baselines captured
- [ ] Documentation complete

---

## 📚 References

- **Source of Truth:** [design-architecture.md § 6](../../../docs/design-architecture.md#6-glassmorphism-system)
- **CSS backdrop-filter:** https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
- **Can I Use (backdrop-filter):** https://caniuse.com/css-backdrop-filter
- **Glassmorphism UI:** https://ui.glass/generator

---

**Status:** 🔴 Not Started  
**Last Updated:** 2026-02-12  
**Next Action:** Create `src/styles/glassmorphism.css` with utility classes
