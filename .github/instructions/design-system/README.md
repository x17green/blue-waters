# Design System Migration Infrastructure

> **Status:** 🚧 Active Migration in Progress  
> **Started:** February 2025  
> **Estimated Completion:** Q2 2025 (14 weeks)  
> **Overall Progress:** See [Master Tracker](00-MASTER-TRACKER.instructions.md)

## 🎯 Overview

This directory contains the complete infrastructure for migrating Blue Waters from a **hybrid shadcn/NextUI system with vibrant ocean theming** to a **sophisticated dark-first glassmorphism design system** built on HeroUI, Pictogrammers icons, and WCAG AA accessibility standards.

### What's Changing

| Aspect | Current State | Target State |
|--------|---------------|--------------|
| **Component Library** | shadcn/ui + NextUI (hybrid) | HeroUI v2 (unified) |
| **Visual Style** | Vibrant gradients, ocean blues/oranges | Dark glassmorphism, muted nautical |
| **Icon System** | Lucide React + Emojis (⛵🌊) | Pictogrammers MDI (professional) |
| **Accessibility** | Partial (known issues) | WCAG AA compliant (≥95 Lighthouse) |
| **Design Tokens** | Hardcoded colors/spacing | CSS variables + Tailwind tokens |
| **Color Philosophy** | Bright, consumer-facing | Conservative, operator-focused |

### Why This Migration?

1. **Brand Alignment:** Shift from consumer aesthetic to professional operator tools
2. **Consistency:** Eliminate component library fragmentation
3. **Accessibility:** Achieve compliance with maritime industry standards
4. **Maintainability:** Centralize design decisions in tokens
5. **Sophistication:** Glassmorphism conveys premium quality

## 📂 Directory Structure

```
.github/instructions/design-system/
├── README.md                                    ← You are here
├── 00-MASTER-TRACKER.instructions.md            ← Central dashboard
├── 01-design-tokens.instructions.md             ← Token definitions & rules
├── 02-component-migration.instructions.md       ← 48 components checklist
├── 03-page-migration.instructions.md            ← 8 pages strategic order
├── 04-accessibility-gates.instructions.md       ← 10 WCAG AA gates
├── 05-glassmorphism-system.instructions.md      ← Glass effects guide
└── 06-iconography-migration.instructions.md     ← Icon mapping table

.github/instructions/prompts/
├── migrate-component.prompt.md                  ← Component migration template
├── accessibility-audit.prompt.md                ← WCAG audit checklist
├── visual-qa.prompt.md                          ← Glass/token validation
└── token-extraction.prompt.md                   ← Hardcoded value scanner

scripts/design-system/
├── update-tracker.js                            ← Auto-update progress tables
├── validate-tokens.js                           ← Enforce no hardcoded colors
└── validate-component.js                        ← Multi-check component validator
```

## 🚀 Quick Start

### For First-Time Contributors

1. **Read the Master Tracker:**
   ```bash
   cat .github/instructions/design-system/00-MASTER-TRACKER.instructions.md
   ```
   This shows overall progress, current phase, and priorities.

2. **Understand the Design System:**
   ```bash
   cat docs/design-architecture.md
   ```
   This is the **source of truth** for all design decisions.

3. **Check What Needs Work:**
   ```bash
   npm run migration:report
   ```
   Shows current completion percentages across all categories.

4. **Validate Current State:**
   ```bash
   npm run design-system:check-tokens
   ```
   Identifies hardcoded colors that need token replacement.

### For Active Contributors

**Migrating a Component:**

1. Choose a priority 1 component from [02-component-migration.instructions.md](02-component-migration.instructions.md)
2. Use [migrate-component.prompt.md](../prompts/migrate-component.prompt.md) as your guide
3. Implement the 6 requirements:
   - ✅ Design tokens only (no hardcoded colors)
   - ✅ HeroUI library (CVA for variants)
   - ✅ WCAG AA accessibility (ARIA, keyboard, focus)
   - ✅ Glassmorphism (where applicable)
   - ✅ Reduced motion fallbacks
   - ✅ Storybook story
4. Validate your work:
   ```bash
   npm run design-system:validate-component button
   ```
5. Mark checkbox in instruction file
6. Update tracker:
   ```bash
   npm run migration:update-tracker
   ```
