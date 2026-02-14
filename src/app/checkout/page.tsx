'use client'

import { Card, CardBody, CardHeader, Checkbox, Input, Navbar, NavbarBrand, Select, SelectItem } from '@nextui-org/react'
import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiArrowLeft, mdiOfficeBuilding, mdiCheckCircle, mdiCreditCard, mdiCellphone } from '@mdi/js'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { useAuth } from '@/src/hooks/use-auth'
import { createClient } from '@/src/lib/supabase/client'

const mockTrips: any = {
  '1': { name: 'Express Commute', price: 3500 },
  '2': { name: 'Bayelsa Heritage Cruise', price: 5000 },
  '3': { name: 'Scenic Waterfront Tour', price: 6000 },
  '4': { name: 'Evening Cruise', price: 12000 },
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const tripId = searchParams.get('trip')
  const passengersCount = Number(searchParams.get('passengers')) || 1
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingRef, setBookingRef] = useState('')

  const trip = tripId ? mockTrips[tripId] : null
  const subtotal = trip ? trip.price * passengersCount : 0
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + serviceFee

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    // Card details
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: '',
    // Bank transfer
    bankName: '',
    accountName: '',
    accountNumber: '',
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateBookingReference = () => {
    return 'BW' + Date.now().toString().slice(-8)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const bookingRef = generateBookingReference()
      // TODO: Insert booking into database when backend is ready
      const _bookingData = {
        user_id: user?.id,
        trip_id: tripId,
        number_of_passengers: passengersCount,
        total_amount: total,
        booking_status: 'pending',
        payment_status: 'pending',
        booking_reference: bookingRef,
        special_requests: '',
      }

      // In a real app, you would create the booking in the database
      // For now, we'll just simulate success
      setBookingRef(bookingRef)
      setBookingComplete(true)
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (bookingComplete) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-bg-800">
        <Navbar className="glass backdrop-blur-lg border-b border-border">
          <NavbarBrand>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-600 to-accent-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⛵</span>
              </div>
              <p className="font-bold text-xl text-accent-500">Blue Waters</p>
            </Link>
          </NavbarBrand>
        </Navbar>

        <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-8 flex justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Icon path={mdiCheckCircle} size={4} className="text-success-500" aria-hidden={true} />
              </motion.div>
            </div>

            <h1 className="text-4xl font-bold text-accent-500 mb-4">Booking Confirmed!</h1>
            <p className="text-lg text-fg-muted mb-8">
              Your trip is now booked. Get ready for an amazing journey!
            </p>

            <Card className="glass-subtle border border-border mb-8">
              <CardBody className="p-8">
                <div className="space-y-6">
                  <div className="bg-accent-500/10 rounded-lg p-4">
                    <p className="text-sm text-fg-muted mb-1">Booking Reference</p>
                    <p className="text-3xl font-bold text-accent-500 font-mono">{bookingRef}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-fg-muted mb-1">Trip</p>
                      <p className="font-semibold text-fg">{trip?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-fg-muted mb-1">Passengers</p>
                      <p className="font-semibold text-fg">{passengersCount}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-fg-muted">Subtotal</span>
                      <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-fg-muted">Service Fee</span>
                      <span className="font-semibold">₦{serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-4">
                      <span className="font-bold text-accent-500">Total Paid</span>
                      <span className="font-bold text-accent-500 text-2xl">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="space-y-3 mb-8">
              <p className="text-fg-muted mb-6">
                A confirmation email has been sent to your registered email address.
              </p>
              <Button
                href="/dashboard"
                className="w-full bg-gradient-to-r from-accent-600 to-accent-400 text-white font-bold text-lg py-3"
                size="lg"
              >
                View My Bookings
              </Button>
              <Button
                href="/"
                variant="outline"
                className="w-full border-border text-accent-500 font-bold text-lg py-3"
                size="lg"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-bg-800">
      <Navbar className="glass backdrop-blur-lg border-b border-border">
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-600 to-accent-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">⛵</span>
            </div>
            <p className="font-bold text-xl text-accent-500">Blue Waters</p>
          </Link>
        </NavbarBrand>
      </Navbar>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            href="/book"
            variant="ghost"
            startIcon={<Icon path={mdiArrowLeft} size={0.6} aria-hidden={true} />}
            className="mb-4 text-accent-500"
          >
            Back to Booking
          </Button>
          <h1 className="text-4xl font-bold text-accent-500 mb-2">Secure Checkout</h1>
          <p className="text-lg text-fg-muted">
            Complete your booking with a secure payment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Contact Information */}
              <Card className="border border-border">
                <CardHeader className="border-b border-border">
                  <h2 className="text-xl font-bold text-accent-500">Contact Information</h2>
                </CardHeader>
                <CardBody className="space-y-4 p-6">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+234 800 000 0000"
                    required
                  />
                </CardBody>
              </Card>

              {/* Payment Method */}
              <Card className="border border-border">
                <CardHeader className="border-b border-border">
                  <h2 className="text-xl font-bold text-accent-500">Payment Method</h2>
                </CardHeader>
                <CardBody className="p-6">
                  <Tabs
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="card" className="flex gap-2">
                        <Icon path={mdiCreditCard} size={0.6} aria-hidden={true} />
                        Card
                      </TabsTrigger>
                      <TabsTrigger value="mobile" className="flex gap-2">
                        <Icon path={mdiCellphone} size={0.6} aria-hidden={true} />
                        Mobile Money
                      </TabsTrigger>
                      <TabsTrigger value="bank" className="flex gap-2">
                        <Icon path={mdiOfficeBuilding} size={0.6} aria-hidden={true} />
                        Bank
                      </TabsTrigger>
                    </TabsList>

                    {/* Card Payment */}
                    <TabsContent value="card" className="space-y-4">
                      <Input
                        label="Cardholder Name"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                      <Input
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                        />
                        <Input
                          label="CVV"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleInputChange}
                          placeholder="123"
                          type="password"
                          maxLength={3}
                        />
                      </div>
                    </TabsContent>

                    {/* Mobile Money */}
                    <TabsContent value="mobile" className="space-y-4">
                      <div className="bg-info-500/10 border border-info-300 rounded-lg p-4">
                        <p className="text-sm text-info-300">
                          You will be redirected to your mobile money provider to complete the payment.
                        </p>
                      </div>
                      <Select label="Mobile Provider">
                        <SelectItem key="mtn" value="mtn">
                          MTN Mobile Money
                        </SelectItem>
                        <SelectItem key="airtel" value="airtel">
                          Airtel Money
                        </SelectItem>
                        <SelectItem key="glo" value="glo">
                          Glo Mobile Money
                        </SelectItem>
                      </Select>
                      <Input
                        label="Phone Number"
                        placeholder="+234 800 000 0000"
                      />
                    </TabsContent>

                    {/* Bank Transfer */}
                    <TabsContent value="bank" className="space-y-4">
                      <div className="bg-warning-500/10 border border-warning-300 rounded-lg p-4">
                        <p className="text-sm text-warning-300">
                          Transfer funds to our account and your booking will be confirmed upon payment verification.
                        </p>
                      </div>
                      <Select label="Bank Name">
                        <SelectItem key="gtb" value="gtb">
                          Guaranty Trust Bank
                        </SelectItem>
                        <SelectItem key="access" value="access">
                          Access Bank
                        </SelectItem>
                        <SelectItem key="zenith" value="zenith">
                          Zenith Bank
                        </SelectItem>
                      </Select>
                      <Input label="Account Name" disabled value="Blue Waters Bayelsa" />
                      <Input label="Account Number" disabled value="1234567890" />
                    </TabsContent>
                  </Tabs>
                </CardBody>
              </Card>

              {/* Terms & Conditions */}
              <Checkbox className="text-accent-500">
                <span className="text-sm text-fg-muted">
                  I agree to the booking terms and payment policy
                </span>
              </Checkbox>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-accent-600 to-accent-400 text-white font-bold text-lg py-3"
                size="lg"
              >
                {loading ? 'Processing Payment...' : 'Complete Booking'}
              </Button>
            </motion.form>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-8 h-fit"
          >
            <Card className="bg-gradient-to-b from-accent-500/10 to-accent-500/5 border-2 border-accent-500">
              <CardHeader className="border-b border-border">
                <h3 className="text-xl font-bold text-accent-500">Order Summary</h3>
              </CardHeader>
              <CardBody className="space-y-4 p-6">
                <div>
                  <p className="text-sm text-fg-muted mb-1">Trip</p>
                  <p className="font-bold text-fg">{trip?.name}</p>
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-muted">Price × {passengersCount}</span>
                    <span className="font-semibold">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-muted">Service Fee (5%)</span>
                    <span className="font-semibold">₦{serviceFee.toLocaleString()}</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-bold text-accent-500">Total Amount</span>
                  <span className="font-bold text-2xl text-accent-500">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function CheckoutLoadingFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-bg-800">
      <Navbar className="glass backdrop-blur-lg border-b border-border">
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-600 to-accent-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">⛵</span>
            </div>
            <p className="font-bold text-xl text-accent-500">Blue Waters</p>
          </Link>
        </NavbarBrand>
      </Navbar>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-accent-500/20 rounded w-1/3"></div>
          <div className="h-64 bg-accent-500/10 rounded"></div>
        </div>
      </div>
    </main>
  )
}

export default function Checkout() {
  return (
    <Suspense fallback={<CheckoutLoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}
