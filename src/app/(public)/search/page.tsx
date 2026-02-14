'use client'

import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiArrowLeft, mdiClock, mdiMapMarker, mdiStar, mdiAccountGroup } from '@mdi/js'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
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
                  <Input
                    placeholder="From..."
                    value={filters.departure}
                    onChange={(e) =>
                      setFilters({ ...filters, departure: e.target.value })
                    }
                    variant="glass"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-fg block mb-2">
                    Arrival
                  </label>
                  <Input
                    placeholder="To..."
                    value={filters.arrival}
                    onChange={(e) =>
                      setFilters({ ...filters, arrival: e.target.value })
                    }
                    variant="glass"
                  />
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
              {mockTrips.map((trip) => (
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
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
