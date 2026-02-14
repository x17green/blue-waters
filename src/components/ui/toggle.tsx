'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Toggle Component - Yenagoa Boat Club Design System
 * 
 * Glassmorphism-enhanced toggle button with design token integration.
 * Supports multiple variants, sizing, and full WCAG AA compliance.
 * 
 * @accessibility
 * - aria-pressed state automatically managed
 * - Keyboard navigable (Space, Enter)
 * - Focus visible with ring offset
 * - Screen reader friendly state announcements
 * - Disabled state properly indicated
 * 
 * @example
 * ```tsx
 * <Toggle variant="glass" size="md" aria-label="Toggle italic">
 *   <Italic className="h-4 w-4" />
 * </Toggle>
 * ```
 */

const toggleVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center',
    'gap-2',
    'rounded-md',
    'text-sm font-medium',
    'text-fg-DEFAULT',
    'transition-all duration-200',
    
    // Icon support
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
    
    // Focus ring
    'focus-visible:outline-none',
    'focus-visible:ring-4 focus-visible:ring-accent-400/30',
    'focus-visible:ring-offset-4 focus-visible:ring-offset-bg-950',
    
    // Disabled
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    
    // Reduced motion
    'motion-reduce:transition-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-transparent',
          'hover:bg-glass-01',
          'hover:text-accent-400',
          'data-[state=on]:bg-glass-02',
          'data-[state=on]:text-accent-300',
          'data-[state=on]:border data-[state=on]:border-accent-600/30',
        ],
        glass: [
          'backdrop-blur-subtle',
          'bg-glass-01',
          'border border-border-subtle',
          'hover:bg-glass-02',
          'hover:border-accent-600/30',
          'data-[state=on]:bg-glass-03',
          'data-[state=on]:border-accent-400',
          'data-[state=on]:text-accent-300',
          'data-[state=on]:shadow-md',
        ],
        outline: [
          'border border-border-default',
          'bg-transparent',
          'hover:bg-glass-01',
          'hover:text-accent-400',
          'hover:border-accent-600/50',
          'data-[state=on]:bg-accent-900/20',
          'data-[state=on]:border-accent-400',
          'data-[state=on]:text-accent-300',
        ],
        primary: [
          'bg-accent-800',
          'text-fg-DEFAULT',
          'hover:bg-accent-700',
          'data-[state=on]:bg-accent-600',
          'data-[state=on]:shadow-lg',
        ],
      },
      size: {
        sm: 'h-9 px-2.5 min-w-9',
        default: 'h-10 px-3 min-w-10',
        lg: 'h-11 px-5 min-w-11',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
