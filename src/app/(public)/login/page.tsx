'use client'

import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiAlertCircle, mdiLock, mdiEmail } from '@mdi/js'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { login } from '@/src/app/auth/actions'
import { Button } from '@/components/ui/button'
import { BlueWatersWordmark } from '@/src/components/brand'

/**
 * Login Page
 * 
 * Professional authentication page with glassmorphic design
 * Following design system: dark-first, muted nautical, design tokens
 * Layout provided by (public)/layout.tsx
 */
export default function LogIn() {
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
              <BlueWatersWordmark size="lg" showText={false} priority />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-fg mb-3">
              Welcome Back
            </h1>
            <p className="text-lg text-fg-muted">
              Sign in to your Yenagoa Boat Club account
            </p>
          </div>

          {/* Form Card */}
          <div className="glass border border-border-default rounded-lg p-8 shadow-[var(--shadow-medium)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-subtle border border-error-600 rounded-md p-4 flex items-start gap-3"
                >
                  <Icon path={mdiAlertCircle} size={0.8} className="text-error-500 flex-shrink-0 mt-0.5" aria-hidden={true} />
                  <p className="text-sm text-error-300 leading-relaxed">{error}</p>
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-fg mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon path={mdiEmail} size={0.8} className="text-accent-500" aria-hidden={true} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 glass-subtle border border-border-default rounded-md bg-glass-01 text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-fg mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon path={mdiLock} size={0.8} className="text-accent-500" aria-hidden={true} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-4 py-3 glass-subtle border border-border-default rounded-md bg-glass-01 text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border-default bg-glass-01 text-accent-500 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-bg-900 transition-all duration-200"
                  />
                  <span className="text-sm text-fg-muted group-hover:text-fg transition-colors duration-200">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-accent-400 hover:text-accent-300 font-semibold transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-accent-600 hover:bg-accent-500 text-white font-semibold py-3 rounded-md shadow-lg shadow-accent-900/30 border border-accent-700 transition-all duration-200 hover:shadow-xl hover:shadow-accent-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-border-subtle">
              <p className="text-center text-sm text-fg-muted">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-accent-400 hover:text-accent-300 font-semibold transition-colors duration-200"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 glass-subtle border border-accent-900 rounded-md p-4">
              <p className="text-xs font-semibold text-accent-400 mb-2 uppercase tracking-wide">
                Demo Credentials
              </p>
              <div className="space-y-1">
                <p className="text-xs text-fg-muted">
                  Email:{' '}
                  <span className="font-mono text-accent-300 bg-glass-01 px-2 py-0.5 rounded">
                    demo@bluewaters.com
                  </span>
                </p>
                <p className="text-xs text-fg-muted">
                  Password:{' '}
                  <span className="font-mono text-accent-300 bg-glass-01 px-2 py-0.5 rounded">
                    Demo@123456
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
  )
}
