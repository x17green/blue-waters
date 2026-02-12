---
name: Visual QA & Glassmorphism Validation Prompt
description: Visual quality assurance and glass effect implementation review
enforceMode: strict
source_of_truth: docs/design-architecture.md#6-glassmorphism-system
---

# 🔮 Visual QA & Glassmorphism Validation

Use this prompt to review visual implementation and validate glass effects.

---

## Target Review

**Component/Page:** _______________  
**URL:** _______________  
**Screenshots:** Attached? [ ] Yes [ ] No

---

## Glassmorphism Validation

### ✅ Base Glass Effect
```css
/* Expected CSS */
.glass {
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
  backdrop-filter: blur(8px) saturate(100%);
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: var(--shadow-soft);
}
```

**Inspect Element → Computed Styles:**
- [ ] `backdrop-filter` present
- [ ] `background` uses rgba or CSS variable
- [ ] `border` subtle (rgba or `--border-subtle`)
- [ ] `box-shadow` applied

**Issues:**
```
-
```

---

### ✅ Glass Hierarchy
**Expected Z-Index Layering:**
```
Tooltip (1600)     → glass-modal, blur(16px)
Popover (1500)     → glass-modal, blur(16px)
Modal (1400)       → glass-modal, blur(16px)
Backdrop (1300)    → glass-strong, blur(12px)
Dropdown (1000)    → glass-strong, blur(12px)
Card (0)           → glass-subtle, blur(4px)
```

**Test:** Verify blur strength increases with z-index

- [ ] Cards: blur(4px)
- [ ] Dropdowns: blur(12px)
- [ ] Modals: blur(16px)

**Issues:**
```
-
```

---

### ✅ Reduced Motion Fallback
**Test:** Enable "Reduce motion" in OS settings

Expected behavior:
```css
@media (prefers-reduced-motion: reduce) {
  .glass {
    backdrop-filter: none;
    background: var(--glass-01);
  }
}
```

**Before (motion enabled):**
- Glass effect visible: [ ] Yes [ ] No

**After (motion disabled):**
- Blur removed: [ ] Yes [ ] No
- Solid background used: [ ] Yes [ ] No

**Issues:**
```
-
```

---

### ✅ Browser Compatibility
**Test on:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Safari (requires -webkit- prefix):**
```css
.glass {
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
```

**Fallback for unsupported browsers:**
```css
@supports not (backdrop-filter: blur(8px)) {
  .glass {
    background: var(--bg-800);
    opacity: 0.95;
  }
}
```

**Issues:**
```
Browser: ___
Problem: ___
```

---

## Design Token Compliance

### ✅ No Hardcoded Colors
**Scan for:**
- ❌ `#` hex codes
- ❌ `rgb()` / `rgba()`
- ❌ `hsl()` / `hsla()`
- ❌ Color keywords (`red`, `blue`, `green`)
- ❌ Tailwind arbitrary values (`bg-[#0C4A79]`)

**Approved patterns:**
- ✅ CSS variables (`var(--accent-500)`)
- ✅ Tailwind classes (`bg-accent-500`, `text-muted-100`)

**Violations Found:**
```
File: ___
Line: ___
Code: ___
Fix: ___
```

---

### ✅ Consistent Spacing
**Expected scale (8px base):**
- 0, 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

**Measure spacing in component:**
- Padding: ___
- Margin: ___
- Gap: ___

**Compliant:** [ ] Yes [ ] No

**Issues:**
```
- Padding 18px (should be 16px or 24px)
```

---

### ✅ Typography
**Expected scale:**
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 28px
- 4xl: 32px

**Measure text sizes:**
- Heading: ___
- Body: ___
- Small: ___

**Compliant:** [ ] Yes [ ] No

---

## Visual Consistency

### ✅ Border Radius
**Expected:**
- sm: 6px
- md: 12px
- lg: 20px

**Measured:**
- Card corners: ___
- Button corners: ___
- Input corners: ___

