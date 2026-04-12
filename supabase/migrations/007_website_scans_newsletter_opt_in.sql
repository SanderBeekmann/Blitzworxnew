alter table public.website_scans
  add column if not exists newsletter_opted_in boolean not null default false,
  add column if not exists consent_text_version text,
  add column if not exists consent_ip inet;

create index if not exists idx_website_scans_newsletter_opted_in
  on public.website_scans (newsletter_opted_in) where newsletter_opted_in = true;
