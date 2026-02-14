import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ================================================================
           DESIGN SYSTEM TOKENS
           Source: src/design-system/tokens.ts
           ================================================================ */
        bg: {
          950: 'hsl(var(--bg-950))',
          900: 'hsl(var(--bg-900))',
          800: 'hsl(var(--bg-800))',
          700: 'hsl(var(--bg-700))',
          600: 'hsl(var(--bg-600))',
        },
        fg: {
          DEFAULT: 'hsl(var(--fg))',
          muted: 'hsl(var(--fg-muted))',
          subtle: 'hsl(var(--fg-subtle))',
        },
        accent: {
          900: 'hsl(var(--accent-900))',
          800: 'hsl(var(--accent-800))',
          700: 'hsl(var(--accent-700))',
          600: 'hsl(var(--accent-600))',
          500: 'hsl(var(--accent-500))',
          400: 'hsl(var(--accent-400))',
          300: 'hsl(var(--accent-300))',
          200: 'hsl(var(--accent-200))',
          100: 'hsl(var(--accent-100))',
          DEFAULT: 'hsl(var(--accent-500))',
          foreground: 'hsl(var(--fg))',
        },
        'accent-gold': {
          900: 'hsl(var(--accent-gold-900))',
          800: 'hsl(var(--accent-gold-800))',
          700: 'hsl(var(--accent-gold-700))',
          600: 'hsl(var(--accent-gold-600))',
          500: 'hsl(var(--accent-gold-500))',
          400: 'hsl(var(--accent-gold-400))',
          300: 'hsl(var(--accent-gold-300))',
          200: 'hsl(var(--accent-gold-200))',
          100: 'hsl(var(--accent-gold-100))',
          DEFAULT: 'hsl(var(--accent-gold-500))',
        },
        neutral: {
          900: 'hsl(var(--neutral-900))',
          800: 'hsl(var(--neutral-800))',
          700: 'hsl(var(--neutral-700))',
          600: 'hsl(var(--neutral-600))',
          500: 'hsl(var(--neutral-500))',
          400: 'hsl(var(--neutral-400))',
          300: 'hsl(var(--neutral-300))',
          200: 'hsl(var(--neutral-200))',
          100: 'hsl(var(--neutral-100))',
        },
        success: {
          900: 'hsl(var(--success-900))',
          800: 'hsl(var(--success-800))',
          700: 'hsl(var(--success-700))',
          600: 'hsl(var(--success-600))',
          500: 'hsl(var(--success-500))',
          300: 'hsl(var(--success-300))',
          DEFAULT: 'hsl(var(--success-500))',
        },
        warning: {
          900: 'hsl(var(--warning-900))',
          800: 'hsl(var(--warning-800))',
          700: 'hsl(var(--warning-700))',
          600: 'hsl(var(--warning-600))',
          500: 'hsl(var(--warning-500))',
          300: 'hsl(var(--warning-300))',
          DEFAULT: 'hsl(var(--warning-500))',
        },
        error: {
          900: 'hsl(var(--error-900))',
          800: 'hsl(var(--error-800))',
          700: 'hsl(var(--error-700))',
          600: 'hsl(var(--error-600))',
          500: 'hsl(var(--error-500))',
          300: 'hsl(var(--error-300))',
          DEFAULT: 'hsl(var(--error-500))',
        },
        info: {
          900: 'hsl(var(--info-900))',
          700: 'hsl(var(--info-700))',
          500: 'hsl(var(--info-500))',
          300: 'hsl(var(--info-300))',
          DEFAULT: 'hsl(var(--info-500))',
        },
        glass: {
          '01': 'var(--glass-01)',
          '02': 'var(--glass-02)',
          '03': 'var(--glass-03)',
          '04': 'var(--glass-04)',
        },

        /* ================================================================
           LEGACY COMPATIBILITY TOKENS
           TODO: Remove after component migration complete
           ================================================================ */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          subtle: 'hsl(var(--border-subtle))',
          emphasis: 'hsl(var(--border-emphasis))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        marketing: 'var(--font-marketing)',
      },
      spacing: {
        0.5: '0.125rem',  // 2px
        1: '0.25rem',     // 4px
        2: '0.5rem',      // 8px
        3: '0.75rem',     // 12px
        4: '1rem',        // 16px
        5: '1.25rem',     // 20px
        6: '1.5rem',      // 24px
        8: '2rem',        // 32px
        10: '2.5rem',     // 40px
        12: '3rem',       // 48px
        16: '4rem',       // 64px
        20: '5rem',       // 80px
        24: '6rem',       // 96px
        32: '8rem',       // 128px
        40: '10rem',      // 160px
        48: '12rem',      // 192px
        56: '14rem',      // 224px
        64: '16rem',      // 256px
      },
      backdropBlur: {
        subtle: 'var(--blur-subtle)',
        base: 'var(--blur-base)',
        strong: 'var(--blur-strong)',
        modal: 'var(--blur-modal)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        strong: 'var(--shadow-strong)',
      },
      zIndex: {
        base: 'var(--z-base)',
        default: 'var(--z-default)',
        elevated: 'var(--z-elevated)',
        overlay: 'var(--z-overlay)',
        sticky: 'var(--z-sticky)',
        header: 'var(--z-header)',
        dropdown: 'var(--z-dropdown)',
        popover: 'var(--z-popover)',
        modal: 'var(--z-modal)',
        tooltip: 'var(--z-tooltip)',
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
        slow: 'var(--transition-slow)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
