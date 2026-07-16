/** Reads a required server-side env var, throwing a clear error at call time instead of
 *  letting `undefined` propagate into a client library and fail with a cryptic error. */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string): string | undefined {
  return process.env[name] || undefined;
}

export const env = {
  get supabaseUrl() {
    return required('SUPABASE_URL');
  },
  get supabaseServiceRoleKey() {
    return required('SUPABASE_SERVICE_ROLE_KEY');
  },
  get hotmartHottok() {
    return required('HOTMART_HOTTOK');
  },
  get ga4MeasurementId() {
    return optional('GA4_MEASUREMENT_ID');
  },
  get ga4ApiSecret() {
    return optional('GA4_API_SECRET');
  },
  get metaPixelId() {
    return optional('META_PIXEL_ID');
  },
  get metaCapiAccessToken() {
    return optional('META_CAPI_ACCESS_TOKEN');
  },
  /** Used as the invite email's redirect target. Falls back to Vercel's own
   *  auto-populated deployment URL so this works before a custom domain is set. */
  get publicSiteUrl() {
    const configured = optional('PUBLIC_SITE_URL');
    if (configured) return configured;
    const vercelUrl = optional('VERCEL_URL');
    return vercelUrl ? `https://${vercelUrl}` : 'http://localhost:5173';
  },
};
