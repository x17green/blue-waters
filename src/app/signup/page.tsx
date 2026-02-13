'use client'

import { Button, Card, CardBody, Checkbox, Input, Select, SelectItem } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { Lock, Mail, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { signup } from '@/src/app/auth/actions'

export default function SignUp() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!agreeToTerms) {
      setError('Please agree to terms and conditions')
      return
    }

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.message) {
        setSuccess(result.message)
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
          <h1 className="text-4xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-foreground/60">Join us for amazing boat journeys</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white border border-primary/10 shadow-xl">
          <CardBody className="p-8">
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

              {/* Full Name */}
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                startContent={<User className="w-4 h-4 text-primary" />}
                required
              />

              {/* Email */}
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                startContent={<Mail className="w-4 h-4 text-primary" />}
                required
              />

              {/* Phone */}
              <Input
                label="Phone Number"
                name="phone"
                placeholder="+234 (0) 800 000 0000"
                startContent={<Phone className="w-4 h-4 text-primary" />}
              />

              {/* User Type */}
              <Select
                label="I am a"
                name="userType"
                defaultSelectedKeys={['customer']}
              >
                <SelectItem key="customer" value="customer">
                  Customer (Book Trips)
                </SelectItem>
                <SelectItem key="operator" value="operator">
                  Boat Operator (List Trips)
                </SelectItem>
              </Select>

              {/* Password */}
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                startContent={<Lock className="w-4 h-4 text-primary" />}
                required
              />

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                startContent={<Lock className="w-4 h-4 text-primary" />}
                required
              />

              {/* Terms Checkbox */}
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="text-primary"
              >
                <span className="text-sm text-foreground/70">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline font-semibold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                </span>
              </Checkbox>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 mt-6"
                size="lg"
              >
                {isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-primary/10">
              <p className="text-foreground/70 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </main>
  )
}
