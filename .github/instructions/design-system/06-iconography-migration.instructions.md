---
name: Iconography Migration (Lucide → Pictogrammers)
applyTo: "**/*.tsx, **/*.ts"
enforceMode: strict
phase: 1-foundation
priority: P1-high
source_of_truth: docs/design-architecture.md#7-iconography
---

# 🎨 Iconography Migration: Lucide → Pictogrammers (Material Design Icons)

## Migration Goal

**Replace all Lucide React icons with Pictogrammers (Material Design Icons) for:**
1. **Universal metaphors** (recognized globally)
2. **Government/official credibility** (professional appearance)
3. **Consistency** (unified icon family)
4. **Accessibility** (semantic meaning over decorative emojis)

---

## 🚫 Icons to Remove

### 1. Emoji Icons (❌ REMOVE ALL)
Currently used in:
- `src/components/hero.tsx`: `⛵` (sailboat), `🌊` (water wave)
- `src/components/how-it-works.tsx`: Various emoji decorations
- `src/app/page.tsx`: Decorative emojis

**Problems:**
- Not accessible (screen readers announce "sailboat emoji")
- Inconsistent across platforms (iOS vs Android vs Windows)
- Not semantic (decorative only)
- Cannot be styled (color, size)

**Replacement:** Pictogrammers SVG icons with `aria-label` or `aria-hidden="true"`

---

### 2. Lucide React Icons (⚠️ REPLACE)
Currently used in:
- `src/components/ui/` (various components)
- Button icons, input decorators, navigation

**Replacement:** Pictogrammers equivalents

---

## 📦 Installation

```bash
npm install @mdi/js @mdi/react
```

**Package Info:**
- `@mdi/js`: Icon paths (tree-shakeable)
- `@mdi/react`: React wrapper component

---

## 🔄 Icon Mapping Table

| Current (Lucide) | Pictogrammers (MDI) | Usage |
|------------------|---------------------|-------|
| `Calendar` | `mdiCalendar` | Date picker, trip dates |
| `MapPin` | `mdiMapMarker` | Location, departure/destination |
| `Users` | `mdiAccountGroup` | Passenger count |
| `Ticket` | `mdiTicket` | Bookings, tickets |
| `Boat` / ⛵ | `mdiFerry` | Boat/cruise |
| `Clock` | `mdiClock` | Time, schedule |
| `Search` | `mdiMagnify` | Search input |
| `Menu` | `mdiMenu` | Mobile hamburger menu |
| `X` / `Close` | `mdiClose` | Close modal, dismiss |
| `ChevronDown` | `mdiChevronDown` | Dropdown indicator |
| `ChevronRight` | `mdiChevronRight` | Navigation arrow |
| `Plus` | `mdiPlus` | Add action |
| `Trash` | `mdiDelete` | Delete action |
| `Edit` | `mdiPencil` | Edit action |
| `Check` | `mdiCheck` | Success, confirmation |
| `AlertCircle` | `mdiAlertCircle` | Error, warning |
| `Info` | `mdiInformation` | Info tooltip |
| `Bell` | `mdiBell` | Notifications |
| `Settings` | `mdiCog` | Settings |
| `LogOut` | `mdiLogout` | Logout action |
| `Eye` / `EyeOff` | `mdiEye` / `mdiEyeOff` | Password visibility |
| `Download` | `mdiDownload` | Download manifest |
| `Upload` | `mdiUpload` | Upload file |
| `Filter` | `mdiFilter` | Filter controls |
| `RefreshCw` | `mdiRefresh` | Reload data |
| `ExternalLink` | `mdiOpenInNew` | Open in new tab |
| `Home` | `mdiHome` | Home navigation |
| 🌊 (wave emoji) | `mdiWaves` | Water, ocean theme |
| `Star` | `mdiStar` / `mdiStarOutline` | Rating |
| `Heart` | `mdiHeart` / `mdiHeartOutline` | Favorite |
| `Share` | `mdiShare` | Share action |
| `Mail` | `mdiEmail` | Email contact |
| `Phone` | `mdiPhone` | Phone contact |
| `QrCode` | `mdiQrcode` | QR code scanner |

**Full Icon Browser:** https://pictogrammers.com/library/mdi/

---

## 🧩 Implementation Patterns

### Before (Lucide ❌)
```tsx
import { Calendar, MapPin, Users } from 'lucide-react';

function TripCard() {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        <span>March 15, 2026</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        <span>Creek Marina</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5" />
        <span>24 passengers</span>
      </div>
    </Card>
  );
}
```

