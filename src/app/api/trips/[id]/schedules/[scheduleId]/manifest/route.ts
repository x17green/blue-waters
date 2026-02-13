/**
 * Manifest Generation API
 * GET /api/trips/[id]/schedules/[scheduleId]/manifest?format=pdf|csv
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/src/lib/api-auth'
import {
  fetchManifestData,
  generateCSVManifest,
  generatePDFManifest,
  validateManifestRequirements,
} from '@/src/lib/manifest-generator'

// Helper for API responses
function apiResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; scheduleId: string }> }
) {
  try {
    // 1. Verify authentication
    const user = await verifyAuth(request)

    // Only staff, operators, and admins can generate manifests
    if (!['operator', 'staff', 'admin'].includes(user.role)) {
      return apiError('Unauthorized - Operators and staff only', 403)
    }

    // 2. Get parameters
    const { id, scheduleId } = await context.params
    const format = request.nextUrl.searchParams.get('format') || 'pdf'

    if (!['pdf', 'csv'].includes(format)) {
      return apiError('Invalid format. Must be "pdf" or "csv"', 400)
    }

    // 3. Fetch manifest data
    let manifestData
    try {
      manifestData = await fetchManifestData(scheduleId)
    } catch (error) {
      return apiError('Trip schedule not found', 404)
    }

    // 4. Validate manifest requirements
    const validation = validateManifestRequirements(manifestData)
    if (!validation.valid) {
      return apiResponse(
        {
          error: 'Manifest validation failed',
          warnings: validation.errors,
          canGenerate: true, // Allow generation with warnings
        },
        400
      )
    }

    // 5. Generate manifest based on format
    if (format === 'csv') {
      const csv = generateCSVManifest(manifestData)
      const filename = `manifest-${scheduleId}-${Date.now()}.csv`

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }

    if (format === 'pdf') {
      const pdfStream = await generatePDFManifest(manifestData)
      const filename = `manifest-${scheduleId}-${Date.now()}.pdf`

      // Convert stream to buffer
      const chunks: Buffer[] = []
      for await (const chunk of pdfStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      }
      const buffer = Buffer.concat(chunks)

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }

    return apiError('Invalid format', 400)
  } catch (error) {
    console.error('Error generating manifest:', error)
    return apiError('Failed to generate manifest', 500)
  }
}

/**
 * Preview manifest data (without generating file)
 * GET /api/trips/[id]/schedules/[scheduleId]/manifest?preview=true
 */
export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ id: string; scheduleId: string }> }
) {
  try {
    const user = await verifyAuth(request)

    if (!['operator', 'staff', 'admin'].includes(user.role)) {
      return apiError('Unauthorized', 403)
    }

    const { id, scheduleId } = await context.params
    const isPreview = request.nextUrl.searchParams.get('preview') === 'true'

    if (!isPreview) {
      return new NextResponse(null, { status: 200 })
    }

    // Fetch and return manifest metadata
    const manifestData = await fetchManifestData(scheduleId)
    const validation = validateManifestRequirements(manifestData)

    return apiResponse({
      tripSchedule: {
        id: manifestData.tripSchedule.id,
        tripTitle: manifestData.tripSchedule.trip.title,
        vesselName: manifestData.tripSchedule.trip.vessel.name,
        departureTime: manifestData.tripSchedule.startTime,
      },
      stats: manifestData.metadata,
      validation,
      downloadUrls: {
        pdf: `/api/trips/${id}/schedules/${scheduleId}/manifest?format=pdf`,
        csv: `/api/trips/${id}/schedules/${scheduleId}/manifest?format=csv`,
      },
    })
  } catch (error) {
    console.error('Error previewing manifest:', error)
    return apiError('Failed to preview manifest', 500)
  }
}
