'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '@mdi/react'
import {
  mdiHelpCircle,
  mdiChevronDown,
  mdiMagnify,
  mdiBookOpenVariant,
  mdiTicket,
  mdiCreditCard,
  mdiShieldCheck,
  mdiPhoneInTalk,
  mdiEmail,
  mdiClockOutline,
  mdiMapMarker,
  mdiAccountQuestion,
} from '@mdi/js'
import Link from 'next/link'

import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'

/**
 * Help Center / FAQ Page
 * Comprehensive help resources and frequently asked questions
 * 
 * Design System: Glassmorphism with accordion components
 * Referenced: Footer links, support mentions
 */

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const categories = [
    { id: 'booking', label: 'Booking & Tickets', icon: mdiTicket },
    { id: 'payment', label: 'Payment & Refunds', icon: mdiCreditCard },
    { id: 'safety', label: 'Safety & Travel', icon: mdiShieldCheck },
    { id: 'account', label: 'Account & Profile', icon: mdiAccountQuestion },
  ]

  const faqs: FAQItem[] = [
    {
      category: 'booking',
      question: 'How do I book a trip?',
      answer: `'You can book a trip by creating an account, searching for available trips, selecting your preferred departure time, and completing the payment process. You'll receive a confirmation email with your ticket and QR code.'`,
    },
    {
      category: 'booking',
      question: 'Can I cancel or modify my booking?',
      answer: 'Yes, you can cancel your booking up to 24 hours before departure for a full refund. Modifications depend on seat availability. Visit your dashboard to manage your bookings.',
    },
    {
      category: 'booking',
      question: 'How early should I arrive before departure?',
      answer: 'We recommend arriving at least 30 minutes before your scheduled departure time. This allows time for check-in, boarding, and safety briefings.',
    },
    {
      category: 'booking',
      question: 'What happens if I miss my scheduled departure?',
      answer: 'If you miss your departure, contact our customer support immediately. Depending on availability, we may be able to transfer you to the next available trip. No-show policies apply after 15 minutes past departure time.',
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept debit cards, credit cards, bank transfers, and USSD payments through our secure payment partner MetaTickets. All transactions are encrypted and secure.',
    },
    {
      category: 'payment',
      question: 'When will I receive my refund?',
      answer: 'Refunds are processed within 5-7 business days after cancellation approval. The amount will be credited to your original payment method.',
    },
    {
      category: 'payment',
      question: 'Are there any cancellation fees?',
      answer: 'Cancellations made 24+ hours before departure: Full refund. 12-24 hours: 50% refund. Less than 12 hours: No refund. Weather-related cancellations by us: Full refund.',
    },
    {
      category: 'payment',
      question: 'Can I get a receipt for my booking?',
      answer: 'Yes, a digital receipt is automatically sent to your email after payment confirmation. You can also download receipts from your dashboard under "My Bookings".',
    },
    {
      category: 'safety',
      question: 'Are your vessels certified and safe?',
      answer: 'Absolutely. All our vessels are certified by NIMASA (Nigerian Maritime Administration and Safety Agency) and undergo regular safety inspections. We maintain a 5-star safety rating.',
    },
    {
      category: 'safety',
      question: 'What safety equipment is provided?',
      answer: 'All passengers are provided with life jackets. Our vessels are equipped with first aid kits, fire extinguishers, emergency communication systems, and trained crew members.',
    },
    {
      category: 'safety',
      question: 'What items am I not allowed to bring?',
      answer: 'Prohibited items include: weapons, flammable materials, illegal substances, and oversized luggage. Each passenger is allowed one carry-on bag (max 15kg) and one personal item.',
    },
    {
      category: 'safety',
      question: 'What happens if there\'s bad weather?',
      answer: 'Safety is our priority. We monitor weather conditions closely. If conditions are unsafe, we\'ll cancel the trip and provide a full refund or reschedule at no extra cost.',
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" in the navigation menu, enter your email, create a password, and verify your email address. You can then start booking trips immediately.',
    },
    {
      category: 'account',
      question: 'I forgot my password. What should I do?',
      answer: `'Click "Forgot Password" on the login page, enter your email, and we\ 'll send you a password reset link. Follow the instructions in the email to create a new password.'`,
    },
    {
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Log in to your dashboard, go to "Profile", and click "Edit Profile". You can update your name, phone number, and other details. Email changes require verification.',
    },
    {
      category: 'account',
      question: 'Can I book for multiple passengers?',
      answer: 'Yes! During checkout, you can add passenger details for each ticket. All passengers will be included in the same booking with a single booking reference.',
    },
  ]

  // Filter FAQs
  const filteredFAQs = faqs.filter((faq) => {
    if (activeCategory && faq.category !== activeCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-500/20 mb-4">
          <Icon path={mdiHelpCircle} size={1.5} className="text-accent-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-fg">Help Center</h1>
        <p className="text-xl text-fg-muted max-w-2xl mx-auto">
          Find answers to common questions or contact our support team for assistance
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <Icon
            path={mdiMagnify}
            size={0.9}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted"
          />
          <Input
            type="search"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg"
          />
        </div>
      </motion.div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3"
      >
        <Button
          variant={activeCategory === null ? 'default' : 'ghost'}
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2"
        >
          <Icon path={mdiBookOpenVariant} size={0.6} />
          All Topics
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'ghost'}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className="flex items-center gap-2"
          >
            <Icon path={cat.icon} size={0.6} />
            {cat.label}
          </Button>
        ))}
      </motion.div>

      {/* FAQ List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto space-y-3"
      >
        {filteredFAQs.length === 0 ? (
          <div className="glass-subtle rounded-lg p-12 text-center">
            <Icon path={mdiMagnify} size={2} className="mx-auto mb-4 text-fg-muted opacity-50" />
            <h3 className="text-lg font-semibold text-fg mb-2">No results found</h3>
            <p className="text-fg-muted">
              Try different keywords or browse by category above.
            </p>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => {
            const isOpen = openFAQ === index
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="glass-subtle rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(isOpen ? null : index)}
                  className="w-full p-4 md:p-6 flex items-center justify-between text-left hover:glass-hover transition-all duration-250"
                >
                  <span className="text-lg font-semibold text-fg pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon path={mdiChevronDown} size={0.9} className="text-fg-muted" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-6 pb-4 md:pb-6 text-fg-muted border-t border-border-subtle pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </motion.div>

      {/* Contact Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-subtle rounded-lg p-8 md:p-12 text-center space-y-6"
      >
        <h2 className="text-2xl font-bold text-fg">Still need help?</h2>
        <p className="text-fg-muted max-w-2xl mx-auto">
          Our support team is here to assist you. Reach out through any of the following channels:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Link href="/contact">
            <div className="glass-strong rounded-lg p-6 hover:glass-hover transition-all duration-300 cursor-pointer">
              <Icon path={mdiEmail} size={1.5} className="mx-auto mb-3 text-accent-400" />
              <h3 className="font-semibold text-fg mb-1">Email Us</h3>
              <p className="text-sm text-fg-muted">support@yenagoaboatclub.ng</p>
              <p className="text-xs text-fg-subtle mt-2">Response within 24 hours</p>
            </div>
          </Link>

          <div className="glass-strong rounded-lg p-6">
            <Icon path={mdiPhoneInTalk} size={1.5} className="mx-auto mb-3 text-accent-400" />
            <h3 className="font-semibold text-fg mb-1">Call Us</h3>
            <p className="text-sm text-fg-muted">+234 803 123 4567</p>
            <p className="text-xs text-fg-subtle mt-2">Mon-Sat, 8am-6pm WAT</p>
          </div>

          <div className="glass-strong rounded-lg p-6">
            <Icon path={mdiClockOutline} size={1.5} className="mx-auto mb-3 text-accent-400" />
            <h3 className="font-semibold text-fg mb-1">Visit Us</h3>
            <p className="text-sm text-fg-muted">Yenagoa Central Jetty</p>
            <p className="text-xs text-fg-subtle mt-2">Mon-Sat, 7am-7pm</p>
          </div>
        </div>

        <Link href="/contact">
          <Button size="lg" className="mt-4">
            Contact Support
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
