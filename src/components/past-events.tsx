'use client'

import { useEffect, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem } from '@/src/components/ui/carousel'
import { Button } from '@/src/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '@/src/lib/analytics'

export default function PastEvents() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const today = new Date()
        const endIso = today.toISOString()
        const start = new Date(today)
        start.setDate(start.getDate() - 30) // recent 30 days
        const startIso = start.toISOString()

        const res = await fetch(`/api/trips?includeSchedules=true&scheduleStatus=completed&startDate=${encodeURIComponent(startIso)}&endDate=${encodeURIComponent(endIso)}&limit=8`)
        if (!res.ok) throw new Error('fetch failed')
        const json = await res.json()
        if (!mounted) return

        // Flatten schedules into per-schedule items for gallery
        const events: any[] = []
        ;(json.trips || []).forEach((t: any) => {
          ;(t.schedules || []).forEach((s: any) => {
            // only include completed schedules
            if (s.status === 'completed') {
              events.push({
                tripId: t.id,
                tripTitle: t.title,
                image: t.vessel?.vesselMetadata?.image || null,
                date: s.startTime,
                summary: t.description || '',
              })
            }
          })
        })

        setItems(events.slice(0, 8))

        if (events.length === 0) trackEvent('past_events_empty')
      } catch (err) {
        console.warn('PastEvents: failed to load', err)
        setError('Failed to load past events')
        trackEvent('past_events_load_error', { message: String(err) })
      } finally {
        if (mounted) setLoading(false)
      }
    }

    run()
    return () => { mounted = false }
  }, [])

  if (loading) return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold">Past Events</h3>
        <p className="text-fg-muted">Memories from recent trips</p>
      </div>
      <div className="h-40 glass-subtle rounded-lg border border-border animate-pulse" />
    </section>
  )

  // Show an informative empty / error state instead of returning `null` so the section is visible
  if (error || items.length === 0) {
    return (
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold">Past Events</h3>
            <p className="text-fg-muted">Memories from recent trips</p>
          </div>
          <Link href="/trips" className="text-sm font-semibold text-accent-500">View all</Link>
        </div>

        <div className="glass-subtle rounded-lg border border-border p-8 text-center">
          {error ? (
            <>
              <p className="text-fg-muted mb-4">{error}</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded bg-accent-600 text-white font-semibold">Retry</button>
                <Link href="/trips"><Button variant="outline">Browse Trips</Button></Link>
              </div>
            </>
          ) : (
            <>
              <h4 className="text-lg font-semibold mb-2">No recent past events</h4>
              <p className="text-fg-muted mb-6">We don't have recorded completed trips in the selected timeframe.</p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/trips"><Button variant="primary">Browse Trips</Button></Link>
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded border border-border">Refresh</button>
              </div>
            </>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold">Past Events</h3>
          <p className="text-fg-muted">Memories from recent trips</p>
        </div>
        <Link href="/trips" className="text-sm font-semibold text-accent-500">View all</Link>
      </div>

      <Carousel opts={{ loop: false, containScroll: 'trimSnaps' }}>
        <CarouselContent>
          {items.map((it, idx) => (
            <CarouselItem key={`${it.tripId}-${idx}`}>
              <Link href={`/trips/${it.tripId}`} className="block w-full rounded-lg overflow-hidden border border-border glass-subtle hover:shadow-md transition-shadow duration-200">
                <div className="relative w-full h-44 bg-muted">
                  {it.image ? (
                    <Image src={it.image} alt={it.tripTitle} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-25" aria-hidden>
                      <svg width="72" height="44" viewBox="0 0 96 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                        <path d="M6 38c6-6 18-6 30-2 12 4 24 4 36 0 6-2 12-4 18 2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.22" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18 30c6-4 12-6 18-4 6 2 12 2 18 0" stroke="currentColor" strokeWidth="1" strokeOpacity="0.14" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="58" y="16" width="12" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-fg truncate">{it.tripTitle}</h4>
                    <time className="text-xs text-fg-muted">{new Date(it.date).toLocaleDateString()}</time>
                  </div>
                  <p className="text-sm text-fg-muted truncate mt-2">{it.summary}</p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
