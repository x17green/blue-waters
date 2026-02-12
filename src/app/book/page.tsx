'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody, CardHeader, Button, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem, Chip } from '@nextui-org/react'
import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, Users, Fuel, Star } from 'lucide-react'
import Image from 'next/image'

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
    image: 'https://images.unsplash.com/photo-1552053831-71594a27c62d?w=500&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1578962996442-48f60103fc96?w=500&h=300&fit=crop',
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
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <Navbar className="bg-primary/10 backdrop-blur-lg border-b border-primary/20">
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">⛵</span>
            </div>
            <p className="font-bold text-xl text-primary">Blue Waters</p>
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              href="/login"
              variant="ghost"
              className="text-primary"
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
            className="mb-4 text-primary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-primary mb-2">Book Your Journey</h1>
          <p className="text-lg text-foreground/60">
            Browse and book from our available boat trips
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border border-primary/10 rounded-2xl p-6 shadow-lg mb-8"
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
            <Button className="bg-gradient-to-r from-primary to-accent text-white font-semibold">
              Search
            </Button>
          </div>
        </motion.div>

        {/* Available Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trips List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-primary mb-6">
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
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <Card className="border border-primary/10">
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
                            <h3 className="text-lg font-bold text-primary mb-2">
                              {trip.name}
                            </h3>
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-2 text-foreground/70">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span className="font-semibold">{trip.route}</span>
                              </div>
                              <div className="flex gap-6 text-sm text-foreground/70">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-primary" />
                                  {trip.departure} - {trip.arrival}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-primary" />
                                  {trip.capacity} seats
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {trip.amenities.map((amenity, idx) => (
                                <Chip key={idx} size="sm" variant="flat" className="bg-primary/10 text-primary">
                                  {amenity}
                                </Chip>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(trip.rating)
                                        ? 'fill-accent text-accent'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                {trip.rating}
                              </span>
                              <span className="text-xs text-foreground/60">
                                ({trip.reviews})
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-primary">
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
                <Card className="bg-gradient-to-b from-primary/10 to-primary/5 border-2 border-primary shadow-lg">
                  <CardHeader className="flex flex-col items-start px-6 py-4 border-b border-primary/20">
                    <h3 className="text-xl font-bold text-primary">Booking Summary</h3>
                  </CardHeader>
                  <CardBody className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Trip</p>
                      <p className="font-bold text-foreground">{selectedTrip.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Route</p>
                      <p className="font-semibold text-primary">{selectedTrip.route}</p>
                    </div>

                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Departure</p>
                      <p className="font-semibold text-foreground">
                        {selectedTrip.departure} - {selectedTrip.arrival}
                      </p>
                    </div>

                    <div className="border-t border-primary/20 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-foreground">Passengers</span>
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

                      <div className="space-y-2 pb-4 border-b border-primary/20">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">Price per person</span>
                          <span className="font-semibold">
                            ₦{selectedTrip.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">Subtotal ({passengers}x)</span>
                          <span className="font-semibold">
                            ₦{(selectedTrip.price * passengers).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">Service Fee</span>
                          <span className="font-semibold">
                            ₦{Math.round(selectedTrip.price * passengers * 0.05).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <span className="font-bold text-lg text-primary">Total</span>
                        <span className="font-bold text-2xl text-primary">
                          ₦{Math.round(selectedTrip.price * passengers * 1.05).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      href={`/checkout?trip=${selectedTrip.id}&passengers=${passengers}`}
                      className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold text-lg py-3"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>

                    <Button
                      variant="bordered"
                      className="w-full text-primary border-primary"
                      onClick={() => setSelectedTrip(null)}
                    >
                      Clear Selection
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <Card className="bg-secondary/30 border border-primary/10">
                  <CardBody className="p-6 text-center">
                    <Fuel className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                    <p className="text-foreground/70 text-lg">
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
