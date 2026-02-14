'use client'

import { Icon } from '@/src/components/ui/icon'
import { mdiAlertCircle, mdiCheckCircle, mdiEye, mdiEyeOff, mdiLock, mdiEmail, mdiMagnify, mdiAccount } from '@mdi/js'
import * as React from 'react'


import { Input } from '@/src/components/ui/input'

/**
 * Input Component Showcase
 * 
 * Comprehensive demonstration of glassmorphism Input component
 * with all variants, sizes, states, and features.
 */
export default function InputShowcase() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-950 to-bg-900 p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-fg">Input Component Showcase</h1>
          <p className="text-lg text-fg-muted">
            Glassmorphism dark-first design system • Full accessibility • WCAG AA compliant
          </p>
        </div>

        {/* Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Primary (Default)</h3>
              <Input
                variant="primary"
                placeholder="Enter your email..."
                startIcon={<Icon path={mdiEmail} size={0.6} aria-hidden={true} />}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Glass</h3>
              <Input
                variant="glass"
                placeholder="Search trips..."
                startIcon={<Icon path={mdiMagnify} size={0.6} aria-hidden={true} />}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Bordered</h3>
              <Input
                variant="bordered"
                placeholder="Username"
                startIcon={<Icon path={mdiAccount} size={0.6} aria-hidden={true} />}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Flat</h3>
              <Input
                variant="flat"
                placeholder="Flat input style"
              />
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Sizes</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Small (sm)</h3>
              <Input
                size="sm"
                placeholder="Small input"
                startIcon={<Icon path={mdiMagnify} size={0.5} aria-hidden={true} />}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Medium (md) - Default</h3>
              <Input
                size="md"
                placeholder="Medium input"
                startIcon={<Icon path={mdiEmail} size={0.6} aria-hidden={true} />}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Large (lg)</h3>
              <Input
                size="lg"
                placeholder="Large input"
                startIcon={<Icon path={mdiAccount} size={0.8} aria-hidden={true} />}
              />
            </div>
          </div>
        </section>

        {/* Validation States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Validation States</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Default</h3>
              <Input
                placeholder="Enter text..."
                helperText="This is a helper text"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Success</h3>
              <Input
                validation="success"
                placeholder="Valid email"
                defaultValue="user@example.com"
                startIcon={<Icon path={mdiEmail} size={0.6} aria-hidden={true} />}
                endIcon={<Icon path={mdiCheckCircle} size={0.6} className="text-success-500" aria-hidden={true} />}
                successMessage="Email is valid"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Error</h3>
              <Input
                validation="error"
                placeholder="Enter email"
                defaultValue="invalid-email"
                startIcon={<Icon path={mdiEmail} size={0.6} aria-hidden={true} />}
                endIcon={<Icon path={mdiAlertCircle} size={0.6} className="text-error-500" aria-hidden={true} />}
                errorMessage="Please enter a valid email address"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Warning</h3>
              <Input
                validation="warning"
                placeholder="Enter password"
                type="password"
                startIcon={<Icon path={mdiLock} size={0.6} aria-hidden={true} />}
                helperText="Password should be at least 8 characters"
              />
            </div>
          </div>
        </section>

        {/* With Label */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">With Labels & Helper Text</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              startIcon={<Icon path={mdiEmail} size={0.6} aria-hidden={true} />}
              helperText="We'll never share your email with anyone"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              required
              startIcon={<Icon path={mdiLock} size={0.6} aria-hidden={true} />}
              helperText="Must be at least 8 characters"
            />

            <Input
              label="Full Name"
              placeholder="John Doe"
              startIcon={<Icon path={mdiAccount} size={0.6} aria-hidden={true} />}
              successMessage="Name looks good!"
            />

            <Input
              label="Phone Number"
              placeholder="+234 800 000 0000"
              errorMessage="Invalid phone number format"
            />
          </div>
        </section>

        {/* Interactive States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Interactive States</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Disabled</h3>
              <Input
                disabled
                placeholder="Disabled input"
                defaultValue="Cannot edit this"
                startIcon={<Icon path={mdiLock} size={0.6} aria-hidden={true} />}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Loading</h3>
              <Input
                isLoading
                placeholder="Loading..."
                defaultValue="Processing..."
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Read-only</h3>
              <Input
                readOnly
                placeholder="Read-only input"
                defaultValue="You can copy but not edit"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Required</h3>
              <Input
                label="Required Field"
                required
                placeholder="This field is required"
              />
            </div>
          </div>
        </section>

        {/* Icon Combinations */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Icon Combinations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Start Icon Only</h3>
              <Input
                placeholder="Search anything..."
                startIcon={<Icon path={mdiMagnify} size={0.6} aria-hidden={true} />}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">End Icon Only</h3>
              <Input
                placeholder="Enter amount"
                type="number"
                endIcon={<span className="text-xs text-fg-subtle">NGN</span>}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Both Icons</h3>
              <Input
                placeholder="user@example.com"
                type="email"
                startIcon={<Icon path={mdiEmail} size={0.6} aria-hidden={true} />}
                endIcon={<Icon path={mdiCheckCircle} size={0.6} className="text-success-500" aria-hidden={true} />}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">No Icons</h3>
              <Input
                placeholder="Plain input without icons"
              />
            </div>
          </div>
        </section>

        {/* Real-world Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Real-world Examples</h2>
          
          <div className="space-y-6">
            {/* Search bar */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Search Bar</h3>
              <Input
                variant="glass"
                size="lg"
                placeholder="Search for boat trips, destinations..."
                startIcon={<Icon path={mdiMagnify} size={0.8} aria-hidden={true} />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                endIcon={
                  searchValue && (
                    <button
                      type="button"
                      onClick={() => setSearchValue('')}
                      className="text-fg-subtle hover:text-fg transition-colors"
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )
                }
              />
            </div>

            {/* Password with toggle */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Password Toggle</h3>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                startIcon={<Icon path={mdiLock} size={0.6} aria-hidden={true} />}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-fg-subtle hover:text-fg transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <Icon path={mdiEyeOff} size={0.6} aria-hidden={true} />
                    ) : (
                      <Icon path={mdiEye} size={0.6} aria-hidden={true} />
                    )}
                  </button>
                }
                helperText="At least 8 characters with one uppercase and one number"
              />
            </div>

            {/* Email with validation */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Email Validation</h3>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                required
                startIcon={<Icon path={mdiEmail} size={0.6} aria-hidden={true} />}
                successMessage="This email is available"
              />
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Amount Input</h3>
              <Input
                label="Booking Amount"
                type="number"
                placeholder="0.00"
                startIcon={<span className="text-sm font-medium text-fg-subtle">₦</span>}
                helperText="Total amount for this booking"
              />
            </div>
          </div>
        </section>

        {/* Form Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Complete Form Example</h2>
          
          <div className="rounded-lg bg-bg-800/50 p-6 space-y-6 border border-border-subtle">
            <h3 className="text-lg font-semibold text-fg">Booking Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                startIcon={<Icon path={mdiAccount} size={0.6} aria-hidden={true} />}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                startIcon={<Icon path={mdiEmail} size={0.6} aria-hidden={true} />}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+234 800 000 0000"
                required
              />

              <Input
                label="Number of Passengers"
                type="number"
                placeholder="1"
                min="1"
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-bg-700 text-fg hover:bg-bg-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-accent-600 text-fg hover:bg-accent-500 transition-colors"
              >
                Submit Booking
              </button>
            </div>
          </div>
        </section>

        {/* Accessibility Information */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Accessibility Features</h2>
          
          <div className="rounded-lg bg-bg-800/50 p-6 space-y-4 border border-border-subtle">
            <ul className="space-y-2 text-sm text-fg-muted">
              <li className="flex items-start gap-2">
                <Icon path={mdiCheckCircle} size={0.6} className="text-success-500 mt-0.5 shrink-0" aria-hidden={true} />
                <span>Proper label association with htmlFor and id attributes</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon path={mdiCheckCircle} size={0.6} className="text-success-500 mt-0.5 shrink-0" aria-hidden={true} />
                <span>aria-invalid for error states</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon path={mdiCheckCircle} size={0.6} className="text-success-500 mt-0.5 shrink-0" aria-hidden={true} />
                <span>aria-describedby linking to helper text and error messages</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon path={mdiCheckCircle} size={0.6} className="text-success-500 mt-0.5 shrink-0" aria-hidden={true} />
                <span>aria-label for required fields</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon path={mdiCheckCircle} size={0.6} className="text-success-500 mt-0.5 shrink-0" aria-hidden={true} />
                <span>role="alert" for error messages</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon path={mdiCheckCircle} size={0.6} className="text-success-500 mt-0.5 shrink-0" aria-hidden={true} />
                <span>Keyboard navigation support</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon path={mdiCheckCircle} size={0.6} className="text-success-500 mt-0.5 shrink-0" aria-hidden={true} />
                <span>Focus indicators with proper contrast (WCAG 2.4.7)</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon path={mdiCheckCircle} size={0.6} className="text-success-500 mt-0.5 shrink-0" aria-hidden={true} />
                <span>Respects prefers-reduced-motion for animations</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon path={mdiCheckCircle} size={0.6} className="text-success-500 mt-0.5 shrink-0" aria-hidden={true} />
                <span>Icons marked as aria-hidden to prevent duplication</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