7. Commit with conventional commit:
   ```bash
   git commit -m "feat(design-system): migrate Button component to HeroUI"
   ```

**Migrating a Page:**

1. Follow the strategic order in [03-page-migration.instructions.md](03-page-migration.instructions.md)
2. Start with **Operator Dashboard** (highest complexity, most components)
3. Ensure component dependencies are migrated first
4. Run full validation before marking complete

**Fixing Accessibility Issues:**

1. Review the 14 current issues in [04-accessibility-gates.instructions.md](04-accessibility-gates.instructions.md)
2. Use [accessibility-audit.prompt.md](../prompts/accessibility-audit.prompt.md) for comprehensive testing
3. Test with real screen readers (NVDA on Windows, VoiceOver on Mac)
4. Achieve ≥95 Lighthouse score on all pages

## 🛠️ Available Commands

### Migration Tracking

```bash
# Update progress tables in instruction files (run after completing work)
npm run migration:update-tracker

# Show current progress report (read-only)
npm run migration:report
```

**What it does:** Scans codebase, counts completed checkboxes, updates markdown tables in instruction files. Commit the changes to record progress.

### Design Token Validation

```bash
# Scan entire codebase for hardcoded colors (blocks CI if violations found)
npm run design-system:check-tokens

# Scan with filtering (in development)
npm run design-system:check-tokens:filter
```

**What it detects:**
- Hex colors: `#0C4A79`, `#FF6B35`
- RGB/RGBA: `rgb(12, 74, 121)`, `rgba(255, 107, 53, 0.8)`
- HSL/HSLA: `hsl(205, 82%, 26%)`
- Tailwind arbitrary: `bg-[#0C4A79]`, `text-[rgb(255,107,53)]`

**Allowed exceptions:**
- CSS variables: `var(--accent-500)`
- Glass effects: `rgba(255, 255, 255, 0.05)` (white/black with alpha)

### Component Validation

```bash
# Validate a single component (pass component name, e.g., "button")
npm run design-system:validate-component button

# Runs 6 checks:
# 1. File existence
# 2. Design tokens (no hardcoded colors)
# 3. Accessibility (ARIA, keyboard, focus)
# 4. Glassmorphism (if applicable, with reduced-motion)
# 5. Icon system (Pictogrammers, not Lucide/emoji)
# 6. Storybook story
```

**Example output:**
```
Validating component: button
Component file: src/components/ui/button.tsx

✅ PASSED CHECKS:
   1. File Existence
   2. Design Tokens
   3. Icons

⚠️  WARNINGS:
   1. Storybook (Story file not found: src/stories/Button.stories.tsx)

❌ FAILED CHECKS:
   1. Glassmorphism (No reduced-motion fallback for glass effects)
   2. Accessibility (Missing aria-label for icon-only buttons)

SUMMARY: 3 passed, 1 warning, 2 failed

🔴 COMPONENT MIGRATION INCOMPLETE
```

### Full Validation

```bash
# Run all design system checks (tokens + manual component validation)
npm run design-system:validate-all
```

## 🤖 CI Enforcement

Every pull request is automatically validated by GitHub Actions:

**Workflow:** [design-system-validator.yml](../../workflows/design-system-validator.yml)

**Checks performed:**
1. ✅ **Token Validation** - Scans all changed files for hardcoded colors
2. ✅ **Component Validation** - Runs multi-check validator on changed components
3. 📊 **Tracker Update** - Auto-updates progress tables
4. 💬 **PR Comment** - Posts detailed compliance report with current progress

**PR will be blocked if:**
- Hardcoded colors found (hex, rgb, hsl, arbitrary Tailwind)
- Component missing required accessibility attributes
- Glassmorphism implemented without reduced-motion fallback
- Lucide icons or emojis used instead of Pictogrammers

**PR will pass if:**
- All design tokens used correctly
- Components follow accessibility checklist
- Glass effects have proper fallbacks
- Pictogrammers icons used (or no icons)

**Example PR comment:**

