'use client'

import { type User } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '@/src/components/ui/icon'
import { mdiChevronLeft, mdiLock, mdiLogout, mdiShieldAccount } from '@mdi/js'

import { signOut } from '@/src/app/auth/actions'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

import ProfileForm from './profile-form'

interface ProfileClientProps {
  user: User
  userData: {
    fullName?: string
    phone?: string
    role?: string
  }
}

export default function ProfileClient({ user, userData }: ProfileClientProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold">⛵</span>
              </div>
              <span className="font-bold text-xl text-primary">Bayelsa Boat Club</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Icon path={mdiChevronLeft} size={0.6} className="mr-2" aria-hidden={true} />
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <Icon path={mdiLogout} size={0.6} className="mr-2" aria-hidden={true} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Account Settings</h1>
            <p className="text-foreground/60">Manage your profile and account preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Form */}
              <ProfileForm user={user} userData={userData} />

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/forgot-password">
                    <Button variant="outline" className="w-full">
                      <Icon path={mdiLock} size={0.6} className="mr-2" aria-hidden={true} />
                      Change Password
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-foreground/50 mb-1">Role</p>
                    <div className="flex items-center gap-2">
                      <Icon path={mdiShieldAccount} size={0.6} className="text-primary" aria-hidden={true} />
                      <span className="text-sm font-medium capitalize">{userData.role}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/50 mb-1">Member Since</p>
                    <span className="text-sm">
                      {new Date(user.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/50 mb-1">Email Verified</p>
                    <span className="text-sm">
                      {user.email_confirmed_at ? (
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Pending</span>
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Permanent account actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" className="w-full" disabled>
                    Delete Account
                  </Button>
                  <p className="text-xs text-foreground/50 mt-2 text-center">
                    Contact support to delete your account
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
