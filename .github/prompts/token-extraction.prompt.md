---
name: Design Token Extraction & Migration Prompt
description: Identify and replace hardcoded values with design tokens
enforceMode: strict
source_of_truth: docs/design-architecture.md#3-design-tokens
---

# 🎨 Design Token Extraction & Replacement Prompt

Use this prompt to systematically replace hardcoded colors, spacing, and other magic values with design system tokens.

---

## Target File

**File Path:** _______________  
**Component:** _______________

---

## Step 1: Scan for Hardcoded Values

### Colors (Hex, RGB, HSL)
```bash
# Search for hex colors
grep -rn '#[0-9a-fA-F]\{3,6\}' <file>

# Search for rgb/rgba
grep -rn 'rgba\?(' <file>

# Search for hsl/hsla
grep -rn 'hsla\?(' <file>
```

**Found:**
```
Line 23: background: #0C4A79;
Line 45: color: rgb(255, 107, 53);
Line 67: border: 1px solid hsl(200, 82%, 40%);
```

---

### Spacing (Non-standard values)
```bash
# Search for spacing not in 8px scale
grep -rn 'padding:\|margin:\|gap:' <file>
```

**Found:**
```
Line 12: padding: 18px;        # Should be 16px or 24px
Line 34: margin: 5px;          # Should be 4px or 8px
Line 56: gap: 14px;            # Should be 12px or 16px
```

---

### Border Radius (Non-token values)
```bash
# Search for border-radius
grep -rn 'border-radius:' <file>
```

**Found:**
```
Line 15: border-radius: 8px;   # Should be var(--radius-sm) 6px or var(--radius-md) 12px
Line 28: border-radius: 15px;  # Should be var(--radius-md) 12px
```

---

### Shadow (Hardcoded)
```bash
# Search for box-shadow
grep -rn 'box-shadow:' <file>
```

**Found:**
```
Line 42: box-shadow: 0 4px 12px rgba(0,0,0,0.5);  # Should be var(--shadow-soft)
```

---

### Font Size (Non-token values)
```bash
# Search for font-size
grep -rn 'font-size:' <file>
```

**Found:**
```
Line 18: font-size: 15px;      # Should be var(--text-sm) 14px or var(--text-base) 16px
```

---

## Step 2: Create Replacement Mapping

| Current Value | Design Token | Token Value | Usage |
|---------------|--------------|-------------|-------|
| `#0C4A79` | `--accent-500` | `#6da7c8` | Primary CTA background |
| `#FF6B35` | `--accent-500` | `#6da7c8` | **REMOVED** (too vibrant) |
| `rgb(255,107,53)` | `--accent-500` | `#6da7c8` | CTA hover state |
| `hsl(200, 82%, 40%)` | `--accent-500` | `#6da7c8` | Legacy primary |
| `rgba(255,255,255,0.03)` | `--glass-01` | `rgba(255,255,255,0.03)` | Glass background |
| `18px` | `--space-4` | `16px` | Padding |
| `5px` | `--space-1` | `4px` | Small margin |
| `8px` | `--radius-sm` | `6px` | Border radius (buttons) |
| `15px` | `--radius-md` | `12px` | Border radius (cards) |
| `0 4px 12px rgba(0,0,0,0.5)` | `--shadow-soft` | `0 6px 20px rgba(4,8,16,0.6)` | Card shadow |
| `15px` | `--text-sm` | `14px` | Small text |

---

## Step 3: Replace Values

### Before (Hardcoded ❌)
```css
.hero {
  background: linear-gradient(135deg, #0C4A79 0%, #0A3A5E 100%);
  padding: 18px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.cta-button {
  background-color: #FF6B35;
  color: white;
  font-size: 15px;
  padding: 12px 20px;
  border-radius: 6px;
}

.cta-button:hover {
  background-color: rgb(255, 107, 53);
}
```

---

### After (Design Tokens ✅)
```css
.hero {
  background: var(--glass-01);
  backdrop-filter: blur(var(--blur-md));
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
}

.cta-button {
  background-color: var(--accent-500);
  color: var(--text-primary);
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-sm);
}

.cta-button:hover {
  background-color: var(--accent-600);
}
```

---

## Step 4: Tailwind Class Conversion

### Before (Arbitrary Values ❌)
```tsx
<div className="bg-[#0C4A79] text-white p-[18px] rounded-[8px]">
  <button className="bg-[#FF6B35] hover:bg-[rgb(255,107,53)] px-[20px] py-[12px]">
    Book Now
  </button>
</div>
```

---

