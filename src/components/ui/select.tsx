'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiCheck, mdiChevronDown, mdiChevronUp } from '@mdi/js'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

/**
 * SelectTrigger Variants using CVA
 * 
 * Glassmorphism dropdown trigger matching Input component
 */
const selectTriggerVariants = cva(
  [
    'flex items-center justify-between',
    'w-full h-10 px-3 py-2',
    'rounded-md',
    'text-sm font-medium text-fg',
    'transition-all duration-normal',
    
    // Focus styles
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-accent-400/30',
    'focus:ring-offset-4',
    'focus:ring-offset-bg-950',
    
    // Disabled styles
    'disabled:cursor-not-allowed disabled:opacity-50',
    
    // Placeholder
    '[&>span]:line-clamp-1',
    'placeholder:text-fg-subtle',
  ],
  {
    variants: {
      variant: {
        // Primary - solid background with glass overlay
        primary: [
          'bg-bg-800',
          'border border-border-default',
          'shadow-soft',
          
          'hover:border-border-emphasis',
          
          'focus:border-accent-400/50',
          'focus:shadow-medium',
        ],
        
        // Glass - full glassmorphism effect
        glass: [
          'bg-glass-02',
          'backdrop-blur-subtle',
          'border border-border-subtle',
          'shadow-glass',
          
          'hover:bg-glass-03',
          'hover:border-border-default',
          
          'focus:bg-glass-03',
          'focus:border-accent-400/30',
          'focus:shadow-glass-emphasis',
        ],
        
        // Bordered - outline style
        bordered: [
          'bg-bg-900/50',
          'border-2 border-border-default',
          
          'hover:border-accent-400/30',
          'hover:bg-bg-800/60',
          
          'focus:border-accent-400',
          'focus:bg-bg-800/80',
        ],
        
        // Flat - minimal style
        flat: [
          'bg-bg-800/30',
          'border border-transparent',
          
          'hover:bg-bg-800/50',
          'hover:border-border-subtle',
          
          'focus:bg-bg-800/70',
          'focus:border-accent-400/30',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  variant?: 'primary' | 'glass' | 'bordered' | 'flat'
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, variant = 'primary', ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <Icon path={mdiChevronDown} size={0.6} className="text-fg-muted transition-transform duration-normal data-[state=open]:rotate-180" aria-hidden={true} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      'text-fg-muted hover:text-fg',
      'transition-colors',
      className,
    )}
    {...props}
  >
    <Icon path={mdiChevronUp} size={0.6} aria-hidden={true} />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      'text-fg-muted hover:text-fg',
      'transition-colors',
      className,
    )}
    {...props}
  >
    <Icon path={mdiChevronDown} size={0.6} aria-hidden={true} />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // Base styles
        'relative z-50',
        'max-h-96 min-w-[8rem]',
        'overflow-hidden rounded-md',
        
        // Glassmorphism
        'bg-bg-800',
        'border border-border-default',
        'shadow-large',
        'backdrop-blur-base',
        
        // Text
        'text-fg',
        
        // Animations
        'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95',
        'data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        
        // Position-specific
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'py-1.5 pl-8 pr-2',
      'text-sm font-semibold text-fg-muted',
      className,
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center',
      'rounded-sm py-1.5 pl-8 pr-2',
      'text-sm text-fg',
      'outline-none',
      'transition-colors duration-normal',
      
      // Focus/hover state
      'focus:bg-accent-600/20',
      'focus:text-fg',
      
      // Disabled state
      'data-[disabled]:pointer-events-none',
      'data-[disabled]:opacity-50',
      
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Icon path={mdiCheck} size={0.6} className="text-accent-400" aria-hidden={true} />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border-subtle', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
