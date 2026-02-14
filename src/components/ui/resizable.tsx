'use client'

import * as ResizablePrimitive from 'react-resizable-panels'

import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiDragVertical } from '@mdi/js'

/**
 * ResizablePanelGroup - Container for resizable panels.
 *
 * @description
 * A flex container that holds resizable panels with drag handles.
 * Built on react-resizable-panels library with glassmorphism design.
 * Supports both horizontal and vertical layouts.
 *
 * Features:
 * - Horizontal or vertical layout (data-[panel-group-direction])
 * - Smooth drag interactions
 * - Maintains panel sizes in localStorage
 * - Keyboard accessible (Arrow keys to resize)
 * - Touch-friendly drag handles
 *
 * @example
 * ```tsx
 * <ResizablePanelGroup direction="horizontal" className="min-h-[200px] rounded-lg border border-glass">
 *   <ResizablePanel defaultSize={50}>
 *     <div className="flex h-full items-center justify-center p-6">
 *       <span className="font-semibold">Sidebar</span>
 *     </div>
 *   </ResizablePanel>
 *   <ResizableHandle withHandle />
 *   <ResizablePanel defaultSize={50}>
 *     <div className="flex h-full items-center justify-center p-6">
 *       <span className="font-semibold">Content</span>
 *     </div>
 *   </ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 *
 * @see {@link https://github.com/bvaughn/react-resizable-panels | react-resizable-panels}
 */
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className,
    )}
    {...props}
  />
)

/**
 * ResizablePanel - Individual resizable panel within a group.
 *
 * @description
 * A panel that can be resized by dragging the adjacent handle.
 * Use defaultSize prop to set initial size (percentage of parent).
 *
 * @example
 * ```tsx
 * <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
 *   Panel content
 * </ResizablePanel>
 * ```
 */
const ResizablePanel = ResizablePrimitive.Panel

/**
 * ResizableHandle - Draggable handle between panels.
 *
 * @description
 * Visual indicator and interaction point for resizing panels.
 * Glassmorphism design with optional grip icon.
 *
 * Features:
 * - Glassmorphism handle (glass-01 background)
 * - Optional grip icon for better visual affordance
 * - Focus ring for keyboard navigation
 * - Hover hit area (after pseudo-element)
 * - Responsive to direction (horizontal/vertical)
 *
 * @param withHandle - Show grip icon for better visual affordance
 */
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      // Base styling
      'relative flex w-px items-center justify-center',
      // Glassmorphism divider
      'bg-glass-01',
      // Hover hit area (after pseudo-element)
      'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
      // Focus ring
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-400/30 focus-visible:ring-offset-4 focus-visible:ring-offset-bg-950',
      // Vertical direction
      'data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full',
      'data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1',
      'data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2',
      'data-[panel-group-direction=vertical]:after:translate-x-0',
      // Rotate grip icon 90deg for vertical
      '[&[data-[panel-group-direction=vertical]>div]:rotate-90',
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-glass bg-glass-01">
        <Icon path={mdiDragVertical} size={0.4} className="text-fg-muted" aria-hidden={true} />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
