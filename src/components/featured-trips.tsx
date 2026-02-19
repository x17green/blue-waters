'use client'

import { mdiAccountGroup, mdiClock, mdiMapMarker, mdiStar } from '@mdi/js'
import Icon from '@mdi/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
/* eslint-disable @typescript-eslint/no-explicit-any */


export default function FeaturedTrips() {
  const [tripsData, setTripsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/trips?limit=8&includeSchedules=true')
        if (!res.ok) throw new Error('fetch failed')
        const json = await res.json()
        if (!mounted) return
        const items = (json.trips || []).slice().sort((a: any, b: any) => (b.operator?.rating || 0) - (a.operator?.rating || 0))
        setTripsData(items.slice(0, 4))
      } catch (err) {
        console.warn('FeaturedTrips: failed to load trips', err)
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

  const display = loading ? Array.from({ length: 4 }) : tripsData

  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {display.map((trip: any, idx: number) => (
        <motion.div key={trip?.id ?? idx} variants={itemVariants}>
          <div className="h-full glass-subtle rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border flex flex-col">
            <div className="relative w-full h-48 overflow-hidden">
              {trip?.vessel?.vesselMetadata?.image ? (
                <Image src={trip.vessel.vesselMetadata.image} alt={trip.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center"> 
                  <span className="text-6xl opacity-20">🚢</span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <div className={'px-3 py-1 rounded-full text-xs font-semibold text-white bg-accent-500'}>Featured</div>
              </div>
            </div>

            <div className="px-4 py-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-accent-500 mb-2">{trip?.title ?? 'Loading...'}</h3>

              <div className="space-y-3 mb-4 flex-1">
                <div className="flex items-center gap-2 text-fg-muted">
                  <Icon path={mdiMapMarker} size={0.6} className="text-accent-500" aria-hidden={true} />
                  <span className="text-sm">{trip?.departurePort ?? trip?.schedules?.[0]?.departurePort ?? '—'}</span>
                </div>

                <div className="flex gap-4 text-sm text-fg-muted">
                  <div className="flex items-center gap-1">
                    <Icon path={mdiClock} size={0.6} className="text-accent-500" aria-hidden={true} />
                    <span>{trip?.durationMinutes ? `${Math.floor(trip.durationMinutes/60)}h ${trip.durationMinutes%60}m` : '—'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon path={mdiAccountGroup} size={0.6} className="text-accent-500" aria-hidden={true} />
                    <span>{trip?.vessel?.capacity ?? '—'} seats</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[0,1,2,3,4].map((_, i) => (
                      <Icon key={i} path={mdiStar} size={0.6} className={`${i < Math.floor(trip?.operator?.rating || 0) ? 'fill-accent-500 text-accent-500' : 'text-fg-dim'}`} aria-hidden={true} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-fg">{(trip?.operator?.rating ?? 0).toFixed(1)}</span>
                  <span className="text-xs text-fg-muted">({trip?.statistics?.reviewCount ?? '—'})</span>
                </div>
              </div>

              <div className="border-t border-border pt-3 mb-4">
                <div>
                  <span className="text-2xl font-bold text-accent-500">₦{(trip?.pricing?.minPrice ?? 0).toLocaleString()}</span>
                  <span className="text-xs text-fg-muted ml-1">/person</span>
                </div>
              </div>

              <Link href={`/trips/${trip?.id ?? ''}`} className="w-full bg-gradient-to-r from-accent-600 to-accent-500 text-white font-semibold py-2 px-4 rounded text-center hover:shadow-md transition-all">View Details</Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
