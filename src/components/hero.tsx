'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Hero() {
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
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  // Search form state + suggestions (prefetch from /api/trips like TripsPage)
  const router = useRouter()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [fromOptions, setFromOptions] = useState<string[]>([])
  const [toOptions, setToOptions] = useState<string[]>([])
  const [optionsLoading, setOptionsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadOptions = async () => {
      try {
        setOptionsLoading(true)
        const today = new Date()
        const startIso = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).toISOString()
        const end = new Date(startIso)
        end.setUTCDate(end.getUTCDate() + 6)
        const endIso = end.toISOString()

        const res = await fetch(`/api/trips?includeSchedules=true&limit=50&startDate=${encodeURIComponent(startIso)}&endDate=${encodeURIComponent(endIso)}`)
        if (!res.ok) return
        const json = await res.json()
        const trips = json.trips || []

        const fromSet = new Set<string>()
        const toSet = new Set<string>()
        trips.forEach((t: any) => {
          if (t.departurePort) fromSet.add(t.departurePort)
          if (t.arrivalPort) toSet.add(t.arrivalPort)
          ;(t.schedules || []).forEach((s: any) => {
            if (s.departurePort) fromSet.add(s.departurePort)
            if (s.arrivalPort) toSet.add(s.arrivalPort)
          })
        })

        if (mounted) {
          setFromOptions(Array.from(fromSet))
          setToOptions(Array.from(toSet))
        }
      } catch (err) {
        console.warn('Hero: failed to load search options', err)
      } finally {
        if (mounted) setOptionsLoading(false)
      }
    }

    loadOptions()
    return () => { mounted = false }
  }, [])

  const handleSearch = (e?: React.SyntheticEvent) => {
    e?.preventDefault()
    const qs = new URLSearchParams()
    if (from) qs.set('from', from)
    if (to) qs.set('to', to)
    if (date) qs.set('date', date)
    router.push(`/search${qs.toString() ? `?${qs.toString()}` : ''}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-50)] via-[var(--bg-100)] to-bg-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute top-20 left-10 w-72 h-72 bg-accent-600/20 rounded-full filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-accent-500/20 rounded-full filter blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold mb-6 text-fg"
        >
          <span>Sail Across</span>
          <br />
          <span className="bg-gradient-to-r from-accent-600 to-accent-400 bg-clip-text text-transparent">
            Bayelsa Waterways
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto"
        >
          Experience the safest, most convenient way to book and enjoy boat trips across beautiful Bayelsa. From scenic cruises to daily commutes, we've got your journey covered.
        </motion.p>

        {/* Search Section (API-backed suggestions; client navigation) */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl shadow-2xl p-6 md:p-8 border border-border max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-fg mb-2 block">From</label>
              <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-bg-600/50">
                <span className="text-accent-500 mr-2">📍</span>
                <input
                  list="from-options"
                  id="hero-from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Departure location"
                  className="w-full bg-transparent outline-none text-fg placeholder:text-fg-muted"
                />
                <datalist id="from-options">
                  {fromOptions.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-fg mb-2 block">To</label>
              <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-bg-600/50">
                <span className="text-accent-500 mr-2">📍</span>
                <input
                  list="to-options"
                  id="hero-to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Arrival location"
                  className="w-full bg-transparent outline-none text-fg placeholder:text-fg-muted"
                />
                <datalist id="to-options">
                  {toOptions.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-fg mb-2 block">Date</label>
              <input
                id="hero-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 bg-bg-600/50 text-fg outline-none focus:border-accent-500 transition-colors"
              />
            </div>
          </div>

          <button
            id="hero-search"
            className="inline-block w-full bg-gradient-to-r from-accent-600 to-accent-400 text-white text-lg font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all text-center"
            onClick={handleSearch}
          >
            Search Trips
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 mt-16 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-accent-500">10K+</div>
            <div className="text-fg-muted">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent-500">500+</div>
            <div className="text-fg-muted">Daily Trips</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent-500">100%</div>
            <div className="text-fg-muted">Safe & Verified</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-32 left-10 text-6xl opacity-40"
      >
        🌊
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-32 right-10 text-6xl opacity-40"
      >
        ⛵
      </motion.div>
    </section>
  )
}
