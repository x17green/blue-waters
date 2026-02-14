'use client'

import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiArrowLeft, mdiEmail } from '@mdi/js'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { requestPasswordReset } from '@/src/app/auth/actions'

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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-600 to-accent-400 flex items-center justify-center">
              <span className="text-white font-bold">⛵</span>
            </div>
            <p className="font-bold text-xl text-accent-500">Blue Waters</p>
          </Link>
          <h1 className="text-4xl font-bold text-accent-500 mb-2">Reset Password</h1>
          <p className="text-fg-muted">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-lg shadow-xl p-8">
          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-success-300/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon path={mdiEmail} size={1.33} className="text-success-600" aria-hidden={true} />
              </div>
              <h2 className="text-xl font-semibold text-fg mb-2">Check Your Email</h2>
              <p className="text-fg-muted mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-fg-dim mb-6">
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
                  className="bg-error-500/10 border border-error-300 text-error-300 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-fg mb-2">
                  Email Address
                </label>
                <div className="flex items-center border border-border rounded-lg px-3 py-2 glass-subtle focus-within:border-accent-500 transition-colors">
                  <Icon path={mdiEmail} size={0.6} className="text-accent-500 mr-2" aria-hidden={true} />
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent outline-none text-fg placeholder:text-fg-dim"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-accent-600 to-accent-400 text-white font-semibold py-3 mt-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-70"
              >
                {isPending ? 'Sending...' : 'Send Reset Link'}
              </button>

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
