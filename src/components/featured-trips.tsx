'use client'

import { mdiAccountGroup, mdiClock, mdiMapMarker, mdiStar } from '@mdi/js'
import Icon from '@mdi/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { useEffect, useState } from 'react'
import { trackEvent } from '@/src/lib/analytics'
/* eslint-disable @typescript-eslint/no-explicit-any */


export default function FeaturedTrips() {
  const [tripsData, setTripsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/trips?limit=8&includeSchedules=true')
        if (!res.ok) throw new Error('fetch failed')
        const json = await res.json()
        if (!mounted) return
        const items = (json.trips || []).slice().sort((a: any, b: any) => (b.operator?.rating || 0) - (a.operator?.rating || 0))
        setTripsData(items.slice(0, 4))
      } catch (err) {
        console.warn('FeaturedTrips: failed to load trips', err)
        if (mounted) setError('Failed to load featured journeys')
        setTripsData([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [])

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  // Telemetry for empty / error states -> helps product detect content gaps
  useEffect(() => {
    if (loading) return
    if (error) {
      trackEvent('featured_trips_load_error', { message: error })
      return
    }
    if (!error && tripsData.length === 0) {
      trackEvent('featured_trips_empty')
    }
  }, [loading, error, tripsData.length])

  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Loading skeletons */}
      {loading && Array.from({ length: 4 }).map((_, i) => (
        <motion.div key={`skeleton-${i}`} variants={itemVariants}>
          <div className="h-full glass-subtle rounded-lg overflow-hidden border border-border flex flex-col animate-pulse">
            <div className="w-full h-48 bg-muted" />
            <div className="p-4 flex-1 flex flex-col gap-3">
              <div className="h-5 bg-muted-foreground/10 rounded w-3/4" />
              <div className="h-4 bg-muted-foreground/8 rounded w-1/2" />
              <div className="flex-1" />
              <div className="h-10 bg-muted-foreground/6 rounded w-full" />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Error or empty state */}
      {!loading && error && (
        <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-12">
          <p className="text-fg-muted mb-4">{error}</p>
          <Link href="/trips">
            <Button variant="primary" size="md">Explore Trips</Button>
          </Link>
        </div>
      )}

      {!loading && !error && tripsData.length === 0 && (
        <div className="col-span-1 md:col-span-2 lg:col-span-4 glass-subtle rounded-lg border border-border p-8 text-center">
          <h3 className="text-lg font-semibold text-fg mb-2">No featured journeys right now</h3>
          <p className="text-fg-muted mb-4">We don't have featured trips at the moment — check back later or explore all available routes.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/trips"><Button variant="primary">Browse Trips</Button></Link>
            <Link href="/contact"><Button variant="outline">Contact Support</Button></Link>
          </div>
        </div>
      )}

      {/* Loaded trips */}
      {!loading && tripsData.length > 0 && tripsData.map((trip: any) => (
        <motion.div key={trip.id} variants={itemVariants}>
          <div className="h-full glass-subtle rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border flex flex-col">
            <div className="relative w-full h-48 overflow-hidden">
              {trip?.vessel?.vesselMetadata?.image ? (
                <Image src={trip.vessel.vesselMetadata.image} alt={trip.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center" aria-hidden>
                  {/* neutral SVG illustration instead of emoji */}
                  <svg width="96" height="56" viewBox="0 0 96 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                    <rect width="96" height="56" rx="6" fill="transparent" />
                    <path d="M6 38c6-6 18-6 30-2 12 4 24 4 36 0 6-2 12-4 18 2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 30c6-4 12-6 18-4 6 2 12 2 18 0" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.18" strokeLinecap="round" strokeLinejoin="round"/>
                    <ellipse cx="40" cy="22" rx="6" ry="2.6" fill="currentColor" fillOpacity="0.12" />
                    <rect x="58" y="16" width="12" height="6" rx="1" fill="currentColor" fillOpacity="0.12" />
                  </svg>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <div className={'px-3 py-1 rounded-full text-xs font-semibold text-white bg-accent-500'}>Featured</div>
              </div>
            </div>

            <div className="px-4 py-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-accent-500 mb-2">{trip.title}</h3>

              <div className="space-y-3 mb-4 flex-1">
                <div className="flex items-center gap-2 text-fg-muted">
                  <Icon path={mdiMapMarker} size={0.6} className="text-accent-500" aria-hidden={true} />
                  <span className="text-sm">{trip.departurePort ?? trip.schedules?.[0]?.departurePort ?? '—'}</span>
                </div>

                <div className="flex gap-4 text-sm text-fg-muted">
                  <div className="flex items-center gap-1">
                    <Icon path={mdiClock} size={0.6} className="text-accent-500" aria-hidden={true} />
                    <span>{trip.durationMinutes ? `${Math.floor(trip.durationMinutes/60)}h ${trip.durationMinutes%60}m` : '—'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon path={mdiAccountGroup} size={0.6} className="text-accent-500" aria-hidden={true} />
                    <span>{trip.vessel?.capacity ?? '—'} seats</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[0,1,2,3,4].map((_, i) => (
                      <Icon key={i} path={mdiStar} size={0.6} className={`${i < Math.floor(trip.operator?.rating || 0) ? 'fill-accent-500 text-accent-500' : 'text-fg-dim'}`} aria-hidden={true} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-fg">{(trip.operator?.rating ?? 0).toFixed(1)}</span>
                  <span className="text-xs text-fg-muted">({trip.statistics?.reviewCount ?? '—'})</span>
                </div>
              </div>

              <div className="border-t border-border pt-3 mb-4">
                <div>
                  <span className="text-2xl font-bold text-accent-500">₦{(trip.pricing?.minPrice ?? 0).toLocaleString()}</span>
                  <span className="text-xs text-fg-muted ml-1">/person</span>
                </div>
              </div>

              <Link href={`/trips/${trip.id}`} className="w-full bg-gradient-to-r from-accent-600 to-accent-500 text-white font-semibold py-2 px-4 rounded text-center hover:shadow-md transition-all">View Details</Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
