'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useTransition } from 'react'

import { resetPassword } from '@/src/app/auth/actions'

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
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold">⛵</span>
            </div>
            <p className="font-bold text-xl text-primary">Blue Waters</p>
          </Link>
          <h1 className="text-4xl font-bold text-primary mb-2">Create New Password</h1>
          <p className="text-foreground/60">Enter your new password below</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-primary/10 shadow-xl p-8">
          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Password Reset Successful
              </h2>
              <p className="text-foreground/60 mb-6">
                Your password has been updated successfully
              </p>
              <Link
                href="/login"
                className="inline-block w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
            </motion.div>
          ) : (
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

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  New Password
                </label>
                <div className="flex items-center border border-primary/20 rounded-lg px-3 py-2 bg-white/50 focus-within:border-primary transition-colors">
                  <Lock className="w-4 h-4 text-primary mr-2" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/40"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="flex items-center border border-primary/20 rounded-lg px-3 py-2 bg-white/50 focus-within:border-primary transition-colors">
                  <Lock className="w-4 h-4 text-primary mr-2" />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/40"
                    required
                    minLength={6}
                  />
                </div>
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
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 mt-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-70"
              >
                {isPending ? 'Updating...' : 'Update Password'}
              </button>
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