```markdown
## 🎨 Design System Compliance Report

**Overall Migration Progress:** 23%

### Validation Results

| Check | Status |
|-------|--------|
| Design Tokens | ✅ Passed |
| Components | ✅ Passed |

✅ **All design system checks passed!** This PR is compliant with the design system requirements.

### Current Progress

| Category | Progress | Items |
|----------|----------|-------|
| Design Tokens | 100% | 8/8 token categories |
| Core Components | 67% | 2/3 components (Button ✅, Input ✅) |
| All Components | 25% | 12/48 components |
| Pages | 13% | 1/8 pages (Operator Dashboard ✅) |
| Accessibility | 64% | 9/14 issues resolved |
| Icons | 40% | 30/50 icons migrated |

---

💡 **Need help?** Check the migration instructions or use the component migration prompt.
```

## 📖 Instruction Files Deep Dive

### [00-MASTER-TRACKER.instructions.md](00-MASTER-TRACKER.instructions.md)

**Purpose:** Central dashboard for entire migration

**Key sections:**
- **Progress table** - Real-time completion percentages
- **Phase breakdown** - 4 phases (0-4) with week-by-week tasks
- **Quick stats** - Snapshot of current state
- **Validation commands** - Copy-paste commands
- **Update history** - Audit trail of progress updates

**When to use:** Check overall progress, understand current phase, find next priority task

### [01-design-tokens.instructions.md](01-design-tokens.instructions.md)

**Purpose:** Define and enforce design token system

**Key sections:**
- **61 CSS variables** - Colors, spacing, typography, effects, z-index, transitions
- **Token mapping table** - Old values → new tokens
- **Migration strategy** - 5-step process
- **Forbidden patterns** - What triggers CI failures
- **Allowed patterns** - Correct token usage

**When to use:** Replacing hardcoded colors, understanding token philosophy, debugging validation errors

### [02-component-migration.instructions.md](02-component-migration.instructions.md)

**Purpose:** Track 48 components with detailed requirements

**Key sections:**
- **6 strict requirements** - Must pass all to mark complete
- **Priority 1-5 components** - Strategic migration order
- **Per-component checklists** - Detailed specs for Button, Input, Card, etc.
- **13-step migration workflow** - Systematic approach

**When to use:** Migrating components, checking component status, understanding requirements

### [03-page-migration.instructions.md](03-page-migration.instructions.md)

**Purpose:** Strategic page-level migration plan

**Key sections:**
- **Strategic order** - Operator Dashboard first (40h), Landing last (20h)
- **Component dependencies** - What must be done before each page
- **Per-page requirements** - Specific patterns for each page (glass sidebar, seat selection grid, payment form)

**When to use:** Planning page migrations, understanding dependencies, estimating effort

### [04-accessibility-gates.instructions.md](04-accessibility-gates.instructions.md)

**Purpose:** WCAG AA compliance enforcement

**Key sections:**
- **10 accessibility gates** - Semantic HTML, keyboard, ARIA, contrast, screen readers, forms, focus, motion, responsive, content
- **14 current issues** - Inventoried by priority (5 P0, 6 P1, 3 P2)
- **Manual testing checklists** - Step-by-step procedures
- **Acceptance criteria** - 0 critical violations, Lighthouse ≥95

**When to use:** Auditing accessibility, fixing keyboard navigation, testing with screen readers

### [05-glassmorphism-system.instructions.md](05-glassmorphism-system.instructions.md)

**Purpose:** Implement glass effects consistently

**Key sections:**
- **4 glass utilities** - `.glass`, `.glass-subtle`, `.glass-strong`, `.glass-modal`
- **Z-index layering** - Proper stacking hierarchy
- **Component patterns** - Cards, nav, modals, sidebar, dropdowns, inputs
- **4 common mistakes** - Over-saturation, no reduced motion, poor contrast, nested glass
- **Browser compatibility** - Safari fallbacks

**When to use:** Adding glass effects, debugging visual issues, ensuring reduced-motion fallbacks

### [06-iconography-migration.instructions.md](06-iconography-migration.instructions.md)

**Purpose:** Replace Lucide + emojis with Pictogrammers

**Key sections:**
- **Icon mapping table** - 30+ Lucide icons → MDI equivalents
- **Emoji removal** - ⛵ → `mdiFerry`, 🌊 → `mdiWaves`
- **Accessibility patterns** - Decorative with `aria-hidden`, icon-only with `aria-label`
- **Icon wrapper component** - Consistent implementation

**When to use:** Replacing icons, ensuring professional aesthetic, fixing emoji usage

