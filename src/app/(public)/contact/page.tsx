'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import {
  mdiEmail,
  mdiPhoneInTalk,
  mdiMapMarker,
  mdiClockOutline,
  mdiSend,
  mdiCheckCircle,
  mdiFacebook,
  mdiTwitter,
  mdiInstagram,
  mdiWhatsapp,
} from '@mdi/js'

import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'

/**
 * Contact Page
 * Contact form and company contact information
 * 
 * Design System: Glassmorphism with form validation
 * Referenced: Footer links, help center
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 3000)

    // TODO: Implement actual contact form submission
    console.log('Contact form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const contactInfo = [
    {
      icon: mdiEmail,
      title: 'Email',
      primary: 'support@yenagoaboatclub.ng',
      secondary: 'info@yenagoaboatclub.ng',
      action: 'mailto:support@yenagoaboatclub.ng',
    },
    {
      icon: mdiPhoneInTalk,
      title: 'Phone',
      primary: '+234 907 080 7444',
      secondary: '+234 810 473 9334',
      action: 'tel:+2349070807444',
    },
    {
      icon: mdiMapMarker,
      title: 'Office',
      primary: 'Ox-Bow Lake Pavilion, Yenagoa',
      secondary: 'Bayelsa State, Nigeria',
      action: 'https://maps.app.goo.gl/34VZRC41bPtoCYC38',
    },
    {
      icon: mdiClockOutline,
      title: 'Hours',
      primary: 'Mon - Sat: 7:00 AM - 7:00 PM',
      secondary: 'Sunday: 8:00 AM - 5:00 PM',
      action: null,
    },
  ]

  const socialLinks = [
    { icon: mdiFacebook, label: 'Facebook', url: '#', color: 'text-accent-500' },
    { icon: mdiTwitter, label: 'Twitter', url: '#', color: 'text-accent-500' },
    { icon: mdiInstagram, label: 'Instagram', url: '#', color: 'text-accent-500' },
    { icon: mdiWhatsapp, label: 'WhatsApp', url: 'https://wa.me/2348104739334', color: 'text-accent-500' },
  ]

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-fg">Get in Touch</h1>
        <p className="text-xl text-fg-muted max-w-2xl mx-auto">
          Have a question or need assistance? We're here to help. Send us a message and we'll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="glass-subtle rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-fg mb-6">Send us a Message</h2>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Icon path={mdiCheckCircle} size={3} className="mx-auto mb-4 text-success-400" />
                <h3 className="text-2xl font-semibold text-fg mb-2">Message Sent!</h3>
                <p className="text-fg-muted">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 803 123 4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? (
                    <>
                      <Icon path={mdiSend} size={0.7} className="mr-2 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon path={mdiSend} size={0.7} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Contact Cards */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-subtle rounded-lg p-4 hover:glass-hover transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon path={info.icon} size={0.9} className="text-accent-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-fg mb-1">{info.title}</h3>
                    {info.action ? (
                      <a
                        href={info.action}
                        target={info.action.startsWith('http') ? '_blank' : undefined}
                        rel={info.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-accent-400 hover:text-accent-300 transition-colors block"
                      >
                        {info.primary}
                      </a>
                    ) : (
                      <p className="text-sm text-fg-muted">{info.primary}</p>
                    )}
                    <p className="text-xs text-fg-subtle mt-1">{info.secondary}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-subtle rounded-lg p-6"
          >
            <h3 className="font-semibold text-fg mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass-strong flex items-center justify-center hover:glass-hover transition-all duration-300"
                  aria-label={social.label}
                >
                  <Icon path={social.icon} size={0.9} className={social.color} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-subtle rounded-lg p-6 border-2 border-warning-500/30"
          >
            <h3 className="font-semibold text-warning-400 mb-2 flex items-center gap-2">
              <Icon path={mdiPhoneInTalk} size={0.8} />
              Emergency Contact
            </h3>
            <p className="text-sm text-fg-muted mb-3">
              For urgent matters or emergencies while traveling:
            </p>
            <a
              href="tel:+2348031234567"
              className="text-lg font-bold text-fg hover:text-accent-400 transition-colors"
            >
              +234 803 123 4567
            </a>
            <p className="text-xs text-fg-subtle mt-2">Available 24/7</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Map Section (Placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-subtle rounded-lg overflow-hidden"
      >
        <div className="h-64 md:h-96 bg-bg-800 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Icon path={mdiMapMarker} size={2} className="mx-auto text-accent-400" />
            <p className="text-fg-muted">
              Interactive map coming soon
            </p>
            <a
              href="https://maps.google.com/?q=Yenagoa+Central+Jetty"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="outline" size="sm">
                Open in Google Maps
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
