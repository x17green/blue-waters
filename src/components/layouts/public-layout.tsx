'use client'

import { motion } from 'framer-motion'
import { 
  mdiAnchor,
  mdiEmail,
  mdiFacebook,
  mdiInstagram,
  mdiLogin,
  mdiMapMarker,
  mdiPhone,
  mdiTwitter,
  mdiAccountPlus,
  mdiWaves
} from '@mdi/js'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode } from 'react'

import { BayelsaCoatOfArms, BlueWatersWordmark, MinistryBlueSeal, FooterLogoSuite } from '@/src/components/brand'
import { Button } from '@/src/components/ui/button'
import { Icon } from '@/src/components/ui/icon'
import { useAuth } from '@/src/hooks/use-auth'

/**
 * Public Layout Header
 * Glassmorphic navigation for public-facing pages
 */
function PublicHeader() {
  const { user, appUser } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#trips', label: 'Book Now' },
    { href: '/#how', label: 'How It Works' },
    { href: '/#testimonials', label: 'Reviews' },
  ]

  const isActive = (href: string) => pathname === href

  const handleDashboardClick = () => {
    if (!user || !appUser) return

    // Role-based routing
    if (appUser.role === 'operator' || appUser.role === 'staff' || appUser.role === 'admin') {
      router.push('/operator/dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <header className="sticky top-0 z-[var(--z-header)] glass backdrop-blur-[var(--blur-strong)] border-b border-border-subtle">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        {/* Partnership Logo Header - Per branding.md spec */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Ministry Seal - Left */}
          <div className="flex-shrink-0">
            <MinistryBlueSeal size="sm" priority />
          </div>

          {/* Blue Waters Wordmark - Center */}
          <Link href="/" className="flex-1 flex justify-center">
            <BlueWatersWordmark size="sm" />
          </Link>

          {/* Bayelsa Coat of Arms - Right */}
          <Link href="/" className="flex-shrink-0">
            <BayelsaCoatOfArms size="sm" priority />
          </Link>
        </div>

        {/* Navigation & Auth */}
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-accent-400'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Placeholder */}
          <div className="md:hidden flex-1" />

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <Button
                onClick={handleDashboardClick}
                className="glass-strong border border-accent-700 text-accent-300 hover:text-accent-200 hover:border-accent-600 transition-all duration-200"
              >
                <Icon path={mdiAnchor} size={0.6} className="mr-2" aria-hidden={true} />
                {appUser?.role === 'operator' || appUser?.role === 'staff' || appUser?.role === 'admin' 
                  ? 'Operator Portal' 
                : 'My Dashboard'}
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="ghost"
                  className="text-accent-400 hover:text-accent-300 hover:bg-glass-01"
                >
                  <Icon path={mdiLogin} size={0.6} className="mr-2" aria-hidden={true} />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-accent-600 text-white hover:bg-accent-500 border border-accent-700 shadow-lg shadow-accent-900/30 transition-all duration-200">
                  <Icon path={mdiAccountPlus} size={0.6} className="mr-2" aria-hidden={true} />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
        </div>
      </nav>
    </header>
  )
}

/**
 * Public Layout Footer
 * Professional footer with contact info and links
 */
function PublicFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'How It Works', href: '/#how' },
      { label: 'Safety Guidelines', href: '/safety' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cancellation Policy', href: '/cancellation' },
    ],
    services: [
      { label: 'Book a Trip', href: '/book' },
      { label: 'Search Routes', href: '/search' },
      { label: 'Popular Destinations', href: '/#trips' },
      { label: 'Operator Portal', href: '/login' },
    ],
  }

  return (
    <footer className="glass border-t border-border-subtle mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <BlueWatersWordmark size="sm" showText={true} />
            </div>
            <p className="text-sm text-fg-muted mb-4 leading-relaxed">
              Safe, reliable, and affordable boat booking across Bayelsa waterways. 
              Experience the beauty of water travel.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-fg-muted">
                <Icon path={mdiMapMarker} size={0.6} className="mt-0.5 text-accent-500" aria-hidden={true} />
              <span>Ministry of Marine and Blue Economy<br />Yenagoa, Bayelsa State</span>
              </div>
              <div className="flex items-center gap-2 text-fg-muted">
                <Icon path={mdiPhone} size={0.6} className="text-accent-500" aria-hidden={true} />
                <span>+234 800 BLUE WATERS</span>
              </div>
              <div className="flex items-center gap-2 text-fg-muted">
                <Icon path={mdiEmail} size={0.6} className="text-accent-500" aria-hidden={true} />
                <span>support@bluewaters.gov.ng</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-fg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-accent-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-fg mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-accent-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold text-fg mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-accent-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-subtle">
          {/* Ministry Seal - Per branding.md spec */}
          <div className="mb-6 flex justify-center">
            <FooterLogoSuite />
          </div>

          {/* Copyright & Social */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-fg-muted">
              © {currentYear} Blue Waters. Ministry of Marine and Blue Economy, Bayelsa State. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-subtle p-2 rounded-full hover:glass-strong transition-all duration-200 group"
              aria-label="Facebook"
            >
              <Icon path={mdiFacebook} size={0.8} className="text-fg-muted group-hover:text-accent-400 transition-colors duration-200" aria-hidden={true} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-subtle p-2 rounded-full hover:glass-strong transition-all duration-200 group"
              aria-label="Twitter"
            >
              <Icon path={mdiTwitter} size={0.8} className="text-fg-muted group-hover:text-accent-400 transition-colors duration-200" aria-hidden={true} />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-subtle p-2 rounded-full hover:glass-strong transition-all duration-200 group"
              aria-label="Instagram"
            >
              <Icon path={mdiInstagram} size={0.8} className="text-fg-muted group-hover:text-accent-400 transition-colors duration-200" aria-hidden={true} />
            </Link>
          </div>
        </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * Public Layout
 * 
 * Main layout wrapper for public-facing pages (home, about, etc.)
 * Features:
 * - Role-aware navigation (shows dashboard link based on user role)
 * - Glassmorphic header with sticky positioning
 * - Professional footer with links and contact info
 * - Design system aligned with dark glassmorphism theme
 */
export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-900 to-[var(--bg-950)] text-fg">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
