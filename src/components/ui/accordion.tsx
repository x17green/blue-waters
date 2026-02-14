'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import * as React from 'react'

import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiChevronDown } from '@mdi/js'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      // Base styles
      'border-b border-border-subtle',
      // Glassmorphism on open
      'data-[state=open]:bg-glass-01',
      'data-[state=open]:backdrop-blur-subtle',
      // Transitions
      'transition-colors duration-normal',
      className,
    )}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between',
        'py-4 px-4',
        'font-medium text-fg',
        // Hover states
        'transition-all duration-normal',
        'hover:text-accent-400',
        // Icon rotation
        '[&[data-state=open]>svg]:rotate-180',
        // Focus ring
        'focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-accent-400/30',
        'focus-visible:ring-offset-4 focus-visible:ring-offset-bg-950',
        className,
      )}
      {...props}
    >
      {children}
      <Icon
        path={mdiChevronDown}
        size={0.6}
        className={cn(
          'shrink-0',
          'transition-transform duration-normal',
          'text-accent-400',
        )}
        aria-hidden={true}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden',
      'text-sm text-fg-muted',
      // Radix animations
      'transition-all',
      'data-[state=closed]:animate-accordion-up',
      'data-[state=open]:animate-accordion-down',
    )}
    {...props}
  >
    <div className={cn('pb-4 pt-0 px-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
