'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiCheck, mdiMinus } from '@mdi/js'

/**
 * Checkbox Variants using CVA
 * 
 * Glassmorphism dark-first design with interactive states
 */
const checkboxVariants = cva(
  [
    // Base styles
    'peer shrink-0 rounded-md',
    'border',
    'transition-all duration-normal',
    
    // Focus styles
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-accent-400/30',
    'focus-visible:ring-offset-4',
    'focus-visible:ring-offset-bg-950',
    
    // Disabled styles
    'disabled:cursor-not-allowed disabled:opacity-50',
    
    // Checked state indicator
    'data-[state=checked]:bg-accent-600',
    'data-[state=checked]:border-accent-500/30',
    'data-[state=checked]:shadow-soft',
    
    // Indeterminate state
    'data-[state=indeterminate]:bg-accent-700',
    'data-[state=indeterminate]:border-accent-600/30',
  ],
  {
    variants: {
      variant: {
        // Primary - solid accent when checked
        primary: [
          'bg-bg-800',
          'border-border-default',
          
          'hover:border-border-emphasis',
          'hover:bg-bg-700',
          
          'data-[state=checked]:hover:bg-accent-500',
          'data-[state=indeterminate]:hover:bg-accent-600',
        ],
        
        // Glass - glassmorphism effect
        glass: [
          'bg-glass-02',
          'backdrop-blur-subtle',
          'border-border-subtle',
          
          'hover:bg-glass-03',
          'hover:border-border-default',
          
          'data-[state=checked]:bg-accent-600/90',
          'data-[state=checked]:backdrop-blur-base',
        ],
        
        // Bordered - outline style
        bordered: [
          'bg-transparent',
          'border-2 border-border-default',
          
          'hover:border-accent-400/30',
          'hover:bg-bg-800/30',
          
          'data-[state=checked]:bg-accent-600',
          'data-[state=checked]:border-accent-500',
        ],
      },
      
      size: {
        sm: ['size-4'],
        md: ['size-5'],
        lg: ['size-6'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface CheckboxProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
      'size'
    >,
    VariantProps<typeof checkboxVariants> {
  /**
   * Visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'glass' | 'bordered'
  
  /**
   * Size of the checkbox
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  
  /**
   * Label text
   */
  label?: string
  
  /**
   * Description text shown below label
   */
  description?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant = 'primary', size = 'md', label, description, id, ...props }, ref) => {
  // Auto-generate ID from label if not provided
  const checkboxId = id || (label ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
  
  const iconSize = size === 'sm' ? 'size-3' : size === 'lg' ? 'size-5' : 'size-4'
  const iconSizeNum = size === 'sm' ? 0.5 : size === 'lg' ? 0.8 : 0.6
  
  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          className={cn(checkboxVariants({ variant, size }), className)}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-fg">
            {props.checked === 'indeterminate' ? (
              <Icon path={mdiMinus} size={iconSizeNum} aria-hidden={true} />
            ) : (
              <Icon path={mdiCheck} size={iconSizeNum} aria-hidden={true} />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        
        <div className="grid gap-1 pt-0.5">
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-fg leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-fg-muted">{description}</p>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      className={cn(checkboxVariants({ variant, size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-fg">
        {props.checked === 'indeterminate' ? (
          <Icon path={mdiMinus} size={iconSizeNum} aria-hidden={true} />
        ) : (
          <Icon path={mdiCheck} size={iconSizeNum} aria-hidden={true} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
