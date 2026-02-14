'use client'

import { Icon } from '@/src/components/ui/icon'
import { mdiChevronRight, mdiCalendar, mdiMapMarker, mdiFerry, mdiAccountGroup } from '@mdi/js'
import * as React from 'react'


import ButtonWithCompounds, { type ButtonComponent } from '@/src/components/ui/button'

// Use the properly typed Button with compound components
const Button = ButtonWithCompounds as ButtonComponent
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'

/**
 * Card Component Showcase
 * 
 * Comprehensive demonstration of glassmorphism Card component
 * with all variants, interactive states, and use cases.
 */
export default function CardShowcase() {
  const [clickedCard, setClickedCard] = React.useState<string | null>(null)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-950 to-bg-900 p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-fg">Card Component Showcase</h1>
          <p className="text-lg text-fg-muted">
            Glassmorphism dark-first design system • Layered depth • Full accessibility
          </p>
        </div>

        {/* Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Primary (Default)</h3>
              <Card variant="primary">
                <CardHeader>
                  <CardTitle>Primary Card</CardTitle>
                  <CardDescription>
                    Solid background with subtle glass overlay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Best for main content areas and important information.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Glass</h3>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Glass Card</CardTitle>
                  <CardDescription>
                    Full glassmorphism with backdrop blur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Creates depth and layering in your design.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Bordered</h3>
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>Bordered Card</CardTitle>
                  <CardDescription>
                    Outline style with minimal background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Subtle and elegant for secondary content.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Flat</h3>
              <Card variant="flat">
                <CardHeader>
                  <CardTitle>Flat Card</CardTitle>
                  <CardDescription>
                    Minimal style with subtle background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Clean and modern for contemporary layouts.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Elevated</h3>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>
                    Raised card with stronger shadow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Emphasizes important content with depth.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-fg-muted">Interactive</h3>
              <Card
                variant="interactive"
                isClickable
                onPress={() => alert('Card clicked!')}
              >
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>
                    Clickable with hover effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Click me! Includes keyboard navigation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Interactive Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Alpha', 'Beta', 'Gamma'].map((name) => (
              <Card
                key={name}
                isClickable
                onPress={() => setClickedCard(name)}
                variant={clickedCard === name ? 'elevated' : 'primary'}
              >
                <CardHeader>
                  <CardTitle>Card {name}</CardTitle>
                  <CardDescription>
                    {clickedCard === name ? 'Selected!' : 'Click to select'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {clickedCard === name
                      ? '✓ This card is active'
                      : 'Click to activate this card'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Real-world Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Real-world Examples</h2>
          
          {/* Trip Card */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fg">Trip Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="glass">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">Lagos to Port Harcourt</CardTitle>
                      <CardDescription>Express Ferry Service</CardDescription>
                    </div>
                    <Icon path={mdiFerry} size={0.8} className="text-accent-400" aria-hidden={true} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-fg-muted">
                    <Icon path={mdiCalendar} size={0.6} aria-hidden={true} />
                    <span>Feb 15, 2026 • 08:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-fg-muted">
                    <Icon path={mdiMapMarker} size={0.6} aria-hidden={true} />
                    <span>Tin Can Island - Rivers Terminal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-fg-muted">
                    <Icon path={mdiAccountGroup} size={0.6} aria-hidden={true} />
                    <span>12 seats available</span>
                  </div>
                  <div className="pt-2 border-t border-border-subtle">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-fg">₦15,000</span>
                      <span className="text-sm text-fg-subtle">per person</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    <Button.Label>Book Now</Button.Label>
                    <Button.Icon>
                      <Icon path={mdiChevronRight} size={0.6} aria-hidden={true} />
                    </Button.Icon>
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">Warri to Brass Island</CardTitle>
                      <CardDescription>Standard Ferry</CardDescription>
                    </div>
                    <Icon path={mdiFerry} size={0.8} className="text-accent-400" aria-hidden={true} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-fg-muted">
                    <Icon path={mdiCalendar} size={0.6} aria-hidden={true} />
                    <span>Feb 16, 2026 • 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-fg-muted">
                    <Icon path={mdiMapMarker} size={0.6} aria-hidden={true} />
                    <span>Warri Port - Brass Terminal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-fg-muted">
                    <Icon path={mdiAccountGroup} size={0.6} aria-hidden={true} />
                    <span>8 seats available</span>
                  </div>
                  <div className="pt-2 border-t border-border-subtle">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-fg">₦12,500</span>
                      <span className="text-sm text-fg-subtle">per person</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    <Button.Label>Book Now</Button.Label>
                    <Button.Icon>
                      <Icon path={mdiChevronRight} size={0.6} aria-hidden={true} />
                    </Button.Icon>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fg">Statistics Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card variant="bordered">
                <CardHeader className="pb-2">
                  <CardDescription>Total Bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-fg">1,284</p>
                  <p className="text-xs text-success-500 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader className="pb-2">
                  <CardDescription>Active Routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-fg">24</p>
                  <p className="text-xs text-fg-subtle mt-1">Across 6 terminals</p>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader className="pb-2">
                  <CardDescription>Revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-fg">₦28.4M</p>
                  <p className="text-xs text-success-500 mt-1">+8% from last month</p>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader className="pb-2">
                  <CardDescription>Customer Rating</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-fg">4.8</p>
                  <p className="text-xs text-fg-subtle mt-1">Based on 892 reviews</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Feature Card */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fg">Feature Showcase</h3>
            <Card variant="primary" className="max-w-2xl">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Book your boat trip in three simple steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-400 font-bold">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-fg">Search for trips</p>
                    <p className="text-sm text-fg-muted">
                      Enter your departure and destination points
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-400 font-bold">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-fg">Choose your seat</p>
                    <p className="text-sm text-fg-muted">
                      Select from available seats and add extras
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-400 font-bold">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-fg">Pay and board</p>
                    <p className="text-sm text-fg-muted">
                      Complete payment and receive your boarding pass
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="primary" className="w-full">
                  <Button.Label>Get Started</Button.Label>
                  <Button.Icon>
                    <Icon path={mdiChevronRight} size={0.6} aria-hidden={true} />
                  </Button.Icon>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Accessibility Information */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Accessibility Features</h2>
          
          <Card variant="glass" className="max-w-3xl">
            <CardHeader>
              <CardTitle>Built for Everyone</CardTitle>
              <CardDescription>
                Comprehensive accessibility support out of the box
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-fg-muted">
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Interactive cards support keyboard navigation (Enter/Space)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Proper ARIA roles for clickable cards (role="button")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Tab navigation support with visible focus indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Focus rings with proper contrast (WCAG 2.4.7)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Respects prefers-reduced-motion for animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Semantic HTML structure for screen readers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Compound component pattern for logical content hierarchy</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
