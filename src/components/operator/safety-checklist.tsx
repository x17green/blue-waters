'use client'

/**
 * Safety Checklist Component
 * Pre-departure safety verification for operators
 */

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Shield,
} from 'lucide-react'

interface SafetyChecklistItem {
  id: string
  category: 'vessel' | 'safety' | 'passenger' | 'crew'
  label: string
  description: string
  required: boolean
}

const SAFETY_CHECKLIST: SafetyChecklistItem[] = [
  // Vessel Checks
  {
    id: 'vessel-inspection',
    category: 'vessel',
    label: 'Vessel Visual Inspection',
    description: 'Hull, deck, and engine compartment inspected',
    required: true,
  },
  {
    id: 'fuel-level',
    category: 'vessel',
    label: 'Fuel Level Check',
    description: 'Sufficient fuel for journey plus reserve',
    required: true,
  },
  {
    id: 'engine-test',
    category: 'vessel',
    label: 'Engine Test',
    description: 'Engine started and tested successfully',
    required: true,
  },
  {
    id: 'navigation-lights',
    category: 'vessel',
    label: 'Navigation Lights',
    description: 'All navigation lights functional',
    required: true,
  },
  {
    id: 'communication-systems',
    category: 'vessel',
    label: 'Communication Systems',
    description: 'Radio and emergency communication devices operational',
    required: true,
  },

  // Safety Equipment
  {
    id: 'life-jackets',
    category: 'safety',
    label: 'Life Jackets',
    description: 'Sufficient life jackets for all passengers and crew',
    required: true,
  },
  {
    id: 'fire-extinguishers',
    category: 'safety',
    label: 'Fire Extinguishers',
    description: 'Fire extinguishers accessible and charged',
    required: true,
  },
  {
    id: 'first-aid-kit',
    category: 'safety',
    label: 'First Aid Kit',
    description: 'First aid kit fully stocked and accessible',
    required: true,
  },
  {
    id: 'emergency-flares',
    category: 'safety',
    label: 'Emergency Flares',
    description: 'Flares and emergency signals available',
    required: false,
  },
  {
    id: 'life-raft',
    category: 'safety',
    label: 'Life Raft/Dinghy',
    description: 'Emergency life raft inflated and ready',
    required: false,
  },

  // Passenger Checks
  {
    id: 'passenger-count',
    category: 'passenger',
    label: 'Passenger Count Verification',
    description: 'Match manifest count with actual passengers',
    required: true,
  },
  {
    id: 'passenger-briefing',
    category: 'passenger',
    label: 'Safety Briefing',
    description: 'Safety briefing provided to all passengers',
    required: true,
  },
  {
    id: 'capacity-check',
    category: 'passenger',
    label: 'Capacity Compliance',
    description: 'Vessel not exceeding licensed capacity',
    required: true,
  },
  {
    id: 'luggage-secured',
    category: 'passenger',
    label: 'Luggage Secured',
    description: 'All luggage properly stowed and secured',
    required: true,
  },

  // Crew Checks
  {
    id: 'crew-present',
    category: 'crew',
    label: 'Crew Present',
    description: 'All required crew members on board',
    required: true,
  },
  {
    id: 'captain-briefing',
    category: 'crew',
    label: 'Captain Briefing',
    description: 'Captain briefed on weather and route conditions',
    required: true,
  },
]

interface SafetyChecklistProps {
  tripId: string
  scheduleId: string
  onComplete?: (checklist: Record<string, boolean>, notes: string) => void
}

export function SafetyChecklist({
  tripId,
  scheduleId,
  onComplete,
}: SafetyChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Toggle checklist item
  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  // Check if all required items are checked
  const requiredItems = SAFETY_CHECKLIST.filter((item) => item.required)
  const requiredChecked = requiredItems.filter(
    (item) => checkedItems[item.id]
  ).length
  const allRequiredChecked = requiredChecked === requiredItems.length

  // Calculate progress
  const totalChecked = Object.values(checkedItems).filter(Boolean).length
  const progressPercentage = (totalChecked / SAFETY_CHECKLIST.length) * 100

  // Group items by category
  const groupedItems = SAFETY_CHECKLIST.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, SafetyChecklistItem[]>
  )

  const categoryLabels = {
    vessel: 'Vessel Checks',
    safety: 'Safety Equipment',
    passenger: 'Passenger Checks',
    crew: 'Crew Checks',
  }

  const categoryIcons = {
    vessel: Shield,
    safety: AlertTriangle,
    passenger: ClipboardCheck,
    crew: CheckCircle2,
  }

  // Handle submission
  const handleSubmit = () => {
    if (!allRequiredChecked) {
      alert('Please complete all required safety checks')
      return
    }

    setSubmitted(true)

    if (onComplete) {
      onComplete(checkedItems, notes)
    }
  }

  if (submitted) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            Safety Checklist Complete
          </h3>
          <p className="text-muted-foreground">
            All safety requirements verified. Vessel cleared for departure.
          </p>
          <Button
            className="mt-6"
            onClick={() => setSubmitted(false)}
            variant="outline"
          >
            Review Checklist
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Pre-Departure Safety Checklist
            </CardTitle>
            <CardDescription>
              Verify all safety requirements before departure
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-base">
            {totalChecked} / {SAFETY_CHECKLIST.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Alert */}
        {!allRequiredChecked && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Required Items Remaining</AlertTitle>
            <AlertDescription>
              {requiredChecked} of {requiredItems.length} required safety checks
              completed
            </AlertDescription>
          </Alert>
        )}

        {/* Checklist Items by Category */}
        {Object.entries(groupedItems).map(([category, items]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          return (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              <div className="space-y-3 pl-7">
                {items.map((item) => {
                  const isChecked = checkedItems[item.id] || false
                  return (
                    <div
                      key={item.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={item.id}
                        checked={isChecked}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={item.id}
                          className="text-base font-medium cursor-pointer flex items-center gap-2"
                        >
                          {item.label}
                          {item.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Notes Section */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-base font-semibold">
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Any observations, issues, or special conditions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {allRequiredChecked ? (
            <span className="text-green-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              All required checks complete
            </span>
          ) : (
            <span className="text-orange-600 font-medium flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {requiredItems.length - requiredChecked} required items remaining
            </span>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!allRequiredChecked}
          size="lg"
          className="gap-2"
        >
          <CheckCircle2 className="h-5 w-5" />
          Complete Checklist & Clear for Departure
        </Button>
      </CardFooter>
    </Card>
  )
}
