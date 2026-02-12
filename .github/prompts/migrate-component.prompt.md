---
name: Component Migration Prompt Template
description: Guide AI or developer through systematic component migration
enforceMode: strict
source_of_truth: docs/design-architecture.md, .github/instructions/design-system/02-component-migration.instructions.md
---

# 🧩 Component Migration Prompt

Use this prompt when migrating a component from the current implementation to the new design system.

---

## Context for AI/Developer

**Objective:** Migrate `<COMPONENT_NAME>` from current hybrid implementation (shadcn/NextUI) to new HeroUI-based design system with:
- Dark-first glassmorphism aesthetic
- Full WCAG AA accessibility compliance
- Conservative government/official credibility
- Design tokens (no hardcoded colors)
- Pictogrammers icons (no Lucide/emojis)
- Reduced motion support

---

## Input Requirements

Before starting, provide:

1. **Component Name:** _______________
2. **Component File Path:** src/components/ui/_______________
3. **Current Implementation:** (paste current code below)

```tsx
// Current code here
```

4. **Dependencies:** (list all imports and external libraries)
   - [ ] NextUI used?
   - [ ] Lucide icons used?
   - [ ] Hardcoded colors present?
   - [ ] Custom variants needed?

---

## Migration Steps

### Step 1: Analyze Current Implementation

Review the current code and identify:

- [ ] **Component library:** shadcn/ui, NextUI, or custom?
- [ ] **Variants:** What visual variants exist? (primary, secondary, destructive, etc.)
- [ ] **States:** Default, hover, focus, active, disabled, loading
- [ ] **Accessibility:** ARIA attributes present? Keyboard support?
- [ ] **Design tokens:** Are colors hardcoded or token-based?
- [ ] **Icons:** Lucide/emoji used? Need replacement?
- [ ] **Animation:** Framer Motion used? Reduced motion support?

**Analysis Output:**
```
Current State:
- Library: shadcn/ui (Radix primitives)
- Variants: primary, secondary, destructive, ghost, link
- States: All covered except loading
- Accessibility: Partial (missing aria-label on icon-only)
- Tokens: Partial (some hardcoded colors in hover states)
- Icons: Lucide icons present
- Animation: None
```

---

### Step 2: Define New Requirements

Based on design-architecture.md, the new component must have:

**Design Tokens:**
- [ ] Background: Use `--glass-01`, `--bg-800`, or `--accent-500`
- [ ] Text: Use `--text-primary`, `--text-secondary`, or `--muted-100`
- [ ] Border: Use `--border-subtle`, `--border-default`
- [ ] Shadow: Use `--shadow-soft`
- [ ] Radius: Use `--radius-sm`, `--radius-md`, `--radius-lg`

**Variants Required:**
- [ ] Primary: Solid `--accent-500` background
- [ ] Secondary: Glass effect with subtle border
- [ ] Destructive: Solid `--danger-500` background
- [ ] Ghost: Transparent with hover glass effect
- [ ] Link: Text-only with underline

**Accessibility:**
- [ ] Keyboard navigable (Tab, Enter, Space)
- [ ] Focus visible (2px ring, `--accent-400`)
- [ ] ARIA: `role`, `aria-label` (if needed), `aria-disabled`
- [ ] Screen reader tested

**Glassmorphism:**
- [ ] Secondary variant uses `.glass-subtle`
- [ ] Hover state adds glass effect
- [ ] Reduced motion fallback present

**Icons:**
- [ ] Replace Lucide with Pictogrammers
- [ ] Add `aria-hidden="true"` if decorative
- [ ] Add `aria-label` if icon-only

---

### Step 3: Implement New Component

Generate the migrated component code following this structure:

```tsx
// src/components/ui/<component>.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
// Import HeroUI base if available

const componentVariants = cva(
  // Base styles (shared across all variants)
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent-500 text-white hover:bg-accent-600',
        secondary: 'glass-subtle hover:glass-hover border border-subtle',
        destructive: 'bg-danger-500 text-white hover:bg-danger-600',
        ghost: 'hover:bg-glass-01 hover:text-accent-500',
        link: 'text-accent-500 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof componentVariants> {
  /** Loading state */
  isLoading?: boolean;
  /** Icon at start */
  startIcon?: string;
  /** Icon at end */
  endIcon?: string;
}

const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      startIcon,
      endIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Icon path={mdiLoading} size={0.8} className="animate-spin mr-2" aria-hidden="true" />}
        {startIcon && !isLoading && <Icon path={startIcon} size={0.8} className="mr-2" aria-hidden="true" />}
        {children}
        {endIcon && <Icon path={endIcon} size={0.8} className="ml-2" aria-hidden="true" />}
      </button>
    );
  }
);

Component.displayName = 'Component';

export { Component, componentVariants };
```

