-- Open/click tracking from Resend webhooks
alter table public.sequence_emails
  add column if not exists opened_at timestamptz,
  add column if not exists clicked_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists bounced_at timestamptz,
  add column if not exists complained_at timestamptz;

-- Approval workflow: pending = awaiting Sander, sent = actually delivered,
-- rejected = Sander declined, failed = Resend error
alter table public.sequence_emails
  add column if not exists status text not null default 'sent',
  add column if not exists approved_at timestamptz,
  add column if not exists rejected_at timestamptz;

create index if not exists idx_sequence_emails_status
  on public.sequence_emails (status)
  where status = 'pending';

-- Webhook event log (one row per Resend event, helps debugging + preventing duplicates)
create table if not exists public.resend_webhook_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  resend_id text,
  sequence_email_id uuid references public.sequence_emails(id) on delete set null,
  payload jsonb,
  processed boolean not null default false
);

create index if not exists idx_resend_webhook_events_resend_id
  on public.resend_webhook_events (resend_id);

alter table public.resend_webhook_events enable row level security;
