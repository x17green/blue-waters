# Storybook Integration Analysis — Yenagoa Boat Club

**Date:** February 14, 2026  
**Status:** Design System Migration Phase — Storybook Story Files Required

---

## Executive Summary

The design system validation script expects Storybook story files for UI components but none currently exist. This analysis compares the provided `storybook-starter.md` scaffold with the current Next.js 16 + React 19 codebase and recommends a **non-breaking integration approach**.

---

## Current State Analysis

### ✅ What We Have

**Project Structure:**
```
blue-waters/
├── Next.js 16.1.6 + React 19.2.3
├── TypeScript 5.7.3
├── Tailwind CSS 3.4.17 + PostCSS 8.5
├── Design System: Glassmorphism dark-first
├── Icons: @mdi/react + @mdi/js (Pictogrammers)
├── UI Framework: Radix UI primitives
├── 52 custom UI components in src/components/ui/
└── Design token system (src/design-system/tokens.ts)
```

**Current Dependencies (Relevant):**
- `@mdi/react`: ^1.6.1
- `@mdi/js`: ^7.4.47
- `framer-motion`: ^11.0.0
- `class-variance-authority`: ^0.7.1
- `tailwind-merge`: ^2.5.5

**Missing:**
- ❌ No Storybook installed
- ❌ No `.storybook/` configuration
- ❌ No `src/stories/` directory
- ❌ No story files for any components

### 🔍 Validation Requirements

**Validation Script Expectations:**  
Path: `scripts/design-system/validate-components.js:242-259`

```javascript
function checkStorybook() {
  const storyFile = `src/stories/${ComponentName}.stories.tsx`;
  if (!fs.existsSync(fullPath)) {
    results.warnings.push({ message: `Story file not found: ${storyFile}` });
  }
}
```

**Components Currently Showing Warnings:**
1. ⚠️ Popover → `src/stories/Popover.stories.tsx`
2. ⚠️ Card → `src/stories/Card.stories.tsx`
3. ⚠️ Dialog → `src/stories/Dialog.stories.tsx`
4. ⚠️ Dropdown-menu → `src/stories/Dropdown-menu.stories.tsx`
5. ⚠️ Sheet → `src/stories/Sheet.stories.tsx`
6. ⚠️ Sidebar → `src/stories/Sidebar.stories.tsx`
7. ⚠️ Sonner → `src/stories/Sonner.stories.tsx`
8. ⚠️ Toast → `src/stories/Toast.stories.tsx`

---

## Storybook Starter Scaffold Analysis

### 📦 Provided Scaffold Overview

**Architecture:** Standalone Storybook project with HeroUI wrappers

**Key Features:**
- Storybook 7.0.0 configuration
- Design token system (colors, spacing, radius)
- Glassmorphism CSS globals
- Basic components: Button, Input, Card
- MDX documentation example
- Accessibility-focused examples

### ⚠️ Compatibility Issues

**1. React Version Mismatch**
- **Scaffold:** React 18.2.0
- **Current:** React 19.2.3
- **Risk:** Moderate — Storybook 7 may have React 19 compatibility issues
- **Solution:** Upgrade to Storybook 8.x which officially supports React 19

**2. HeroUI Dependency**
- **Scaffold:** Uses `@heroui/core` ^1.0.0
- **Current:** Uses Radix UI primitives + custom wrappers
- **Risk:** High — Incompatible component architecture
- **Solution:** Skip HeroUI, write stories for existing Radix-based components

**3. Design Token Duplication**
- **Scaffold:** Custom token system in `src/tokens/`
- **Current:** Tailwind config + `src/design-system/tokens.ts`
- **Risk:** Low — Can be unified
- **Solution:** Reference existing Tailwind classes in stories

**4. Styling Approach**
- **Scaffold:** Inline styles + CSS-in-JS
- **Current:** Tailwind CSS utility classes
- **Risk:** Low — Stories can use existing Tailwind
- **Solution:** Import existing `globals.css` in Storybook preview

---

## Recommended Integration Approach

### 🎯 Strategy: Minimal Non-Breaking Integration

**Objective:** Add Storybook to existing Next.js project without disrupting current architecture.

**Principles:**
1. ✅ **Use existing components** — No rewrites
2. ✅ **Leverage Tailwind** — No new CSS system
3. ✅ **Radix UI aware** — Stories showcase Radix patterns
4. ✅ **Accessibility first** — Document ARIA, keyboard nav, reduced-motion
5. ✅ **Incremental adoption** — Start with 8 failing components

---

## Implementation Plan

### Phase 1: Storybook Installation & Configuration

