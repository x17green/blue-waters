'use client'

import { motion } from 'framer-motion'
import { mdiFerry, mdiAnchor, mdiShipWheel } from '@mdi/js'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Icon } from '@/src/components/ui/icon' 

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
        <motion.div variants={itemVariants} className="mb-6">
          <p className="text-sm uppercase tracking-widest text-accent-300 mb-3">Seamless bookings · Safe journeys</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-fg mb-4">Book fast. Sail better.</h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
            <Button href="/book" variant="primary" size="lg" startIcon={<Icon path={mdiFerry} size={0.9} aria-hidden />}>
              Book a Trip
            </Button>

            <Button href="/search?category=charter" variant="glass" size="lg" startIcon={<Icon path={mdiAnchor} size={0.9} aria-hidden />}>
              Book a Charter
            </Button>

            <Button href="/search?category=tour" variant="outline" size="lg" startIcon={<Icon path={mdiShipWheel} size={0.9} aria-hidden />}>
              Book a Cruise
            </Button>
          </div>
        </motion.div>

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
      </motion.div>

      {/* Floating scene (SVG + motion -> lightweight 3D-like float without adding three.js) */}
      <div style={{ perspective: 900 }} className="absolute inset-0 pointer-events-none">
        {/* soft floating wave blob */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute left-6 top-24 w-72 h-72 filter blur-2xl opacity-60"
          animate={{ y: [0, -18, 0], rotateY: [0, 8, -8, 0], rotateX: [0, 6, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" x2="100%">
              {/* use design tokens (CSS variables) instead of hard-coded RGBA */}
              <stop offset="0%" stopColor={`hsl(var(--accent-400) / 0.9)`} />
              <stop offset="100%" stopColor={`hsl(var(--success-500) / 0.8)`} />
            </linearGradient>
          </defs>
          <path d="M0 60 C40 20, 80 100, 140 60 C180 20, 220 100, 260 60 L260 200 L0 200 Z" fill="url(#waveGrad)" opacity="0.9" />
        </motion.svg>

        {/* floating boat (simple SVG hull + mast) */}
        <motion.svg
          viewBox="0 0 64 64"
          className="absolute right-10 bottom-20 w-40 h-40 drop-shadow-2xl"
          animate={{ y: [0, 10, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          aria-hidden
        >
          <g transform="translate(0,6)">
            {/* replace hard-coded colors with tokens from tokens.ts (CSS variables) */}
            <rect x="20" y="2" width="2" height="12" fill="hsl(var(--accent-gold-500))" opacity="0.0" />
            <path d="M8 24 C18 18, 46 18, 56 24 L48 32 L16 32 Z" fill={`hsl(var(--accent-600))`} />
            <path d="M16 16 L32 8 L48 16 L32 12 Z" fill={`hsl(var(--success-500) / 0.85)`} opacity="0.85" />
          </g>
        </motion.svg>
      </div>
    </section>
  )
}
