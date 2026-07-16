import { createHash } from 'node:crypto';
import { env } from '../env.js';

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

interface MetaEventInput {
  eventName: string;
  email?: string;
  eventSourceUrl?: string;
  eventId?: string;
  customData?: Record<string, unknown>;
}

/** Sends an event server-side via the Meta Conversions API. Silently no-ops if Meta
 *  isn't configured. PII (email) is SHA-256 hashed before it ever leaves the server,
 *  per Meta's requirements — never send raw email to the CAPI endpoint. */
export async function sendMetaEvent(input: MetaEventInput): Promise<void> {
  const pixelId = env.metaPixelId;
  const accessToken = env.metaCapiAccessToken;
  if (!pixelId || !accessToken) return;

  const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: input.eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: input.eventId,
            event_source_url: input.eventSourceUrl,
            action_source: 'website',
            user_data: input.email ? { em: [sha256(input.email)] } : {},
            custom_data: input.customData ?? {},
          },
        ],
      }),
    });
    // fetch() only rejects on network failure, not on 4xx/5xx — log those too,
    // otherwise a bad/expired META_CAPI_ACCESS_TOKEN fails silently forever.
    if (!response.ok) {
      console.error('Meta Conversions API rejected event', input.eventName, response.status, await response.text());
    }
  } catch (err) {
    console.error('Meta Conversions API request failed', input.eventName, err);
  }
}
