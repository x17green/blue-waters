'use client'

import { motion } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { login } from '@/src/app/auth/actions'

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
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-foreground/60">Sign in to your Blue Waters account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-primary/10 shadow-xl p-8">
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

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <div className="flex items-center border border-primary/20 rounded-lg px-3 py-2 bg-white/50 focus-within:border-primary transition-colors">
                <Mail className="w-4 h-4 text-primary mr-2" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/40"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="flex items-center border border-primary/20 rounded-lg px-3 py-2 bg-white/50 focus-within:border-primary transition-colors">
                <Lock className="w-4 h-4 text-primary mr-2" />
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/40"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm text-foreground/70">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 mt-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-70"
            >
              {isPending ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-6 border-t border-primary/10">
            <p className="text-foreground/70 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-semibold">
                Create one now
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-2">Demo Credentials:</p>
            <p className="text-xs text-foreground/70">
              Email: <span className="font-mono text-primary">demo@bluewaters.com</span>
            </p>
            <p className="text-xs text-foreground/70">
              Password: <span className="font-mono text-primary">Demo@123456</span>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
