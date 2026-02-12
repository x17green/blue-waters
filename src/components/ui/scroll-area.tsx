'use client'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * ScrollArea - Custom scrollable area with styled scrollbars.
 *
 * @description
 * A scrollable container with glassmorphism-styled scrollbars.
 * Provides a consistent scroll experience across browsers with custom styling.
 *
 * Features:
 * - Custom glassmorphism scrollbar design
 * - Smooth scrolling behavior
 * - Touch-friendly scroll controls
 * - Horizontal and vertical scrolling support
 *
 * @example
 * ```tsx
 * <ScrollArea className="h-[400px] w-full rounded-lg border border-glass">
 *   <div className="p-4">
 *     {longContent.map((item) => (
 *       <div key={item.id} className="py-2">{item.text}</div>
 *     ))}
 *   </div>
 * </ScrollArea>
 * ```
 *
 * @example
 * ```tsx
 * // Horizontal scrolling gallery
 * <ScrollArea className="w-full whitespace-nowrap">
 *   <div className="flex gap-4 p-4">
 *     {images.map((img) => (
 *       <img key={img.id} src={img.src} className="h-40 w-auto" />
 *     ))}
 *   </div>
 * </ScrollArea>
 * ```
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/scroll-area | Radix UI ScrollArea}
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

/**
 * ScrollBar - Custom styled scrollbar for ScrollArea.
 *
 * @description
 * Glassmorphism-styled scrollbar with smooth hover transitions.
 * Automatically handles orientation (vertical/horizontal) and positioning.
 *
 * Features:
 * - Glassmorphism thumb design with backdrop blur
 * - Hover state enhancement (glass-02)
 * - Touch-friendly sizing (2.5 = 10px)
 * - Smooth color transitions
 *
 * @example
 * Custom scrollbar is automatically included in ScrollArea component.
 * Use orientation prop to control scroll direction (vertical or horizontal).
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      // Base styling
      'flex touch-none select-none',
      // Smooth transitions
      'transition-colors duration-200',
      // Reduced motion
      'motion-reduce:transition-none',
      // Vertical orientation
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      // Horizontal orientation
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={cn(
        // Base styling
        'relative flex-1 rounded-full',
        // Glassmorphism
        'bg-glass-01 backdrop-blur-subtle',
        // Hover enhancement
        'hover:bg-glass-02',
        // Smooth transitions
        'transition-colors duration-200',
        // Reduced motion
        'motion-reduce:transition-none',
      )}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
