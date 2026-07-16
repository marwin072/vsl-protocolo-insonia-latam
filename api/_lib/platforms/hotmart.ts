import { timingSafeEqual } from 'node:crypto';
import { env } from '../env.js';
import type { ParsedPurchase, PurchasePlatformAdapter, PurchaseStatus } from './types.js';

// https://developers.hotmart.com/docs/en/2.0.0/webhook/purchase-webhook/
const STATUS_MAP: Record<string, PurchaseStatus> = {
  APPROVED: 'approved',
  COMPLETE: 'approved',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'refunded',
  CHARGEBACK: 'chargeback',
  CANCELLED: 'canceled',
  EXPIRED: 'canceled',
};

interface HotmartPayload {
  event: string;
  data?: {
    product?: { id?: number | string; ucode?: string };
    buyer?: { email?: string };
    purchase?: {
      transaction?: string;
      status?: string;
      price?: { value?: number; currency_value?: string };
    };
  };
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Length alone isn't secret — only the content needs constant-time comparison.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export const hotmartAdapter: PurchasePlatformAdapter = {
  name: 'hotmart',

  verify(request) {
    // Hotmart sends its shared-secret token in this exact header on every webhook
    // request (not an HMAC signature over the body — a static per-account token).
    const token = request.headers.get('x-hotmart-hottok');
    return typeof token === 'string' && timingSafeStringEqual(token, env.hotmartHottok);
  },

  parse(rawBody): ParsedPurchase {
    const payload = JSON.parse(rawBody) as HotmartPayload;

    const email = payload.data?.buyer?.email;
    const transactionId = payload.data?.purchase?.transaction;
    if (!email || !transactionId) {
      throw new Error('Hotmart payload missing data.buyer.email or data.purchase.transaction');
    }

    const rawStatus = payload.data?.purchase?.status ?? '';
    const price = payload.data?.purchase?.price;
    const product = payload.data?.product;

    return {
      email: email.trim().toLowerCase(),
      platform: 'hotmart',
      productId: product?.ucode ?? (product?.id != null ? String(product.id) : null),
      transactionId,
      amountCents: typeof price?.value === 'number' ? Math.round(price.value * 100) : null,
      currency: price?.currency_value ?? 'BRL',
      status: STATUS_MAP[rawStatus] ?? 'other',
      rawEvent: payload.event ?? rawStatus,
    };
  },
};
