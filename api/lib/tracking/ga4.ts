import { env } from '../env.js';

interface Ga4Event {
  name: string;
  params?: Record<string, unknown>;
}

/** Sends an event server-side via the GA4 Measurement Protocol. Silently no-ops if
 *  GA4 isn't configured — tracking must never break the request it's attached to. */
export async function sendGa4Event(clientId: string, event: Ga4Event): Promise<void> {
  const measurementId = env.ga4MeasurementId;
  const apiSecret = env.ga4ApiSecret;
  if (!measurementId || !apiSecret) return;

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        events: [{ name: event.name, params: event.params ?? {} }],
      }),
    });
    // fetch() only rejects on network failure, not on 4xx/5xx — log those too,
    // otherwise a bad GA4_API_SECRET fails silently forever.
    if (!response.ok) {
      console.error('GA4 Measurement Protocol rejected event', event.name, response.status);
    }
  } catch (err) {
    console.error('GA4 Measurement Protocol request failed', event.name, err);
  }
}
