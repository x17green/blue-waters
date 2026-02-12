---
name: Design Tokens Migration Instructions
applyTo: "**/*.css, **/*.tsx, **/*.ts, tailwind.config.ts"
enforceMode: strict
phase: 0-foundation
priority: P0-critical
source_of_truth: docs/design-architecture.md#3-design-tokens
---

# 🎨 Design Tokens Migration

## CRITICAL RULE: NO HARDCODED COLORS

**STRICT ENFORCEMENT:** Any PR with hardcoded color values will be **BLOCKED** by CI.

Forbidden patterns:
- ❌ `#0C4A79`, `#FF6B35`, or any hex color
- ❌ `rgb(12, 74, 121)` or `rgba(...)`
- ❌ `hsl(200, 82%, 40%)` or `hsla(...)`
- ❌ Tailwind arbitrary values: `bg-[#0C4A79]`, `text-[rgb(255,107,53)]`
- ❌ Inline color keywords: `color: blue`, `background: red`

Allowed patterns:
- ✅ CSS variables: `var(--accent-500)`, `var(--bg-900)`
- ✅ Tailwind classes mapped to tokens: `bg-accent-500`, `text-muted-100`
- ✅ Theme-aware utilities: `className={cn('glass', 'shadow-soft')}`

---

## 📋 Migration Checklist

### Phase 0: Token System Setup

- [ ] **Create token definition file:** `src/design-system/tokens.ts`
- [ ] **Update globals.css:** Replace current HSL variables with new dark-first tokens
- [ ] **Update Tailwind config:** Map tokens to Tailwind theme
- [ ] **Remove legacy tokens:** Delete old `--primary`, `--accent`, `--ocean-blue`
- [ ] **Validate:** Run `npm run design-system:check-tokens` (0 violations)

---

## 🎨 Token Definitions

### Color Tokens (from design-architecture.md)

```css
:root {
  /* === BACKGROUNDS (Dark-First) === */
  --bg-900: #0b0f12;           /* App background */
  --bg-800: #0f171b;           /* Page panels */
  --panel-800: rgba(255,255,255,0.03);
  
  /* === GLASS LAYERS === */
  --glass-01: rgba(255,255,255,0.03);  /* Subtle glass */
  --glass-02: rgba(255,255,255,0.06);  /* Stronger glass */
  
  /* === TEXT COLORS === */
  --text-primary: rgba(255,255,255,0.95);    /* Main text */
  --text-secondary: rgba(255,255,255,0.75);  /* Secondary text */
  --muted-100: #9aa4ab;                       /* Muted text, placeholders */
  --muted-70: rgba(255,255,255,0.06);        /* Dividers */
  
  /* === ACCENT (Conservative Muted) === */
  --accent-500: #6da7c8;       /* Primary CTA (muted teal-blue) */
  --accent-400: #89b6d2;       /* Hover/secondary */
  --accent-600: #5a8fb8;       /* Pressed state */
  
  /* === SEMANTIC COLORS === */
  --success-500: #67d17f;      /* Success states */
  --success-400: #7fdb94;      /* Success hover */
  --danger-500: #e06c75;       /* Danger/destructive actions */
  --danger-400: #e88389;       /* Danger hover */
  --warning-500: #e0b55a;      /* Warning states */
  --warning-400: #e7c376;      /* Warning hover */
  --info-500: #61afef;         /* Info states */
  --info-400: #7dbff5;         /* Info hover */
  
  /* === BORDERS === */
  --border-subtle: rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.12);
  --border-strong: rgba(255,255,255,0.18);
  
  /* === SHADOWS === */
  --shadow-soft: 0 6px 20px rgba(4,8,16,0.6);
  --shadow-medium: 0 10px 40px rgba(4,8,16,0.7);
  --shadow-strong: 0 20px 60px rgba(4,8,16,0.8);
  
  /* === BORDER RADIUS === */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  
  /* === SPACING (8px base) === */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  
  /* === TYPOGRAPHY === */
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 28px;
  --text-4xl: 32px;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* === Z-INDEX === */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;
  
  /* === TRANSITIONS === */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
  
  /* === BLUR === */
  --blur-sm: 4px;
  --blur-md: 8px;
  --blur-lg: 12px;
  --blur-xl: 16px;
}
```

