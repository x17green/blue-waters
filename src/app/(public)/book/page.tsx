'use client'

import { Button, Card, CardBody, CardHeader, Chip, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiArrowLeft, mdiClock, mdiGasStation, mdiMapMarker, mdiStar, mdiAccountGroup } from '@mdi/js'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Mock trip data
const mockTrips = [
  {
    id: 1,
    name: 'Express Commute - Morning',
    route: 'Yenagoa → Kaiama',
    departure: '06:00 AM',
    arrival: '07:30 AM',
    price: 3500,
    rating: 4.6,
    reviews: 289,
    capacity: 80,
    duration: '1.5 hours',
    amenities: ['WiFi', 'Comfort Seats', 'Safety Vest'],
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Bayelsa Heritage Cruise',
    route: 'Yenagoa → Nembe',
    departure: '08:00 AM',
    arrival: '11:00 AM',
    price: 5000,
    rating: 4.8,
    reviews: 342,
    capacity: 45,
    duration: '3 hours',
    amenities: ['Lunch', 'WiFi', 'Air Conditioning', 'Premium Seats'],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Scenic Waterfront Tour',
    route: 'Yenagoa → Brass',
    departure: '10:00 AM',
    arrival: '2:00 PM',
    price: 6000,
    rating: 4.9,
    reviews: 521,
    capacity: 60,
    duration: '4 hours',
    amenities: ['Lunch', 'Photo Tour', 'WiFi', 'AC'],
    image: 'https://images.unsplash.com/photo-1745412219587-d9c91c383e14?w=500&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'Evening Cruise - Special',
    route: 'Yenagoa → Opobo',
    departure: '4:00 PM',
    arrival: '9:00 PM',
    price: 12000,
    rating: 5.0,
    reviews: 156,
    capacity: 30,
    duration: '5 hours',
    amenities: ['Dinner', 'Entertainment', 'WiFi', 'Bar Service'],
    image: 'https://images.unsplash.com/photo-1766939367026-5ddcdf16f362?w=500&h=300&fit=crop',
  },
]

