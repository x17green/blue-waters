'use client'

import { mdiCircleSmall } from '@mdi/js'
import { OTPInput, OTPInputContext } from 'input-otp'
import * as React from 'react'

import { Icon } from '@/src/components/ui/icon'
import { cn } from '@/src/lib/utils'

/**
 * InputOTP - One-Time Password input field component.
 *
 * @description
 * A secure input component for entering OTP codes (typically 4-6 digits).
 * Built on input-otp library with automatic focus management and paste support.
 *
 * Features:
 * - Glassmorphism slot design
 * - Auto-focus and auto-advance between slots
 * - Paste support (auto-fills all slots)
 * - Customizable slot count and grouping
 * - Animated caret indicator
 * - Keyboard navigation (Arrow keys, Backspace)
 *
 * @example
 * ```tsx
 * <InputOTP maxLength={6}>
 *   <InputOTPGroup>
 *     <InputOTPSlot index={0} />
 *     <InputOTPSlot index={1} />
 *     <InputOTPSlot index={2} />
 *   </InputOTPGroup>
 *   <InputOTPSeparator />
 *   <InputOTPGroup>
 *     <InputOTPSlot index={3} />
 *     <InputOTPSlot index={4} />
 *     <InputOTPSlot index={5} />
 *   </InputOTPGroup>
 * </InputOTP>
 * ```
 *
 * @see {@link https://input-otp.rodz.dev | input-otp Documentation}
 */
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      'flex items-center gap-2 has-[:disabled]:opacity-50',
      containerClassName,
    )}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
))
InputOTP.displayName = 'InputOTP'

/**
 * InputOTPGroup - Container for grouping OTP slots.
 *
 * @description
 * Groups multiple InputOTPSlot components together visually.
 * Use InputOTPSeparator between groups for visual distinction.
 */
const InputOTPGroup = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
))
InputOTPGroup.displayName = 'InputOTPGroup'

/**
 * InputOTPSlot - Individual OTP character slot.
 *
 * @description
 * Single slot for one OTP character with glassmorphism design.
 * Automatically manages focus state, caret animation, and character display.
 *
 * Features:
 * - Glassmorphism borders (border-glass)
 * - Active state with accent ring (ring-accent-400/30)
 * - Animated blinking caret
 * - Responsive sizing (h-10 w-10 = 40x40px)
 *
 * @param index - Zero-based index of the slot (required)
 */
const InputOTPSlot = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        // Base layout
        'relative flex h-10 w-10 items-center justify-center',
        // Typography
        'text-sm text-fg-DEFAULT',
        // Glassmorphism borders
        'border-y border-r border-glass',
        'first:rounded-l-md first:border-l last:rounded-r-md',
        // Active state with ring
        isActive && 'z-10 ring-4 ring-accent-400/30 ring-offset-4 ring-offset-bg-950',
        // Smooth transitions
        'transition-all duration-200',
        // Reduced motion
        'motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-fg-DEFAULT duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = 'InputOTPSlot'

/**
 * InputOTPSeparator - Visual separator between OTP slot groups.
 *
 * @description
 * Displays a dot icon to separate groups of OTP slots (e.g., 123 • 456).
 * Uses Pictogrammers mdiCircleSmall icon.
 */
const InputOTPSeparator = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Icon path={mdiCircleSmall} size={0.6} className="text-fg-muted" aria-hidden={true} />
  </div>
))
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
