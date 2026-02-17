import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Icon from '@mdi/react'
import { mdiChevronLeft, mdiShield } from '@mdi/js'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icon path={mdiShield} size={1.33} className="text-primary" aria-hidden={true} />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: February 14, 2026</p>
        </div>

        <Card className="glass-card border-primary/50">\n          <CardContent className="pt-6">
            <p className="text-sm">
              Bayelsa Boat Club ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our booking services. Please read this policy carefully.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <h4 className="font-semibold">1.1 Personal Information</h4>
            <p>When you book a trip with us, we collect:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Full name (as appears on government-issued ID)</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Date of birth (for age verification)</li>
              <li>Gender (optional)</li>
              <li>Emergency contact information</li>
              <li>Next of kin details (for safety records)</li>
            </ul>

            <h4 className="font-semibold">1.2 Payment Information</h4>
            <p>
              Payment card details are processed securely through our payment gateway (MetaTickets).
              We do not store complete card details on our servers. We only retain:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Last 4 digits of card number</li>
              <li>Cardholder name</li>
              <li>Transaction reference numbers</li>
            </ul>

            <h4 className="font-semibold">1.3 Booking Information</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Trip selection and schedule preferences</li>
              <li>Seat assignments</li>
              <li>Special requests or requirements</li>
              <li>Check-in status</li>
            </ul>

            <h4 className="font-semibold">1.4 Technical Information</h4>
            <p>
              When you access our platform, we automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Access times and pages viewed</li>
              <li>Referring website</li>
            </ul>

            <h4 className="font-semibold">1.5 Location Data</h4>
            <p>
              With your permission, we may collect location data to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Show nearby jetties and departure points</li>
              <li>Provide directions to boarding locations</li>
              <li>Send location-based notifications</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <p>We use your information to:</p>

            <h4 className="font-semibold">2.1 Provide Services</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Process and confirm bookings</li>
              <li>Issue digital tickets with QR codes</li>
              <li>Facilitate check-in procedures</li>
              <li>Process payments and refunds</li>
              <li>Send booking confirmations and updates</li>
            </ul>

            <h4 className="font-semibold">2.2 Communication</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Send trip reminders and updates</li>
              <li>Notify you of schedule changes or cancellations</li>
              <li>Respond to your inquiries</li>
              <li>Send important service announcements</li>
            </ul>

            <h4 className="font-semibold">2.3 Safety and Compliance</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Maintain passenger manifests for maritime safety regulations</li>
              <li>Verify identity at check-in</li>
              <li>Comply with Nigerian Maritime Safety Authority (NIMASA) requirements</li>
              <li>Respond to emergencies or safety incidents</li>
            </ul>

            <h4 className="font-semibold">2.4 Improvement and Analytics</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Analyze usage patterns to improve our services</li>
              <li>Conduct market research</li>
              <li>Develop new features and routes</li>
              <li>Optimize pricing and schedules</li>
            </ul>

            <h4 className="font-semibold">2.5 Marketing (with consent)</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Send promotional offers and newsletters</li>
              <li>Notify you about new routes or special deals</li>
              <li>Conduct customer satisfaction surveys</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>3. Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <p>We may share your information with:</p>

            <h4 className="font-semibold">3.1 Service Providers</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Payment processors (MetaTickets)</li>
              <li>SMS and email service providers</li>
              <li>Cloud hosting services</li>
              <li>Analytics providers</li>
            </ul>

            <h4 className="font-semibold">3.2 Regulatory Authorities</h4>
            <p>
              We share passenger manifests and safety records with:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Nigerian Maritime Safety Authority (NIMASA)</li>
              <li>Bayelsa State Water Transport Authority</li>
              <li>Law enforcement when legally required</li>
            </ul>

            <h4 className="font-semibold">3.3 Business Transfers</h4>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be
              transferred to the new entity.
            </p>

            <h4 className="font-semibold">3.4 Emergency Situations</h4>
            <p>
              We may disclose information to emergency services, hospitals, or next of kin in case
              of accidents or medical emergencies.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>4. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <p>We implement industry-standard security measures:</p>

            <h4 className="font-semibold">4.1 Technical Safeguards</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Encrypted database storage</li>
              <li>Regular security audits and penetration testing</li>
              <li>Firewall protection</li>
              <li>Access controls and authentication</li>
            </ul>

            <h4 className="font-semibold">4.2 Organizational Measures</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Employee training on data protection</li>
              <li>Confidentiality agreements with staff</li>
              <li>Limited access to personal data (need-to-know basis)</li>
              <li>Regular backups and disaster recovery plans</li>
            </ul>

            <h4 className="font-semibold">4.3 Payment Security</h4>
            <p>
              All payment processing is PCI-DSS compliant through our certified payment gateway.
              We never store complete payment card details.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>5. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <p>Under the Nigeria Data Protection Regulation (NDPR), you have the right to:</p>

            <h4 className="font-semibold">5.1 Access</h4>
            <p>
              Request a copy of the personal data we hold about you.
            </p>

            <h4 className="font-semibold">5.2 Correction</h4>
            <p>
              Update or correct inaccurate personal information through your account settings or by
              contacting us.
            </p>

            <h4 className="font-semibold">5.3 Deletion</h4>
            <p>
              Request deletion of your personal data, subject to legal and regulatory retention
              requirements (e.g., maritime safety records must be retained for 5 years).
            </p>

            <h4 className="font-semibold">5.4 Objection</h4>
            <p>
              Object to processing of your data for marketing purposes or based on legitimate
              interests.
            </p>

            <h4 className="font-semibold">5.5 Portability</h4>
            <p>
              Request your data in a structured, machine-readable format.
            </p>

            <h4 className="font-semibold">5.6 Marketing Preferences</h4>
            <p>
              Opt out of marketing communications at any time by:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Clicking "unsubscribe" in emails</li>
              <li>Replying "STOP" to SMS messages</li>
              <li>Adjusting preferences in your account settings</li>
            </ul>

            <p className="mt-4">
              To exercise these rights, contact our Data Protection Officer at:{' '}
              <a href="mailto:privacy@yenagoaboatclub.com" className="underline">
                privacy@yenagoaboatclub.com
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>6. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>We retain your personal data for:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Booking records:</strong> 5 years (maritime regulation requirement)
              </li>
              <li>
                <strong>Payment records:</strong> 7 years (tax and accounting requirements)
              </li>
              <li>
                <strong>Marketing data:</strong> Until you opt out or 2 years of inactivity
              </li>
              <li>
                <strong>Safety/incident reports:</strong> 10 years
              </li>
              <li>
                <strong>Account data:</strong> Until account deletion (subject to above minimums)
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>7. Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
            <p>We use cookies and similar technologies for:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Essential cookies:</strong> Required for booking system functionality
              </li>
              <li>
                <strong>Analytics cookies:</strong> To understand how you use our site
              </li>
              <li>
                <strong>Preference cookies:</strong> To remember your settings and preferences
              </li>
            </ul>
            <p>
              You can control cookies through your browser settings. Note that disabling essential
              cookies may affect site functionality.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>8. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              Our services are not directed to children under 13. We do not knowingly collect
              personal information from children under 13 without parental consent. Bookings for
              minors must be made by a parent or legal guardian.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>9. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              Your data is primarily stored in Nigeria. If we transfer data internationally (e.g.,
              to cloud service providers), we ensure adequate safeguards through:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Standard contractual clauses</li>
              <li>Privacy Shield frameworks</li>
              <li>Adequacy decisions</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>10. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              We may update this Privacy Policy periodically. We will notify you of material
              changes by:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Email notification</li>
              <li>Prominent notice on our website</li>
              <li>In-app notification</li>
            </ul>
            <p>
              Continued use of our services after changes constitutes acceptance of the updated
              policy.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>11. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>For privacy-related questions or concerns, contact:</p>
            <div className="mt-4 space-y-2">
              <p>
                <strong>Data Protection Officer</strong>
                <br />
                Bayelsa Boat Club
                <br />
                Yenagoa Central Jetty, Bayelsa State, Nigeria
              </p>
              <p>
                Email:{' '}
                <a href="mailto:privacy@yenagoaboatclub.com" className="underline">
                  privacy@yenagoaboatclub.com
                </a>
                <br />
                Phone: +234 XXX XXX XXXX
              </p>
            </div>

            <h4 className="font-semibold mt-6">Regulatory Authority</h4>
            <p>
              If you believe we have not handled your data properly, you may lodge a complaint with:
            </p>
            <p className="mt-2">
              <strong>Nigeria Data Protection Commission (NDPC)</strong>
              <br />
              Website:{' '}
              <a
                href="https://ndpc.gov.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                ndpc.gov.ng
              </a>
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By using Bayelsa Boat Club services, you acknowledge that you have read and understood
            this Privacy Policy.
          </p>
          <p className="mt-4">
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
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