---

## ⚠️ Migration Strategy

### Step 1: Audit Current Tokens

Run the audit script:
```bash
npm run design-system:check-tokens
```

**Expected output:**
```
🔍 Scanning codebase for hardcoded colors...

VIOLATIONS FOUND:

src/app/page.tsx:
  Line 45: className="bg-[#0C4A79] text-white"
  Line 87: style={{ color: '#FF6B35' }}

src/components/hero.tsx:
  Line 23: background: linear-gradient(135deg, #0C4A79 0%, #0A3A5E 100%)

src/app/globals.css:
  Line 15: --primary: 200 82% 40%;
  Line 16: --accent: 16 100% 60%;

TOTAL: 47 violations across 12 files

❌ AUDIT FAILED
```

### Step 2: Create Token Mapping Table

| Old Token | Old Value | New Token | New Value | Usage |
|-----------|-----------|-----------|-----------|-------|
| `--primary` | `hsl(200 82% 40%)` | `--accent-500` | `#6da7c8` | Primary CTAs |
| `--accent` | `hsl(16 100% 60%)` | `--accent-400` | `#89b6d2` | Hover states |
| `#0C4A79` | Deep Ocean Blue | `--bg-800` | `#0f171b` | Panel backgrounds |
| `#FF6B35` | Calypso Orange | `--accent-500` | `#6da7c8` | **REMOVED** (too vibrant) |
| `--card` | `0 0% 100%` | `--glass-01` | `rgba(255,255,255,0.03)` | Card backgrounds |

### Step 3: Replace All Occurrences

Use find-and-replace with validation:

```bash
# Find all hardcoded hex colors
npm run design-system:find-colors

# Auto-replace with tokens (preview mode)
npm run design-system:replace-tokens --dry-run

# Execute replacement (user confirmation required)
npm run design-system:replace-tokens --confirm
```

