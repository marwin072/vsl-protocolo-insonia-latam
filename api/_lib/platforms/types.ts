export type PurchaseStatus = 'approved' | 'refunded' | 'chargeback' | 'canceled' | 'other';

export interface ParsedPurchase {
  email: string;
  platform: string;
  productId: string | null;
  transactionId: string;
  amountCents: number | null;
  currency: string;
  status: PurchaseStatus;
  /** The platform's own event/status label, kept for debugging — not used for logic. */
  rawEvent: string;
}

export interface PurchasePlatformAdapter {
  name: string;
  /** Verifies the webhook request is authentically from this platform (signature/token check). */
  verify(request: Request, rawBody: string): boolean | Promise<boolean>;
  /** Parses an already-verified raw body into our normalized purchase shape. Throws on malformed payloads. */
  parse(rawBody: string): ParsedPurchase;
}
