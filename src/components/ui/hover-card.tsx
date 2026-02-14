'use client'

import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * HoverCard - Root component for hover-activated popover content.
 *
 * @description
 * A container that displays rich content in a popover when hovering over a trigger element.
 * Built on Radix UI HoverCard primitive with configurable delays and positioning.
 *
 * @example
 * ```tsx
 * <HoverCard openDelay={300}>
 *   <HoverCardTrigger>@username</HoverCardTrigger>
 *   <HoverCardContent>
 *     <div className="space-y-2">
 *       <h4 className="font-semibold">User Profile</h4>
 *       <p className="text-fg-muted">Additional user information</p>
 *     </div>
 *   </HoverCardContent>
 * </HoverCard>
 * ```
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/hover-card | Radix UI HoverCard}
 */
const HoverCard = HoverCardPrimitive.Root

/**
 * HoverCardTrigger - Element that triggers the hover card.
 *
 * @description
 * The element that activates the hover card when hovered.
 * Automatically manages hover interactions and focus states.
 *
 * @example
 * ```tsx
 * <HoverCardTrigger className="text-accent-400 hover:text-accent-300">
 *   Hover for details
 * </HoverCardTrigger>
 * ```
 */
const HoverCardTrigger = HoverCardPrimitive.Trigger

/**
 * HoverCardContent - Content container for the hover card.
 *
 * @description
 * Popover content with glassmorphism styling and smooth animations.
 * Appears on hover with configurable delay, alignment, and positioning.
 *
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Smooth fade and zoom animations
 * - Automatic positioning with collision detection
 * - Focus management and keyboard navigation
 *
 * @example
 * ```tsx
 * <HoverCardContent align="start" sideOffset={8}>
 *   <div className="flex gap-4">
 *     <Avatar src="/user.jpg" />
 *     <div>
 *       <h4 className="font-semibold text-fg-DEFAULT">John Doe</h4>
 *       <p className="text-sm text-fg-muted">Software Engineer</p>
 *     </div>
 *   </div>
 * </HoverCardContent>
 * ```
 */
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      // Base styling
      'z-50 w-64 rounded-lg p-4 outline-none',
      // Glassmorphism
      'bg-glass-03 backdrop-blur-base',
      'border border-glass',
      'shadow-large',
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
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
