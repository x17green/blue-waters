import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Bayelsa Boat Club Button Component
 * 
 * Glassmorphism dark-first design with accessibility features.
 * Design Source: docs/design-architecture.md#8-component-system
 * Token Source: src/design-system/tokens.ts
 * 
 * Features:
 * - Glassmorphism effects with backdrop blur
 * - Dark matte theme with conservative palette
 * - Full keyboard navigation and focus management
 * - ARIA attributes for screen readers
 * - Compound pattern support (Button.Icon, Button.Label)
 * - Press feedback animations
 */

const buttonVariants = cva(
  [
    // Base styles
    'group relative inline-flex items-center justify-center gap-2',
    'font-medium transition-all duration-normal',
    'rounded-md overflow-hidden',
    
    // Typography
    'text-sm leading-tight',
    
    // Focus management (WCAG 2.4.7)
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-accent-400 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-bg-900',
    
    // Disabled state
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
    
    // Icon sizing
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    
    // Press feedback animation
    'active:scale-[0.98] transition-transform',
  ],
  {
    variants: {
      variant: {
        // Primary: Solid accent with glass reflection
        primary: [
          'bg-accent-600 text-fg',
          'shadow-soft',
          'border border-accent-500/30',
          
          // Glass overlay
          'before:absolute before:inset-0',
          'before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent',
          'before:opacity-100 before:transition-opacity',
          
          // Hover state
          'hover:bg-accent-500 hover:shadow-medium',
          'hover:border-accent-400/40',
          'hover:before:opacity-80',
          
          // Active/pressed state
          'active:bg-accent-700 active:shadow-soft',
        ],
        
        // Secondary: Subtle glass with muted accent
        secondary: [
          'bg-accent-900/40 text-accent-100',
          'backdrop-blur-subtle saturate-100',
          'border border-accent-800/50',
          'shadow-soft',
          
          // Glass overlay
          'before:absolute before:inset-0',
          'before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent',
          
          // Hover state
          'hover:bg-accent-800/50 hover:text-accent-50',
          'hover:border-accent-700/60 hover:shadow-medium',
          'hover:before:from-white/[0.05]',
          
          // Active state
          'active:bg-accent-900/60',
        ],
        
        // Glass: Prominent glassmorphism effect
        glass: [
          'bg-glass-02 text-fg',
          'backdrop-blur-base saturate-100',
          'border border-white/[0.06]',
          'shadow-soft',
          
          // Enhanced glass overlay
          'before:absolute before:inset-0',
          'before:bg-gradient-to-b before:from-white/[0.06] before:to-white/[0.02]',
          'before:opacity-100 before:transition-opacity',
          
          // Hover state - stronger glass
          'hover:bg-glass-03 hover:border-white/[0.08]',
          'hover:shadow-medium hover:before:from-white/[0.08]',
          
          // Active state
          'active:bg-glass-04 active:shadow-strong',
        ],
        
        // Outline: Minimal border-only style
        outline: [
          'bg-transparent text-fg',
          'border border-border-default',
          
          // Subtle glass on hover
          'hover:bg-glass-01 hover:border-border-emphasis',
          'hover:backdrop-blur-subtle',
          
          // Active state
          'active:bg-glass-02',
        ],
        
        // Ghost: Transparent with hover effect
        ghost: [
          'bg-transparent text-fg-muted',
          'border border-transparent',
          
          // Hover state - gentle glass appearance
          'hover:bg-glass-01 hover:text-fg',
          'hover:border-border-subtle hover:backdrop-blur-subtle',
          
          // Active state
          'active:bg-glass-02 active:text-fg',
        ],
        
        // Danger: Error/destructive actions
        danger: [
          'bg-error-600 text-fg',
          'shadow-soft',
          'border border-error-500/30',
          
          // Glass overlay
          'before:absolute before:inset-0',
          'before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent',
          
          // Hover state
          'hover:bg-error-500 hover:shadow-medium',
          'hover:border-error-400/40',
          
          // Active state
          'active:bg-error-700',
        ],
        
        // Danger Soft: Muted danger variant
        'danger-soft': [
          'bg-error-900/40 text-error-300',
          'backdrop-blur-subtle saturate-100',
          'border border-error-800/50',
          'shadow-soft',
          
          // Hover state
          'hover:bg-error-800/50 hover:text-error-200',
          'hover:border-error-700/60',
          
          // Active state
          'active:bg-error-900/60',
        ],
        
        // Link: Underlined text style
        link: [
          'bg-transparent text-accent-400',
          'underline-offset-4 hover:underline',
          'hover:text-accent-300',
          'border-none shadow-none',
        ],
        
        // Legacy compatibility (map old names to new variants)
        default: [
          'bg-accent-600 text-fg',
          'shadow-soft',
          'border border-accent-500/30',
          'before:absolute before:inset-0',
          'before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent',
          'hover:bg-accent-500 hover:shadow-medium',
        ],
        destructive: [
          'bg-error-600 text-fg',
          'shadow-soft',
          'border border-error-500/30',
          'hover:bg-error-500 hover:shadow-medium',
        ],
      },
      
      size: {
        sm: [
          'h-9 px-3 py-1.5',
          'text-xs',
          '[&_svg]:size-4',
          'gap-1.5',
        ],
        md: [
          'h-10 px-4 py-2',
          'text-sm',
          '[&_svg]:size-4',
          'gap-2',
        ],
        lg: [
          'h-11 px-6 py-2.5',
          'text-base',
          '[&_svg]:size-5',
          'gap-2.5',
        ],
        xl: [
          'h-14 px-8 py-3',
          'text-lg',
          '[&_svg]:size-6',
          'gap-3',
        ],
        icon: [
          'h-10 w-10 p-0',
          'aspect-square',
          '[&_svg]:size-5',
        ],
        'icon-sm': [
          'h-9 w-9 p-0',
          'aspect-square',
          '[&_svg]:size-4',
        ],
        'icon-lg': [
          'h-11 w-11 p-0',
          'aspect-square',
          '[&_svg]:size-5',
        ],
        
        // Legacy compatibility
        default: [
          'h-10 px-4 py-2',
          'text-sm',
          '[&_svg]:size-4',
          'gap-2',
        ],
      },
      
      // Reduced motion support (WCAG Animation)
      reducedMotion: {
        true: [
          'transition-none',
          'active:scale-100',
          'before:transition-none',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render button as a child component (for custom components)
   */
  asChild?: boolean
  
  /**
   * Link href - when provided, button renders as Next.js Link
   * (TypeScript Note: href usage may require type assertion due to CVA limitations)
   */
  href?: string
  
  /**
   * Loading state with spinner
   */
  isLoading?: boolean
  
  /**
   * Icon to display before label
   */
  startIcon?: React.ReactNode
  
  /**
   * Icon to display after label
   */
  endIcon?: React.ReactNode
  
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      href,
      isLoading = false,
      startIcon,
      endIcon,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    // If href is provided, render as Link
    const Comp = href ? Link : asChild ? Slot : 'button'
    
    // Detect user's motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Combine disabled states
    const isDisabled = disabled || isLoading
    
    // Build component props based on comp type
    const componentProps = href
      ? { 
          href,
          className: cn(buttonVariants({ variant, size, reducedMotion: prefersReducedMotion, className })),
          ...(props as any),
        }
      : asChild
      ? { 
          className: cn(buttonVariants({ variant, size, reducedMotion: prefersReducedMotion, className })),
          ...props,
        }
      : {
          className: cn(buttonVariants({ variant, size, reducedMotion: prefersReducedMotion, className })),
          type,
          disabled: isDisabled,
          'aria-disabled': isDisabled,
          'aria-busy': isLoading,
          ...props,
        }
    
    // When using asChild, pass children directly without wrappers (Slot requires single child)
    if (asChild) {
      return (
        <Comp
          ref={ref as any}
          {...componentProps}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        ref={ref as any}
        {...componentProps}
      >
        {/* Loading spinner */}
        {isLoading && (
          <span
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden={true}
          >
            <svg
              className="size-5 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        
        {/* Content wrapper - hidden when loading */}
        <span
          className={cn(
            'flex items-center justify-center gap-2',
            isLoading && 'invisible',
          )}
        >
          {startIcon && (
            <span className="inline-flex shrink-0" aria-hidden={true}>
              {startIcon}
            </span>
          )}
          
          {children}
          
          {endIcon && (
            <span className="inline-flex shrink-0" aria-hidden={true}>
              {endIcon}
            </span>
          )}
        </span>
      </Comp>
    )
  },
)
Button.displayName = 'Button'

/**
 * Compound component: Button.Icon
 * 
 * For explicit icon control in compound pattern:
 * <Button>
 *   <Button.Icon><IconComponent /></Button.Icon>
 *   <Button.Label>Text</Button.Label>
 * </Button>
 */
const ButtonIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('inline-flex shrink-0', className)}
    aria-hidden={true}
    {...props}
  />
))
ButtonIcon.displayName = 'Button.Icon'

/**
 * Compound component: Button.Label
 * 
 * For explicit label control in compound pattern
 */
const ButtonLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('inline-flex items-center', className)}
    {...props}
  />
))
ButtonLabel.displayName = 'Button.Label'

// Export with proper TypeScript types
export { ButtonIcon, ButtonLabel, buttonVariants }

// Augment Button type with compound components (for TypeScript)
export type ButtonComponent = typeof Button & {
  Icon: typeof ButtonIcon
  Label: typeof ButtonLabel
}

// Attach compound components at runtime
const ButtonWithCompounds = Button as ButtonComponent
ButtonWithCompounds.Icon = ButtonIcon
ButtonWithCompounds.Label = ButtonLabel

// Named export with compounds
export { ButtonWithCompounds as Button }

// Default export with compounds
export default ButtonWithCompounds