### After (Token-Based Classes ✅)
```tsx
<div className="glass shadow-soft p-4 rounded-md">
  <button className="bg-accent-500 hover:bg-accent-600 px-5 py-3 rounded-sm">
    Book Now
  </button>
</div>
```

---

## Step 5: Component Props Conversion

### Before (Hardcoded ❌)
```tsx
<Card
  style={{
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '16px 24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  }}
>
  <h3 style={{ color: '#FF6B35', fontSize: '20px' }}>
    Featured Trip
  </h3>
</Card>
```

---

### After (Design Tokens ✅)
```tsx
<Card className="glass shadow-soft p-4 rounded-md">
  <h3 className="text-accent-500 text-xl">
    Featured Trip
  </h3>
</Card>
```

---

## Step 6: Validate Replacement

### Run Automated Check
```bash
npm run design-system:check-tokens -- --file=<path>
```

**Expected Output:**
```
✅ No hardcoded colors found
✅ All spacing values use design system scale
✅ All border-radius values use tokens
✅ All shadows use tokens
✅ All font-sizes use tokens

RESULT: Token migration COMPLETE ✅
```

---

### Manual Verification
**Visual inspection:**
- [ ] Colors match design system palette
- [ ] Spacing looks consistent with other components
- [ ] Border radius matches button standard (sm) or card standard (md)
- [ ] Shadows provide appropriate depth

**Screenshot comparison:**
- Before: [Attach]
- After: [Attach]
- Differences: _______________

**Acceptable differences:**
- ✅ Slightly different accent color (old orange → new muted blue)
- ✅ Adjusted spacing (18px → 16px for consistency)
- ❌ Completely different layout (indicates error)

---

## Step 7: Update Tailwind Config (if needed)

If new token combinations needed:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        accent: {
          400: 'var(--accent-400)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
        },
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        // ...
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
    },
  },
};
```

---

## Common Patterns & Replacements

### Pattern 1: Gradient Backgrounds
**Old (vibrant gradients):**
```css
background: linear-gradient(135deg, #0C4A79 0%, #FF6B35 100%);
```

**New (glass or subtle gradient):**
```css
background: var(--glass-01);
backdrop-filter: blur(var(--blur-md));
/* OR */
background: linear-gradient(180deg, var(--bg-800), var(--bg-900));
```

---

### Pattern 2: Hover States
**Old (hardcoded lighter shade):**
```css
.button {
  background: #0C4A79;
}
.button:hover {
  background: #0E5A95;  /* Manually lightened */
}
```

**New (token variants):**
```css
.button {
  background: var(--accent-500);
}
.button:hover {
  background: var(--accent-600);
}
```

---

### Pattern 3: Border Colors
**Old (hardcoded borders):**
```css
border: 1px solid rgba(255,255,255,0.1);
```

**New (token-based):**
```css
border: 1px solid var(--border-subtle);
/* OR */
border: 1px solid var(--border-default);
```

---

### Pattern 4: Opacity-Based Colors
**Old (color + opacity):**
```css
background-color: #0C4A79;
opacity: 0.8;
```

**New (token with alpha):**
```css
background-color: var(--glass-01);  /* Already has alpha */
```

---

## Troubleshooting

### Issue: Color looks different after replacement
**Diagnosis:** Old color was vibrant, new token is conservative (by design)  
**Resolution:** Confirm with stakeholders this is intentional (move from consumer → government aesthetic)

### Issue: Spacing looks too tight/loose
**Diagnosis:** Rounding to nearest 8px scale value  
**Resolution:** Test both adjacent values (e.g., 16px vs 24px), choose best visual result

### Issue: Border radius doesn't match
**Diagnosis:** Component-specific radius not in token system  
**Resolution:** Use closest token (sm, md, lg) or create new semantic token if needed globally

---

## Completion Checklist

- [ ] All hex colors replaced
- [ ] All rgb/rgba/hsl/hsla replaced
- [ ] All arbitrary spacing replaced
- [ ] All border-radius replaced
- [ ] All box-shadow replaced
- [ ] All font-size replaced
- [ ] Tailwind arbitrary values removed
- [ ] CSS variables imported in globals.css
- [ ] Tailwind config updated (if needed)
- [ ] Validation script passes
- [ ] Visual regression acceptable
- [ ] Commit made: `chore(design-system): replace hardcoded values with tokens in <component>`

---

**File processed:** _______________  
**Tokens replaced:** ___  
**Status:** [ ] Complete [ ] In Progress  
**Reviewer:** _______________  
**Date:** _______________
