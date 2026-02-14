/**
 * Paystack Webhook Handler
 * 
 * POST /api/webhooks/paystack
 * 
 * Handles payment confirmations from Paystack API (fallback provider)
 * Events: charge.success, charge.failed, refund.processed
 */

import crypto from 'crypto'

import { NextRequest } from 'next/server'

import { apiError, apiResponse } from '@/src/lib/api-auth'
import {
  markWebhookProcessed,
  processPaymentFailure,
  processPaymentSuccess,
  storeWebhookEvent,
} from '@/src/lib/payment-webhooks'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''

interface PaystackWebhookPayload {
  event: string
  data: {
    id: number
    reference: string
    amount: number
    currency: string
    status: string
    paid_at?: string
    gateway_response?: string
    channel?: string
    customer?: {
      email: string
      customer_code: string
    }
    metadata?: {
      booking_reference: string
      [key: string]: any
    }
  }
}

/**
 * Verify Paystack webhook signature
 * Paystack uses a simpler signature scheme
 */
function verifyPaystackSignature(rawBody: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex')

  return hash === signature
}

export async function POST(request: NextRequest) {
  try {
    // 1. Get raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-paystack-signature') || ''

    // 2. Verify webhook signature
    if (!verifyPaystackSignature(rawBody, signature)) {
      console.error('Invalid Paystack webhook signature')
      return apiError('Invalid signature', 401)
    }

    // 3. Parse payload
    const payload: PaystackWebhookPayload = JSON.parse(rawBody)

    // 4. Extract booking reference from metadata
    const bookingReference = payload.data.metadata?.booking_reference
    if (!bookingReference) {
      console.error('No booking reference in Paystack webhook')
      return apiError('Missing booking reference', 400)
    }

    // 5. Store webhook event for audit
    const webhookEvent = await storeWebhookEvent({
      event: payload.event,
      data: payload.data,
      provider: 'paystack',
      signature,
    })

    try {
      // 6. Process event based on type
      switch (payload.event) {
        case 'charge.success':
          await processPaymentSuccess(bookingReference, {
            provider: 'paystack',
            transactionId: payload.data.reference,
            amountKobo: payload.data.amount, // Paystack already uses kobo
            paidAt: new Date(payload.data.paid_at || Date.now()),
            paymentMethod: payload.data.channel,
            metadata: {
              customer: payload.data.customer,
              currency: payload.data.currency,
              gateway_response: payload.data.gateway_response,
            },
          })

          await markWebhookProcessed(webhookEvent.id, true)

          console.log(`Paystack payment successful for booking: ${bookingReference}`)
          
          // TODO: Send confirmation email/SMS
          
          break

        case 'charge.failed':
          await processPaymentFailure(
            bookingReference,
            payload.data.gateway_response || 'Payment failed',
          )

          await markWebhookProcessed(webhookEvent.id, true)

          console.log(`Paystack payment failed for booking: ${bookingReference}`)
          
          // TODO: Send failure notification
          
          break

        case 'refund.processed':
          // TODO: Implement refund processing
          console.log(`Paystack refund processed for booking: ${bookingReference}`)
          await markWebhookProcessed(webhookEvent.id, true)
          break

        default:
          console.warn(`Unhandled Paystack event: ${payload.event}`)
          await markWebhookProcessed(webhookEvent.id, true)
      }

      // 7. Return success response
      return apiResponse({ received: true })

    } catch (processingError: any) {
      console.error('Error processing Paystack webhook:', processingError)
      
      // Mark webhook as processed with error
      await markWebhookProcessed(webhookEvent.id, false, processingError.message)

      // Return 200 for idempotent errors
      if (processingError.message.includes('already processed')) {
        return apiResponse({ received: true, skipped: true })
      }

      // Return 500 for unknown errors (triggers retry)
      return apiError('Processing failed', 500)
    }

  } catch (error) {
    console.error('Paystack webhook error:', error)
    return apiError('Webhook processing failed', 500)
  }
}
