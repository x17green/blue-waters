/**
 * MetaTickets Webhook Handler
 * 
 * POST /api/webhooks/metatickets
 * 
 * Handles payment confirmations from MetaTickets API
 * Events: payment.successful, payment.failed, refund.processed
 */

import { NextRequest } from 'next/server'

import { apiError, apiResponse } from '@/src/lib/api-auth'
import {
  markWebhookProcessed,
  processPaymentFailure,
  processPaymentSuccess,
  storeWebhookEvent,
  verifyWebhookSignature,
} from '@/src/lib/payment-webhooks'

const METATICKETS_WEBHOOK_SECRET = process.env.METATICKETS_WEBHOOK_SECRET || ''

interface MetaTicketsWebhookPayload {
  event: string
  data: {
    transaction_id: string
    booking_reference: string
    amount: number
    currency: string
    status: string
    paid_at?: string
    failure_reason?: string
    payment_method?: string
    customer?: {
      email: string
      name: string
    }
  }
  timestamp: string
  signature: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Get raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-metatickets-signature') || ''

    // 2. Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, METATICKETS_WEBHOOK_SECRET)) {
      console.error('Invalid MetaTickets webhook signature')
      return apiError('Invalid signature', 401)
    }

    // 3. Parse payload
    const payload: MetaTicketsWebhookPayload = JSON.parse(rawBody)

    // 4. Store webhook event for audit
    const webhookEvent = await storeWebhookEvent({
      event: payload.event,
      data: payload.data,
      provider: 'metatickets',
      signature,
      timestamp: payload.timestamp,
    })

    try {
      // 5. Process event based on type
      switch (payload.event) {
        case 'payment.successful':
          await processPaymentSuccess(payload.data.booking_reference, {
            provider: 'metatickets',
            transactionId: payload.data.transaction_id,
            amountKobo: payload.data.amount * 100, // Convert to kobo
            paidAt: new Date(payload.data.paid_at || payload.timestamp),
            paymentMethod: payload.data.payment_method,
            metadata: {
              customer: payload.data.customer,
              currency: payload.data.currency,
            },
          })

          // Mark webhook as processed
          await markWebhookProcessed(webhookEvent.id, true)

          console.log(`Payment successful for booking: ${payload.data.booking_reference}`)
          
          // TODO: Send confirmation email/SMS
          
          break

        case 'payment.failed':
          await processPaymentFailure(
            payload.data.booking_reference,
            payload.data.failure_reason || 'Payment failed',
          )

          await markWebhookProcessed(webhookEvent.id, true)

          console.log(`Payment failed for booking: ${payload.data.booking_reference}`)
          
          // TODO: Send failure notification
          
          break

        case 'refund.processed':
          // TODO: Implement refund processing
          console.log(`Refund processed for booking: ${payload.data.booking_reference}`)
          await markWebhookProcessed(webhookEvent.id, true)
          break

        default:
          console.warn(`Unhandled MetaTickets event: ${payload.event}`)
          await markWebhookProcessed(webhookEvent.id, true)
      }

      // 6. Return success response (important for webhook retry logic)
      return apiResponse({ received: true })

    } catch (processingError: any) {
      console.error('Error processing MetaTickets webhook:', processingError)
      
      // Mark webhook as processed with error
      await markWebhookProcessed(webhookEvent.id, false, processingError.message)

      // Still return 200 to prevent retry if it's a known error
      if (processingError.message.includes('already processed')) {
        return apiResponse({ received: true, skipped: true })
      }

      // Return 500 for unknown errors (will trigger retry)
      return apiError('Processing failed', 500)
    }

  } catch (error) {
    console.error('MetaTickets webhook error:', error)
    return apiError('Webhook processing failed', 500)
  }
}
