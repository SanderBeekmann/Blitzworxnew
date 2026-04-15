-- Explicit service_role policies on sequence tables.
-- Service role bypasses RLS by default in Supabase, but these policies
-- make the intent explicit and future-proof the tables.

create policy "service_role_sequences_all"
  on public.email_sequences for all to service_role
  using (true) with check (true);

create policy "service_role_sequence_emails_all"
  on public.sequence_emails for all to service_role
  using (true) with check (true);

create policy "service_role_webhook_events_all"
  on public.resend_webhook_events for all to service_role
  using (true) with check (true);
