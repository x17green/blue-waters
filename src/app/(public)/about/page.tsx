'use client'

import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import {
  mdiFerry,
  mdiShieldCheck,
  mdiStarCircle,
  mdiAccountGroup,
  mdiMapMarker,
  mdiClockCheck,
  mdiTrophy,
  mdiHeartCircle,
  mdiWaves,
  mdiLeaf,
} from '@mdi/js'

import { BlueWatersWordmark } from '@/src/components/brand'

/**
 * About Us Page
 * Company information, mission, team, and values
 * 
 * Design System: Glassmorphism with brand storytelling
 * Referenced: Footer links across all layouts
 */
export default function AboutPage() {
  const stats = [
    { icon: mdiFerry, label: 'Active Vessels', value: '12+' },
    { icon: mdiMapMarker, label: 'Routes Covered', value: '25+' },
    { icon: mdiAccountGroup, label: 'Passengers Served', value: '50K+' },
    { icon: mdiTrophy, label: 'Years of Service', value: '8+' },
  ]

  const values = [
    {
      icon: mdiShieldCheck,
      title: 'Safety First',
      description: 'Your safety is our top priority. All vessels meet NIMASA standards with regular inspections.',
    },
    {
      icon: mdiStarCircle,
      title: 'Excellence',
      description: 'We strive for excellence in every journey, ensuring comfortable and professional service.',
    },
    {
      icon: mdiClockCheck,
      title: 'Reliability',
      description: 'Punctual departures and arrivals. We value your time and maintain strict schedules.',
    },
    {
      icon: mdiHeartCircle,
      title: 'Customer Care',
      description: '24/7 support and assistance. Your satisfaction drives everything we do.',
    },
    {
      icon: mdiWaves,
      title: 'Local Expertise',
      description: 'Deep knowledge of Bayelsa waterways with experienced local crew members.',
    },
    {
      icon: mdiLeaf,
      title: 'Sustainability',
      description: 'Committed to eco-friendly operations and protecting our waterways for future generations.',
    },
  ]

  const team = [
    {
      name: 'Chief Ebikeme Michael',
      role: 'Founder & Chief Executive',
      bio: 'With over 20 years of maritime experience, Chief Ebikeme founded Bayelsa Boat Club to revolutionize water transportation in Bayelsa State.',
    },
    {
      name: 'Capt. Tonye Owei',
      role: 'Head of Operations',
      bio: 'Licensed marine captain with 15 years on Nigerian waterways. Oversees all vessel operations and crew training.',
    },
    {
      name: 'Mrs. Sarah Alagoa',
      role: 'Customer Experience Director',
      bio: 'Dedicated to ensuring every passenger has a memorable journey. Leads our customer support and booking teams.',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-500 opacity-20 blur-3xl rounded-full" />
            <div className="relative glass-strong rounded-xl p-4">
              <BlueWatersWordmark size="lg" showText={false} priority />
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-fg">
          About Bayelsa Boat Club
        </h1>
        <p className="text-xl text-fg-muted max-w-3xl mx-auto">
          Connecting communities across Bayelsa State through safe, reliable, and comfortable water transportation.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass-subtle rounded-lg p-6 text-center space-y-2"
          >
            <Icon path={stat.icon} size={1.5} className="mx-auto text-accent-400" />
            <p className="text-3xl font-bold text-fg">{stat.value}</p>
            <p className="text-sm text-fg-muted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Our Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-subtle rounded-lg p-8 md:p-12 space-y-6"
      >
        <h2 className="text-3xl font-bold text-fg text-center mb-6">Our Story</h2>
        <div className="space-y-4 text-fg-muted text-lg leading-relaxed">
          <p>
            Founded in 2018, <span className="text-fg font-semibold">Bayelsa Boat Club</span> began with a simple
            mission: to provide the people of Bayelsa State with a safe, reliable, and modern alternative for water
            transportation.
          </p>
          <p>
            Our founder, Chief Ebikeme Michael, recognized the challenges faced by commuters traveling between
            Yenagoa, Port Harcourt, Brass, and other riverine communities. What started with two speedboats has grown
            into a fleet of modern vessels serving thousands of passengers every month.
          </p>
          <p>
            Today, we're proud to be the leading water transportation service in Bayelsa State, known for our
            commitment to safety, punctuality, and customer satisfaction. Every member of our team—from captains to
            customer service staff—shares the vision of making waterway travel comfortable, efficient, and accessible
            for everyone.
          </p>
          <p>
            We're not just a transport company; we're a community connector, bringing families together, supporting
            businesses, and contributing to the economic growth of our beloved Bayelsa State.
          </p>
        </div>
      </motion.div>

      {/* Our Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-fg text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="glass-subtle rounded-lg p-6 space-y-4 hover:glass-hover transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center">
                <Icon path={value.icon} size={1} className="text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-fg">{value.title}</h3>
              <p className="text-fg-muted">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leadership Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-fg text-center">Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="glass-subtle rounded-lg p-6 space-y-3"
            >
              {/* Avatar placeholder */}
              <div className="w-24 h-24 mx-auto rounded-full bg-accent-500/20 flex items-center justify-center">
                <Icon path={mdiAccountGroup} size={2} className="text-accent-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-fg">{member.name}</h3>
                <p className="text-sm text-accent-400 mb-3">{member.role}</p>
                <p className="text-sm text-fg-muted">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Certifications & Compliance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-subtle rounded-lg p-8 text-center space-y-4"
      >
        <Icon path={mdiShieldCheck} size={2} className="mx-auto text-success-400" />
        <h3 className="text-2xl font-bold text-fg">Certified & Compliant</h3>
        <p className="text-fg-muted max-w-2xl mx-auto">
          All our vessels are certified by the Nigerian Maritime Administration and Safety Agency (NIMASA).
          We maintain strict safety protocols, regular vessel inspections, and crew training to ensure the highest
          standards of maritime safety.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <div className="glass-strong rounded-lg px-6 py-3">
            <p className="text-sm text-fg-muted">Certified by</p>
            <p className="font-semibold text-fg">NIMASA</p>
          </div>
          <div className="glass-strong rounded-lg px-6 py-3">
            <p className="text-sm text-fg-muted">ISO Certified</p>
            <p className="font-semibold text-fg">9001:2015</p>
          </div>
          <div className="glass-strong rounded-lg px-6 py-3">
            <p className="text-sm text-fg-muted">Safety Rating</p>
            <p className="font-semibold text-success-400">5/5</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