### Step 4: Update Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          900: "var(--bg-900)",
          800: "var(--bg-800)",
        },
        glass: {
          1: "var(--glass-01)",
          2: "var(--glass-02)",
        },
        accent: {
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
        },
        muted: {
          70: "var(--muted-70)",
          100: "var(--muted-100)",
        },
        success: {
          400: "var(--success-400)",
          500: "var(--success-500)",
        },
        danger: {
          400: "var(--danger-400)",
          500: "var(--danger-500)",
        },
        warning: {
          400: "var(--warning-400)",
          500: "var(--warning-500)",
        },
        info: {
          400: "var(--info-400)",
          500: "var(--info-500)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        medium: "var(--shadow-medium)",
        strong: "var(--shadow-strong)",
      },
      backdropBlur: {
        sm: "var(--blur-sm)",
        md: "var(--blur-md)",
        lg: "var(--blur-lg)",
        xl: "var(--blur-xl)",
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 5: Validate

Run all validators:
```bash
npm run design-system:validate-all
```

**Success criteria:**
- ✅ 0 hardcoded colors found
- ✅ All CSS variables defined in globals.css
- ✅ Tailwind config maps all tokens
- ✅ No broken styles (visual regression tests pass)

---

## 🚨 CI/CD Enforcement

The CI pipeline will **BLOCK** any PR that:
1. Contains hardcoded color values (hex, rgb, hsl)
2. Uses arbitrary Tailwind values for colors
3. Introduces new CSS variables not in the approved token list

**GitHub Actions check:**
```yaml
- name: Check for hardcoded colors
  run: |
    npm run design-system:check-tokens
    if [ $? -ne 0 ]; then
      echo "❌ Design token violations found. PR blocked."
      exit 1
    fi
```

---

## 📋 Token Usage Examples

### Before (WRONG ❌)
```tsx
// Hardcoded colors
<button className="bg-[#0C4A79] hover:bg-[#0A3A5E] text-white">
  Book Now
</button>

// Inline styles
<div style={{ backgroundColor: '#FF6B35', color: 'white' }}>
  Featured Trip
</div>

// Legacy CSS variables
<Card className="bg-primary text-primary-foreground">
  Dashboard
</Card>
```

### After (CORRECT ✅)
```tsx
// Using design tokens via Tailwind
<button className="bg-accent-500 hover:bg-accent-600 text-white">
  Book Now
</button>

// CSS variables
<div className="glass shadow-soft rounded-md">
  Featured Trip
</div>

// Token-based card
<Card className="bg-glass-1 border border-subtle">
  Dashboard
</Card>
```

---

## 🔄 Update Process

When tokens change:

1. **Update source of truth:** Edit [design-architecture.md](../../../docs/design-architecture.md)
2. **Update token file:** Edit `src/design-system/tokens.ts`
3. **Update globals.css:** Apply new CSS variable values
4. **Run migration script:** `npm run design-system:replace-tokens`
5. **Validate:** `npm run design-system:check-tokens`
6. **Commit:** `git commit -m "chore(design-system): update color tokens"`
7. **Update tracker:** `npm run migration:update-tracker`

---

## 📊 Progress Tracking

### Token Categories

#### 1. Color Tokens (8 total)
- [ ] Background colors (`--bg-900`, `--bg-800`)
- [ ] Glass layers (`--glass-01`, `--glass-02`)
- [ ] Text colors (`--text-primary`, `--text-secondary`, `--muted-100`)
- [ ] Accent colors (`--accent-400`, `--accent-500`, `--accent-600`)
- [ ] Semantic colors (success, danger, warning, info)
- [ ] Border colors (`--border-subtle`, `--border-default`, `--border-strong`)

#### 2. Spacing Tokens (12 total)
- [ ] Base spacing scale (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20)

#### 3. Typography Tokens (11 total)
- [ ] Font families (`--font-sans`)
- [ ] Font sizes (`--text-xs` through `--text-4xl`)
- [ ] Font weights (normal, medium, semibold, bold)
- [ ] Line heights (tight, normal, relaxed)

#### 4. Effect Tokens (11 total)
- [ ] Border radius (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`)
- [ ] Shadows (`--shadow-soft`, `--shadow-medium`, `--shadow-strong`)
- [ ] Blur values (`--blur-sm` through `--blur-xl`)

#### 5. Z-Index Tokens (8 total)
- [ ] Layering scale (base, dropdown, sticky, fixed, modal, popover, tooltip)

#### 6. Transition Tokens (3 total)
- [ ] Duration values (fast, base, slow)

---

## 🔍 Validation Script Output

When running `npm run design-system:check-tokens`, expect:

```
╔══════════════════════════════════════════════════════════════╗
║           DESIGN TOKEN VALIDATION REPORT                     ║
╚══════════════════════════════════════════════════════════════╝

✅ Token Definition File: FOUND (src/design-system/tokens.ts)
✅ Globals CSS: VALID (all tokens defined)
✅ Tailwind Config: VALID (all tokens mapped)

🔍 Scanning for hardcoded colors...

Files scanned: 127
Violations found: 0

✅ ALL CHECKS PASSED — Design token system is compliant.

Token Coverage:
  Color tokens: 100% (8/8)
  Spacing tokens: 100% (12/12)
  Typography tokens: 100% (11/11)
  Effect tokens: 100% (11/11)
  Z-index tokens: 100% (8/8)
  Transition tokens: 100% (3/3)

Last updated: 2026-02-12 14:30:22
```

---

## 📚 References

- **Source of Truth:** [design-architecture.md § 3. Design Tokens](../../../docs/design-architecture.md#3-design-tokens)
- **Current Analysis:** [ui-ux-analysis-report.md](../../../docs/ui-ux-analysis-report.md)
- **Tailwind Documentation:** https://tailwindcss.com/docs/customizing-colors
- **CSS Variables Guide:** https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

---

**Status:** 🔴 Not Started  
**Last Updated:** 2026-02-12  
**Next Action:** Create `src/design-system/tokens.ts` and run initial audit
