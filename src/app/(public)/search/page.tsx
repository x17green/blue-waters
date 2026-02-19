'use client'

import { mdiAccountGroup, mdiArrowLeft, mdiClock, mdiMapMarker, mdiStar } from '@mdi/js'
import Icon from '@mdi/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Slider } from '@/src/components/ui/slider'

const mockTrips = [
  {
    id: 1,
    name: 'Express Commute',
    route: 'Yenagoa → Kaiama',
    departure: '06:00 AM',
    arrival: '07:30 AM',
    price: 3500,
    rating: 4.6,
    reviews: 289,
    capacity: 80,
    available: 40,
    duration: '1.5 hours',
    boat: 'Speed Boat 1',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Heritage Cruise',
    route: 'Yenagoa → Nembe',
    departure: '08:00 AM',
    arrival: '11:00 AM',
    price: 5000,
    rating: 4.8,
    reviews: 342,
    capacity: 45,
    available: 15,
    duration: '3 hours',
    boat: 'Cruise Liner',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Scenic Tour',
    route: 'Yenagoa → Brass',
    departure: '10:00 AM',
    arrival: '2:00 PM',
    price: 6000,
    rating: 4.9,
    reviews: 521,
    capacity: 60,
    available: 35,
    duration: '4 hours',
    boat: 'Comfort Yacht',
    image: 'https://images.unsplash.com/photo-1745412219587-d9c91c383e14?w=500&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'Evening Special',
    route: 'Yenagoa → Opobo',
    departure: '4:00 PM',
    arrival: '9:00 PM',
    price: 12000,
    rating: 5.0,
    reviews: 156,
    capacity: 30,
    available: 8,
    duration: '5 hours',
    boat: 'Luxury Catamaran',
    image: 'https://images.unsplash.com/photo-1766939367026-5ddcdf16f362?w=500&h=300&fit=crop',
  },
]

