'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Progress Variants using CVA
 * 
 * Glassmorphism progress bars with semantic color variants
 */
const progressVariants = cva(
  [
    'relative w-full overflow-hidden',
    'rounded-full',
    'transition-all duration-normal',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-bg-800', 'border border-border-subtle'],
        glass: ['bg-glass-02', 'backdrop-blur-subtle', 'border border-border-subtle'],
        success: ['bg-success-900/50', 'border border-success-800/50'],
        warning: ['bg-warning-900/50', 'border border-warning-800/50'],
        error: ['bg-error-900/50', 'border border-error-800/50'],
      },
      size: {
        sm: ['h-2'],
        md: ['h-3'],
        lg: ['h-4'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

const progressIndicatorVariants = cva(
  [
    'h-full w-full flex-1',
    'transition-all duration-normal ease-out',
    'rounded-full',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-accent-600', 'shadow-soft'],
        glass: ['bg-accent-600/90', 'backdrop-blur-base'],
        success: ['bg-success-600'],
        warning: ['bg-warning-600'],
        error: ['bg-error-600'],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  variant?: 'primary' | 'glass' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = 'primary', size = 'md', ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={progressIndicatorVariants({ variant })}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
