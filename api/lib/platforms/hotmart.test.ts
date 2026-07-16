import { describe, it, expect, beforeEach } from 'vitest';
import { hotmartAdapter } from './hotmart.js';

function fakeRequest(headers: Record<string, string> = {}): Request {
  return new Request('https://example.com/api/webhook/purchase?platform=hotmart', {
    method: 'POST',
    headers,
  });
}

function samplePayload(overrides: Partial<{ status: string; email: string; transaction: string }> = {}) {
  return JSON.stringify({
    id: 'evt_123',
    creation_date: 1700000000000,
    event: 'PURCHASE_APPROVED',
    version: '2.0.0',
    data: {
      product: { id: 12345, ucode: 'abc-ucode' },
      buyer: { email: overrides.email ?? '  Buyer@Example.COM  ' },
      purchase: {
        transaction: overrides.transaction ?? 'HP17715690036014',
        status: overrides.status ?? 'APPROVED',
        price: { value: 97.5, currency_value: 'BRL' },
      },
    },
  });
}

describe('hotmartAdapter.verify', () => {
  beforeEach(() => {
    process.env.HOTMART_HOTTOK = 'shared-secret-token';
  });

  it('accepts the correct HOTTOK header', () => {
    const req = fakeRequest({ 'x-hotmart-hottok': 'shared-secret-token' });
    expect(hotmartAdapter.verify(req, samplePayload())).toBe(true);
  });

  it('rejects a missing header', () => {
    const req = fakeRequest();
    expect(hotmartAdapter.verify(req, samplePayload())).toBe(false);
  });

  it('rejects a wrong token of the same length', () => {
    const req = fakeRequest({ 'x-hotmart-hottok': 'shared-secret-tokeN' });
    expect(hotmartAdapter.verify(req, samplePayload())).toBe(false);
  });

  it('rejects a token of a different length instead of throwing', () => {
    const req = fakeRequest({ 'x-hotmart-hottok': 'short' });
    expect(() => hotmartAdapter.verify(req, samplePayload())).not.toThrow();
    expect(hotmartAdapter.verify(req, samplePayload())).toBe(false);
  });
});

describe('hotmartAdapter.parse', () => {
  it('extracts and normalizes the fields the app needs', () => {
    const result = hotmartAdapter.parse(samplePayload());
    expect(result).toEqual({
      email: 'buyer@example.com',
      platform: 'hotmart',
      productId: 'abc-ucode',
      transactionId: 'HP17715690036014',
      amountCents: 9750,
      currency: 'BRL',
      status: 'approved',
      rawEvent: 'PURCHASE_APPROVED',
    });
  });

  it.each([
    ['APPROVED', 'approved'],
    ['COMPLETE', 'approved'],
    ['REFUNDED', 'refunded'],
    ['PARTIALLY_REFUNDED', 'refunded'],
    ['CHARGEBACK', 'chargeback'],
    ['CANCELLED', 'canceled'],
    ['EXPIRED', 'canceled'],
    ['WAITING_PAYMENT', 'other'],
    ['SOME_FUTURE_STATUS_HOTMART_ADDS_LATER', 'other'],
  ])('maps purchase status %s -> %s', (hotmartStatus, expected) => {
    const result = hotmartAdapter.parse(samplePayload({ status: hotmartStatus }));
    expect(result.status).toBe(expected);
  });

  it('throws on a payload missing buyer.email', () => {
    const payload = JSON.parse(samplePayload());
    delete payload.data.buyer.email;
    expect(() => hotmartAdapter.parse(JSON.stringify(payload))).toThrow(/buyer\.email/);
  });

  it('throws on a payload missing purchase.transaction', () => {
    const payload = JSON.parse(samplePayload());
    delete payload.data.purchase.transaction;
    expect(() => hotmartAdapter.parse(JSON.stringify(payload))).toThrow(/purchase\.transaction/);
  });

  it('falls back to numeric product id when ucode is absent', () => {
    const payload = JSON.parse(samplePayload());
    delete payload.data.product.ucode;
    const result = hotmartAdapter.parse(JSON.stringify(payload));
    expect(result.productId).toBe('12345');
  });
});
