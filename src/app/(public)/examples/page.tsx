
// filepath: l:\home\projects\blue-waters\src\app\examples\page.tsx
'use client'

import Icon from '@mdi/react'
import { mdiChevronRight } from '@mdi/js'
import Link from 'next/link'
import * as React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

/**
 * Examples Hub
 * 
 * Central showcase page linking to all component examples
 * and utilities in the Bayelsa Boat Club design system.
 */
export default function ExamplesPage() {
    const examples = [
        {
            title: 'Input Components',
            description: 'Glassmorphism input fields with validation states, icons, sizes, and interactive features.',
            href: '/examples/input-showcase',
            icon: '📝',
            features: ['Text input', 'Password toggle', 'Validation states', 'Icons', 'Labels & helpers'],
        },
        {
            title: 'Button Components',
            description: 'Comprehensive button variants with different sizes, states, and icon combinations.',
            href: '/examples/button-showcase',
            icon: '🔘',
            features: ['Primary variant', 'Glass style', 'Icon buttons', 'Danger actions', 'Loading states'],
        },
        {
            title: 'Card Components',
            description: 'Card layouts for displaying content with multiple variants and interactive patterns.',
            href: '/examples/card-showcase',
            icon: '🎴',
            features: ['Trip cards', 'Stats cards', 'Interactive cards', 'Feature showcase', 'Elevated effects'],
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-bg-950 to-bg-900 p-8">
            <div className="mx-auto max-w-6xl space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-fg">Component Examples</h1>
                    <p className="text-lg text-fg-muted">
                        Explore the Bayelsa Boat Club design system with interactive component showcases
                    </p>
                </div>

                {/* Examples Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {examples.map((example) => (
                        <Link key={example.href} href={example.href}>
                            <Card
                                variant="interactive"
                                isClickable
                                className="h-full hover:shadow-lg transition-all"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="text-3xl">{example.icon}</div>
                                            <CardTitle className="text-xl">{example.title}</CardTitle>
                                            <CardDescription>{example.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-fg-subtle uppercase">Features included</p>
                                        <ul className="space-y-1">
                                            {example.features.map((feature) => (
                                                <li key={feature} className="text-sm text-fg-muted flex items-center gap-2">
                                                    <span className="text-accent-400">•</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-center gap-2 text-accent-400 font-medium text-sm pt-2">
                                        View Examples
                                        <Icon path={mdiChevronRight} size={0.6} aria-hidden={true} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Design System Info */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-fg">Design System Overview</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Glassmorphism Model</CardTitle>
                                <CardDescription>
                                    Dark-first design with frosted glass effects
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-fg-muted">
                                    All components feature glassmorphism with backdrop blur, semi-transparent backgrounds,
                                    and layered depth for a modern, sophisticated appearance.
                                </p>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Accessibility First</CardTitle>
                                <CardDescription>
                                    WCAG AA compliant components
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-fg-muted">
                                    Every component includes proper ARIA attributes, keyboard navigation, focus indicators,
                                    and screen reader support for inclusive user experiences.
                                </p>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Validation States</CardTitle>
                                <CardDescription>
                                    Success, error, and warning states
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-fg-muted">
                                    Comprehensive validation patterns with clear visual feedback, helper text,
                                    and error messages for user guidance.
                                </p>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Responsive Design</CardTitle>
                                <CardDescription>
                                    Mobile-first approach
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-fg-muted">
                                    All components are fully responsive with touch-friendly sizes, adaptive layouts,
                                    and consistent behavior across all devices.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Quick Reference */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-fg">Quick Reference</h2>

                    <div className="space-y-4">
                        <Card variant="bordered">
                            <CardHeader>
                                <CardTitle className="text-lg">Color Palette</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-fg-muted">
                                    <p><strong>Primary:</strong> Accent colors for CTAs and key interactions</p>
                                    <p><strong>Semantic:</strong> Success (green), Error (red), Warning (yellow)</p>
                                    <p><strong>Backgrounds:</strong> bg-950 to bg-700 for depth layering</p>
                                    <p><strong>Text:</strong> fg (primary), fg-muted (secondary), fg-subtle (tertiary)</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="bordered">
                            <CardHeader>
                                <CardTitle className="text-lg">Component Variants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-fg-muted">
                                    <p><strong>Primary:</strong> Default solid style for main content</p>
                                    <p><strong>Glass:</strong> Full glassmorphism with backdrop blur</p>
                                    <p><strong>Bordered:</strong> Outline style with minimal background</p>
                                    <p><strong>Flat:</strong> Simple flat design approach</p>
                                    <p><strong>Elevated:</strong> Raised with stronger shadow emphasis</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="bordered">
                            <CardHeader>
                                <CardTitle className="text-lg">Spacing & Sizing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-fg-muted">
                                    <p><strong>Sizes:</strong> sm, md (default), lg, xl for buttons and inputs</p>
                                    <p><strong>Icon Sizes:</strong> size-3.5, size-4, size-5 for visual hierarchy</p>
                                    <p><strong>Gaps:</strong> 2, 3, 4, 6 for consistent spacing</p>
                                    <p><strong>Padding:</strong> Scaled automatically with component sizes</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <div className="space-y-4 pt-8 border-t border-border-subtle">
                    <p className="text-sm text-fg-muted">
                        Built with React, TypeScript, and Tailwind CSS • Glassmorphism dark-first design system
                    </p>
                    <p className="text-xs text-fg-subtle">
                        Bayelsa Boat Club © 2026 • Design System v1.0
                    </p>
                </div>
            </div>
        </div>
    )
}