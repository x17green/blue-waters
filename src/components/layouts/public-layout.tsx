'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
  mdiMenu,
  mdiClose,
  mdiChevronRight
} from '@mdi/js'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useState } from 'react'

import { BayelsaCoatOfArms, BlueWatersWordmark, MinistryBlueSeal, FooterLogoSuite, PartnershipLogoHeader } from '@/src/components/brand'
import { Button } from '@/src/components/ui/button'
import { Icon } from '@/src/components/ui/icon'
import { useAuth } from '@/src/hooks/use-auth'

/**
 * Public Layout Header
 * World-class glassmorphic navigation for public-facing pages
 */
function PublicHeader() {
  const { user, appUser } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/trips', label: 'Book Now' },
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
    <header className="sticky top-0 z-[var(--z-header)] glass backdrop-blur-[var(--blur-strong)] border-b border-border-subtle shadow-lg shadow-bg-950/20">
      <nav className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Partnership Logo Header - Per branding.md spec */}
        <div className="flex items-center justify-between gap-4 py-3 border-b border-border-subtle/50">
          {/* Ministry Seal - Left */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <MinistryBlueSeal size="sm" priority />
          </motion.div>

          {/* Bayelsa Boat Club Wordmark - Center */}
          <Link href="/" className="flex-1 flex justify-center group">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="transition-transform duration-300"
            >
              <BlueWatersWordmark 
                size="sm" 
                className="uppercase text-center sm:text-md md:text-3xl lg:text-5xl font-bold" 
                subTextClassName="text-center sm:text-sm md:text-base lg:text-2xl text-accent-500" 
              />
            </motion.div>
          </Link>

          {/* Bayelsa Coat of Arms - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex-shrink-0 block hover:scale-105 transition-transform duration-300">
              <BayelsaCoatOfArms size="sm" priority />
            </Link>
          </motion.div>
        </div>

        {/* Navigation & Auth */}
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-250
                    ${
                      isActive(link.href)
                        ? 'text-accent-300'
                        : 'text-fg-muted hover:text-fg'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="publicActiveTab"
                      className="absolute inset-0 glass-strong rounded-lg border border-accent-900"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Navigation Placeholder */}
          <div className="md:hidden flex-1" />

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={handleDashboardClick}
                  className="glass-strong border border-accent-700 text-accent-300 hover:text-accent-200 hover:border-accent-600 hover:shadow-lg hover:shadow-accent-900/30 transition-all duration-200"
                >
                  <Icon path={mdiAnchor} size={0.6} className="mr-2" aria-hidden={true} />
                  <span className="hidden sm:inline">
                    {appUser?.role === 'operator' || appUser?.role === 'staff' || appUser?.role === 'admin' 
                      ? 'Operator Portal' 
                      : 'My Dashboard'}
                  </span>
                  <span className="sm:hidden">Dashboard</span>
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="hidden sm:block"
                >
                  <Link href="/login">
                    <Button 
                      variant="ghost"
                      className="text-accent-400 hover:text-accent-300 hover:bg-glass-01 transition-all duration-200"
                    >
                      <Icon path={mdiLogin} size={0.6} className="mr-2" aria-hidden={true} />
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <Link href="/signup">
                    <Button className="bg-accent-600 text-white hover:bg-accent-500 border border-accent-700 shadow-lg shadow-accent-900/30 hover:shadow-xl hover:shadow-accent-900/40 transition-all duration-200">
                      <Icon path={mdiAccountPlus} size={0.6} className="mr-2" aria-hidden={true} />
                      <span className="hidden sm:inline">Sign Up</span>
                      <span className="sm:hidden">Join</span>
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden glass-hover rounded-lg p-2 hover:bg-glass-02 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <Icon path={mdiClose} size={0.8} className="text-fg" aria-hidden={true} />
              ) : (
                <Icon path={mdiMenu} size={0.8} className="text-fg" aria-hidden={true} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border-subtle backdrop-blur-xl"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200 group
                    ${
                      isActive(link.href)
                        ? 'glass-strong text-accent-300 border border-accent-900'
                        : 'text-fg-muted hover:text-fg hover:bg-glass-01'
                    }
                  `}
                >
                  <span>{link.label}</span>
                  <Icon 
                    path={mdiChevronRight} 
                    size={0.6} 
                    className={`transition-transform duration-200 ${isActive(link.href) ? 'text-accent-400' : 'text-fg-subtle group-hover:translate-x-1'}`}
                    aria-hidden={true}
                  />
                </Link>
              ))}

              {/* Mobile Auth Section */}
              {!user && (
                <div className="pt-4 mt-4 border-t border-border-subtle space-y-2">
                  <Link href="/login" className="block">
                    <Button 
                      variant="ghost"
                      className="w-full justify-start text-accent-400 hover:text-accent-300 hover:bg-glass-01"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon path={mdiLogin} size={0.6} className="mr-2" aria-hidden={true} />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button 
                      className="w-full bg-accent-600 text-white hover:bg-accent-500 border border-accent-700 shadow-lg shadow-accent-900/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon path={mdiAccountPlus} size={0.6} className="mr-2" aria-hidden={true} />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/**
 * Public Layout Footer
 * World-class professional footer with refined glassmorphism and interactions
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

  const socialLinks = [
    { 
      platform: 'Facebook', 
      href: 'https://facebook.com', 
      icon: mdiFacebook,
      color: 'hover:text-blue-400' 
    },
    { 
      platform: 'Twitter', 
      href: 'https://twitter.com', 
      icon: mdiTwitter,
      color: 'hover:text-sky-400' 
    },
    { 
      platform: 'Instagram', 
      href: 'https://instagram.com', 
      icon: mdiInstagram,
      color: 'hover:text-pink-400' 
    },
  ]

  return (
    <footer className="glass border-t border-border-subtle mt-20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4 group">
              <BlueWatersWordmark 
                size="sm" 
                showText={true}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="text-sm text-fg-muted mb-6 leading-relaxed max-w-xs">
              Safe, reliable, and affordable boat booking across Bayelsa waterways. 
              Experience the beauty of water travel.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <motion.div 
                className="flex items-start gap-3 text-fg-muted group cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="glass-subtle rounded-lg p-1.5 group-hover:glass-strong transition-all duration-200">
                  <Icon path={mdiMapMarker} size={0.6} className="text-accent-500" aria-hidden={true} />
                </div>
                <span className="text-sm leading-relaxed">
                  Ministry of Marine and Blue Economy<br />
                  Yenagoa, Bayelsa State
                </span>
              </motion.div>
              
              <motion.a
                href="tel:+2348000000000"
                className="flex items-center gap-3 text-fg-muted hover:text-accent-400 group"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="glass-subtle rounded-lg p-1.5 group-hover:glass-strong transition-all duration-200">
                  <Icon path={mdiPhone} size={0.6} className="text-accent-500 group-hover:text-accent-400" aria-hidden={true} />
                </div>
                <span className="text-sm">+234 800 BAYELSABC</span>
              </motion.a>
              
              <motion.a
                href="mailto:support@bluewaters.gov.ng"
                className="flex items-center gap-3 text-fg-muted hover:text-accent-400 group"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="glass-subtle rounded-lg p-1.5 group-hover:glass-strong transition-all duration-200">
                  <Icon path={mdiEmail} size={0.6} className="text-accent-500 group-hover:text-accent-400" aria-hidden={true} />
                </div>
                <span className="text-sm">support@bluewaters.gov.ng</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-fg mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-accent-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Icon 
                      path={mdiChevronRight} 
                      size={0.5} 
                      className="text-fg-subtle group-hover:text-accent-400 group-hover:translate-x-1 transition-all duration-200" 
                      aria-hidden={true}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h3 className="font-semibold text-fg mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-accent-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Icon 
                      path={mdiChevronRight} 
                      size={0.5} 
                      className="text-fg-subtle group-hover:text-accent-400 group-hover:translate-x-1 transition-all duration-200" 
                      aria-hidden={true}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-fg mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-accent-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Icon 
                      path={mdiChevronRight} 
                      size={0.5} 
                      className="text-fg-subtle group-hover:text-accent-400 group-hover:translate-x-1 transition-all duration-200" 
                      aria-hidden={true}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-subtle">
          {/* Partnership Logos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="glass-subtle rounded-xl p-4 border border-border-subtle hover:glass-strong transition-all duration-300">
              <FooterLogoSuite />
            </div>
          </motion.div>

          {/* Copyright & Social */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm text-fg-muted text-center md:text-left"
            >
              © {currentYear} Bayelsa Boat Club. Ministry of Marine and Blue Economy, Bayelsa State. All rights reserved.
            </motion.p>

            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-3"
            >
              {socialLinks.map((social) => (
                <Link
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-subtle p-2.5 rounded-full hover:glass-strong transition-all duration-200 group"
                  aria-label={social.platform}
                >
                  <Icon 
                    path={social.icon} 
                    size={0.8} 
                    className={`text-fg-muted group-hover:scale-110 transition-all duration-200 ${social.color}`}
                    aria-hidden={true}
                  />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * Public Layout
 * 
 * World-class layout wrapper for public-facing pages
 * 
 * Features:
 * - Sophisticated glassmorphism with professional animations
 * - Role-aware navigation with dashboard access
 * - Mobile-responsive design with smooth transitions
 * - Partnership branding per branding.md specifications
 * - Refined hover states and micro-interactions
 * - Professional footer with enhanced contact section
 * - Strict adherence to design system tokens
 * - WCAG 2.1 AA accessibility compliance
 * 
 * Design System:
 * - Color tokens: Deep Ocean Blue, Muted Teal, Soft Gold
 * - Typography: Inter (primary), DM Sans (marketing)
 * - Glass effects: backdrop-blur with layered depth
 * - Animations: Smooth spring-based transitions
 */
export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-900 via-bg-950 to-bg-900 text-fg antialiased">
      <PublicHeader />
      <main className="relative">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
