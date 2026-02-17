/**
 * Button Component Showcase
 * 
 * Demonstrates all Button variants with glassmorphism dark matte theme.
 * Use this component for testing and visual QA.
 * 
 * Design: docs/design-architecture.md#8-component-system--buttons
 */

'use client'

import * as React from 'react'

import ButtonWithCompounds, { type ButtonComponent } from '@/src/components/ui/button'

// Use the properly typed Button with compound components
const Button = ButtonWithCompounds as ButtonComponent

/**
 * Material Design Icons (Pictogrammers)
 * Using inline SVG for demonstration - in production, use @mdi/react
 */
const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const IconDownload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
)

const IconTrash = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const IconArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

export default function ButtonShowcase() {
  const [isLoading, setIsLoading] = React.useState(false)

  const simulateLoadingAction = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-bg-900 p-8 space-y-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-fg mb-2">
          Button Component Showcase
        </h1>
        <p className="text-fg-muted text-lg">
          Glassmorphism dark matte theme with accessibility features
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Primary Variant */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Primary Variant</h2>
            <p className="text-fg-muted text-sm">
              Solid accent with glass reflection overlay. Use for main CTAs.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 p-6 bg-bg-800 rounded-lg border border-border-subtle">
            <Button variant="primary" size="sm">Small Primary</Button>
            <Button variant="primary">Default Primary</Button>
            <Button variant="primary" size="lg">Large Primary</Button>
            <Button variant="primary" size="xl">Extra Large Primary</Button>
          </div>
          
          <div className="flex flex-wrap gap-4 p-6 bg-bg-800 rounded-lg border border-border-subtle">
            <Button variant="primary" startIcon={<IconPlus />}>
              Add Booking
            </Button>
            <Button variant="primary" endIcon={<IconArrowRight />}>
              Continue
            </Button>
            <Button variant="primary" isLoading={isLoading} onClick={simulateLoadingAction}>
              {isLoading ? 'Processing...' : 'Submit Payment'}
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </section>

        {/* Glass Variant */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Glass Variant</h2>
            <p className="text-fg-muted text-sm">
              Prominent glassmorphism with backdrop blur. Perfect for elevated cards.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 p-6 bg-bg-800 rounded-lg border border-border-subtle">
            <Button variant="glass" size="sm">Small Glass</Button>
            <Button variant="glass">Default Glass</Button>
            <Button variant="glass" size="lg">Large Glass</Button>
            <Button variant="glass" startIcon={<IconDownload />}>
              Download Manifest
            </Button>
          </div>
        </section>

        {/* Secondary Variant */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Secondary Variant</h2>
            <p className="text-fg-muted text-sm">
              Subtle glass with muted accent. Secondary actions.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 p-6 bg-bg-800 rounded-lg border border-border-subtle">
            <Button variant="secondary">Cancel</Button>
            <Button variant="secondary" size="lg">View Details</Button>
            <Button variant="secondary" startIcon={<IconHeart />}>
              Save for Later
            </Button>
            <Button variant="secondary" disabled>
              Unavailable
            </Button>
          </div>
        </section>

        {/* Outline & Ghost */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Outline & Ghost</h2>
            <p className="text-fg-muted text-sm">
              Minimal styles for tertiary actions.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 p-6 bg-bg-800 rounded-lg border border-border-subtle">
            <Button variant="outline">Outline Button</Button>
            <Button variant="outline" size="sm">Small Outline</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="ghost" size="lg">Large Ghost</Button>
          </div>
        </section>

        {/* Danger Variants */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Danger Variants</h2>
            <p className="text-fg-muted text-sm">
              Destructive actions requiring confirmation. Danger-soft for muted warnings.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 p-6 bg-bg-800 rounded-lg border border-border-subtle">
            <Button variant="danger" startIcon={<IconTrash />}>
              Delete Booking
            </Button>
            <Button variant="danger-soft" startIcon={<IconTrash />}>
              Cancel Reservation
            </Button>
            <Button variant="danger" size="lg">
              Void Transaction
            </Button>
            <Button variant="danger" disabled>
              Cannot Delete
            </Button>
          </div>
        </section>

        {/* Link Variant */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Link Variant</h2>
            <p className="text-fg-muted text-sm">
              Styled as inline link with underline on hover.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 p-6 bg-bg-800 rounded-lg border border-border-subtle">
            <Button variant="link">Learn more</Button>
            <Button variant="link" size="sm">Terms & Conditions</Button>
            <Button variant="link" endIcon={<IconArrowRight />}>
              View full schedule
            </Button>
          </div>
        </section>

        {/* Icon-only Buttons */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Icon-Only Buttons</h2>
            <p className="text-fg-muted text-sm">
              Square aspect ratio for toolbar actions.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 p-6 bg-bg-800 rounded-lg border border-border-subtle items-center">
            <Button variant="primary" size="icon-sm" aria-label="Add item">
              <IconPlus />
            </Button>
            <Button variant="primary" size="icon" aria-label="Add item">
              <IconPlus />
            </Button>
            <Button variant="primary" size="icon-lg" aria-label="Add item">
              <IconPlus />
            </Button>
            
            <div className="w-px h-10 bg-border-subtle" />
            
            <Button variant="glass" size="icon" aria-label="Download">
              <IconDownload />
            </Button>
            <Button variant="secondary" size="icon" aria-label="Favorite">
              <IconHeart />
            </Button>
            <Button variant="danger" size="icon" aria-label="Delete">
              <IconTrash />
            </Button>
            <Button variant="ghost" size="icon" aria-label="More options">
              <IconArrowRight />
            </Button>
          </div>
        </section>

        {/* Compound Pattern */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Compound Pattern</h2>
            <p className="text-fg-muted text-sm">
              Explicit control with Button.Icon and Button.Label components.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 p-6 bg-bg-800 rounded-lg border border-border-subtle">
            <Button variant="primary">
              <Button.Icon>
                <IconDownload />
              </Button.Icon>
              <Button.Label>Download Report</Button.Label>
            </Button>
            
            <Button variant="glass" size="lg">
              <Button.Label>Proceed to Checkout</Button.Label>
              <Button.Icon>
                <IconArrowRight />
              </Button.Icon>
            </Button>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Accessibility Features</h2>
            <p className="text-fg-muted text-sm">
              Built-in ARIA attributes, keyboard focus rings, reduced motion support.
            </p>
          </div>
          
          <div className="space-y-4 p-6 bg-bg-800 rounded-lg border border-border-subtle">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">
                Tab to focus (2px ring on accent-400)
              </Button>
              <Button variant="glass">
                Press Enter or Space
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" disabled aria-label="Booking unavailable, please check availability">
                Disabled with aria-label
              </Button>
              <Button variant="primary" aria-pressed="true">
                Toggle Button (aria-pressed)
              </Button>
            </div>
            
            <p className="text-fg-muted text-sm mt-4">
              ✓ Focus visible rings (WCAG 2.4.7)<br />
              ✓ Color contrast &gt;= 4.5:1 (WCAG 1.4.3)<br />
              ✓ Prefers-reduced-motion support<br />
              ✓ Screen reader accessible labels
            </p>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-fg mb-1">Real-World Examples</h2>
            <p className="text-fg-muted text-sm">
              Common button groups from Bayelsa Boat Club booking flow.
            </p>
          </div>
          
          {/* Booking CTA */}
          <div className="p-6 bg-bg-800 rounded-lg border border-border-subtle space-y-4">
            <h3 className="text-lg font-medium text-fg">Booking Confirmation</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="lg">
                Cancel
              </Button>
              <Button variant="primary" size="lg" startIcon={<IconArrowRight />}>
                Confirm & Pay
              </Button>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="p-6 bg-bg-800 rounded-lg border border-border-subtle space-y-4">
            <h3 className="text-lg font-medium text-fg">Operator Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="glass" startIcon={<IconDownload />}>
                Export Manifest
              </Button>
              <Button variant="secondary">
                Edit Details
              </Button>
              <Button variant="danger-soft" startIcon={<IconTrash />}>
                Cancel Booking
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
