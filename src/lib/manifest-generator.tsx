/**
 * Manifest Generation Utilities
 * Generates passenger manifests in PDF and CSV formats for regulatory compliance
 */

import { renderToStream } from '@react-pdf/renderer'
import { parse } from 'papaparse'
import prisma from './prisma.client'

export interface ManifestData {
  tripSchedule: {
    id: string
    startTime: Date
    endTime: Date
    departurePort: string | null
    arrivalPort: string | null
    trip: {
      title: string
      description: string | null
      vessel: {
        name: string
        registrationNo: string | null
        capacity: number
      }
      operator: {
        companyName: string | null
        user: {
          email: string | null
          phone: string | null
        } | null
      } | null
    }
  }
  passengers: Array<{
    id: string
    fullName: string
    phone: string | null
    email: string | null
    emergencyContact: string | null
    specialNeeds: string | null
    booking: {
      bookingReference: string | null
      user: {
        email: string | null
        phone: string | null
      } | null
    }
  }>
  metadata: {
    generatedAt: Date
    generatedBy: string
    totalPassengers: number
    vesselCapacity: number
    occupancyRate: number
  }
}

/**
 * Fetch manifest data from database
 */
export async function fetchManifestData(
  tripScheduleId: string
): Promise<ManifestData> {
  const schedule = await prisma.tripSchedule.findUnique({
    where: { id: tripScheduleId },
    include: {
      trip: {
        include: {
          vessel: true,
          operator: {
            include: {
              user: {
                select: {
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!schedule) {
    throw new Error('Trip schedule not found')
  }

  // Get all checked-in passengers for this trip
  const passengers = await prisma.passenger.findMany({
    where: {
      booking: {
        tripScheduleId: schedule.id,
        status: 'confirmed',
      },
    },
    include: {
      booking: {
        select: {
          bookingReference: true,
          user: {
            select: {
              email: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: {
      fullName: 'asc',
    },
  })

  const totalPassengers = passengers.length
  const vesselCapacity = schedule.trip.vessel.capacity
  const occupancyRate = (totalPassengers / vesselCapacity) * 100

  return {
    tripSchedule: schedule,
    passengers,
    metadata: {
      generatedAt: new Date(),
      generatedBy: 'System',
      totalPassengers,
      vesselCapacity,
      occupancyRate,
    },
  }
}

/**
 * Generate CSV manifest
 */
export function generateCSVManifest(data: ManifestData): string {
  const rows = [
    // Header information
    ['PASSENGER MANIFEST'],
    [''],
    ['Trip', data.tripSchedule.trip.title],
    ['Vessel', data.tripSchedule.trip.vessel.name],
    ['Registration', data.tripSchedule.trip.vessel.registrationNo || 'N/A'],
    ['Departure', data.tripSchedule.departurePort || 'N/A'],
    ['Arrival', data.tripSchedule.arrivalPort || 'N/A'],
    [
      'Departure Time',
      data.tripSchedule.startTime.toLocaleString('en-NG', {
        timeZone: 'Africa/Lagos',
      }),
    ],
    [
      'Expected Arrival',
      data.tripSchedule.endTime.toLocaleString('en-NG', {
        timeZone: 'Africa/Lagos',
      }),
    ],
    ['Total Passengers', data.metadata.totalPassengers.toString()],
    ['Vessel Capacity', data.metadata.vesselCapacity.toString()],
    [
      'Occupancy Rate',
      `${data.metadata.occupancyRate.toFixed(1)}%`,
    ],
    [
      'Generated',
      data.metadata.generatedAt.toLocaleString('en-NG', {
        timeZone: 'Africa/Lagos',
      }),
    ],
    [''],
    // Passenger table header
    [
      'Booking Ref',
      'Full Name',
      'Phone',
      'Email',
      'Emergency Contact',
      'Special Needs',
      'Booking Email',
      'Booking Phone',
    ],
  ]

  // Add passenger rows
  data.passengers.forEach((passenger) => {
    rows.push([
      passenger.booking.bookingReference || 'N/A',
      passenger.fullName,
      passenger.phone || 'N/A',
      passenger.email || 'N/A',
      passenger.emergencyContact || 'N/A',
      passenger.specialNeeds || 'None',
      passenger.booking.user?.email || 'N/A',
      passenger.booking.user?.phone || 'N/A',
    ])
  })

  // Convert to CSV string
  return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
}

/**
 * Generate PDF manifest (returns readable stream)
 * Uses @react-pdf/renderer for production-grade PDF generation
 */
export async function generatePDFManifest(
  data: ManifestData
): Promise<NodeJS.ReadableStream> {
  const { renderToStream } = await import('@react-pdf/renderer');
  const { ManifestPDF } = await import('./manifest-pdf');

  // Render PDF document to stream using React PDF with JSX
  const stream = await renderToStream(<ManifestPDF data={data} />);

  return stream;
}

/**
 * Format date for manifest display
 */
export function formatManifestDate(date: Date): string {
  return date.toLocaleString('en-NG', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Validate manifest generation requirements
 */
export function validateManifestRequirements(data: ManifestData): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check vessel registration
  if (!data.tripSchedule.trip.vessel.registrationNo) {
    errors.push('Vessel registration number is missing')
  }

  // Check operator information
  if (!data.tripSchedule.trip.operator) {
    errors.push('Operator information is missing')
  }

  // Check departure/arrival ports
  if (!data.tripSchedule.departurePort || !data.tripSchedule.arrivalPort) {
    errors.push('Departure or arrival port information is missing')
  }

  // Check passenger details
  const missingEmergencyContacts = data.passengers.filter(
    (p) => !p.emergencyContact
  )
  if (missingEmergencyContacts.length > 0) {
    errors.push(
      `${missingEmergencyContacts.length} passenger(s) missing emergency contact`
    )
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
