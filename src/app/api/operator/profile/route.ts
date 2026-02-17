/**
 * Operator Profile API Route
 *
 * PUT /api/operator/profile - Update authenticated operator's profile
 */

import { NextRequest } from 'next/server'

import { apiError, apiResponse, verifyRole } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma.client'

/**
 * PUT /api/operator/profile
 * Update the authenticated operator's profile
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify operator role
    const user = await verifyRole(request, ['operator', 'admin'])

    // Get or create operator info
    let operator = await prisma.operator.findFirst({
      where: {
        userId: user.role === 'admin' ? undefined : user.id,
        ...(user.role === 'admin' && { userId: user.id })
      }
    })

    // If operator doesn't exist, create one
    if (!operator) {
      operator = await prisma.operator.create({
        data: {
          userId: user.id,
          organizationName: '',
          contactEmail: '',
          contactPhone: '',
          verified: false,
        }
      })
    }

    const body = await request.json()
    const { organizationName, contactEmail, contactPhone } = body

    // Validate required fields
    if (!organizationName || !organizationName.trim()) {
      return apiError('Organization name is required', 400)
    }

    // Update operator profile
    const updatedOperator = await prisma.operator.update({
      where: { id: operator.id },
      data: {
        organizationName: organizationName.trim(),
        contactEmail: contactEmail?.trim() || operator.contactEmail,
        contactPhone: contactPhone?.trim() || operator.contactPhone,
      }
    })

    return apiResponse({
      operator: {
        id: updatedOperator.id,
        organizationName: updatedOperator.organizationName,
        contactEmail: updatedOperator.contactEmail,
        contactPhone: updatedOperator.contactPhone,
        verified: updatedOperator.verified
      }
    })

  } catch (error) {
    console.error('Error updating operator profile:', error)
    return apiError('Failed to update profile', 500)
  }
}