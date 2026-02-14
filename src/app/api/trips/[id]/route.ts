/**
 * Individual Trip API Route
 * 
 * GET /api/trips/[id] - Get trip details
 * PATCH /api/trips/[id] - Update trip (operator only)
 * DELETE /api/trips/[id] - Delete trip (operator only)
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'

import { apiError, apiResponse, UnauthorizedError, verifyAuth, verifyRole } from '@/src/lib/api-auth'
import { prisma } from '@/src/lib/prisma.client'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

const updateTripSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  durationMinutes: z.number().int().min(15).max(1440).optional(),
  category: z.enum(['tour', 'transport', 'charter', 'event']).optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  highlights: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
})

/**
 * GET /api/trips/[id]
 * Get detailed trip information
 */
export async function GET(
  request: NextRequest,
  context: RouteParams,
) {
  try {
    const { id } = await context.params

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        vessel: true,
        operator: {
          include: {
            user: {
              select: {
                fullName: true,
                phone: true,
              },
            },
          },
        },
        schedules: {
          where: {
            startTime: { gte: new Date() },
            status: 'scheduled',
          },
          orderBy: { startTime: 'asc' },
          include: {
            _count: {
              select: { bookings: true },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!trip) {
      return apiError('Trip not found', 404)
    }

    // Calculate statistics
    const totalBookings = await prisma.booking.count({
      where: {
        tripSchedule: {
          tripId: id,
        },
        status: 'confirmed',
      },
    })

    const avgRating = trip.reviews.length > 0
      ? trip.reviews.reduce((sum: number, r) => sum + r.rating, 0) / trip.reviews.length
      : 0

    return apiResponse({
      trip: {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        category: trip.category,
        durationMinutes: trip.durationMinutes,
        highlights: trip.highlights,
        amenities: trip.amenities,
        vessel: trip.vessel,
        operator: trip.operator ? {
          id: trip.operator.id,
          companyName: trip.operator.companyName,
          rating: trip.operator.rating ? Number(trip.operator.rating) : null,
          contact: trip.operator.user,
        } : null,
        schedules: trip.schedules.map((s) => ({
          id: s.id,
          startTime: s.startTime,
          endTime: s.endTime,
          capacity: s.capacity,
          bookedSeats: s.bookedSeats,
          availableSeats: s.capacity - s.bookedSeats,
          status: s.status,
          bookingsCount: s._count.bookings,
        })),
        reviews: trip.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          userName: r.user.fullName,
          createdAt: r.createdAt,
        })),
        statistics: {
          totalBookings,
          averageRating: Number(avgRating.toFixed(1)),
          reviewCount: trip.reviews.length,
          upcomingSchedules: trip.schedules.length,
        },
        createdAt: trip.createdAt,
        updatedAt: trip.updatedAt,
      },
    })

  } catch (error) {
    console.error('Error fetching trip:', error)
    return apiError('Failed to fetch trip', 500)
  }
}

/**
 * PATCH /api/trips/[id]
 * Update trip (operator only)
 */
export async function PATCH(
  request: NextRequest,
  context: RouteParams,
) {
  try {
    const user = await verifyRole(request, ['operator', 'admin'])
    const { id } = await context.params
    const body = await request.json()
    const validatedData = updateTripSchema.parse(body)

    // Verify trip exists
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { operator: true },
    })

    if (!trip) {
      return apiError('Trip not found', 404)
    }

    // Verify operator owns this trip (unless admin)
    const operator = await prisma.operator.findFirst({
      where: { userId: user.id },
    })

    if (user.role !== 'admin' && trip.operatorId !== operator?.id) {
      return apiError('Unauthorized to update this trip', 403)
    }

    // Update trip
    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: validatedData,
      include: {
        vessel: true,
        operator: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'trip',
        entityId: id,
        action: 'update',
        userId: user.id,
        changes: validatedData,
      },
    })

    return apiResponse({
      trip: updatedTrip,
      message: 'Trip updated successfully',
    })

  } catch (error) {
    console.error('Error updating trip:', error)

    if (error instanceof UnauthorizedError) {
      return apiError(error.message, 401)
    }

    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.errors[0].message}`, 400)
    }

    return apiError('Failed to update trip', 500)
  }
}

/**
 * DELETE /api/trips/[id]
 * Archive trip (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  context: RouteParams,
) {
  try {
    const user = await verifyRole(request, ['operator', 'admin'])
    const { id } = await context.params

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { operator: true },
    })

    if (!trip) {
      return apiError('Trip not found', 404)
    }

    // Verify ownership
    const operator = await prisma.operator.findFirst({
      where: { userId: user.id },
    })

    if (user.role !== 'admin' && trip.operatorId !== operator?.id) {
      return apiError('Unauthorized to delete this trip', 403)
    }

    // Check for active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        tripSchedule: {
          tripId: id,
        },
        status: { in: ['held', 'confirmed'] },
      },
    })

    if (activeBookings > 0) {
      return apiError(
        `Cannot delete trip with ${activeBookings} active bookings`,
        400,
      )
    }

    // Soft delete (archive)
    await prisma.trip.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'trip',
        entityId: id,
        action: 'delete',
        userId: user.id,
        changes: { status: 'archived' },
      },
    })

    return apiResponse({
      message: 'Trip archived successfully',
    })

  } catch (error) {
    console.error('Error deleting trip:', error)

    if (error instanceof UnauthorizedError) {
      return apiError(error.message, 401)
    }

    return apiError('Failed to delete trip', 500)
  }
}