---

### Step 4: Create Storybook Story

```tsx
// src/stories/<Component>.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from '@/components/ui/<component>';
import { mdiTicket, mdiArrowRight } from '@mdi/js';

const meta: Meta<typeof Component> = {
  title: 'Design System/<Component>',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Book Now',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'View Details',
  },
};

export const WithStartIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Book Ticket',
    startIcon: mdiTicket,
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'ghost',
    'aria-label': 'Next page',
    endIcon: mdiArrowRight,
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Processing...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Unavailable',
    disabled: true,
  },
};
```

---

### Step 5: Run Validation

Execute all validation checks:

```bash
# Check for design token compliance
npm run design-system:check-tokens -- --filter=<component>

# Check accessibility
npm run design-system:check-a11y -- --component=<component>

# Validate glassmorphism implementation
npm run design-system:validate-glass -- --component=<component>

# Run full component validation
npm run design-system:validate-component <component>
```

**Expected Output:**
```
✅ Design Tokens: All hardcoded colors replaced
✅ Accessibility: WCAG AA compliant
✅ Glassmorphism: Properly implemented with fallbacks
✅ Icons: Pictogrammers used, proper ARIA
✅ Keyboard: Fully navigable
✅ Reduced Motion: Fallbacks present
✅ Storybook: Story created with 0 a11y violations

RESULT: Component migration COMPLETE ✅
```

---

### Step 6: Update Documentation

Update the migration tracker:

```bash
# Mark component as complete
npm run migration:mark-complete <component>

# Update overall tracker
npm run migration:update-tracker
```

Edit `.github/instructions/design-system/02-component-migration.instructions.md`:
- Mark checkboxes as complete
- Update progress percentage
- Note any blockers or deviations

---

## Verification Checklist

Before marking migration complete, verify:

- [ ] All hardcoded colors replaced with design tokens
- [ ] Component uses HeroUI base (if available)
- [ ] All variants implemented and tested
- [ ] ARIA attributes complete and correct
- [ ] Keyboard navigation works (Tab, Enter, Space, Escape)
- [ ] Focus indicator visible (2px ring, contrast ≥ 3:1)
- [ ] Screen reader announces correctly (manual test)
- [ ] Glassmorphism applied (if appropriate)
- [ ] Icons replaced (Lucide/emoji → Pictogrammers)
- [ ] Reduced motion fallback present
- [ ] Storybook story created with all variants
- [ ] Accessibility addon shows 0 violations
- [ ] Visual regression baseline captured
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Documentation updated
- [ ] Commit follows convention: `feat(design-system): migrate <Component> with WCAG AA`

---

## Example Migration Output

**Component:** Button  
**Status:** ✅ Complete

**Changes Made:**
1. Replaced NextUI Button with custom implementation
2. Applied design tokens (`--accent-500`, `--glass-01`)
3. Added glassmorphism to secondary variant
4. Replaced Lucide icons with Pictogrammers
5. Added `aria-label` for icon-only buttons
6. Implemented loading state with spinner
7. Added reduced motion fallback
8. Created Storybook story with 6 variants
9. All accessibility tests pass (0 violations)

**Files Modified:**
- `src/components/ui/button.tsx` (component)
- `src/stories/Button.stories.tsx` (Storybook)
- `src/app/page.tsx` (usage updated)
- `src/app/book/page.tsx` (usage updated)

**Validation Results:**
- ✅ Design tokens: 100% compliant
- ✅ Accessibility: WCAG AA (Lighthouse 100)
- ✅ Glassmorphism: Properly implemented
- ✅ Icons: All Pictogrammers
- ✅ Keyboard: Fully accessible
- ✅ Visual regression: Baseline captured

---

## Troubleshooting

### Issue: HeroUI component not available
**Solution:** Build custom implementation using Radix UI primitives + design system styles

### Issue: Complex variants needed
**Solution:** Use CVA (class-variance-authority) for compound variants

### Issue: Accessibility violations in Storybook
**Solution:** Consult [04-accessibility-gates.instructions.md](../design-system/04-accessibility-gates.instructions.md) for fixes

### Issue: Glass effect not working
**Solution:** Check browser support, add fallback for unsupported browsers

---

**Prompt prepared for component:** _______________  
**Migration estimated time:** _____ hours  
**Ready to begin:** [ ] Yes  
