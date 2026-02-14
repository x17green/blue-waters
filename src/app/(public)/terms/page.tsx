import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Icon from '@mdi/react'
import { mdiChevronLeft } from '@mdi/js'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: February 14, 2026</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>1. Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              By accessing and using Yenagoa Boat Club's services, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you do not agree with
              any of these terms, you are prohibited from using our services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Use License</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <p>
              Permission is granted to temporarily access our booking services for personal,
              non-commercial transitory use only. This is the grant of a license, not a transfer
              of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>3. Booking and Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <h4 className="font-semibold">3.1 Booking Confirmation</h4>
            <p>
              A booking is confirmed only when full payment has been received and a confirmation
              email with QR code has been sent to the registered email address.
            </p>

            <h4 className="font-semibold">3.2 Payment</h4>
            <p>
              All payments must be made through our approved payment gateway (MetaTickets). We
              accept major debit/credit cards and bank transfers. Prices are displayed in Nigerian
              Naira (₦) and include all applicable taxes.
            </p>

            <h4 className="font-semibold">3.3 Seat Reservation</h4>
            <p>
              Seats are held for 10 minutes during the booking process. After this time, unpaid
              seats will be released for other customers.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>4. Cancellation and Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <h4 className="font-semibold">4.1 Customer Cancellation</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>More than 24 hours before departure:</strong> Full refund minus 10%
                processing fee
              </li>
              <li>
                <strong>12-24 hours before departure:</strong> 50% refund
              </li>
              <li>
                <strong>Less than 12 hours before departure:</strong> No refund
              </li>
              <li>
                <strong>No-show:</strong> No refund
              </li>
            </ul>

            <h4 className="font-semibold">4.2 Operator Cancellation</h4>
            <p>
              If a trip is cancelled by the operator due to weather, mechanical issues, or safety
              concerns, customers will receive:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Full refund within 5-7 business days, OR</li>
              <li>Free rebooking to the next available trip</li>
            </ul>

            <h4 className="font-semibold">4.3 Refund Processing</h4>
            <p>
              Approved refunds will be processed within 5-7 business days and credited to the
              original payment method.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>5. Passenger Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <p>Passengers must:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Arrive at least 30 minutes before scheduled departure</li>
              <li>Present valid government-issued identification and booking QR code</li>
              <li>Provide accurate personal information during booking</li>
              <li>Follow all safety instructions from crew members</li>
              <li>Not carry prohibited items (weapons, illegal substances, flammable materials)</li>
              <li>Respect other passengers and crew members</li>
              <li>Be responsible for their personal belongings</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>6. Safety and Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <h4 className="font-semibold">6.1 Safety Standards</h4>
            <p>
              All vessels operated by Yenagoa Boat Club meet Nigerian Maritime Safety regulations
              and are regularly inspected. Life jackets and safety equipment are provided on all
              trips.
            </p>

            <h4 className="font-semibold">6.2 Limitation of Liability</h4>
            <p>
              Yenagoa Boat Club is not liable for:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Delays or cancellations due to weather or circumstances beyond our control</li>
              <li>Loss or damage to personal belongings</li>
              <li>Injuries resulting from failure to follow safety instructions</li>
              <li>Indirect or consequential damages</li>
            </ul>

            <h4 className="font-semibold">6.3 Insurance</h4>
            <p>
              Basic passenger insurance is included in your ticket price. Passengers may purchase
              additional travel insurance independently.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>7. Special Conditions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <h4 className="font-semibold">7.1 Children</h4>
            <p>
              Children under 12 must be accompanied by an adult. Children under 2 travel free but
              must sit on an adult's lap.
            </p>

            <h4 className="font-semibold">7.2 Pregnant Passengers</h4>
            <p>
              Pregnant passengers must consult their doctor before travel. We may refuse boarding
              to passengers in advanced stages of pregnancy for safety reasons.
            </p>

            <h4 className="font-semibold">7.3 Medical Conditions</h4>
            <p>
              Passengers with medical conditions that may affect travel must inform us at the time
              of booking and present a doctor's clearance if requested.
            </p>

            <h4 className="font-semibold">7.4 Intoxication</h4>
            <p>
              We reserve the right to refuse boarding to passengers who appear intoxicated or under
              the influence of drugs.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>8. Changes to Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              We reserve the right to modify or discontinue services without notice. We may also
              change schedules, routes, and vessel assignments as needed for operational reasons.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>9. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes
              shall be resolved in the courts of Bayelsa State.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>10. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>For questions about these Terms of Service, please contact us:</p>
            <ul className="list-none space-y-2">
              <li>Email: legal@yenagoaboatclub.com</li>
              <li>Phone: +234 XXX XXX XXXX</li>
              <li>Address: Yenagoa Central Jetty, Bayelsa State, Nigeria</li>
            </ul>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By using our services, you acknowledge that you have read, understood, and agree to be
            bound by these Terms of Service.
          </p>
          <p className="mt-4">
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            {' • '}
            <Link href="/help" className="underline hover:text-foreground">
              Help Center
            </Link>
            {' • '}
            <Link href="/contact" className="underline hover:text-foreground">
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
