import { describe, it, expect } from 'vitest';
import { pickUtm } from './lead.js';

describe('pickUtm', () => {
  it('extracts known utm fields and nulls out the rest', () => {
    const result = pickUtm({
      utm_source: 'facebook',
      utm_medium: 'cpc',
      irrelevant: 'should be ignored',
    });

    expect(result).toEqual({
      utm_source: 'facebook',
      utm_medium: 'cpc',
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    });
  });

  it('nulls out non-string values instead of passing them through', () => {
    const result = pickUtm({ utm_source: 123, utm_medium: { nested: true }, utm_campaign: null });
    expect(result.utm_source).toBeNull();
    expect(result.utm_medium).toBeNull();
    expect(result.utm_campaign).toBeNull();
  });

  it('rejects absurdly long values (defends against abuse via the public endpoint)', () => {
    const result = pickUtm({ utm_source: 'x'.repeat(500) });
    expect(result.utm_source).toBeNull();
  });

  it('returns all nulls for an empty body', () => {
    expect(pickUtm({})).toEqual({
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    });
  });
});
