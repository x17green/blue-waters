'use client'

import { motion } from 'framer-motion'
import { Icon } from '@/src/components/ui/icon'
import { mdiCheckCircle, mdiCreditCard, mdiMagnify, mdiFerry } from '@mdi/js'

const steps = [
  {
    icon: mdiMagnify,
    title: 'Search Trips',
    description: 'Browse available boat trips based on your route, date, and preferences',
    color: 'from-accent-600 to-accent-500',
  },
  {
    icon: mdiCheckCircle,
    title: 'Select & Book',
    description: 'Choose your preferred trip and secure your seats with just a few clicks',
    color: 'from-info-500 to-info-400',
  },
  {
    icon: mdiCreditCard,
    title: 'Make Payment',
    description: 'Pay securely using various payment methods including cards and mobile money',
    color: 'from-success-500 to-success-400',
  },
  {
    icon: mdiFerry,
    title: 'Set Sail',
    description: 'Check in at your designated time and enjoy your journey across the waters',
    color: 'from-accent-500 to-accent-400',
  },
]

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="how" className="py-20 px-4 md:px-8 bg-gradient-to-b from-bg-800 to-bg-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-accent-500 mb-4">How It Works</h2>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            Booking your next adventure is simple and straightforward
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-4"
        >
          {steps.map((step, index) => {
            const iconPath = step.icon
            return (
              <motion.div key={index} variants={itemVariants} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-1/2 w-full h-1 bg-gradient-to-r from-accent-500/50 to-transparent -z-10 transform translate-y-full" />
                )}

                <div className="h-full glass-subtle rounded-lg border border-border hover:shadow-lg transition-shadow p-6 text-center flex flex-col items-center justify-center">
                  {/* Step Number Circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon path={iconPath} size={1.33} className="text-white" aria-hidden={true} />
                  </motion.div>

                  <div className="absolute -top-4 -right-2 w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-bold text-accent-500 mb-2">{step.title}</h3>
                  <p className="text-fg-muted text-sm">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
