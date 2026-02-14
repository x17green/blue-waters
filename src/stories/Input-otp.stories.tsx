import type { Meta, StoryObj } from '@storybook/react'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/src/components/ui/input-otp'

/**
 * InputOTP - One-Time Password input component
 * 
 * Features:
 * - Glassmorphism slot design
 * - Auto-focus and auto-advance between slots
 * - Paste support (auto-fills all slots)
 * - Animated caret indicator
 * - Keyboard navigation
 */
const meta = {
  title: 'UI/Input OTP',
  component: InputOTP,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<typeof InputOTP>

/**
 * Default 6-digit OTP with separator (3-3 pattern)
 */
export const Default: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="otp-default" className="text-sm font-medium text-fg-DEFAULT">
        Enter verification code
      </label>
      <InputOTP id="otp-default" maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
}

/**
 * 4-digit PIN code (2-2 pattern)
 */
export const FourDigit: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="otp-pin" className="text-sm font-medium text-fg-DEFAULT">
        Enter PIN
      </label>
      <InputOTP id="otp-pin" maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
}

/**
 * Single group without separator (common for short codes)
 */
export const SingleGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="otp-single" className="text-sm font-medium text-fg-DEFAULT">
        Verification code
      </label>
      <InputOTP id="otp-single" maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
}

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="otp-disabled" className="text-sm font-medium text-fg-DEFAULT">
        Code (disabled)
      </label>
      <InputOTP id="otp-disabled" maxLength={6} disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
}