---

### After (Pictogrammers ✅)
```tsx
import Icon from '@mdi/react';
import { mdiCalendar, mdiMapMarker, mdiAccountGroup } from '@mdi/js';

function TripCard() {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Icon path={mdiCalendar} size={0.8} className="text-muted-100" aria-hidden="true" />
        <span>March 15, 2026</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon path={mdiMapMarker} size={0.8} className="text-muted-100" aria-hidden="true" />
        <span>Creek Marina</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon path={mdiAccountGroup} size={0.8} className="text-muted-100" aria-hidden="true" />
        <span>24 passengers</span>
      </div>
    </Card>
  );
}
```

**Size Options:**
- `size={0.6}` (15px) — Small inline icons
- `size={0.8}` (20px) — Default text icons
- `size={1}` (24px) — Primary action icons
- `size={1.33}` (32px) — Feature tile icons

---

## ♿ Accessibility Patterns

### Decorative Icons (with visible text)
```tsx
<button>
  <Icon path={mdiTicket} size={0.8} aria-hidden="true" />
  <span>Book now</span>
</button>
```

**Rule:** `aria-hidden="true"` because text provides context.

---

### Icon-Only Buttons (interactive)
```tsx
<button aria-label="Close modal">
  <Icon path={mdiClose} size={1} />
</button>
```

**Rule:** `aria-label` required when no visible text.

---

### Status Indicators
```tsx
<div role="status" aria-label="Booking confirmed">
  <Icon path={mdiCheck} size={1} className="text-success-500" aria-hidden="true" />
  <span>Confirmed</span>
</div>
```

**Rule:** Semantic wrapper (`role="status"`) + `aria-label` + visible text.

---

### Icon in Input
```tsx
<div className="relative">
  <Icon
    path={mdiMagnify}
    size={0.8}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-100"
    aria-hidden="true"
  />
  <Input
    className="pl-10"
    placeholder="Search trips"
    aria-label="Search trips"
  />
</div>
```

**Rule:** Icon is decorative, input has `aria-label`.

---

## 🎨 Styling Icons

### Color (Use Design Tokens)
```tsx
/* ❌ WRONG: Hardcoded color */
<Icon path={mdiCalendar} color="#6DA7C8" />

/* ✅ CORRECT: Tailwind class */
<Icon path={mdiCalendar} className="text-accent-500" />

/* ✅ CORRECT: CSS variable */
<Icon path={mdiCalendar} style={{ color: 'var(--accent-500)' }} />
```

### Size (Consistent Scale)
```tsx
/* Text icons (inline) */
<Icon size={0.8} />  /* 20px */

/* Button icons */
<Icon size={1} />    /* 24px */

/* Feature tiles */
<Icon size={1.33} /> /* 32px */

/* Hero graphic */
<Icon size={2} />    /* 48px */
```

### Monochrome (Government Aesthetic)
```tsx
/* Use single accent color, not multicolor icons */
<Icon path={mdiFerry} className="text-accent-500" />
```

**Avoid:** Multicolor icons (too playful for conservative design)

---

## 🔄 Migration Workflow

### Step 1: Audit Current Icons
```bash
npm run design-system:audit-icons
```

**Output:**
```
Icon Audit Report
==================

Lucide Icons Found: 42 instances across 18 files
Emoji Icons Found: 8 instances across 3 files

Top Icons by Usage:
  - Calendar: 12 instances
  - MapPin: 8 instances
  - Users: 7 instances
  - Ticket: 5 instances

Files to Update:
  - src/components/hero.tsx (6 emojis)
  - src/components/featured-trips.tsx (Lucide icons)
  - src/components/how-it-works.tsx (4 emojis)
  - src/app/book/page.tsx (Lucide icons)
  - src/app/dashboard/page.tsx (Lucide icons)

Estimated Effort: 16 hours
```

---

### Step 2: Create Icon Wrapper Component
```tsx
// src/components/ui/icon.tsx
import IconBase from '@mdi/react';
import { type ComponentProps } from 'react';

interface IconProps extends ComponentProps<typeof IconBase> {
  /** MDI icon path */
  path: string;
  /** Icon size in rem (0.8 = 20px, 1 = 24px) */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label (required for icon-only buttons) */
  'aria-label'?: string;
  /** Hide from screen readers (when text is present) */
  'aria-hidden'?: boolean;
}

export function Icon({
  path,
  size = 0.8,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  ...props
}: IconProps) {
  return (
    <IconBase
      path={path}
      size={size}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
}
```

