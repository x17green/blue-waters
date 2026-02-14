'use client'

import * as MenubarPrimitive from '@radix-ui/react-menubar'
import * as React from 'react'

import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiCheck, mdiChevronRight, mdiCircleSmall } from '@mdi/js'

/**
 * Menubar - Desktop application-style menu bar component.
 *
 * @description
 * A horizontal menu bar typically placed at the top of desktop applications.
 * Built on Radix UI Menubar primitive with glassmorphism design.
 * Similar to system menus found in macOS/Windows applications (File, Edit, View, etc.).
 *
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Nested sub-menus with chevron indicators
 * - Checkbox and radio items with visual indicators
 * - Keyboard shortcuts display
 * - Full ARIA support for screen readers
 *
 * @example
 * ```tsx
 * <Menubar>
 *   <MenubarMenu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenubarContent>
 *       <MenubarItem>
 *         New Tab <MenubarShortcut>⌘T</MenubarShortcut>
 *       </MenubarItem>
 *       <MenubarItem>
 *         New Window <MenubarShortcut>⌘N</MenubarShortcut>
 *       </MenubarItem>
 *       <MenubarSeparator />
 *       <MenubarItem>Share</MenubarItem>
 *       <MenubarSeparator />
 *       <MenubarItem>Print</MenubarItem>
 *     </MenubarContent>
 *   </MenubarMenu>
 * </Menubar>
 * ```
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/menubar | Radix UI Menubar}
 */

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

/**
 * Menubar - Root container for the menu bar.
 */
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      // Layout and sizing
      'flex h-10 items-center space-x-1 p-1',
      // Border radius
      'rounded-md',
      // Glassmorphism
      'bg-glass-02 backdrop-blur-subtle',
      'border border-glass',
      className,
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

/**
 * MenubarTrigger - Button that opens the menu.
 */
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base styling
      'flex cursor-default select-none items-center',
      'rounded-sm px-3 py-1.5',
      // Typography
      'text-sm font-medium text-fg-DEFAULT',
      'outline-none',
      // Focus state
      'focus:bg-glass-02 focus:text-fg-DEFAULT',
      // Open state
      'data-[state=open]:bg-glass-02 data-[state=open]:text-fg-DEFAULT',
      // Transitions
      'transition-colors duration-200',
      'motion-reduce:transition-none',
      className,
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

/**
 * MenubarSubTrigger - Trigger for nested sub-menu.
 */
const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
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
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

/**
 * MenubarSubContent - Content panel for nested sub-menu.
 */
const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      // Base styling
      'z-50 min-w-[8rem] overflow-hidden',
      'rounded-md p-1',
      // Glassmorphism
      'bg-glass-03 backdrop-blur-base',
      'border border-glass',
      // Typography
      'text-fg-DEFAULT',
      // Animations - entry
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
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

/**
 * MenubarContent - Main content panel for the menu.
 */
const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
    ref,
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          // Base styling
          'z-50 min-w-[12rem] overflow-hidden',
          'rounded-md p-1',
          // Glassmorphism
          'bg-glass-03 backdrop-blur-base',
          'border border-glass',
          'shadow-large',
          // Typography
          'text-fg-DEFAULT',
          // Animations - entry
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
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
    </MenubarPrimitive.Portal>
  ),
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

/**
 * MenubarItem - Individual menu item.
 */
const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
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
MenubarItem.displayName = MenubarPrimitive.Item.displayName

/**
 * MenubarCheckboxItem - Menu item with checkbox.
 */
const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
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
      <MenubarPrimitive.ItemIndicator>
        <Icon path={mdiCheck} size={0.6} className="text-fg-DEFAULT" aria-hidden={true} />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

/**
 * MenubarRadioItem - Menu item with radio button.
 */
const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
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
      <MenubarPrimitive.ItemIndicator>
        <Icon path={mdiCircleSmall} size={0.3} className="fill-current text-fg-DEFAULT" aria-hidden={true} />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

/**
 * MenubarLabel - Label for grouping menu items.
 */
const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-fg-DEFAULT',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

/**
 * MenubarSeparator - Visual separator between menu items.
 */
const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-glass-01', className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

/**
 * MenubarShortcut - Keyboard shortcut display.
 */
const MenubarShortcut = ({
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
MenubarShortcut.displayName = 'MenubarShortcut'

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
