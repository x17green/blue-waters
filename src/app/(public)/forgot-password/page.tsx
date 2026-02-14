'use client'

import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiArrowLeft, mdiEmail } from '@mdi/js'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { requestPasswordReset } from '@/src/app/auth/actions'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await requestPasswordReset(formData)
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
          <h1 className="text-4xl font-bold text-fg mb-2">Reset Password</h1>
          <p className="text-fg-muted">
            Enter your email and we'll send you a reset link
          </p>
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
                <Icon path={mdiEmail} size={1.33} className="text-success-500" aria-hidden={true} />
              </div>
              <h2 className="text-xl font-semibold text-fg mb-2">Check Your Email</h2>
              <p className="text-fg-muted mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-fg-subtle mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-accent-500 hover:underline font-semibold"
              >
                <Icon path={mdiArrowLeft} size={0.6} aria-hidden={true} />
                Back to Login
              </Link>
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

              {/* Email */}
              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-fg mb-2">
                  Email Address
                </Label>
                <div className="relative">
                  <Icon path={mdiEmail} size={0.6} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500" aria-hidden={true} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 glass-subtle border-border-subtle focus:border-accent-500"
                    required
                    aria-describedby="email-description"
                  />
                </div>
                <p id="email-description" className="sr-only">
                  Enter the email address associated with your account
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full glass-strong border border-accent-500 bg-accent-500 hover:bg-accent-400 text-white shadow-soft"
                disabled={isPending}
                aria-describedby={isPending ? "submitting" : undefined}
              >
                {isPending ? 'Sending...' : 'Send Reset Link'}
              </Button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent-500 transition-colors"
                >
                  <Icon path={mdiArrowLeft} size={0.6} aria-hidden={true} />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  )
}
