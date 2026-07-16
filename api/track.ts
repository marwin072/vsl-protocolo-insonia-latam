import { json, methodNotAllowed, isValidEmail } from './lib/http.js';
import { sendGa4Event } from './lib/tracking/ga4.js';
import { sendMetaEvent } from './lib/tracking/metaCapi.js';
import { ALLOWED_TRACK_EVENTS, META_EVENT_NAME_MAP, type TrackEventName } from '../shared/trackingEvents.js';

interface TrackPayload {
  event_name: string;
  email?: string;
  client_id?: string;
  event_id?: string;
  params?: Record<string, unknown>;
}

const ALLOWED_EVENTS = new Set<string>(ALLOWED_TRACK_EVENTS);

function isTrackEventName(value: string): value is TrackEventName {
  return ALLOWED_EVENTS.has(value);
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return methodNotAllowed(['POST']);

  let body: Partial<TrackPayload>;
  try {
    body = (await request.json()) as Partial<TrackPayload>;
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  if (typeof body !== 'object' || body === null) {
    return json(400, { error: 'Invalid JSON body' });
  }
  if (typeof body.event_name !== 'string' || !isTrackEventName(body.event_name)) {
    return json(400, { error: `event_name must be one of: ${ALLOWED_TRACK_EVENTS.join(', ')}` });
  }
  if (body.email !== undefined && !isValidEmail(body.email)) {
    return json(400, { error: 'email must be a valid address if provided' });
  }

  const eventName = body.event_name;
  const email = body.email?.trim().toLowerCase();

  await Promise.all([
    // GA4 Measurement Protocol forbids PII in event data — client_id must never be
    // (or fall back to) the email address.
    sendGa4Event(body.client_id ?? crypto.randomUUID(), {
      name: eventName,
      params: body.params ?? {},
    }),
    sendMetaEvent({
      eventName: META_EVENT_NAME_MAP[eventName],
      email,
      eventId: body.event_id,
      eventSourceUrl: request.headers.get('referer') ?? undefined,
      customData: body.params,
    }),
  ]);

  return json(200, { ok: true });
}
