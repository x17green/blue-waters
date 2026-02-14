'use client'

import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiLock } from '@mdi/js'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useTransition } from 'react'

import { resetPassword } from '@/src/app/auth/actions'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    startTransition(async () => {
      const result = await resetPassword(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  return (
    <main className="min-h-screen bg-bg-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-fg mb-2">Create New Password</h1>
          <p className="text-fg-muted">Enter your new password below</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-lg shadow-soft p-8">
          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon path={mdiLock} size={1.33} className="text-success-500" aria-hidden={true} />
              </div>
              <h2 className="text-xl font-semibold text-fg mb-2">
                Password Reset Successful
              </h2>
              <p className="text-fg-muted mb-6">
                Your password has been updated successfully
              </p>
              <Button
                asChild
                className="w-full glass-strong border border-accent-500 bg-accent-500 hover:bg-accent-400 text-white shadow-soft"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-error-500/10 border border-error-500/20 text-error-500 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* New Password */}
              <div>
                <Label htmlFor="password" className="block text-sm font-semibold text-fg mb-2">
                  New Password
                </Label>
                <div className="relative">
                  <Icon path={mdiLock} size={0.6} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500" aria-hidden={true} />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    className="pl-10 glass-subtle border-border-subtle focus:border-accent-500"
                    required
                    minLength={6}
                    aria-describedby="password-description"
                  />
                </div>
                <p id="password-description" className="sr-only">
                  Enter a new password with at least 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-semibold text-fg mb-2">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Icon path={mdiLock} size={0.6} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500" aria-hidden={true} />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="pl-10 glass-subtle border-border-subtle focus:border-accent-500"
                    required
                    minLength={6}
                    aria-describedby="confirm-description"
                  />
                </div>
                <p id="confirm-description" className="sr-only">
                  Re-enter your new password to confirm
                </p>
              </div>

              {/* Password Requirements */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-foreground mb-2">
                  Password Requirements:
                </p>
                <ul className="text-xs text-foreground/60 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Mix of letters and numbers recommended</li>
                  <li>• Special characters recommended</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full glass-strong border border-accent-500 bg-accent-500 hover:bg-accent-400 text-white shadow-soft"
                disabled={isPending}
                aria-describedby={isPending ? "updating" : undefined}
              >
                {isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
