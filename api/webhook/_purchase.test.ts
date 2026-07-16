import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoisted mock: purchase.ts (via lib/memberAccess.ts) imports getSupabaseAdmin from
// this module. We control exactly what it returns per-test via `mockSupabase`, so we
// can exercise the dedup/retry/access control flow without a real Supabase project.
const mockSupabase = {
  purchases: {
    existingRow: null as { status: string } | null,
    upsert: vi.fn().mockResolvedValue({ error: null }),
  },
  members: {
    row: null as { user_id: string } | null,
    upsert: vi.fn().mockResolvedValue({ error: null }),
  },
  invite: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
  updateUserById: vi.fn().mockResolvedValue({ error: null }),
  // Default: no user found — the "genuinely never existed" case. Individual tests
  // override this to simulate resolving an existing user whose `members` row is missing.
  generateLink: vi.fn().mockResolvedValue({ data: { user: null }, error: { message: 'User not found' } }),
};

vi.mock('../lib/supabaseAdmin.js', () => ({
  getSupabaseAdmin: () => ({
    from: (table: string) => {
      if (table === 'purchases') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: mockSupabase.purchases.existingRow }),
              }),
            }),
          }),
          upsert: mockSupabase.purchases.upsert,
        };
      }
      if (table === 'members') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: mockSupabase.members.row }),
            }),
          }),
          upsert: mockSupabase.members.upsert,
        };
      }
      throw new Error(`unexpected table ${table}`);
    },
    auth: {
      admin: {
        inviteUserByEmail: mockSupabase.invite,
        updateUserById: mockSupabase.updateUserById,
        generateLink: mockSupabase.generateLink,
      },
    },
  }),
}));

process.env.HOTMART_HOTTOK = 'shared-secret-token';

const { default: handler } = await import('./purchase.js');

function webhookRequest(body: unknown, hottok = 'shared-secret-token') {
  return new Request('https://example.com/api/webhook/purchase?platform=hotmart', {
    method: 'POST',
    headers: hottok ? { 'x-hotmart-hottok': hottok } : {},
    body: JSON.stringify(body),
  });
}

function payload(status: string, transaction = 'HP111') {
  return {
    event: 'PURCHASE_APPROVED',
    data: {
      product: { ucode: 'prod-1' },
      buyer: { email: 'buyer@example.com' },
      purchase: { transaction, status, price: { value: 97, currency_value: 'BRL' } },
    },
  };
}

beforeEach(() => {
  mockSupabase.purchases.existingRow = null;
  mockSupabase.purchases.upsert.mockClear();
  mockSupabase.members.row = null;
  mockSupabase.members.upsert.mockClear().mockResolvedValue({ error: null });
  mockSupabase.invite.mockClear().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
  mockSupabase.updateUserById.mockClear().mockResolvedValue({ error: null });
  mockSupabase.generateLink.mockClear().mockResolvedValue({ data: { user: null }, error: { message: 'User not found' } });
});

