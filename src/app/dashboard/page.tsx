'use client'

import { Card, CardBody, CardHeader, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { Bookmark, Calendar, LogOut, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { useAuth } from '@/src/hooks/use-auth'
import { createClient } from '@/src/lib/supabase/client'

interface Booking {
  id: string
  trip_id: string
  booking_reference: string
  number_of_passengers: number
  total_amount: number
  booking_status: string
  created_at: string
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setBookings(bookingsData || [])
      } catch (err) {
        console.error('Error fetching bookings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const handleLogout = async () => {
    await signOut()
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent animate-spin mx-auto mb-4" />
          <p className="text-foreground/60 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
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
              href="/book"
              className="bg-accent text-white font-semibold"
            >
              Book Trip
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-primary"
              startIcon={<LogOut className="w-4 h-4" />}
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-lg text-foreground/60">
            Manage your bookings and explore new adventures
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm mb-2">Total Bookings</p>
                    <p className="text-4xl font-bold text-primary">{bookings.length}</p>
                  </div>
                  <Bookmark className="w-10 h-10 text-primary/30" />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm mb-2">Amount Spent</p>
                    <p className="text-4xl font-bold text-accent">
                      ₦{bookings.reduce((sum, b) => sum + b.total_amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <MapPin className="w-10 h-10 text-accent/30" />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-400/10 to-blue-400/5 border border-blue-400/20">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm mb-2">Completed Trips</p>
                    <p className="text-4xl font-bold text-blue-600">
                      {bookings.filter((b) => b.booking_status === 'completed').length}
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600/30" />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>

        {/* Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white border border-primary/10">
            <CardHeader className="flex flex-col items-start px-6 py-4 border-b border-primary/10">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Your Bookings
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                  <p className="text-lg text-foreground/60 mb-6">
                    You haven't booked any trips yet
                  </p>
                  <Button
                    href="/book"
                    className="bg-gradient-to-r from-primary to-accent text-white font-semibold"
                  >
                    Book Your First Trip
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking, idx) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 mb-4 md:mb-0">
                          <p className="font-semibold text-primary mb-2">
                            Booking #{booking.booking_reference}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {booking.number_of_passengers} passengers
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col md:text-right gap-2 md:gap-0">
                          <p className="text-lg font-bold text-primary">
                            ₦{booking.total_amount.toLocaleString()}
                          </p>
                          <span
                            className={`text-xs font-semibold w-fit md:ml-auto px-3 py-1 rounded-full ${
                              booking.booking_status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : booking.booking_status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {booking.booking_status.charAt(0).toUpperCase() +
                              booking.booking_status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
