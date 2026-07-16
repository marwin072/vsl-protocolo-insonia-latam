import type { PurchasePlatformAdapter } from './types.js';
import { hotmartAdapter } from './hotmart.js';

// Add new checkout platforms here as they're needed (Kiwify, Eduzz, Monetizze, ...).
// Each just needs to implement PurchasePlatformAdapter — verify() + parse().
const adapters: Record<string, PurchasePlatformAdapter> = {
  hotmart: hotmartAdapter,
};

export function getAdapter(platform: string): PurchasePlatformAdapter | undefined {
  return adapters[platform.toLowerCase()];
}

export type { PurchasePlatformAdapter, ParsedPurchase, PurchaseStatus } from './types.js';
