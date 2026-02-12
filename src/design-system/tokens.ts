/**
 * Blue Waters Design System - Design Tokens
 * 
 * Central token definitions for colors, spacing, typography, effects.
 * Source of truth: docs/design-architecture.md
 * 
 * Philosophy: Dark-first glassmorphism with conservative government aesthetic
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const colors = {
  // Background Layers (Dark-first)
  bg: {
    950: 'hsl(207, 40%, 8%)',    // #0B0F12 - Deepest background
    900: 'hsl(207, 40%, 12%)',   // #0F171B - App background (dark mode default)
    800: 'hsl(207, 40%, 16%)',   // #1A2329 - Elevated panels
    700: 'hsl(207, 40%, 24%)',   // #2A3944 - Hover states
    600: 'hsl(207, 40%, 32%)',   // #3A4E5E - Active states
  },

  // Foreground / Text Colors
  fg: {
    DEFAULT: 'hsl(205, 100%, 97%)', // #EFF9FF - Primary text (dark mode)
    muted: 'hsl(205, 50%, 70%)',    // #99C8E0 - Secondary text
    subtle: 'hsl(205, 30%, 50%)',   // #668BA3 - Tertiary text
  },

  // Accent Colors (Muted Nautical Blue)
  accent: {
    900: 'hsl(207, 70%, 20%)',   // #0F3D52 - Darkest
    800: 'hsl(207, 70%, 28%)',   // #16566F - Dark
    700: 'hsl(207, 70%, 36%)',   // #1D6E8C - Medium dark
    600: 'hsl(207, 80%, 44%)',   // #2186AA - Medium
    500: 'hsl(207, 80%, 50%)',   // #6DA7C8 - Primary accent (design system)
    400: 'hsl(207, 80%, 60%)',   // #52B8E0 - Hover
    300: 'hsl(207, 80%, 70%)',   // #85D0F5 - Active
    200: 'hsl(207, 80%, 80%)',   // #B8E6FF - Subtle
    100: 'hsl(207, 80%, 90%)',   // #DBF3FF - Very subtle
  },

  // Neutral Colors
  neutral: {
    900: 'hsl(207, 20%, 20%)',   // #33424D - Dark neutral
    800: 'hsl(207, 20%, 30%)',   // #4D5E6B - Medium dark
    700: 'hsl(207, 20%, 40%)',   // #667A89 - Medium
    600: 'hsl(207, 20%, 50%)',   // #8096A7 - Medium light
    500: 'hsl(207, 20%, 60%)',   // #99B2C5 - Light
    400: 'hsl(207, 20%, 70%)',   // #B3CEE3 - Lighter
    300: 'hsl(207, 20%, 80%)',   // #CCEAFF - Very light
    200: 'hsl(207, 20%, 90%)',   // #E6F6FF - Extremely light
    100: 'hsl(207, 20%, 95%)',   // #F3FAFF - Almost white
  },

  // Semantic Colors
  success: {
    900: 'hsl(142, 70%, 20%)',   // #0F5229 - Dark green
    800: 'hsl(142, 70%, 28%)',   // #166E38 - Darker green
    700: 'hsl(142, 70%, 35%)',   // #1A8F47 - Medium green
    600: 'hsl(142, 70%, 42%)',   // #1FA653 - Medium-light green
    500: 'hsl(142, 70%, 45%)',   // #22B35C - Primary success
    300: 'hsl(142, 70%, 70%)',   // #7FE0A5 - Light green
  },

  warning: {
    900: 'hsl(38, 90%, 25%)',    // #733D0A - Dark orange
    800: 'hsl(38, 90%, 32%)',    // #944F0D - Darker orange
    700: 'hsl(38, 90%, 40%)',    // #BF6610 - Medium orange
    600: 'hsl(38, 90%, 46%)',    // #E87312 - Medium-light orange
    500: 'hsl(38, 90%, 50%)',    // #F28314 - Primary warning
    300: 'hsl(38, 90%, 70%)',    // #FFC480 - Light orange
  },

  error: {
    900: 'hsl(0, 70%, 25%)',     // #6B1313 - Dark red
    800: 'hsl(0, 70%, 32%)',     // #8A1A1A - Darker red
    700: 'hsl(0, 70%, 40%)',     // #AD1F1F - Medium red
    600: 'hsl(0, 70%, 46%)',     // #C62525 - Medium-light red
    500: 'hsl(0, 70%, 50%)',     // #D92929 - Primary error
    300: 'hsl(0, 70%, 70%)',     // #FF8080 - Light red
  },

  info: {
    900: 'hsl(200, 80%, 25%)',   // #0D5266 - Dark cyan
    700: 'hsl(200, 80%, 40%)',   // #1485A6 - Medium cyan
    500: 'hsl(200, 80%, 50%)',   // #1AA7D0 - Primary info
    300: 'hsl(200, 80%, 70%)',   // #70D4F5 - Light cyan
  },

  // Border Colors
  border: {
    subtle: 'hsl(207, 30%, 25%)', // #2E4252 - Very subtle border
    default: 'hsl(207, 30%, 35%)', // #3E5869 - Default border
    emphasis: 'hsl(207, 30%, 45%)', // #4E6E80 - Emphasized border
  },

  // Glass Effect Colors (used in CSS variables)
  glass: {
    '01': 'rgba(255, 255, 255, 0.03)', // Subtle glass
    '02': 'rgba(255, 255, 255, 0.05)', // Base glass
    '03': 'rgba(255, 255, 255, 0.08)', // Medium glass
    '04': 'rgba(255, 255, 255, 0.12)', // Strong glass
  },
} as const

// ============================================================================
// SPACING TOKENS (8px base scale)
// ============================================================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  2: '0.5rem',       // 8px
  3: '0.75rem',      // 12px
  4: '1rem',         // 16px - base unit
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  8: '2rem',         // 32px
  10: '2.5rem',      // 40px
  12: '3rem',        // 48px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  32: '8rem',        // 128px
  40: '10rem',       // 160px
  48: '12rem',       // 192px
  56: '14rem',       // 224px
  64: '16rem',       // 256px
} as const

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const typography = {
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.75rem',  // 28px
    '4xl': '2rem',     // 32px
    '5xl': '2.5rem',   // 40px
    '6xl': '3rem',     // 48px
    '7xl': '4rem',     // 64px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
} as const

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  md: '0.75rem',     // 12px
  lg: '1.25rem',     // 20px
  xl: '1.5rem',      // 24px
  '2xl': '2rem',     // 32px
  full: '9999px',
} as const

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const shadows = {
  soft: '0 6px 20px rgba(4, 8, 16, 0.6)',
  medium: '0 10px 40px rgba(4, 8, 16, 0.7)',
  strong: '0 20px 60px rgba(4, 8, 16, 0.8)',
} as const

// ============================================================================
// GLASSMORPHISM TOKENS
// ============================================================================

export const glassmorphism = {
  blur: {
    subtle: '4px',    // Cards on dark backgrounds
    base: '8px',      // Standard glass effect
    strong: '12px',   // Dropdowns, popovers
    modal: '16px',    // Modals, overlays
  },

  saturation: {
    default: '100%',  // Standard saturation
    enhanced: '120%', // Enhanced for emphasis
  },
} as const

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export const zIndex = {
  base: 0,
  default: 1,
  elevated: 200,
  overlay: 400,
  sticky: 600,
  header: 800,
  dropdown: 1000,
  popover: 1200,
  modal: 1400,
  tooltip: 1600,
} as const

// ============================================================================
// TRANSITION TOKENS
// ============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },

  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================================================
// BREAKPOINTS (Tailwind defaults)
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================================================
// CONSOLIDATED EXPORT
// ============================================================================

export const tokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  glassmorphism,
  zIndex,
  transitions,
  breakpoints,
} as const

export default tokens
