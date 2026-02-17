'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Label Component - Bayelsa Boat Club Design System
 * 
 * Glassmorphism-enhanced form labels with design token integration.
 * Supports semantic variants, sizing, and full WCAG AA compliance.
 * 
 * @accessibility
 * - Automatically associates with form controls via htmlFor
 * - Screen reader optimized with proper aria-label support
 * - Supports required indicators and error states
 * - Respects prefers-reduced-motion for animations
 * 
 * @example
 * ```tsx
 * <Label htmlFor="email" variant="primary" size="md">
 *   Email Address
 * </Label>
 * <Input id="email" type="email" />
 * ```
 */

const labelVariants = cva(
  // Base styles - Design token integration
  [
    'inline-flex items-center gap-1.5',
    'font-medium leading-none',
    'text-fg-DEFAULT',
    'transition-colors duration-200',
    
    // Accessibility
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    'peer-disabled:text-fg-subtle',
    
    // Error states
    'peer-invalid:text-error-500',
    'peer-aria-[invalid=true]:text-error-500',
    
    // Focus support for associated inputs
    'peer-focus-visible:text-accent-400',
  ],
  {
    variants: {
      variant: {
        primary: [
          'text-fg-DEFAULT',
        ],
        muted: [
          'text-fg-muted',
        ],
        subtle: [
          'text-fg-subtle',
        ],
        accent: [
          'text-accent-400',
        ],
        error: [
          'text-error-500',
        ],
        success: [
          'text-success-500',
        ],
        warning: [
          'text-warning-500',
        ],
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      required: {
        true: 'after:content-["*"] after:ml-0.5 after:text-error-500',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
      weight: 'medium',
    },
  },
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /**
   * Whether the associated field is required
   */
  required?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, size, weight, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, size, weight, required }), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