**Dependencies to Add:**
```json
{
  "devDependencies": {
    "@storybook/addon-essentials": "^8.4.7",
    "@storybook/addon-interactions": "^8.4.7",
    "@storybook/addon-links": "^8.4.7",
    "@storybook/addon-a11y": "^8.4.7",
    "@storybook/blocks": "^8.4.7",
    "@storybook/nextjs": "^8.4.7",
    "@storybook/react": "^8.4.7",
    "@storybook/test": "^8.4.7",
    "storybook": "^8.4.7"
  }
}
```

**Why Storybook 8.4:**
- ✅ React 19 support
- ✅ Next.js 16 integration (`@storybook/nextjs`)
- ✅ Improved TypeScript inference
- ✅ Native Tailwind CSS support
- ✅ Better accessibility addon

**Scripts to Add:**
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build -o storybook-static",
    "storybook:test": "test-storybook"
  }
}
```

---

### Phase 2: Storybook Configuration Files

**`.storybook/main.ts`:**
```typescript
import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-a11y', // Accessibility testing
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      // Next.js 16 compatibility
      nextConfigPath: path.resolve(__dirname, '../next.config.mjs'),
    },
  },
  core: {
    disableTelemetry: true,
  },
  // Support for existing path aliases
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../'),
      };
    }
    return config;
  },
  staticDirs: ['../public'],
};

export default config;
```

**`.storybook/preview.tsx`:**
```typescript
import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Import existing Tailwind + design tokens

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0F171B' }, // --bg-800
        { name: 'darker', value: '#0A2A3A' }, // --bg-900
      ],
    },
    layout: 'centered',
    // Accessibility addon configuration
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
        ],
      },
    },
  },
  // Global decorators for glassmorphism context
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-b from-bg-900 to-bg-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export default preview;
```

**`.storybook/preview-head.html`:**
```html
<!-- Preload design system fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

---

### Phase 3: Create Story Files (Priority Components)

**Template Pattern for All Stories:**

```typescript
// src/stories/[Component].stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { [Component] } from '@/src/components/ui/[component]';

const meta = {
  title: 'UI/[Component]',
  component: [Component],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Brief description with accessibility notes',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for props
  },
} satisfies Meta<typeof [Component]>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const WithReducedMotion: Story = {
  args: {
    // Same props
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'motion-reduce', enabled: true }],
      },
    },
  },
};
```

---

### Phase 4: Story File Specifications

**1. Popover.stories.tsx**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { Button } from '@/src/components/ui/button';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Glassmorphism popover with Radix UI. Supports keyboard navigation (Esc to close, Tab for focus trap) and reduced-motion fallback.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="glass">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-semibold text-fg">Booking Options</h4>
          <p className="text-sm text-fg-muted">
            Select your preferred sail time
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithReducedMotion: Story = {
  ...Default,
  parameters: {
    docs: {
      description: {
        story: 'Tests motion-reduce:backdrop-blur-none and motion-reduce:animate-none classes for users with vestibular motion disorders.',
      },
    },
  },
};
```

**2. Card.stories.tsx**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card with glassmorphism variants. Glass variant includes motion-reduce:backdrop-blur-none for accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'glass', 'bordered', 'flat', 'elevated', 'interactive'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    className: 'w-96',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Trip to Brass</CardTitle>
        <CardDescription>Departing at 2:00 PM</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-fg-muted">
          Available seats: 42 | Duration: 2.5 hours
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Book Now</Button>
      </CardFooter>
    </Card>
  ),
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    className: 'w-96',
  },
  render: Primary.render,
};

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    className: 'w-96',
  },
  render: Primary.render,
};
```

**3. Dialog.stories.tsx**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal dialog with glassmorphism overlay and content. Includes motion-reduce fallbacks for blur and animations. Traps focus and supports Esc to close.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Confirm Booking</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Your Booking?</DialogTitle>
          <DialogDescription>
            You're about to book 2 seats on the 2:00 PM trip to Brass.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
