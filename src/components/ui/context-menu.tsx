'use client'

import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import * as React from 'react'

import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiCheck, mdiChevronRight, mdiCircleSmall } from '@mdi/js'

/**
 * ContextMenu - Right-click context menu component.
 *
 * @description
 * A menu that appears when right-clicking on an element (contextmenu event).
 * Built on Radix UI ContextMenu primitive with glassmorphism design.
 * Commonly used for providing contextual actions like Copy, Paste, Delete, etc.
 *
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Right-click activation (desktop) or long-press (mobile)
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Nested sub-menus with chevron indicators
 * - Checkbox and radio items with visual indicators
 * - Keyboard shortcuts display
 * - Full ARIA support for screen readers
 *
 * @example
 * ```tsx
 * <ContextMenu>
 *   <ContextMenuTrigger className=\"flex h-[150px] w-[300px] items-center justify-center rounded-md border border-glass\">
 *     Right click here
 *   </ContextMenuTrigger>
 *   <ContextMenuContent className=\"w-64\">
 *     <ContextMenuItem inset>
 *       Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
 *     </ContextMenuItem>
 *     <ContextMenuItem inset disabled>
 *       Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
 *     </ContextMenuItem>
 *     <ContextMenuItem inset>
 *       Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
 *     </ContextMenuItem>
 *     <ContextMenuSeparator />
 *     <ContextMenuCheckboxItem checked>
 *       Show Bookmarks Bar <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
 *     </ContextMenuCheckboxItem>
 *     <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 * ```
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/context-menu | Radix UI ContextMenu}
 */

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

/**
 * ContextMenuSubTrigger - Trigger for nested sub-menu.
 */
const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      // Base styling
      'flex cursor-default select-none items-center',
      'rounded-sm px-2 py-1.5',
      // Typography
      'text-sm text-fg-DEFAULT',
      'outline-none',
      // Focus state
      'focus:bg-glass-02 focus:text-fg-DEFAULT',
      // Open state
      'data-[state=open]:bg-glass-02 data-[state=open]:text-fg-DEFAULT',
      // Inset option for alignment with checkboxes
      inset && 'pl-8',
      // Transitions
      'transition-colors duration-200',
      'motion-reduce:transition-none',
      className,
    )}
    {...props}
  >
    {children}
    <Icon path={mdiChevronRight} size={0.6} className="ml-auto text-fg-muted" aria-hidden={true} />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

/**
 * ContextMenuSubContent - Content panel for nested sub-menu.
 */
const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      // Base styling
      'z-50 min-w-[8rem] overflow-hidden',
      'rounded-md p-1',
      // Glassmorphism
      'bg-glass-03 backdrop-blur-base',
      'border border-glass',
      'shadow-large',
      // Typography
      'text-fg-DEFAULT',
      // Animations entry
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      // Animations - exit
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      // Animations - directional slide
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      // Reduced motion
      'motion-reduce:transition-none',
      className,
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

/**
 * ContextMenuContent - Main content panel for the context menu.
 */
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        // Base styling
        'z-50 min-w-[8rem] overflow-hidden',
        'rounded-md p-1',
        // Glassmorphism
        'bg-glass-03 backdrop-blur-base',
        'border border-glass',
        'shadow-large',
        // Typography
        'text-fg-DEFAULT',
        // Animations - entry (includes fade-in-80 for initial appearance)
        'animate-in fade-in-80',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        // Animations - exit
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        // Animations - directional slide
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        // Reduced motion
        'motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

/**
 * ContextMenuItem - Individual context menu item.
 */
const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      // Base styling
      'relative flex cursor-default select-none items-center',
      'rounded-sm px-2 py-1.5',
      // Typography
      'text-sm text-fg-DEFAULT',
      'outline-none',
      // Focus state
      'focus:bg-glass-02 focus:text-fg-DEFAULT',
      // Disabled state
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      // Inset option
      inset && 'pl-8',
      // Transitions
      'transition-colors duration-200',
      'motion-reduce:transition-none',
      className,
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

/**
 * ContextMenuCheckboxItem - Context menu item with checkbox.
 */
const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      // Base styling
      'relative flex cursor-default select-none items-center',
      'rounded-sm py-1.5 pl-8 pr-2',
      // Typography
      'text-sm text-fg-DEFAULT',
      'outline-none',
      // Focus state
      'focus:bg-glass-02 focus:text-fg-DEFAULT',
      // Disabled state
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      // Transitions
      'transition-colors duration-200',
      'motion-reduce:transition-none',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Icon path={mdiCheck} size={0.6} className="text-fg-DEFAULT" aria-hidden={true} />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

/**
 * ContextMenuRadioItem - Context menu item with radio button.
 */
const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      // Base styling
      'relative flex cursor-default select-none items-center',
      'rounded-sm py-1.5 pl-8 pr-2',
      // Typography
      'text-sm text-fg-DEFAULT',
      'outline-none',
      // Focus state
      'focus:bg-glass-02 focus:text-fg-DEFAULT',
      // Disabled state
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      // Transitions
      'transition-colors duration-200',
      'motion-reduce:transition-none',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Icon path={mdiCircleSmall} size={0.3} className="fill-current text-fg-DEFAULT" aria-hidden={true} />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

/**
 * ContextMenuLabel - Label for grouping context menu items.
 */
const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-fg-DEFAULT',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

/**
 * ContextMenuSeparator - Visual separator between menu items.
 */
const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-glass-01', className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

/**
 * ContextMenuShortcut - Keyboard shortcut display.
 */
const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-fg-muted',
        className,
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
