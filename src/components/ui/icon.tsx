/**
 * Icon Component - Bayelsa Boat Club Design System
 * 
 * Wrapper for Pictogrammers (Material Design Icons) with design token integration.
 * Replaces Lucide React icons for consistent, accessible, government-appropriate iconography.
 * 
 * @accessibility
 * - Use `aria-hidden="true"` for decorative icons with visible text
 * - Use `aria-label` for icon-only buttons
 * - Use semantic wrappers (`role="status"`) for status indicators
 * 
 * @example Decorative Icon (with text)
 * ```tsx
 * <button>
 *   <Icon path={mdiTicket} size={0.8} aria-hidden="true" />
 *   <span>Book now</span>
 * </button>
 * ```
 * 
 * @example Icon-Only Button
 * ```tsx
 * <button aria-label="Close modal">
 *   <Icon path={mdiClose} size={1} />
 * </button>
 * ```
 * 
 * @example Status Indicator
 * ```tsx
 * <div role="status" aria-label="Booking confirmed">
 *   <Icon path={mdiCheck} size={1} className="text-success-500" aria-hidden="true" />
 *   <span>Confirmed</span>
 * </div>
 * ```
 */

import IconBase from '@mdi/react';
import { type ComponentProps } from 'react';

interface IconProps extends Omit<ComponentProps<typeof IconBase>, 'path'> {
  /** 
   * MDI icon path from @mdi/js
   * @example mdiCalendar, mdiMapMarker, mdiFerry
   */
  path: string;
  
  /** 
   * Icon size in rem units
   * - 0.6 (15px) — Small inline icons
   * - 0.8 (20px) — Default text icons
   * - 1 (24px) — Primary action icons
   * - 1.33 (32px) — Feature tile icons
   * - 2 (48px) — Hero graphics
   */
  size?: number;
  
  /** 
   * Additional CSS classes (use design tokens)
   * @example "text-accent-500", "text-muted-100"
   */
  className?: string;
  
  /** 
   * ARIA label (required for icon-only buttons)
   */
  'aria-label'?: string;
  
  /** 
   * Hide from screen readers (when text is present)
   * @default false
   */
  'aria-hidden'?: boolean;
}

export function Icon({
  path,
  size = 0.8,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  ...props
}: IconProps) {
  return (
    <IconBase
      path={path}
      size={size}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
}
