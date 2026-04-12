create table if not exists public.website_scans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  url text not null,
  email text,
  score_overall numeric(3,1) not null,
  score_speed numeric(3,1) not null,
  score_mobile numeric(3,1) not null,
  score_seo numeric(3,1) not null,
  score_security numeric(3,1) not null,
  score_accessibility numeric(3,1) not null
);

alter table public.website_scans enable row level security;
create index idx_website_scans_url on public.website_scans (url);
