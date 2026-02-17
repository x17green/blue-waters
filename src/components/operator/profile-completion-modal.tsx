import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Button } from '@/src/components/ui/button'
import { useState } from 'react'

interface ProfileCompletionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileForm: {
    organizationName: string
    contactEmail: string
    contactPhone: string
  }
  setProfileForm: (form: any) => void
  onSave: () => void
  saving: boolean
  error?: string | null
}

export function ProfileCompletionModal({
  open,
  onOpenChange,
  profileForm,
  setProfileForm,
  onSave,
  saving,
  error
}: ProfileCompletionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border border-border-default max-w-md">
        <DialogHeader>
          <DialogTitle className="text-fg text-xl">Complete Your Operator Profile</DialogTitle>
          <DialogDescription className="text-fg-muted">
            Please provide your organization details to start managing your boat trips.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="orgName" className="text-fg">Organization Name *</Label>
            <Input
              id="orgName"
              value={profileForm.organizationName}
              onChange={(e) => setProfileForm((prev: any) => ({ ...prev, organizationName: e.target.value }))}
              placeholder="e.g., Bayelsa Boat Tours Ltd"
              className="glass-subtle border border-border mt-1"
            />
          </div>
          <div>
            <Label htmlFor="contactEmail" className="text-fg">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={profileForm.contactEmail}
              onChange={(e) => setProfileForm((prev: any) => ({ ...prev, contactEmail: e.target.value }))}
              placeholder="contact@yourcompany.com"
              className="glass-subtle border border-border mt-1"
            />
          </div>
          <div>
            <Label htmlFor="contactPhone" className="text-fg">Contact Phone</Label>
            <Input
              id="contactPhone"
              value={profileForm.contactPhone}
              onChange={(e) => setProfileForm((prev: any) => ({ ...prev, contactPhone: e.target.value }))}
              placeholder="+234 800 000 0000"
              className="glass-subtle border border-border mt-1"
            />
          </div>
          {error && <div className="text-error-500 text-sm pt-2">{error}</div>}
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="flex-1 glass-subtle border border-border-default"
            type="button"
          >
            Skip for Now
          </Button>
          <Button
            onClick={onSave}
            disabled={saving || !profileForm.organizationName.trim()}
            className="flex-1 bg-accent-600 hover:bg-accent-500 text-white"
            type="button"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
