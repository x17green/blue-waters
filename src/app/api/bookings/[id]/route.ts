/**
 * Individual Booking API Route
 * 
 * GET /api/bookings/[id] - Get booking details
 * PATCH /api/bookings/[id] - Update booking
 * DELETE /api/bookings/[id] - Cancel booking
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'

import { apiError, apiResponse, UnauthorizedError, verifyAuth } from '@/src/lib/api-auth'
import { prisma } from '@/src/lib/prisma.client'
import { releaseSeats } from '@/src/lib/seat-lock'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/bookings/[id]
 * Get booking details with QR code
 */
export async function GET(
  request: NextRequest,
  context: RouteParams,
) {
  try {
    const user = await verifyAuth(request)
    const { id } = await context.params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        tripSchedule: {
          include: {
            trip: {
              include: {
                vessel: true,
                operator: true,
              },
            },
          },
        },
        priceTier: true,
        passengers: true,
        items: true,
        checkinRecords: true,
      },
    })

    if (!booking) {
      return apiError('Booking not found', 404)
    }

    // Verify user owns this booking (or is staff/admin)
    if (booking.userId !== user.id && !['staff', 'admin'].includes(user.role)) {
      return apiError('Unauthorized', 403)
    }

    return apiResponse({
      booking: {
        id: booking.id,
        reference: booking.bookingReference,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        numberOfPassengers: booking.numberOfPassengers,
        totalAmount: Number(booking.totalAmountKobo) / 100,
        qrCode: booking.qrCode,
        createdAt: booking.createdAt,
        holdExpiresAt: booking.holdExpiresAt,
        tripSchedule: {
          id: booking.tripSchedule.id,
          startTime: booking.tripSchedule.startTime,
          endTime: booking.tripSchedule.endTime,
          departurePort: booking.tripSchedule.departurePort,
          arrivalPort: booking.tripSchedule.arrivalPort,
          status: booking.tripSchedule.status,
          trip: {
            title: booking.tripSchedule.trip.title,
            description: booking.tripSchedule.trip.description,
            durationMinutes: booking.tripSchedule.trip.durationMinutes,
          },
          vessel: {
            name: booking.tripSchedule.trip.vessel?.name,
            registrationNumber: booking.tripSchedule.trip.vessel?.registrationNo,
          },
          operator: {
            companyName: booking.tripSchedule.trip.operator?.companyName,
          },
        },
        priceTier: {
          name: booking.priceTier?.name,
          description: booking.priceTier?.description,
        },
        passengers: booking.passengers.map((p: any) => ({
          id: p.id,
          fullName: p.fullName,
          phone: p.phone,
          email: p.email,
        })),
        checkinRecords: booking.checkinRecords.map((c: any) => ({
          id: c.id,
          checkedInAt: c.checkedInAt,
          checkedInBy: c.checkedInBy,
        })),
      },
    })

  } catch (error) {
    console.error('Error fetching booking:', error)

    if (error instanceof UnauthorizedError) {
      return apiError(error.message, 401)
    }

    return apiError('Failed to fetch booking', 500)
  }
}

const updateBookingSchema = z.object({
  passengers: z.array(z.object({
    id: z.string().uuid().optional(),
    fullName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email().optional(),
  })).optional(),
})

/**
 * PATCH /api/bookings/[id]
 * Update booking (only allowed before payment)
 */
export async function PATCH(
  request: NextRequest,
  context: RouteParams,
) {
  try {
    const user = await verifyAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const validatedData = updateBookingSchema.parse(body)

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { userId: true, status: true, paymentStatus: true },
    })

    if (!booking) {
      return apiError('Booking not found', 404)
    }

    if (booking.userId !== user.id) {
      return apiError('Unauthorized', 403)
    }

    if (booking.paymentStatus === 'succeeded') {
      return apiError('Cannot update paid bookings', 400)
    }

    // Update passengers if provided
    if (validatedData.passengers) {
      await prisma.$transaction(async (tx) => {
        // Delete existing passengers
        await tx.passenger.deleteMany({
          where: { bookingId: id },
        })

        // Create new passengers
        await tx.passenger.createMany({
          data: validatedData.passengers!.map((p) => ({
            bookingId: id,
            fullName: p.fullName,
            phone: p.phone,
            email: p.email,
          })),
        })
      })
    }

    // Update booking timestamp
    await prisma.booking.update({
      where: { id },
      data: { updatedAt: new Date() },
    })

    return apiResponse({ message: 'Booking updated successfully' })

  } catch (error) {
    console.error('Error updating booking:', error)

    if (error instanceof UnauthorizedError) {
      return apiError(error.message, 401)
    }

    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.errors[0].message}`, 400)
    }

    return apiError('Failed to update booking', 500)
  }
}

/**
 * DELETE /api/bookings/[id]
 * Cancel booking and release seat locks
 */
export async function DELETE(
  request: NextRequest,
  context: RouteParams,
) {
  try {
    const user = await verifyAuth(request)
    const { id } = await context.params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        tripSchedule: true,
      },
    })

    if (!booking) {
      return apiError('Booking not found', 404)
    }

    if (booking.userId !== user.id) {
      return apiError('Unauthorized', 403)
    }

    // Check if cancellation is allowed
    if (booking.status === 'confirmed') {
      return apiError('Cannot cancel completed bookings', 400)
    }

    if (booking.status === 'cancelled') {
      return apiError('Booking already cancelled', 400)
    }

    // Check if trip has already started
    if (new Date(booking.tripSchedule.startTime) < new Date()) {
      return apiError('Cannot cancel after trip has started', 400)
    }

    // Process cancellation
    await prisma.$transaction(async (tx) => {
      // Update booking status
      await tx.booking.update({
        where: { id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
        },
      })

      // If paid, create refund record (webhook will process)
      if (booking.paymentStatus === 'succeeded') {
        // Update payment status
        await tx.booking.update({
          where: { id },
          data: { paymentStatus: 'refund_pending' },
        })

        // Create audit log
        await tx.auditLog.create({
          data: {
            entityType: 'booking',
            entityId: id,
            action: 'cancel_with_refund',
            userId: user.id,
            changes: {
              status: 'cancelled',
              paymentStatus: 'refund_pending',
            },
          },
        })
      }

      // Update trip schedule booked seats if already confirmed
      if (booking.status === 'confirmed') {
        await tx.tripSchedule.update({
          where: { id: booking.tripScheduleId },
          data: {
            bookedSeats: {
              decrement: booking.numberOfPassengers || 1,
            },
          },
        })
      }
    })

    // Release seat locks in Redis
    await releaseSeats(booking.tripScheduleId, user.id)

    return apiResponse({
      message: 'Booking cancelled successfully',
      refundStatus: booking.paymentStatus === 'succeeded' ? 'pending' : 'not_applicable',
    })

  } catch (error) {
    console.error('Error cancelling booking:', error)

    if (error instanceof UnauthorizedError) {
      return apiError(error.message, 401)
    }

    return apiError('Failed to cancel booking', 500)
  }
}