**Compliant:** [ ] Yes [ ] No

---

### ✅ Shadows
**Expected:**
- soft: `0 6px 20px rgba(4,8,16,0.6)`
- medium: `0 10px 40px rgba(4,8,16,0.7)`
- strong: `0 20px 60px rgba(4,8,16,0.8)`

**Measured:**
- Card shadow: ___
- Modal shadow: ___
- Dropdown shadow: ___

**Compliant:** [ ] Yes [ ] No

---

### ✅ Icon System
**Expected:** Pictogrammers (Material Design Icons)

**Check:**
- [ ] No Lucide icons
- [ ] No emoji icons
- [ ] All icons use `Icon` component or `@mdi/react`
- [ ] Icon sizes consistent (0.8rem, 1rem, 1.33rem)
- [ ] Monochrome (single accent color, not multicolor)

**Violations:**
```
File: ___
Icon: ___ (emoji or Lucide)
Fix: Replace with mdi<IconName>
```

---

## Dark-First Validation

### ✅ Dark Mode Compliance
**Check all UI elements on dark background:**

- [ ] Text readable (contrast ≥ 4.5:1)
- [ ] Glass effects subtle (not over-saturated)
- [ ] Borders visible but not harsh
- [ ] Shadows provide depth (not lost on dark bg)
- [ ] CTAs stand out (accent color clear)

**Light mode (if applicable):**
- [ ] Glass effects inverted or removed
- [ ] Tokens updated for light background
- [ ] Contrast ratios maintained

---

## Conservative Aesthetic Validation

### ✅ Brand Alignment
**Expected tone:** Professional, conservative, government/official credibility

**Check:**
- [ ] No vibrant gradients (should be subtle)
- [ ] No playful emojis (use SVG icons)
- [ ] Muted accent colors (not bright orange/pink)
- [ ] Professional typography (no script fonts)
- [ ] Restrained animations (subtle, purposeful)

**Brand violations:**
```
Element: ___
Issue: Too vibrant/playful for conservative tone
Recommendation: ___
```

---

## Cross-Browser Visual Regression

### Chrome
- [ ] Glass effects render correctly
- [ ] Shadows visible
- [ ] Typography clear
- [ ] Spacing consistent

**Screenshot:** [Attach]

---

### Firefox
- [ ] Glass effects render correctly
- [ ] Shadows visible
- [ ] Typography clear
- [ ] Spacing consistent

**Screenshot:** [Attach]

---

### Safari
- [ ] `-webkit-backdrop-filter` working
- [ ] Glass effects render correctly
- [ ] Spacing consistent

**Screenshot:** [Attach]

---

### Mobile (iOS/Android)
- [ ] Touch targets ≥ 44×44px
- [ ] Text readable at default zoom
- [ ] Glass effects performant (no lag)
- [ ] Layout adapts to small screen

**Screenshot:** [Attach]

---

## Performance Impact

### ✅ Glass Effect Performance
**Test:** Open DevTools → Performance tab → Record interaction

**Metrics:**
- Frame rate with blur: ___ fps (target ≥ 60fps)
- Paint time: ___ ms (target < 16ms)
- CPU usage: ___ % (target < 50%)

**Issues:**
```
- Glass effect on 50+ cards causes jank
- Recommendation: Reduce blur or limit glass usage
```

---

## Summary

**Total Visual Issues:** ___

**Critical (blocks release):**
1. ___

**High (degraded UX):**
1. ___

**Medium (polish):**
1. ___

**Low (nice-to-have):**
1. ___

---

## Sign-Off

**Visual QA Pass:** [ ] Yes [ ] No  
**Glassmorphism Compliant:** [ ] Yes [ ] No  
**Cross-browser Consistent:** [ ] Yes [ ] No  
**Performance Acceptable:** [ ] Yes [ ] No  

**Reviewer:** _______________  
**Date:** _______________  
**Next Review:** _______________
