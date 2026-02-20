'use client'

import { mdiAccountGroup, mdiArrowRight, mdiClock, mdiMagnify, mdiStar } from '@mdi/js'
import Icon from '@mdi/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


// Trip interface matching API response
interface Trip {
  id: string
  title: string
  description: string
  category: string
  durationMinutes: number
  highlights: string[]
  amenities: string[]
  pricing: {
    minPrice: number
    maxPrice: number
    tiers: number
  }
  schedules?: Array<{
    id: string
    startTime: string
    endTime?: string
    capacity?: number
    bookedSeats?: number
    availableSeats?: number
    status?: string
    priceTiers?: Array<{ id: string; name?: string; price: number; capacity?: number }>
  }>
  vessel?: {
    id: string
    name: string
    registrationNo: string
    capacity: number
    vesselMetadata?: { image?: string, amenities?: string[] }
  }
  operator?: {
    id: string
    companyName: string
    rating: number | null
  }
  createdAt: string
}

export default function TripsPage() {
  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'duration'>('popularity')
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use SWR to cache trips client-side (cache-first, background revalidate)
  const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch ${url}`)
    return res.json()
  }

  const today = new Date()
  const startIso = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).toISOString()
  const weekEnd = new Date(startIso)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)
  const weekEndIso = weekEnd.toISOString()

  const tripsKey = `/api/trips?includeSchedules=true&limit=50&startDate=${encodeURIComponent(startIso)}&endDate=${encodeURIComponent(weekEndIso)}`
  const { data, error: swrError } = useSWR(tripsKey, fetcher, { dedupingInterval: 60000, revalidateOnFocus: false })

  useEffect(() => {
    let mounted = true
    if (data) {
      if (mounted) setTrips(data.trips || [])

      const hasSchedulePorts = (data.trips || []).some((t: any) => (t.schedules || []).some((s: any) => s.departurePort && s.arrivalPort))
      if (!hasSchedulePorts) {
        // fallback: extend the window to 30 days (fire-and-forget)
        ;(async () => {
          try {
            const extendedEnd = new Date(startIso)
            extendedEnd.setUTCDate(extendedEnd.getUTCDate() + 30)
            const extRes = await fetch(`/api/trips?includeSchedules=true&limit=50&startDate=${encodeURIComponent(startIso)}&endDate=${encodeURIComponent(extendedEnd.toISOString())}`)
            if (extRes.ok) {
              const extData = await extRes.json()
              if (mounted) setTrips(extData.trips || [])
            }
          } catch (err) {
            console.warn('Trips: extended schedule fetch failed', err)
          }
        })()
      }
    }

    if (swrError) setError(swrError instanceof Error ? swrError.message : 'Failed to load trips')
    setLoading(!data && !swrError)

    return () => { mounted = false }
  }, [data, swrError])

  // Filter and sort trips based on current state
  const filteredAndSortedTrips = useMemo(() => {
    let results = [...trips]

    // Apply search filters (use schedule ports when available)
    if (searchFrom && searchFrom !== 'any') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results = results.filter(trip => (trip.schedules || []).some((s: any) => s.departurePort === searchFrom))
    }

    if (searchTo && searchTo !== 'any') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results = results.filter(trip => (trip.schedules || []).some((s: any) => s.arrivalPort === searchTo))
    }

    if (maxPrice !== undefined) {
      results = results.filter(trip => trip.pricing.minPrice <= maxPrice)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.pricing.minPrice - b.pricing.minPrice)
        break
      case 'price-high':
        results.sort((a, b) => b.pricing.minPrice - a.pricing.minPrice)
        break
      case 'duration':
        results.sort((a, b) => a.durationMinutes - b.durationMinutes)
        break
      case 'popularity':
      default:
        // For now, sort by creation date (most recent first)
        // TODO: Add popularity score to API
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return results
  }, [trips, searchFrom, searchTo, maxPrice, sortBy])

  const handleClearFilters = () => {
    setSearchFrom('')
    setSearchTo('')
    setMaxPrice(undefined)
    setSortBy('popularity')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="glass-subtle mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon path={mdiMagnify} size={0.83} className="" aria-hidden={true} />
            Search Trips
          </CardTitle>
          <CardDescription>
            Filter trips by departure, destination, and price
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From */}
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Select value={searchFrom} onValueChange={(v: string) => setSearchFrom(v)}>
                <SelectTrigger id="from" className="glass w-full">
                  <SelectValue placeholder="Any departure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {Array.from(new Set(trips.flatMap((t: any) => [t.departurePort].concat((t.schedules || []).map((s: any) => s.departurePort || ''))))).filter(Boolean).map((port: any) => (
                    <SelectItem key={port} value={port}>{port}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To */}
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Select value={searchTo} onValueChange={(v: string) => setSearchTo(v)}>
                <SelectTrigger id="to" className="glass w-full">
                  <SelectValue placeholder="Any arrival" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {Array.from(new Set(trips.flatMap((t: any) => [t.arrivalPort].concat((t.schedules || []).map((s: any) => s.arrivalPort || ''))))).filter(Boolean).map((port: any) => (
                    <SelectItem key={port} value={port}>{port}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price (₦)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="e.g., 10000"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Label htmlFor="sortBy">Sort by:</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'popularity' | 'price-low' | 'price-high' | 'duration')}>
                  <SelectTrigger id="sortBy" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="duration">Shortest Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={!searchFrom && !searchTo && !maxPrice && sortBy === 'popularity'}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        {loading ? (
          <p className="text-muted-foreground">Loading trips...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <p className="text-muted-foreground">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} found
          </p>
        )}
      </div>

      {/* Trip Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-subtle p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-48 bg-muted rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="glass-subtle p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Icon path={mdiMagnify} size={1} className="text-red-600" aria-hidden={true} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Error Loading Trips</h3>
          <p className="text-muted-foreground mb-4">
            {error}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </Card>
      ) : filteredAndSortedTrips.length === 0 ? (
        <Card className="glass-subtle p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Icon path={mdiMagnify} size={1} className="text-muted-foreground" aria-hidden={true} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No trips found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search filters
          </p>
          <Button onClick={handleClearFilters} variant="outline">
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}

function TripCard({ trip }: { trip: Trip }) {
  // format a Date as local YYYY-MM-DD (stable across timezones)
  const toLocalISO = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }

  return (
    <Card className="glass-card overflow-hidden hover:glass-hover transition-all">
      {/* Image (use vessel image if available, otherwise fallback) */}
      <div className="relative h-48 bg-muted">
        {trip.vessel?.vesselMetadata?.image ? (
          <Image
            src={trip.vessel.vesselMetadata.image}
            alt={trip.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-600" aria-hidden>
            <svg width="96" height="56" viewBox="0 0 96 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
              <path d="M6 38c6-6 18-6 30-2 12 4 24 4 36 0 6-2 12-4 18 2" stroke="white" strokeWidth="1.5" strokeOpacity="0.22" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 30c6-4 12-6 18-4 6 2 12 2 18 0" stroke="white" strokeWidth="1.2" strokeOpacity="0.14" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="58" y="16" width="12" height="6" rx="1" fill="white" fillOpacity="0.08" />
            </svg>
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
        <CardDescription className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Icon path={mdiClock} size={0.67} className="" aria-hidden={true} />
            <span>{trip.durationMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="capitalize">{trip.category}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating */}
        {trip.operator?.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Icon path={mdiStar} size={0.67} className="fill-yellow-400 text-yellow-400" aria-hidden={true} />
              <span className="font-semibold">{trip.operator.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {trip.operator.companyName}
            </span>
          </div>
        )}

        {/* Vessel Info */}
        {trip.vessel && (
          <div className="flex items-center gap-2 text-sm">
            <Icon path={mdiAccountGroup} size={0.67} className="text-muted-foreground" aria-hidden={true} />
            <span className="text-muted-foreground">
              {trip.vessel.name} • {trip.vessel.capacity} seats
            </span>
          </div>
        )}

        {/* Amenities */}
        {Array.from(new Set([...(trip.amenities || []), ...(trip.vessel?.vesselMetadata?.amenities || [])])).length > 0 && (
          (() => {
            const combined = Array.from(new Set([...(trip.amenities || []), ...(trip.vessel?.vesselMetadata?.amenities || [])]))
            return (
              <div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {combined.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {combined.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{combined.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Weekly availability strip (next 7 days) — compare using LOCAL dates so highlights match user timezone (e.g. Lagos, GMT+1) */}
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {getNextNDates(7).map((d) => {
                    const localIso = toLocalISO(d)

                    // compare schedule local-date (derived from schedule.startTime) to calendar localIso
                    const has = (trip.schedules || []).some((s) => {
                      const sd = new Date(s.startTime)
                      return toLocalISO(sd) === localIso
                    })

                    const minPrice = (() => {
                      const s = (trip.schedules || []).find((s) => {
                        const sd = new Date(s.startTime)
                        return toLocalISO(sd) === localIso
                      })
                      return s?.priceTiers?.[0]?.price ?? null
                    })()

                    return (
                      <div key={localIso} className="flex flex-col items-center w-12">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${has ? 'bg-success-600 text-white' : 'bg-muted'}`}>
                          {d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0,3)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {has ? `₦${(minPrice||0).toLocaleString()}` : '—'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()
        )}

        {/* Price */}
        <div className="pt-4 border-t">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold">₦{trip.pricing.minPrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">per person</span>
          </div>
          {trip.pricing.minPrice !== trip.pricing.maxPrice && (
            <p className="text-sm text-muted-foreground">
              Up to ₦{trip.pricing.maxPrice.toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/trips/${trip.id}`}>
            View Details
            <Icon path={mdiArrowRight} size={0.67} className="ml-2" aria-hidden={true} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

/**
 * Return an array of Date objects for the next `n` calendar days (UTC-midnight).
 * Dates are normalized to UTC midnight so `d.toISOString().split('T')[0]` matches
 * server-side ISO date strings used in schedule.startTime comparisons.
 */
function getNextNDates(n: number, from?: Date): Date[] {
  const ref = from ? new Date(from) : new Date()
  const start = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate()))
  const dates: Date[] = []
  for (let i = 0; i < n; i++) {
    dates.push(new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + i)))
  }
  return dates
}
