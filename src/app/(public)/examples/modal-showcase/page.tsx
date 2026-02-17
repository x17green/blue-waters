"use client"

import { useState } from 'react'
import { ProfileCompletionModal } from '@/src/components/operator'
import { Button } from '@/src/components/ui/button'

export default function ModalShowcase() {
  const [open, setOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    organizationName: '',
    contactEmail: '',
    contactPhone: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setOpen(false)
      setError(null)
      alert('Profile saved!')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary p-8">
      <h1 className="text-3xl font-bold mb-6 text-fg">Profile Completion Modal Showcase</h1>
      <Button onClick={() => setOpen(true)} className="mb-8">Open Modal</Button>
      <ProfileCompletionModal
        open={open}
        onOpenChange={setOpen}
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        onSave={handleSave}
        saving={saving}
        error={error}
      />
    </div>
  )
}
