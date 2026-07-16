import { META_EVENT_NAME_MAP, type TrackEventName } from '../../shared/trackingEvents';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const UTM_STORAGE_KEY = 'pmd_utm';
const CLIENT_ID_STORAGE_KEY = 'pmd_client_id';

type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Captures UTM params from the current URL into localStorage on first landing, so
 *  they're still available later (lead form, checkout click) even after the user
 *  navigates within the site and the query string is gone. First-touch wins. */
export function captureUtm(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(UTM_STORAGE_KEY)) return; // already captured this visit

  const params = new URLSearchParams(window.location.search);
  const utm: Utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  if (Object.keys(utm).length > 0) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  }
}

export function getStoredUtm(): Utm {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

/** Stable per-visitor id, used to tie the browser-side gtag hit to the server-side
 *  Measurement Protocol hit for the same event (GA4 dedups on client_id). */
export function getClientId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
  }
  return id;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Loads GA4 gtag.js and the Meta Pixel base snippet, if their ids are configured.
 *  Safe to call once at app startup; no-ops for whichever isn't configured. */
export function loadTrackingTags(): void {
  if (typeof window === 'undefined') return;

  const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;
  if (ga4Id && !window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', ga4Id);
  }

  const pixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
  if (pixelId && !window.fbq) {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any) {
      let n: any, t: any, s: any;
      if (f.fbq) return;
      n = f.fbq = function (...args: unknown[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq!('init', pixelId);
    window.fbq!('track', 'PageView');
  }
}

/** Fires an event on the client-side tags (if loaded) and mirrors it server-side via
 *  /api/track (Meta Conversions API + GA4 Measurement Protocol) using a shared
 *  event_id so Meta can dedupe the browser and server copies of the same event. */
export async function trackEvent(eventName: TrackEventName, email?: string): Promise<void> {
  const eventId = crypto.randomUUID();
  const clientId = getClientId();

  if (window.gtag) window.gtag('event', eventName, { event_id: eventId });
  const fbEventName = META_EVENT_NAME_MAP[eventName];
  if (window.fbq && fbEventName) window.fbq('track', fbEventName, {}, { eventID: eventId });

  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_name: eventName, email, client_id: clientId, event_id: eventId }),
    });
  } catch {
    // Best-effort — never block the user's action on analytics.
  }
}