describe('POST /api/webhook/purchase', () => {
  it('rejects non-POST methods', async () => {
    const res = await handler(new Request('https://example.com/api/webhook/purchase', { method: 'GET' }));
    expect(res.status).toBe(405);
  });

  it('rejects a missing/wrong HOTTOK without touching the database', async () => {
    const res = await handler(webhookRequest(payload('APPROVED'), 'wrong-token'));
    expect(res.status).toBe(401);
    expect(mockSupabase.purchases.upsert).not.toHaveBeenCalled();
    expect(mockSupabase.invite).not.toHaveBeenCalled();
  });

  it('records a first-time approval, invites the buyer, maps their user id, and unbans', async () => {
    const res = await handler(webhookRequest(payload('APPROVED', 'HP-new')));

    expect(res.status).toBe(200);
    expect(mockSupabase.purchases.upsert).toHaveBeenCalledTimes(1);
    expect(mockSupabase.invite).toHaveBeenCalledWith(
      'buyer@example.com',
      expect.objectContaining({ redirectTo: expect.any(String) })
    );
    expect(mockSupabase.members.upsert).toHaveBeenCalledWith(
      [{ email: 'buyer@example.com', user_id: 'user-123' }],
      { onConflict: 'email' }
    );
    expect(mockSupabase.updateUserById).toHaveBeenCalledWith('user-123', { ban_duration: 'none' });
  });

  it('still retries the invite on a replayed already-approved transaction (self-healing)', async () => {
    mockSupabase.purchases.existingRow = { status: 'approved' }; // already approved before

    const res = await handler(webhookRequest(payload('APPROVED', 'HP-replay')));

    expect(res.status).toBe(200);
    expect(mockSupabase.purchases.upsert).toHaveBeenCalledTimes(1);
    expect(mockSupabase.invite).toHaveBeenCalled();
  });

  it('treats an existing confirmed member (email_exists) as success and still looks up their id to unban', async () => {
    mockSupabase.invite.mockResolvedValue({ data: { user: null }, error: { code: 'email_exists', message: 'already registered' } });
    mockSupabase.members.row = { user_id: 'user-existing' };

    const res = await handler(webhookRequest(payload('APPROVED', 'HP-renewal')));

    expect(res.status).toBe(200);
    expect(mockSupabase.updateUserById).toHaveBeenCalledWith('user-existing', { ban_duration: 'none' });
  });

  it('falls back to generateLink and backfills the mapping when email_exists but the members row is missing', async () => {
    mockSupabase.invite.mockResolvedValue({ data: { user: null }, error: { code: 'email_exists', message: 'already registered' } });
    mockSupabase.members.row = null; // mapping never got written (the bug this fallback fixes)
    mockSupabase.generateLink.mockResolvedValue({ data: { user: { id: 'user-recovered' } }, error: null });

    const res = await handler(webhookRequest(payload('APPROVED', 'HP-missing-mapping')));

    expect(res.status).toBe(200);
    expect(mockSupabase.generateLink).toHaveBeenCalledWith({ type: 'recovery', email: 'buyer@example.com' });
    // Backfilled for next time, and the recovered id is what actually gets unbanned.
    expect(mockSupabase.members.upsert).toHaveBeenCalledWith(
      [{ email: 'buyer@example.com', user_id: 'user-recovered' }],
      { onConflict: 'email' }
    );
    expect(mockSupabase.updateUserById).toHaveBeenCalledWith('user-recovered', { ban_duration: 'none' });
  });

  it('returns 500 on a genuine invite failure so Hotmart retries the whole webhook', async () => {
    mockSupabase.invite.mockResolvedValue({ data: { user: null }, error: { code: 'unexpected_failure', message: 'GoTrue is down' } });

    const res = await handler(webhookRequest(payload('APPROVED', 'HP-fail')));

    expect(res.status).toBe(500);
  });

  it('returns 500 when the unban call fails after a successful invite', async () => {
    mockSupabase.updateUserById.mockResolvedValue({ error: { message: 'GoTrue is down' } });

    const res = await handler(webhookRequest(payload('APPROVED', 'HP-unban-fails')));

    expect(res.status).toBe(500);
  });

  it('never invites for a non-approved status (e.g. a refund webhook)', async () => {
    const res = await handler(webhookRequest(payload('REFUNDED', 'HP-refund')));

    expect(res.status).toBe(200);
    expect(mockSupabase.invite).not.toHaveBeenCalled();
  });

  it('does nothing for a pre-payment cancellation/expiration (never had access to begin with)', async () => {
    const res = await handler(webhookRequest(payload('CANCELLED', 'HP-cancelled')));

    expect(res.status).toBe(200);
    expect(mockSupabase.invite).not.toHaveBeenCalled();
    expect(mockSupabase.updateUserById).not.toHaveBeenCalled();
  });

  it('bans the member on refund when a mapping exists', async () => {
    mockSupabase.members.row = { user_id: 'user-to-ban' };

    const res = await handler(webhookRequest(payload('REFUNDED', 'HP-refund-2')));

    expect(res.status).toBe(200);
    expect(mockSupabase.updateUserById).toHaveBeenCalledWith('user-to-ban', { ban_duration: '876000h' });
  });

  it('bans the member on chargeback too', async () => {
    mockSupabase.members.row = { user_id: 'user-to-ban' };

    const res = await handler(webhookRequest(payload('CHARGEBACK', 'HP-chargeback')));

    expect(res.status).toBe(200);
    expect(mockSupabase.updateUserById).toHaveBeenCalledWith('user-to-ban', { ban_duration: '876000h' });
  });

  it('is a no-op (not an error) revoking access for an email that genuinely never existed', async () => {
    mockSupabase.members.row = null;
    // Default generateLink mock already returns "not found" — never existed at all.

    const res = await handler(webhookRequest(payload('REFUNDED', 'HP-never-a-member')));

    expect(res.status).toBe(200);
    expect(mockSupabase.updateUserById).not.toHaveBeenCalled();
  });

  it('treats banning an already-deleted auth user (user_not_found) as a no-op, not a failure', async () => {
    mockSupabase.members.row = { user_id: 'user-deleted' };
    mockSupabase.updateUserById.mockResolvedValue({ error: { code: 'user_not_found', message: 'gone' } });

    const res = await handler(webhookRequest(payload('REFUNDED', 'HP-deleted-user')));

    expect(res.status).toBe(200);
  });

  it('returns 500 on a genuine ban failure so the webhook is retried', async () => {
    mockSupabase.members.row = { user_id: 'user-to-ban' };
    mockSupabase.updateUserById.mockResolvedValue({ error: { message: 'GoTrue is down' } });

    const res = await handler(webhookRequest(payload('REFUNDED', 'HP-ban-fails')));

    expect(res.status).toBe(500);
  });

  it('rejects a malformed payload with 400 without calling the database', async () => {
    const res = await handler(webhookRequest({ event: 'PURCHASE_APPROVED', data: {} }));
    expect(res.status).toBe(400);
    expect(mockSupabase.purchases.upsert).not.toHaveBeenCalled();
  });
});
