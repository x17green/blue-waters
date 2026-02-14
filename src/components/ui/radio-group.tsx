'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiCircle } from '@mdi/js'

/**
 * RadioGroup Component - Yenagoa Boat Club Design System
 * 
 * Glassmorphism-enhanced radio group with design token integration.
 * Supports semantic variants, sizing, and full WCAG AA compliance.
 * 
 * @accessibility
 * - Full keyboard navigation (Arrow keys, Space, Tab)
 * - Screen reader announcements for checked/unchecked states
 * - Focus visible with 4px offset ring
 * - ARIA attributes: role="radiogroup", aria-labelledby, aria-describedby
 * - Respects prefers-reduced-motion for animations
 * 
 * @example
 * ```tsx
 * <RadioGroup defaultValue="option1">
 *   <RadioGroupItem value="option1" id="opt1" />
 *   <Label htmlFor="opt1">Option 1</Label>
 *   <RadioGroupItem value="option2" id="opt2" />
 *   <Label htmlFor="opt2">Option 2</Label>
 * </RadioGroup>
 * ```
 */

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const radioGroupItemVariants = cva(
  [
    // Base styles
    'group relative',
    'aspect-square rounded-full',
    'transition-all duration-200',
    
    // Glassmorphism
    'backdrop-blur-subtle',
    'bg-glass-01',
    
    // Border
    'border border-border-default',
    
    // Focus ring (WCAG AA)
    'focus:outline-none',
    'focus-visible:ring-4 focus-visible:ring-accent-400/30',
    'focus-visible:ring-offset-4 focus-visible:ring-offset-bg-950',
    
    // States
    'hover:bg-glass-02 hover:border-accent-400/50',
    'data-[state=checked]:bg-glass-02',
    'data-[state=checked]:border-accent-400',
    'data-[state=checked]:shadow-md',
    
    // Disabled
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'disabled:hover:bg-glass-01',
    'disabled:hover:border-border-default',
    
    // Reduced motion
    'motion-reduce:transition-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-border-default',
          'data-[state=checked]:border-accent-400',
        ],
        primary: [
          'border-accent-600/50',
          'data-[state=checked]:border-accent-400',
          'data-[state=checked]:bg-accent-900/20',
        ],
        glass: [
          'bg-glass-02',
          'border-border-subtle',
          'data-[state=checked]:bg-glass-03',
          'data-[state=checked]:border-accent-300/80',
        ],
        success: [
          'border-border-default',
          'data-[state=checked]:border-success-500',
          'data-[state=checked]:bg-success-900/20',
          'data-[state=checked]:shadow-md',
        ],
        error: [
          'border-border-default',
          'data-[state=checked]:border-error-500',
          'data-[state=checked]:bg-error-900/20',
          'data-[state=checked]:shadow-md',
        ],
      },
      size: {
        sm: 'h-3.5 w-3.5',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
        xl: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

const indicatorVariants = cva(
  [
    'flex items-center justify-center',
    'transition-all duration-200',
  ],
  {
    variants: {
      variant: {
        default: 'text-accent-400',
        primary: 'text-accent-300',
        glass: 'text-accent-300',
        success: 'text-success-500',
        error: 'text-error-500',
      },
      size: {
        sm: '[&>svg]:h-2 [&>svg]:w-2',
        md: '[&>svg]:h-2.5 [&>svg]:w-2.5',
        lg: '[&>svg]:h-3 [&>svg]:w-3',
        xl: '[&>svg]:h-3.5 [&>svg]:w-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioGroupItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioGroupItemVariants({ variant, size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className={cn(indicatorVariants({ variant, size }))}>
        <Icon 
          path={mdiCircle}
          size={0.4}
          className="fill-current" 
          aria-hidden={true}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem, radioGroupItemVariants }