## 🎓 Prompt Templates Deep Dive

### [migrate-component.prompt.md](../prompts/migrate-component.prompt.md)

**Purpose:** Systematic component migration guide for AI or developers

**Structure:**
1. **Context** - Design system requirements
2. **Input** - Component name, file path, current code
3. **6 migration steps:**
   - Analyze current implementation
   - Define new requirements
   - Implement with CVA + HeroUI
   - Create Storybook story
   - Run validation
   - Update documentation
4. **21-item verification checklist**
5. **Example output** - Button component fully migrated

**When to use:** Migrating a component from scratch, ensuring all requirements met, training new contributors

### [accessibility-audit.prompt.md](../prompts/accessibility-audit.prompt.md)

**Purpose:** Comprehensive WCAG AA audit process

**Structure:**
1. **Automated testing** - Axe-core, Lighthouse, Pa11y
2. **10 manual testing gates** - Detailed procedures for each
3. **Summary report template** - Issue count by priority
4. **GitHub issue template** - Tracking fixes

**When to use:** Full accessibility review, testing keyboard navigation, screen reader testing

### [visual-qa.prompt.md](../prompts/visual-qa.prompt.md)

**Purpose:** Visual implementation and glass effect validation

**Structure:**
1. **Glassmorphism validation** - Inspect computed styles, verify hierarchy
2. **Design token compliance** - Scan for hardcoded values
3. **Visual consistency** - Border-radius, shadows, icons
4. **Dark-first validation** - Contrast on dark backgrounds
5. **Conservative aesthetic** - No vibrant gradients, no emojis
6. **Cross-browser testing** - Screenshots, visual regression
7. **Performance impact** - Frame rate, paint time

**When to use:** QA before marking page complete, debugging glass effects, ensuring token compliance

### [token-extraction.prompt.md](../prompts/token-extraction.prompt.md)

**Purpose:** Identify and replace hardcoded values systematically

**Structure:**
1. **6-step workflow:**
   - Scan for hardcoded values (bash grep commands)
   - Create replacement mapping table
   - Replace in CSS, Tailwind, component props
   - Update Tailwind config
   - Validate
2. **Common patterns** - Gradients, hover states, borders, opacity
3. **Troubleshooting** - Color differences, spacing rounding

**When to use:** Starting token migration, bulk replacement of hardcoded values, understanding token mapping

## 📊 Migration Phases

### Phase 0: Foundation (Weeks 1-2, 40 hours)

**Deliverables:**
- ✅ Infrastructure setup (this documentation)
- ✅ Validation scripts (update-tracker, validate-tokens, validate-component)
- ✅ CI enforcement (GitHub Actions workflow)
- ✅ Design token definitions (61 CSS variables)
- [ ] Create `src/design-system/tokens.ts` with all token exports
- [ ] Update `globals.css` with all CSS variables
- [ ] Update `tailwind.config.ts` to use design tokens

**Success criteria:** CI blocks PRs with hardcoded colors, tracker updates automatically

### Phase 1: Core Components (Weeks 3-5, 80 hours)

**Deliverables:**
- [ ] Button component (variants, icons, loading, ARIA)
- [ ] Input component (labels, errors, autocomplete)
- [ ] Card component (glass effects, composite pattern)
- [ ] Badge, Alert (simple feedback components)
- [ ] Storybook stories for all 5 components
- [ ] Accessibility audit (keyboard, screen reader)

**Success criteria:** 100% design token usage, ≥95 Lighthouse on Storybook

### Phase 2: Forms & Navigation (Weeks 6-9, 100 hours)

**Deliverables:**
- [ ] Select, Checkbox, Radio Group, Switch (form components)
- [ ] Dropdown Menu, Navigation Menu, Tabs (navigation)
- [ ] Operator Dashboard page (40 hours, complex glass layout)
- [ ] Accessibility audit (all 10 gates)

**Success criteria:** Forms fully accessible, dashboard visually polished

### Phase 3: Advanced Components & Pages (Weeks 10-12, 80 hours)

**Deliverables:**
- [ ] Modal, Dialog, Sheet (overlays with glass)
- [ ] Table, Pagination (data display)
- [ ] Book page (seat selection ARIA grid)
- [ ] Checkout page (payment form autocomplete)
- [ ] Login/Signup pages (glass cards)

