'use client'

import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiFacebook, mdiInstagram, mdiLinkedin, mdiEmail, mdiMapMarker, mdiPhone, mdiTwitter } from '@mdi/js'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Platform: [
      { label: 'Search Trips', href: '/search' },
      { label: 'Book Now', href: '/book' },
      { label: 'My Bookings', href: '/bookings' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Safety Guidelines', href: '/safety' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Report Issue', href: '/report' },
      { label: 'Feedback', href: '/feedback' },
    ],
  }

  return (
    <footer className="bg-bg-900 text-fg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-400 flex items-center justify-center">
                <span className="text-2xl">⛵</span>
              </div>
              <span className="text-2xl font-bold">Bayelsa Boat Club</span>
            </div>
            <p className="text-fg-muted mb-6">
              Your trusted partner for safe, convenient, and affordable boat travel across Bayelsa waterways.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-fg-muted text-sm">
              <div className="flex items-center gap-2">
                <Icon path={mdiPhone} size={0.6} aria-hidden={true} />
                <a href="tel:+234800000000">+234 (0) 800-000-0000</a>
              </div>
              <div className="flex items-center gap-2">
                <Icon path={mdiEmail} size={0.6} aria-hidden={true} />
                <a href="mailto:info@bluewaters.com">info@bluewaters.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Icon path={mdiMapMarker} size={0.6} aria-hidden={true} />
                <span>Yenagoa, Bayelsa State, Nigeria</span>
              </div>
            </div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <h3 className="font-semibold text-lg mb-4 text-fg">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-fg-muted hover:text-accent-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-8 border-t border-border-subtle flex justify-center gap-6"
        >
          <a
            href="#"
            className="text-fg-muted hover:text-accent-400 transition-colors duration-200"
            aria-label="Facebook"
          >
            <Icon path={mdiFacebook} size={1} aria-hidden={true} />
          </a>
          <a
            href="#"
            className="text-fg-muted hover:text-accent-400 transition-colors duration-200"
            aria-label="Twitter"
          >
            <Icon path={mdiTwitter} size={1} aria-hidden={true} />
          </a>
          <a
            href="#"
            className="text-fg-muted hover:text-accent-400 transition-colors duration-200"
            aria-label="Instagram"
          >
            <Icon path={mdiInstagram} size={1} aria-hidden={true} />
          </a>
          <a
            href="#"
            className="text-fg-muted hover:text-accent-400 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <Icon path={mdiLinkedin} size={1} aria-hidden={true} />
          </a>
        </motion.div>

        {/* Copyright */}
        <div className="py-6 border-t border-border-subtle text-center text-fg-subtle text-sm">
          <p>
            © {currentYear} Bayelsa Boat Club. Ministry of Marine and Blue Economy. All rights reserved.
          </p>
          <p className="mt-2">
            Committed to safe, sustainable, and inclusive water transportation in Bayelsa.
          </p>
        </div>
      </div>
    </footer>
  )
}
