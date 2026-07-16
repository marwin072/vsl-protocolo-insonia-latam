/**
 * Single source of truth for the client-side event name -> Meta Conversions API event
 * name mapping. Imported by both api/track.ts (server) and src/lib/tracking.ts
 * (browser) so the two never drift out of sync.
 */
export const ALLOWED_TRACK_EVENTS = ['initiate_checkout', 'view_offer'] as const;
export type TrackEventName = (typeof ALLOWED_TRACK_EVENTS)[number];

export const META_EVENT_NAME_MAP: Record<TrackEventName, string> = {
  initiate_checkout: 'InitiateCheckout',
  view_offer: 'ViewContent',
};