**Success criteria:** All key user flows migrated, 0 accessibility violations

### Phase 4: Polish & Landing (Weeks 13-14, 20 hours)

**Deliverables:**
- [ ] Landing page (brand decision: consumer vs. operator aesthetic)
- [ ] Remaining advanced components (Calendar, Command, Carousel)
- [ ] Icon migration completion (50/50 icons)
- [ ] Visual QA (cross-browser, performance)
- [ ] Documentation finalization

**Success criteria:** 100/100 Lighthouse, consistent visual language, professional iconography

## ❓ FAQ

### Q: Can I still use NextUI components?

**A:** No. The migration is moving entirely to HeroUI for consistency. NextUI components should be replaced as part of the migration.

### Q: What if I need a color not in the token system?

**A:** First, check if an existing token can work. If truly needed, propose adding a new token to `01-design-tokens.instructions.md` and update `globals.css`. Never use hardcoded colors—CI will block it.

### Q: How do I test glassmorphism effects?

**A:** Use [visual-qa.prompt.md](../prompts/visual-qa.prompt.md). Inspect computed styles in DevTools to verify `backdrop-filter: blur(Xpx)` and alpha transparency. Always test with `prefers-reduced-motion` enabled to ensure fallbacks work.

### Q: What if a component doesn't need glass effects?

**A:** Not all components need glass. Primarily use on: cards, navigation, modals, sidebars, dropdowns. Buttons, inputs, badges, alerts typically don't need glass. The validator checks only where glass is expected.

### Q: How do I find the right Pictogrammers icon?

**A:** Check [06-iconography-migration.instructions.md](06-iconography-migration.instructions.md) for the mapping table. Search at [https://pictogrammers.com/library/mdi/](https://pictogrammers.com/library/mdi/) if not listed.

### Q: What's the difference between `glass` and `glass-subtle`?

**A:**
- `glass`: Base blur (8px) for general cards
- `glass-subtle`: Light blur (4px) for cards on darker backgrounds  
- `glass-strong`: Medium blur (12px) for dropdowns/popovers
- `glass-modal`: Heavy blur (16px) for modals/overlays

### Q: Do I need to update the tracker manually?

**A:** **Yes, checkboxes.** Mark checkboxes `- [x]` manually after completing work. The progress tables are updated automatically by `npm run migration:update-tracker`, which you should run before committing.

### Q: Can I merge a PR with warnings?

**A:** Yes. Warnings (e.g., missing Storybook story) don't block merges, but should be addressed eventually. Failures (e.g., hardcoded colors, missing ARIA) block merges.

### Q: What counts as "migration complete" for a component?

**A:** All 6 requirements must pass:
1. ✅ Design tokens only (no hardcoded colors)
2. ✅ HeroUI library (CVA variants)
3. ✅ WCAG AA accessibility (ARIA, keyboard, focus)
4. ✅ Glassmorphism (if applicable, with reduced-motion)
5. ✅ Reduced motion fallbacks
6. ✅ Storybook story

Run `npm run design-system:validate-component <name>` to verify.

### Q: Who approves design system changes?

**A:** Changes to core design decisions (tokens, glass utilities, accessibility gates) require review. Component implementations following established patterns can be merged with 1 approval after CI passes.

## 🤝 Contributing

1. **Pick a task** from [00-MASTER-TRACKER.instructions.md](00-MASTER-TRACKER.instructions.md)
2. **Use the appropriate prompt template** as your guide
3. **Validate your work** with npm scripts
4. **Update tracker** with `npm run migration:update-tracker`
5. **Commit with conventional commit format:** `feat(design-system): migrate X`
6. **Open PR** - CI will validate automatically

## 📞 Support

- **Design questions:** Refer to [docs/design-architecture.md](../../../docs/design-architecture.md)
- **Accessibility questions:** See [04-accessibility-gates.instructions.md](04-accessibility-gates.instructions.md)
- **Token questions:** See [01-design-tokens.instructions.md](01-design-tokens.instructions.md)
- **Technical blockers:** Open GitHub issue with `design-system` label

---

**Last Updated:** February 2025  
**Maintainer:** Design System Working Group  
**Status:** 🚧 Active Migration
