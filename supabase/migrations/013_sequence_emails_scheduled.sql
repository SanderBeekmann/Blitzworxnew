-- Per-email scheduled send time. Approved emails wait until this time
-- before the cron job dispatches them via Resend.
alter table public.sequence_emails
  add column if not exists scheduled_send_at timestamptz;

-- Fast lookup for the cron job: "find approved emails due for sending"
create index if not exists idx_sequence_emails_scheduled_send
  on public.sequence_emails (scheduled_send_at)
  where status = 'approved';
