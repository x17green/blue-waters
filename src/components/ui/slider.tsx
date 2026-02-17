'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Slider Component - Bayelsa Boat Club Design System
 * 
 * Glassmorphism-enhanced range slider with design token integration.
 * Supports semantic variants, sizing, and full WCAG AA compliance.
 * 
 * @accessibility
 * - Full keyboard navigation (Arrow keys, Home, End, Page Up/Down)
 * - aria-valuemin, aria-valuemax, aria-valuenow
 * - Screen reader friendly value announcements
 * - Focus visible with ring offset
 * - Touch-friendly thumb size
 * 
 * @example
 * ```tsx
 * <Slider 
 *   defaultValue={[50]} 
 *   max={100} 
 *   step={1}
 *   variant="primary"
 *   size="md"
 * />
 * ```
 */

const sliderVariants = cva(
  [
    'relative flex w-full',
    'touch-none select-none',
    'items-center',
  ],
  {
    variants: {
      variant: {
        default: '',
        primary: '',
        success: '',
        warning: '',
        error: '',
      },
      size: {
        sm: '[&_[role=slider]]:h-4 [&_[role=slider]]:w-4',
        md: '[&_[role=slider]]:h-5 [&_[role=slider]]:w-5',
        lg: '[&_[role=slider]]:h-6 [&_[role=slider]]:w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

const trackVariants = cva(
  [
    'relative w-full grow',
    'overflow-hidden rounded-full',
    'backdrop-blur-subtle',
    'bg-glass-01',
    'border border-border-subtle',
  ],
  {
    variants: {
      size: {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-2.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

const rangeVariants = cva(
  [
    'absolute h-full',
    'transition-colors duration-200',
  ],
  {
    variants: {
      variant: {
        default: 'bg-accent-500',
        primary: 'bg-accent-400',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        error: 'bg-error-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const thumbVariants = cva(
  [
    'block rounded-full',
    'backdrop-blur-base',
    'bg-glass-03',
    'border-2',
    'transition-all duration-200',
    // Focus ring
    'focus-visible:outline-none',
    'focus-visible:ring-4 focus-visible:ring-accent-400/30',
    'focus-visible:ring-offset-4 focus-visible:ring-offset-bg-950',
    // Disabled
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    // Hover
    'hover:scale-110',
    // Active
    'active:scale-95',
    // Reduced motion
    'motion-reduce:transition-none',
    'motion-reduce:hover:scale-100',
    'motion-reduce:active:scale-100',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-accent-400',
          'shadow-md',
        ],
        primary: [
          'border-accent-300',
          'shadow-md',
        ],
        success: [
          'border-success-500',
          'shadow-md',
        ],
        warning: [
          'border-warning-500',
          'shadow-md',
        ],
        error: [
          'border-error-500',
          'shadow-md',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderVariants> {}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, variant, size, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(sliderVariants({ variant, size }), className)}
    {...props}
  >
    <SliderPrimitive.Track className={cn(trackVariants({ size }))}>
      <SliderPrimitive.Range className={cn(rangeVariants({ variant }))} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn(thumbVariants({ variant }))} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider, sliderVariants, trackVariants, rangeVariants, thumbVariants }
