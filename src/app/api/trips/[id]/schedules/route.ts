/**
 * Trip Schedules API Route
 * 
 * GET /api/trips/[id]/schedules - List trip schedules
 * POST /api/trips/[id]/schedules - Create new schedule (operator only)
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'

import { apiError, apiResponse, UnauthorizedError, verifyAuth, verifyRole } from '@/src/lib/api-auth'
import { prisma } from '@/src/lib/prisma.client'
import { getAvailableSeats } from '@/src/lib/seat-lock'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

const createScheduleSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  capacity: z.number().int().min(1).max(500),
  departurePort: z.string().min(2),
  arrivalPort: z.string().min(2),
  priceTiers: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    priceKobo: z.number().int().min(100),
    capacity: z.number().int().optional(),
  })),
})

/**
 * GET /api/trips/[id]/schedules
 * List all schedules for a trip
 */
export async function GET(
  request: NextRequest,
  context: RouteParams,
) {
  try {
    const { id } = await context.params
    const { searchParams } = new URL(request.url)
    
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = { tripId: id }

    if (startDate) {
      where.startTime = { gte: new Date(startDate) }
    }

    if (endDate) {
      where.startTime = { ...where.startTime, lte: new Date(endDate) }
    }

    if (status) {
      where.status = status
    }

    // Fetch schedules
    const schedules = await prisma.tripSchedule.findMany({
      where,
      include: {
        trip: {
          include: {
            vessel: true,
          },
        },
        priceTiers: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    })

    // Get real-time available seats for each schedule
    const schedulesWithAvailability = await Promise.all(
      schedules.map(async (schedule) => {
        const availableSeats = await getAvailableSeats(schedule.id)

        return {
          id: schedule.id,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          departurePort: schedule.departurePort,
          arrivalPort: schedule.arrivalPort,
          capacity: schedule.capacity,
          bookedSeats: schedule.bookedSeats,
          availableSeats,
          status: schedule.status,
          priceTiers: schedule.priceTiers.map((pt) => ({
            id: pt.id,
            name: pt.name,
            description: pt.description,
            price: (pt.priceKobo || 0) / 100,
            capacity: pt.capacity,
          })),
          bookingsCount: schedule._count.bookings,
          trip: {
            title: schedule.trip.title,
            vessel: schedule.trip.vessel?.name,
          },
        }
      }),
    )

    return apiResponse({
      schedules: schedulesWithAvailability,
    })

  } catch (error) {
    console.error('Error fetching schedules:', error)
    return apiError('Failed to fetch schedules', 500)
  }
}

/**
 * POST /api/trips/[id]/schedules
 * Create new schedule for a trip (operator only)
 */
export async function POST(
  request: NextRequest,
  context: RouteParams,
) {
  try {
    const user = await verifyRole(request, ['operator', 'admin'])
    const { id: tripId } = await context.params
    const body = await request.json()
    const validatedData = createScheduleSchema.parse(body)

    // Verify trip exists and belongs to operator
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { operator: true, vessel: true },
    })

    if (!trip) {
      return apiError('Trip not found', 404)
    }

    const operator = await prisma.operator.findFirst({
      where: { userId: user.id },
    })

    if (user.role !== 'admin' && trip.operatorId !== operator?.id) {
      return apiError('Unauthorized to create schedule for this trip', 403)
    }

    // Validate capacity doesn't exceed vessel capacity
    if (validatedData.capacity > (trip.vessel?.capacity || 0)) {
      return apiError(
        `Capacity (${validatedData.capacity}) exceeds vessel capacity (${trip.vessel?.capacity})`,
        400,
      )
    }

    // Validate dates
    const startTime = new Date(validatedData.startTime)
    const endTime = new Date(validatedData.endTime)

    if (startTime >= endTime) {
      return apiError('End time must be after start time', 400)
    }

    if (startTime < new Date()) {
      return apiError('Cannot create schedule in the past', 400)
    }

    // Check for scheduling conflicts
    const conflictingSchedule = await prisma.tripSchedule.findFirst({
      where: {
        trip: {
          vesselId: trip.vesselId,
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
        status: { not: 'cancelled' },
      },
    })

    if (conflictingSchedule) {
      return apiError('Vessel is already scheduled for this time period', 409)
    }

    // Create schedule with price tiers (transaction)
    const schedule = await prisma.$transaction(async (tx) => {
      const newSchedule = await tx.tripSchedule.create({
        data: {
          tripId,
          startTime,
          endTime,
          capacity: validatedData.capacity,
          bookedSeats: 0,
          departurePort: validatedData.departurePort,
          arrivalPort: validatedData.arrivalPort,
          status: 'scheduled',
        },
      })

      // Create price tiers
      const priceTiers = await tx.priceTier.createMany({
        data: validatedData.priceTiers.map((tier) => ({
          tripScheduleId: newSchedule.id,
          name: tier.name,
          description: tier.description,
          amountKobo: BigInt(tier.priceKobo),
          capacity: tier.capacity,
        })),
      })

      return { schedule: newSchedule, priceTiers }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'trip_schedule',
        entityId: schedule.schedule.id,
        action: 'create',
        userId: user.id,
        changes: validatedData,
      },
    })

    return apiResponse({
      schedule: {
        id: schedule.schedule.id,
        startTime: schedule.schedule.startTime,
        endTime: schedule.schedule.endTime,
        capacity: schedule.schedule.capacity,
        departurePort: schedule.schedule.departurePort,
        arrivalPort: schedule.schedule.arrivalPort,
        status: schedule.schedule.status,
      },
      message: 'Schedule created successfully',
    }, 201)

  } catch (error) {
    console.error('Error creating schedule:', error)

    if (error instanceof UnauthorizedError) {
      return apiError(error.message, 401)
    }

    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.errors[0].message}`, 400)
    }

    return apiError('Failed to create schedule', 500)
  }
}
