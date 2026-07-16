import { describe, it, expect } from 'vitest';
import { isValidEmail } from './http.js';

describe('isValidEmail', () => {
  it('accepts a normal address', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts addresses with subdomains and plus tags', () => {
    expect(isValidEmail('user+tag@mail.example.co.uk')).toBe(true);
  });

  it.each([
    undefined,
    null,
    123,
    '',
    'not-an-email',
    'missing-domain@',
    '@missing-local.com',
    'spaces in@address.com',
    'a'.repeat(255) + '@example.com',
  ])('rejects %p', (value) => {
    expect(isValidEmail(value)).toBe(false);
  });
});
