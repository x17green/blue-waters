'use client'

import { Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Navbar, NavbarBrand, NavbarContent, NavbarItem, Button as NextUIButton, Tabs as NextUITabs, Tab, useDisclosure } from '@nextui-org/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Icon } from '@/src/components/ui/icon'
import { mdiCurrencyUsd, mdiLogout, mdiMapMarker, mdiFerry, mdiTrendingUp, mdiAccountGroup } from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'

const operatorData = {
  name: 'Captain Ocean Cruises',
  verified: true,
  rating: 4.8,
  totalTrips: 245,
  totalRevenue: 12450000,
}

const revenueData = [
  { month: 'Jan', revenue: 1200000 },
  { month: 'Feb', revenue: 1400000 },
  { month: 'Mar', revenue: 1100000 },
  { month: 'Apr', revenue: 1800000 },
  { month: 'May', revenue: 1600000 },
  { month: 'Jun', revenue: 2100000 },
]

const bookingsData = [
  { day: 'Mon', bookings: 45 },
  { day: 'Tue', bookings: 52 },
  { day: 'Wed', bookings: 38 },
  { day: 'Thu', bookings: 61 },
  { day: 'Fri', bookings: 55 },
  { day: 'Sat', bookings: 67 },
  { day: 'Sun', bookings: 48 },
]

const upcomingTrips = [
  {
    id: 1,
    name: 'Express Commute',
    departure: '06:00 AM',
    route: 'Yenagoa → Kaiama',
    passengers: 42,
    capacity: 80,
    status: 'scheduled',
    revenue: 147000,
  },
  {
    id: 2,
    name: 'Heritage Cruise',
    departure: '08:00 AM',
    route: 'Yenagoa → Nembe',
    passengers: 38,
    capacity: 45,
    status: 'scheduled',
    revenue: 190000,
  },
  {
    id: 3,
    name: 'Scenic Tour',
    departure: '10:00 AM',
    route: 'Yenagoa → Brass',
    passengers: 55,
    capacity: 60,
    status: 'ongoing',
    revenue: 330000,
  },
]

export default function OperatorDashboard() {
  const [user, setUser] = useState<any>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    // In a real app, fetch user data
    setUser({ email: 'operator@bluewaters.com' })
  }, [])

  const handleLogout = async () => {
    window.location.href = '/'
  }

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
    hidden: { opacity: 0, y: 10 },
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
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
              My Boats
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
              Bookings
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
              Earnings
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-primary"
              startIcon={<Icon path={mdiLogout} size={0.6} aria-hidden={true} />}
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">
            {operatorData.name}
          </h1>
          <p className="text-lg text-foreground/60">
            Manage your boats, trips, and earnings
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm mb-2">Total Trips</p>
                    <p className="text-4xl font-bold text-primary">
                      {operatorData.totalTrips}
                    </p>
                  </div>
                  <Icon path={mdiFerry} size={1.66} className="text-primary/30" aria-hidden={true} />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm mb-2">Total Revenue</p>
                    <p className="text-2xl font-bold text-accent">
                      ₦{(operatorData.totalRevenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <Icon path={mdiCurrencyUsd} size={1.66} className="text-accent/30" aria-hidden={true} />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-400/10 to-blue-400/5 border border-blue-400/20">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm mb-2">Rating</p>
                    <p className="text-4xl font-bold text-blue-600">
                      {operatorData.rating}
                    </p>
                  </div>
                  <Icon path={mdiTrendingUp} size={1.66} className="text-blue-600/30" aria-hidden={true} />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-green-400/10 to-green-400/5 border border-green-400/20">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm mb-2">Active Boats</p>
                    <p className="text-4xl font-bold text-green-600">4</p>
                  </div>
                  <Icon path={mdiAccountGroup} size={1.66} className="text-green-600/30" aria-hidden={true} />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts and Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border border-primary/10">
              <CardHeader className="border-b border-primary/10">
                <h2 className="text-xl font-bold text-primary">Revenue Trend</h2>
              </CardHeader>
              <CardBody className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="stroke-fg-muted" />
                    <YAxis className="stroke-fg-muted" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      className="stroke-accent-500"
                      strokeWidth={2}
                      dot={{ className: 'fill-error-500', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </motion.div>

          {/* Weekly Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border border-primary/10">
              <CardHeader className="border-b border-primary/10">
                <h2 className="text-xl font-bold text-primary">Weekly Bookings</h2>
              </CardHeader>
              <CardBody className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" className="stroke-fg-muted" />
                    <YAxis className="stroke-fg-muted" />
                    <Tooltip />
                    <Bar dataKey="bookings" className="fill-accent-500" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10">
              <h2 className="text-2xl font-bold text-primary">Upcoming Trips</h2>
              <Button
                href="/operator/trips/new"
                className="bg-accent text-white font-semibold"
              >
                Create Trip
              </Button>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {upcomingTrips.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary text-lg mb-2">
                          {trip.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                          <span className="flex items-center gap-1">
                            <Icon path={mdiMapMarker} size={0.6} aria-hidden={true} />
                            {trip.route}
                          </span>
                          <span>{trip.departure}</span>
                          <span>
                            {trip.passengers}/{trip.capacity} passengers
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col md:text-right gap-2">
                        <p className="text-lg font-bold text-accent">
                          ₦{trip.revenue.toLocaleString()}
                        </p>
                        <span
                          className={`text-xs font-semibold w-fit md:ml-auto px-3 py-1 rounded-full ${
                            trip.status === 'ongoing'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
