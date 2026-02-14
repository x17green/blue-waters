'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import Icon from "@mdi/react"
import { mdiContentSave, mdiRefresh, mdiCog, mdiShield, mdiCreditCard, mdiEmail, mdiBell, mdiFileDocument } from "@mdi/js"
import { useToast } from "@/hooks/use-toast"

interface Settings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    contactPhone: string
    timezone: string
    currency: string
  }
  booking: {
    maxAdvanceBookingDays: number
    minAdvanceBookingHours: number
    cancellationPolicy: string
    refundPolicy: string
    maxPassengersPerBooking: number
    requirePhoneVerification: boolean
  }
  payment: {
    supportedMethods: string[]
    currency: string
    taxRate: number
    serviceCharge: number
    paymentTimeoutMinutes: number
    autoRefundOnCancellation: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    bookingConfirmations: boolean
    paymentReminders: boolean
    adminAlerts: boolean
    marketingEmails: boolean
  }
  security: {
    sessionTimeoutHours: number
    passwordMinLength: number
    requireTwoFactor: boolean
    maxLoginAttempts: number
    ipWhitelist: string[]
    auditLogRetentionDays: number
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      } else {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "error"
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (section: keyof Settings, newSettings: any) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          section,
          settings: newSettings
        })
      })

      if (response.ok) {
        setSettings(prev => prev ? { ...prev, [section]: newSettings } : null)
        toast({
          title: "Success",
          description: "Settings updated successfully"
        })
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "error"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleGeneralSave = () => {
    if (settings) {
      updateSettings('general', settings.general)
    }
  }

  const handleBookingSave = () => {
    if (settings) {
      updateSettings('booking', settings.booking)
    }
  }

  const handlePaymentSave = () => {
    if (settings) {
      updateSettings('payment', settings.payment)
    }
  }

  const handleNotificationsSave = () => {
    if (settings) {
      updateSettings('notifications', settings.notifications)
    }
  }

  const handleSecuritySave = () => {
    if (settings) {
      updateSettings('security', settings.security)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Icon path={mdiRefresh} size={2} className="animate-spin mx-auto mb-4" />
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Failed to load settings</p>
          <Button onClick={fetchSettings} className="mt-4">
            <Icon path={mdiRefresh} size={0.75} className="mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
        <Button variant="outline" onClick={fetchSettings}>
          <Icon path={mdiRefresh} size={0.75} className="mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Icon path={mdiCog} size={0.75} />
            General
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Icon path={mdiFileDocument} size={0.75} />
            Booking
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <Icon path={mdiCreditCard} size={0.75} />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Icon path={mdiBell} size={0.75} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Icon path={mdiShield} size={0.75} />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site configuration and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contactEmail: e.target.value }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.general.contactPhone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contactPhone: e.target.value }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">West Africa Time (WAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteDescription: e.target.value }
                  })}
                />
              </div>

              <Button onClick={handleGeneralSave} disabled={saving}>
                <Icon path={mdiContentSave} size={0.75} className="mr-2" />
                {saving ? 'Saving...' : 'Save General Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Settings */}
        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>Configure booking policies and restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxAdvanceBookingDays">Max Advance Booking (Days)</Label>
                  <Input
                    id="maxAdvanceBookingDays"
                    type="number"
                    value={settings.booking.maxAdvanceBookingDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      booking: { ...settings.booking, maxAdvanceBookingDays: parseInt(e.target.value) }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPassengersPerBooking">Max Passengers per Booking</Label>
                  <Input
                    id="maxPassengersPerBooking"
                    type="number"
                    value={settings.booking.maxPassengersPerBooking}
                    onChange={(e) => setSettings({
                      ...settings,
                      booking: { ...settings.booking, maxPassengersPerBooking: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requirePhoneVerification"
                  checked={settings.booking.requirePhoneVerification}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    booking: { ...settings.booking, requirePhoneVerification: checked }
                  })}
                />
                <Label htmlFor="requirePhoneVerification">Require phone verification for bookings</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Textarea
                  id="cancellationPolicy"
                  value={settings.booking.cancellationPolicy}
                  onChange={(e) => setSettings({
                    ...settings,
                    booking: { ...settings.booking, cancellationPolicy: e.target.value }
                  })}
                />
              </div>

              <Button onClick={handleBookingSave} disabled={saving}>
                <Icon path={mdiContentSave} size={0.75} className="mr-2" />
                {saving ? 'Saving...' : 'Save Booking Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.payment.taxRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, taxRate: parseFloat(e.target.value) }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceCharge">Service Charge (%)</Label>
                  <Input
                    id="serviceCharge"
                    type="number"
                    step="0.1"
                    value={settings.payment.serviceCharge}
                    onChange={(e) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, serviceCharge: parseFloat(e.target.value) }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTimeoutMinutes">Payment Timeout (Minutes)</Label>
                  <Input
                    id="paymentTimeoutMinutes"
                    type="number"
                    value={settings.payment.paymentTimeoutMinutes}
                    onChange={(e) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, paymentTimeoutMinutes: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoRefundOnCancellation"
                  checked={settings.payment.autoRefundOnCancellation}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, autoRefundOnCancellation: checked }
                  })}
                />
                <Label htmlFor="autoRefundOnCancellation">Auto-refund on cancellation</Label>
              </div>

              <Button onClick={handlePaymentSave} disabled={saving}>
                <Icon path={mdiContentSave} size={0.75} className="mr-2" />
                {saving ? 'Saving...' : 'Save Payment Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and SMS notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, smsNotifications: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Booking Confirmations</Label>
                    <p className="text-sm text-muted-foreground">Send booking confirmation notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.bookingConfirmations}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, bookingConfirmations: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send payment reminder notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.paymentReminders}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, paymentReminders: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Admin Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to administrators</p>
                  </div>
                  <Switch
                    checked={settings.notifications.adminAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, adminAlerts: checked }
                    })}
                  />
                </div>
              </div>

              <Button onClick={handleNotificationsSave} disabled={saving}>
                <Icon path={mdiContentSave} size={0.75} className="mr-2" />
                {saving ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security policies and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeoutHours">Session Timeout (Hours)</Label>
                  <Input
                    id="sessionTimeoutHours"
                    type="number"
                    value={settings.security.sessionTimeoutHours}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeoutHours: parseInt(e.target.value) }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, passwordMinLength: parseInt(e.target.value) }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auditLogRetentionDays">Audit Log Retention (Days)</Label>
                  <Input
                    id="auditLogRetentionDays"
                    type="number"
                    value={settings.security.auditLogRetentionDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, auditLogRetentionDays: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requireTwoFactor"
                  checked={settings.security.requireTwoFactor}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    security: { ...settings.security, requireTwoFactor: checked }
                  })}
                />
                <Label htmlFor="requireTwoFactor">Require two-factor authentication</Label>
              </div>

              <Button onClick={handleSecuritySave} disabled={saving}>
                <Icon path={mdiContentSave} size={0.75} className="mr-2" />
                {saving ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}