export default function Book() {
  const [selectedTrip, setSelectedTrip] = useState<(typeof mockTrips)[0] | null>(null)
  const [passengers, setPassengers] = useState(1)
  const [searchDate, setSearchDate] = useState('')
  const [filteredTrips, setFilteredTrips] = useState(mockTrips)

  useEffect(() => {
    // In a real app, this would filter based on actual data
    setFilteredTrips(mockTrips)
  }, [searchDate])

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
    <main className="min-h-screen bg-gradient-to-b from-bg-100 to-bg-900">
      {/* Navigation */}
      <Navbar className="glass-subtle border-b border-border">
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-600 to-accent-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">⛵</span>
            </div>
            <p className="font-bold text-xl text-accent-500">Blue Waters</p>
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              href="/login"
              variant="ghost"
              className="text-accent-500"
            >
              Sign In
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
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
          <h1 className="text-4xl font-bold text-accent-500 mb-2">Book Your Journey</h1>
          <p className="text-lg text-fg-muted">
            Browse and book from our available boat trips
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl p-6 shadow-lg mb-8 border border-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Select Date"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <Input
              label="Number of Passengers"
              type="number"
              value={String(passengers)}
              onChange={(e) => setPassengers(Number(e.target.value))}
              min="1"
              max="10"
            />
            <Input
              placeholder="Search by route..."
              type="text"
            />
            <Button className="bg-gradient-to-r from-accent-600 to-accent-400 text-white font-semibold">
              Search
            </Button>
          </div>
        </motion.div>

        {/* Available Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trips List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-accent-500 mb-6">
              Available Trips ({filteredTrips.length})
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  variants={itemVariants}
                  onClick={() => setSelectedTrip(trip)}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedTrip?.id === trip.id
                      ? 'ring-2 ring-accent-500 shadow-lg'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <Card className="border border-border">
                    <CardBody className="p-0">
                      <div className="flex flex-col md:flex-row h-full">
                        {/* Image */}
                        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                          <Image
                            src={trip.image}
                            alt={trip.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-accent-500 mb-2">
                              {trip.name}
                            </h3>
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-2 text-fg-muted">
                                <Icon path={mdiMapMarker} size={0.6} className="text-accent-500" aria-hidden={true} />
                                <span className="font-semibold">{trip.route}</span>
                              </div>
                              <div className="flex gap-6 text-sm text-fg-muted">
                                <div className="flex items-center gap-1">
                                  <Icon path={mdiClock} size={0.6} className="text-accent-500" aria-hidden={true} />
                                  {trip.departure} - {trip.arrival}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Icon path={mdiAccountGroup} size={0.6} className="text-accent-500" aria-hidden={true} />
                                  {trip.capacity} seats
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {trip.amenities.map((amenity, idx) => (
                                <Chip key={idx} size="sm" variant="flat" className="bg-accent-500/10 text-accent-500">
                                  {amenity}
                                </Chip>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Icon
                                    key={i}
                                    path={mdiStar}
                                    size={0.6}
                                    className={
                                      i < Math.floor(trip.rating)
                                        ? 'fill-accent-500 text-accent-500'
                                        : 'text-fg-dim'
                                    }
                                    aria-hidden={true}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-fg">
                                {trip.rating}
                              </span>
                              <span className="text-xs text-fg-muted">
                                ({trip.reviews})
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-accent-500">
                              ₦{trip.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-8"
            >
              {selectedTrip ? (
                <Card className="glass-subtle border-2 border-accent-500 shadow-lg">
                  <CardHeader className="flex flex-col items-start px-6 py-4 border-b border-border">
                    <h3 className="text-xl font-bold text-accent-500">Booking Summary</h3>
                  </CardHeader>
                  <CardBody className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-fg-muted mb-1">Trip</p>
                      <p className="font-bold text-fg">{selectedTrip.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-fg-muted mb-1">Route</p>
                      <p className="font-semibold text-accent-500">{selectedTrip.route}</p>
                    </div>

                    <div>
                      <p className="text-sm text-fg-muted mb-1">Departure</p>
                      <p className="font-semibold text-fg">
                        {selectedTrip.departure} - {selectedTrip.arrival}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-fg">Passengers</span>
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onClick={() => setPassengers(Math.max(1, passengers - 1))}
                          >
                            −
                          </Button>
                          <span className="w-8 text-center font-bold">{passengers}</span>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onClick={() => setPassengers(Math.min(selectedTrip.capacity, passengers + 1))}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 pb-4 border-b border-border">
                        <div className="flex justify-between text-sm">
                          <span className="text-fg-muted">Price per person</span>
                          <span className="font-semibold">
                            ₦{selectedTrip.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-fg-muted">Subtotal ({passengers}x)</span>
                          <span className="font-semibold">
                            ₦{(selectedTrip.price * passengers).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-fg-muted">Service Fee</span>
                          <span className="font-semibold">
                            ₦{Math.round(selectedTrip.price * passengers * 0.05).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <span className="font-bold text-lg text-accent-500">Total</span>
                        <span className="font-bold text-2xl text-accent-500">
                          ₦{Math.round(selectedTrip.price * passengers * 1.05).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      href={`/checkout?trip=${selectedTrip.id}&passengers=${passengers}`}
                      className="w-full bg-gradient-to-r from-accent-600 to-accent-400 text-white font-bold text-lg py-3"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>

                    <Button
                      variant="bordered"
                      className="w-full text-accent-500 border-accent-500"
                      onClick={() => setSelectedTrip(null)}
                    >
                      Clear Selection
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <Card className="glass-subtle border border-border">
                  <CardBody className="p-6 text-center">
                    <Icon path={mdiGasStation} size={2.67} className="text-accent-500/20 mx-auto mb-4" aria-hidden={true} />
                    <p className="text-fg-muted text-lg">
                      Select a trip to see booking details
                    </p>
                  </CardBody>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
