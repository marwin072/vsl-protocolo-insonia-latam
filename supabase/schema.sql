-- Protocolo Mente Desligada — backend schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) once the project is created.

create extension if not exists pgcrypto;

-- Email opt-ins captured before checkout (landing page lead form).
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  created_at timestamptz not null default now()
);

-- Plain (not functional) unique index on the literal `email` column: the app always
-- normalizes to lowercase before insert (see api/lead.ts), and the upsert's
-- `onConflict: 'email'` arbiter must match a real column index, not an expression index.
create unique index if not exists leads_email_key on public.leads (email);

-- One row per confirmed purchase notification from the checkout platform (Hotmart, etc).
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  platform text not null,
  product_id text,
  transaction_id text not null,
  amount_cents integer,
  currency text not null default 'BRL',
  status text not null,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

-- A platform can resend the same transaction (retries); keep it idempotent.
create unique index if not exists purchases_platform_transaction_key
  on public.purchases (platform, transaction_id);

create index if not exists purchases_email_idx on public.purchases (lower(email));

-- Maps a buyer's email to the auth.users id created for them by inviteUserByEmail().
-- The Admin API has no "get user by email" call, so this is our own index for it —
-- needed to ban/unban a member's auth account on refund/chargeback without paging
-- through every user in the project to find them.
create table if not exists public.members (
  email text primary key,
  -- Cascades so a deleted auth user (GDPR erasure, manual cleanup, ...) doesn't leave
  -- a dangling mapping that a later refund/renewal would otherwise try to act on.
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Lock all three tables down by default. Only the service-role key (used exclusively
-- in /api serverless functions, never shipped to the browser) bypasses RLS — there are
-- deliberately no policies granting anon/authenticated access.
alter table public.leads enable row level security;
alter table public.purchases enable row level security;
alter table public.members enable row level security;
