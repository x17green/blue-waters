'use client'

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { toggleVariants } from '@/src/components/ui/toggle'
import { cn } from '@/src/lib/utils'

/**
 * ToggleGroup Component - Bayelsa Boat Club Design System
 * 
 * Glassmorphism-enhanced toggle group with design token integration.
 * Manages multiple toggle buttons with single or multiple selection modes.
 * Inherits variants and styling from Toggle component.
 * 
 * @accessibility
 * - role="group" for single selection
 * - Keyboard navigation (Arrow keys, Tab)
 * - aria-pressed on each item
 * - Focus management across items
 * - Screen reader friendly
 * 
 * @example
 * ```tsx
 * <ToggleGroup type="single" variant="glass">
 *   <ToggleGroupItem value="left">Left</ToggleGroupItem>
 *   <ToggleGroupItem value="center">Center</ToggleGroupItem>
 *   <ToggleGroupItem value="right">Right</ToggleGroupItem>
 * </ToggleGroup>
 * ```
 */

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: 'default',
  variant: 'default',
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('flex items-center justify-center gap-1', className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
