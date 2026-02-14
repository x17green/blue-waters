/**
 * Operator Dashboard Page
 * Comprehensive boarding management interface for operators
 */

import { BoardingDashboard } from '@/src/components/operator/boarding-dashboard'
import { SafetyChecklist } from '@/src/components/operator/safety-checklist'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Icon } from '@/src/components/ui/icon'
import { mdiFerry, mdiClipboardCheck } from '@mdi/js'

interface OperatorDashboardPageProps {
  params: Promise<{ scheduleId: string }>
  searchParams: Promise<{ tripId?: string }>
}

export default async function OperatorDashboardPage({
  params,
  searchParams,
}: OperatorDashboardPageProps) {
  const { scheduleId } = await params
  const { tripId } = await searchParams

  if (!tripId) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Trip ID Required
          </h1>
          <p className="text-muted-foreground">
            Please provide a tripId query parameter
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Icon path={mdiFerry} size={1.33} aria-hidden={true} />
            Operator Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Boarding management for Schedule {scheduleId}
          </p>
        </div>
      </div>

      <Tabs defaultValue="boarding" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="boarding" className="gap-2">
            <Icon path={mdiFerry} size={0.6} aria-hidden={true} />
            Boarding Management
          </TabsTrigger>
          <TabsTrigger value="safety" className="gap-2">
            <Icon path={mdiClipboardCheck} size={0.6} aria-hidden={true} />
            Safety Checklist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boarding" className="space-y-6">
          <BoardingDashboard tripId={tripId} scheduleId={scheduleId} />
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <SafetyChecklist
            tripId={tripId}
            scheduleId={scheduleId}
            onComplete={(checklist, notes) => {
              console.log('Safety checklist completed:', checklist, notes)
              // TODO: Save to database
              alert('Safety checklist submitted successfully!')
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
