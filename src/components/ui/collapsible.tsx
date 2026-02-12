'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

/**
 * Collapsible - Root component for creating collapsible sections.
 *
 * @description
 * A container that expands and collapses to show or hide content.
 * Built on Radix UI Collapsible primitive with keyboard support and smooth animations.
 *
 * @example
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger>Toggle Content</CollapsibleTrigger>
 *   <CollapsibleContent>
 *     Hidden content that expands/collapses
 *   </CollapsibleContent>
 * </Collapsible>
 * ```
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/collapsible | Radix UI Collapsible}
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * CollapsibleTrigger - Button that toggles the collapsible state.
 *
 * @description
 * Clickable element that controls the open/closed state of the Collapsible.
 * Automatically manages aria-expanded and aria-controls attributes.
 *
 * @example
 * ```tsx
 * <CollapsibleTrigger className="flex items-center gap-2">
 *   <ChevronDown className="transition-transform data-[state=open]:rotate-180" />
 *   Show Details
 * </CollapsibleTrigger>
 * ```
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * CollapsibleContent - Container for collapsible content.
 *
 * @description
 * Content area that expands/collapses with smooth animations.
 * Hidden when closed, visible when open. Supports data-[state] attributes for custom styling.
 *
 * @example
 * ```tsx
 * <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out">
 *   <div className="pt-4 space-y-2">
 *     <p>Collapsible content goes here</p>
 *   </div>
 * </CollapsibleContent>
 * ```
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