---

### Step 3: Replace Icons File-by-File

**Priority Order:**
1. Core components (Button, Input, Card)
2. Navigation (header, sidebar)
3. Custom components (Hero, FeaturedTrips)
4. Pages (book, dashboard, login)

**Example Migration:**

**Before (`src/components/featured-trips.tsx`):**
```tsx
import { Calendar, MapPin, Users } from 'lucide-react';

<div className="flex items-center gap-2">
  <Calendar className="w-5 h-5 text-muted-foreground" />
  <span>⛵ {trip.duration}</span>
</div>
```

**After:**
```tsx
import { Icon } from '@/components/ui/icon';
import { mdiCalendar, mdiFerry } from '@mdi/js';

<div className="flex items-center gap-2">
  <Icon path={mdiCalendar} className="text-muted-100" aria-hidden="true" />
  <Icon path={mdiFerry} className="text-accent-500" aria-hidden="true" />
  <span>{trip.duration}</span>
</div>
```

---

### Step 4: Remove Lucide Dependency
```bash
npm uninstall lucide-react
```

---

### Step 5: Validate
```bash
npm run design-system:validate-icons
```

**Success Output:**
```
✅ Icon Migration Complete

  - 0 Lucide icons remaining
  - 0 emoji icons remaining
  - 50 Pictogrammers icons implemented
  - All icons have proper ARIA attributes
  - All icon-only buttons have aria-label
  - All decorative icons have aria-hidden="true"
```

---

## 📋 Icon Migration Checklist

### Phase 1: Core Components (Week 3)
- [ ] Button (start/end icon support)
- [ ] Input (decorative search, password toggle)
- [ ] Card (header icons)
- [ ] Dialog (close button)
- [ ] Alert (status icons)
- [ ] Badge (inline icons)

### Phase 2: Navigation (Week 4)
- [ ] Header navigation (menu, notifications, profile)
- [ ] Sidebar (operator dashboard)
- [ ] Breadcrumbs (home icon, chevrons)
- [ ] Footer (social icons)

### Phase 3: Custom Components (Week 4)
- [ ] Hero (remove ⛵, 🌊 emojis)
- [ ] FeaturedTrips (replace Lucide)
- [ ] HowItWorks (remove emoji decorations)
- [ ] Testimonials (star rating icons)

### Phase 4: Pages (Week 5)
- [ ] Book (search, filter icons)
- [ ] Dashboard (stat card icons)
- [ ] Operator Dashboard (action icons)
- [ ] Login/Signup (email, password, phone icons)

---

## 📊 Progress Tracker

**Icons Migrated:** 0 of 50+ (0%)

**By Category:**
- Lucide removed: 0 of 42 (0%)
- Emojis removed: 0 of 8 (0%)
- Pictogrammers added: 0 of 50 (0%)

---

## 🚨 Common Mistakes

### ❌ MISTAKE 1: Hardcoded Colors
```tsx
<Icon path={mdiCalendar} color="#6DA7C8" />
```

**✅ FIX:**
```tsx
<Icon path={mdiCalendar} className="text-accent-500" />
```

---

### ❌ MISTAKE 2: Missing ARIA
```tsx
<button>
  <Icon path={mdiClose} size={1} />
</button>
```

**✅ FIX:**
```tsx
<button aria-label="Close modal">
  <Icon path={mdiClose} size={1} aria-hidden="true" />
</button>
```

---

### ❌ MISTAKE 3: Emoji Still Present
```tsx
<span>⛵ Cruise</span>
```

**✅ FIX:**
```tsx
<span className="flex items-center gap-2">
  <Icon path={mdiFerry} className="text-accent-500" aria-hidden="true" />
  Cruise
</span>
```

---

## 📚 Resources

- **Pictogrammers Icon Library:** https://pictogrammers.com/library/mdi/
- **MDI React Docs:** https://github.com/Pictogrammers/pictogrammers-react
- **Icon Accessibility:** https://www.w3.org/WAI/ARIA/apg/practices/images/
- **Source of Truth:** [design-architecture.md § 7](../../../docs/design-architecture.md#7-iconography)

---

**Status:** 🔴 Not Started (42 Lucide + 8 emoji icons to migrate)  
**Last Updated:** 2026-02-12  
**Next Action:** Install `@mdi/js` and `@mdi/react`, create Icon wrapper component