```

**4-8. Remaining Components:**
- `Dropdown-menu.stories.tsx`
- `Sheet.stories.tsx`
- `Sidebar.stories.tsx`
- `Sonner.stories.tsx`
- `Toast.stories.tsx`

*(Follow same pattern — I can generate all if needed)*

---

## Benefits of This Approach

### For Development

1. **Component Documentation** — Visual catalog of all UI components
2. **Isolated Testing** — Test components without running full Next.js app
3. **Design Review** — Stakeholders can preview components before implementation
4. **Accessibility Audit** — Built-in a11y addon tests ARIA, contrast, keyboard nav
5. **Reduced-Motion Validation** — Test glassmorphism fallbacks visually

### For Design System Compliance

6. **Validates Story Presence** — Resolves validation warnings
7. **Token Usage Examples** — Documents correct design token application
8. **Variant Showcase** — Shows all CVA variants (primary, glass, bordered, etc.)
9. **ARIA Pattern Documentation** — Radix UI accessibility patterns visible
10. **Motion Preference Testing** — Verify `motion-reduce:*` classes work

### For CI/CD

11. **Visual Regression Tests** — Chromatic or Percy integration possible
12. **Snapshot Testing** — Storybook test runner for Jest snapshots
13. **Build-Time Validation** — `build-storybook` catches component errors
14. **Deployment Target** — Host at `storybook.bluewaters.gov` for public docs

---

## Installation Commands

```bash
# 1. Install Storybook 8.x with Next.js integration
pnpm add -D storybook@^8.4.7 \\
  @storybook/nextjs@^8.4.7 \\
  @storybook/react@^8.4.7 \\
  @storybook/addon-essentials@^8.4.7 \\
  @storybook/addon-interactions@^8.4.7 \\
  @storybook/addon-links@^8.4.7 \\
  @storybook/addon-a11y@^8.4.7 \\
  @storybook/blocks@^8.4.7 \\
  @storybook/test@^8.4.7

# 2. Initialize Storybook configuration
npx storybook@latest init --type nextjs --skip-install

# 3. Create stories directory
mkdir -p src/stories

# 4. Start Storybook dev server
pnpm storybook
```

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| React 19 compatibility issues with Storybook 8 | Medium | Low | Use `@storybook/nextjs` adapter |
| Build time increase | Low | High | Run Storybook separately, not in main build |
| Dependency conflicts | Medium | Low | Use exact versions, test incrementally |
| Developer learning curve | Low | Medium | Provide templates, start with 8 components |
| CI/CD pipeline slowdown | Low | Medium | Make Storybook build optional, run in parallel |

---

## Timeline Estimate

| Phase | Effort | Duration |
|-------|--------|----------|
| **Phase 1:** Install & Configure | 1-2 hours | Day 1 |
| **Phase 2:** Configuration Files | 1 hour | Day 1 |
| **Phase 3:** First 8 Story Files | 2-3 hours | Day 1-2 |
| **Phase 4:** Remaining 44 Components | 8-10 hours | Week 1-2 |
| **Phase 5:** Documentation & Polish | 2-3 hours | Week 2 |
| **Total** | ~15-20 hours | 1-2 weeks |

**Quick Win:** Create stories for the 8 failing components first (4-5 hours) to pass validation immediately.

---

## Alternatives Considered

### Option A: Skip Storybook, Remove Validation Check
- ❌ Loses component documentation value
- ❌ No visual testing capability
- ❌ Harder for design review

### Option B: Use Separate Storybook Repo (Scaffold Approach)
- ❌ Duplication of components
- ❌ Sync issues between repos
- ❌ More maintenance overhead

### Option C: Recommended — Integrated Storybook (This Plan)
- ✅ Single source of truth
- ✅ Minimal breaking changes
- ✅ Incremental adoption
- ✅ CI/CD integration ready

---

## Next Steps

1. **Approve Approach** — Confirm strategy with team
2. **Install Dependencies** — Run installation commands
3. **Create Config Files** — Add `.storybook/main.ts` and `preview.tsx`
4. **Story File Template** — Create first story (Popover) as template
5. **Batch Creation** — Generate remaining 7 stories for validation
6. **Test & Validate** — Run `npm run design-system:validate-component popover`
7. **Commit & Push** — Verify GitHub Actions passes
8. **Expand Coverage** — Add stories for remaining 44 components over time

---

## Questions for Review

1. **Should we integrate Storybook now or defer after other priorities?**
2. **Do we want Chromatic for visual regression testing?** (Additional cost)
3. **Should Storybook build be part of CI/CD or separate?**
4. **Target deployment: Internal docs site or public github.io?**
5. **Priority: All 52 components or just the 8 failing validation?**

---

## Appendix: Validation Script Modification Option

**Alternative:** Instead of adding Storybook, we could modify the validation script to make stories optional:

```javascript
// scripts/design-system/validate-components.js:242
function checkStorybook() {
  console.log('Checking Storybook story...');
  
  const storyFile = `src/stories/${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.stories.tsx`;
  const fullPath = path.resolve(process.cwd(), storyFile);
  
  if (!fs.existsSync(fullPath)) {
    // Change from warning to info
    console.log(`ℹ️  Optional: Story file not found: ${storyFile}`);
    return; // Don't add to warnings
  }
  
  results.passed.push({
    check: 'Storybook',
    message: `Story file exists: ${storyFile}`,
  });
}
```

**Pros:** Quick fix, no Storybook needed  
**Cons:** Loses documentation value, defeats purpose of design system tooling

---

**Recommendation:** Proceed with integrated Storybook approach. Start with 8 story files to pass validation, expand incrementally to all 52 components over 2 weeks.
