import { NextRequest } from 'next/server'

// Lightweight telemetry ingest endpoint — logs to server console for now.
// Intentionally simple: does not persist PII and is safe to keep enabled in production.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    // Basic validation
    if (!body || typeof body.event !== 'string') {
      return new Response(JSON.stringify({ ok: false }), { status: 400 })
    }

    // Surface to server logs (can be replaced by a provider sink in future)
    // Keep payload small and non-sensitive
    const safePayload = {
      event: body.event,
      properties: body.properties || {},
      ts: body.ts || new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
    }

    // eslint-disable-next-line no-console
    console.info('[telemetry]', safePayload.event, safePayload.properties || {})

    // 204 (no content) for minimal client footprint
    return new Response(null, { status: 204 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Telemetry ingest failed', err)
    return new Response(JSON.stringify({ ok: false }), { status: 500 })
  }
}
