'use client'

import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiArrowRight } from '@mdi/js'
import Link from 'next/link'

import FeaturedTrips from '@/components/featured-trips'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import PublicLayout from '@/components/layouts/public-layout'
import Testimonials from '@/components/testimonials'
import { Button } from '@/components/ui/button'

/**
 * Home Page
 * Public-facing landing page with hero, featured trips, and CTAs
 * Uses PublicLayout for consistent navigation and footer
 */
export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <Hero />

      {/* Featured Trips */}
      <section id="trips" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-fg mb-4">
            Featured Journeys
          </h2>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
            Explore the most popular boat trips across the beautiful Bayelsa waterways
          </p>
        </motion.div>
        <FeaturedTrips />
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-900)] via-[var(--accent-800)] to-[var(--accent-900)] opacity-50" />
        <div className="absolute inset-0 glass-modal" />
        
        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-fg mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-fg-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              Book your boat trip today and experience the beauty of Bayelsa waterways. 
              Safe, reliable, and affordable.
            </p>
            <Link href="/book">
              <Button 
                size="lg"
                className="glass-strong border-2 border-accent-500 bg-accent-600 hover:bg-accent-500 text-white shadow-2xl shadow-accent-900/50 text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105"
              >
                Book Your Trip Now
                <Icon path={mdiArrowRight} size={0.8} className="ml-2" aria-hidden={true} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}
