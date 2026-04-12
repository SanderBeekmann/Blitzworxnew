-- Full scan data cached so the email agent can reference specific weak points
alter table public.website_scans
  add column if not exists full_report jsonb;

-- One row per lead enrolled in the website-score email sequence
create table if not exists public.email_sequences (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  scan_id uuid references public.website_scans(id) on delete set null,
  email text not null,
  url text not null,
  status text not null default 'active', -- active | completed | stopped | unsubscribed
  current_step smallint not null default 2, -- next step to send; step 1 is the transactional report sent synchronously
  enrolled_at timestamptz not null default now(),
  next_send_at timestamptz,
  last_send_at timestamptz,
  completed_at timestamptz,
  stopped_reason text
);

create index if not exists idx_email_sequences_status_next_send
  on public.email_sequences (next_send_at)
  where status = 'active';

create index if not exists idx_email_sequences_email
  on public.email_sequences (email);

-- Each generated email (one row per send attempt)
create table if not exists public.sequence_emails (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sequence_id uuid not null references public.email_sequences(id) on delete cascade,
  step smallint not null,
  subject text not null,
  body_html text not null,
  body_text text,
  generated_by text, -- 'claude' | 'template'
  sent_at timestamptz,
  resend_id text,
  error text
);

create index if not exists idx_sequence_emails_sequence_id
  on public.sequence_emails (sequence_id);

alter table public.email_sequences enable row level security;
alter table public.sequence_emails enable row level security;
