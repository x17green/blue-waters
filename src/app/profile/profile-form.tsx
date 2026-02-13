'use client'

import { type User } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Mail, Phone, Save, User as UserIcon } from 'lucide-react'
import { useState, useTransition } from 'react'

import { updateProfile } from '@/src/app/auth/actions'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

interface ProfileFormProps {
  user: User
  userData: {
    fullName?: string
    phone?: string
  }
}

export default function ProfileForm({ user, userData }: ProfileFormProps) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess('Profile updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email Address
            </label>
            <div className="flex items-center border border-primary/20 rounded-lg px-3 py-2 bg-gray-50">
              <Mail className="w-4 h-4 text-primary mr-2" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-transparent outline-none text-foreground/70"
              />
            </div>
            <p className="text-xs text-foreground/50 mt-1">Email cannot be changed</p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
            <div className="flex items-center border border-primary/20 rounded-lg px-3 py-2 bg-white focus-within:border-primary transition-colors">
              <UserIcon className="w-4 h-4 text-primary mr-2" />
              <input
                name="fullName"
                type="text"
                defaultValue={userData.fullName || ''}
                placeholder="Enter your full name"
                className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/40"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Phone Number
            </label>
            <div className="flex items-center border border-primary/20 rounded-lg px-3 py-2 bg-white focus-within:border-primary transition-colors">
              <Phone className="w-4 h-4 text-primary mr-2" />
              <input
                name="phone"
                type="tel"
                defaultValue={userData.phone || ''}
                placeholder="+234 (0) 800 000 0000"
                className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/40"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button type="submit" disabled={isPending} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