export default function Search() {
  const [filters, setFilters] = useState({
    departure: '',
    arrival: '',
    date: '',
    minPrice: 0,
    maxPrice: 15000,
    sortBy: 'price',
  })

  // apiTrips is typed as `any[]` because server returns dynamic schedule structures
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apiTrips, setApiTrips] = useState<any[]>([])
  const [apiFetchSucceeded, setApiFetchSucceeded] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        const res = await fetch('/api/trips?includeSchedules=true&limit=50')
        if (!res.ok) throw new Error('failed')
        const json = await res.json()
        if (!mounted) return
        setApiTrips(json.trips || [])
        setApiFetchSucceeded(true)
      } catch (err) {
        console.warn('Search: failed to fetch trips, falling back to mock data', err)
        setApiTrips([])
        setApiFetchSucceeded(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [])

  // flatten schedules into search items (one row per schedule)
  const searchItems = useMemo(() => {
    // Only fall back to mock data if the API explicitly failed.
    if (apiFetchSucceeded === false) return mockTrips

    // If API succeeded but returned no schedules, show no results (do not use mock).
    if (!apiTrips || apiTrips.length === 0) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return apiTrips.flatMap((t: any) => (t.schedules || []).map((s: any) => ({
      id: `${t.id}-${s.id}`,
      tripId: t.id,
      name: t.title,
      route: `${s.departurePort ?? t.departurePort ?? '—'} → ${s.arrivalPort ?? t.arrivalPort ?? '—'}`,
      departure: new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      arrival: new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: s.priceTiers?.[0]?.price ?? t.pricing?.minPrice ?? 0,
      rating: t.operator?.rating ?? 0,
      reviews: t.statistics?.reviewCount ?? 0,
      capacity: t.vessel?.capacity ?? 0,
      available: s.availableSeats ?? 0,
      duration: t.durationMinutes ? `${Math.floor(t.durationMinutes/60)}h ${t.durationMinutes%60}m` : '—',
      boat: t.vessel?.name ?? '',
      image: t.vessel?.vesselMetadata?.image ?? '',
    })))
  }, [apiTrips, apiFetchSucceeded])


  // derive select options from available search items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const departureOptions = Array.from(new Set(searchItems.map((t: any) => t.route.split('→')[0].trim())))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arrivalOptions = Array.from(new Set(searchItems.map((t: any) => t.route.split('→')[1].trim())))

  const filteredTrips = useMemo(() => {
    let results = searchItems.slice()
    if (filters.departure && filters.departure !== 'any') {
      results = results.filter(t => t.route.split('→')[0].trim() === filters.departure)
    }
    if (filters.arrival && filters.arrival !== 'any') {
      results = results.filter(t => t.route.split('→')[1].trim() === filters.arrival)
    }
    if (filters.date) {
      // API-backed schedules include real dates; advanced filtering can be added later
    }
    results = results.filter(t => t.price >= filters.minPrice && t.price <= filters.maxPrice)

    switch (filters.sortBy) {
      case 'price':
        results.sort((a, b) => a.price - b.price)
        break
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'time': {
        const toMinutes = (timeStr: string) => {
          const [hms, ampm] = timeStr.split(' ')
          const [h, m] = hms.split(':').map(Number)
          let hh = h % 12
          if (ampm === 'PM') hh += 12
          return hh * 60 + m
        }
        results.sort((a, b) => toMinutes(a.departure) - toMinutes(b.departure))
        break
      }
    }

    return results
  }, [filters, searchItems])


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <main className="min-h-screen bg-bg-900">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            href="/"
            variant="ghost"
            className="mb-4 text-accent-500 flex items-center gap-2"
          >
            <Icon path={mdiArrowLeft} size={0.6} aria-hidden={true} />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-accent-500 mb-2">Search Trips</h1>
          <p className="text-lg text-fg-muted">
            Find and book your perfect boat journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="glass border-border-subtle">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-accent-500 mb-4">Filters</h3>
                </div>

                <div>
                  <label className="text-sm font-semibold text-fg block mb-2">
                    Departure
                  </label>
                  <Select value={filters.departure} onValueChange={(v) => setFilters({ ...filters, departure: v })}>
                  <SelectTrigger className="glass w-full">
                    <SelectValue placeholder="Departure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {departureOptions.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-fg block mb-2">
                    Arrival
                  </label>
                  <Select value={filters.arrival} onValueChange={(v) => setFilters({ ...filters, arrival: v })}>
                  <SelectTrigger className="glass w-full">
                    <SelectValue placeholder="Arrival" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {arrivalOptions.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-fg block mb-2">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={filters.date}
                    onChange={(e) =>
                      setFilters({ ...filters, date: e.target.value })
                    }
                    variant="glass"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-fg block mb-4">
                    Price Range
                  </label>
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={(value) => {
                      setFilters({
                        ...filters,
                        minPrice: value[0],
                        maxPrice: value[1],
                      })
                    }}
                    max={15000}
                    min={0}
                    step={500}
                    className="max-w-md"
                  />
                  <p className="text-xs text-fg-muted mt-2">
                    ₦{filters.minPrice.toLocaleString()} - ₦
                    {filters.maxPrice.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-fg block mb-2">
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters({ ...filters, sortBy: value })
                    }
                  >
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price: Low to High</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="time">Departure Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full glass border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white"
                  onClick={() => setFilters({
                    departure: '',
                    arrival: '',
                    date: '',
                    minPrice: 0,
                    maxPrice: 15000,
                    sortBy: 'price',
                  })}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trips List */}
          <div className="lg:col-span-3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredTrips.length === 0 ? (
                <Card className="glass border-border-subtle p-6">
                  <CardContent>
                    <p className="text-fg-muted">No trips match the selected filters.</p>
                    {apiFetchSucceeded === false && (
                      <p className="text-xs text-fg-muted mt-2">The search API failed — showing fallback content is disabled for reliability.</p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredTrips.map((trip) => (
                  <motion.div key={trip.id} variants={itemVariants}>
                    <Card className="glass border-border-subtle hover:shadow-soft transition-shadow">
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6 p-6">
                          {/* Image */}
                          <div className="relative w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={trip.image}
                              alt={trip.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-accent-500 mb-2">
                              {trip.name}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-fg-muted">
                                <Icon path={mdiMapMarker} size={0.6} className="text-accent-500" aria-hidden={true} />
                                {trip.route}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-fg-muted">
                                <Icon path={mdiClock} size={0.6} className="text-accent-500" aria-hidden={true} />
                                {trip.departure}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-fg-muted">
                                <Icon path={mdiAccountGroup} size={0.6} className="text-accent-500" aria-hidden={true} />
                                {trip.available} available
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                  <Icon
                                    key={i}
                                    path={mdiStar}
                                    size={0.6}
                                    className={
                                      i < Math.floor(trip.rating)
                                        ? 'fill-accent-500 text-accent-500'
                                        : 'text-fg-subtle'
                                    }
                                    aria-hidden={true}
                                  />
                                ))}
                                <span className="text-sm font-semibold text-fg">
                                  {trip.rating}
                                </span>
                                <span className="text-xs text-fg-muted">
                                  ({trip.reviews})
                                </span>
                              </div>

                              <Button
                                asChild
                                className="glass-strong border border-accent-500 bg-accent-500 hover:bg-accent-400 text-white shadow-soft"
                              >
                                <Link href={`/book/${trip.id}`}>
                                  ₦{trip.price.toLocaleString()} - Book
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
