// Minimal analytics helper — client-side tracker that forwards to server telemetry endpoint
// Purpose: lightweight, provider-agnostic event capture used by UI components (non-blocking)

export function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  try {
    // push to dataLayer for sites that use GTM (no-op if absent)
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      try { (window as any).dataLayer.push({ event: eventName, ...properties }) } catch (e) { /* swallow */ }
    }

    // best-effort fire-and-forget to server telemetry endpoint (no blocking)
    if (typeof window !== 'undefined') {
      void fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, properties, ts: new Date().toISOString() }),
      }).catch(() => { /* swallow network errors */ })
    }
  } catch (err) {
    // intentionally swallow errors to avoid impacting UI
    // console.debug('trackEvent failed', err)
  }
}
