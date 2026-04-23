-- Cache lookup + rate limiting + unlock tracking for website score jobs
alter table public.website_score_jobs
  add column if not exists ip_address text,
  add column if not exists client_id text,
  add column if not exists email text,
  add column if not exists unlocked_at timestamptz;

-- Cache lookup: find completed job for a URL within TTL
create index if not exists idx_website_score_jobs_url_completed
  on public.website_score_jobs (url, created_at desc)
  where status = 'completed';

-- Rate limit lookups
create index if not exists idx_website_score_jobs_ip_created
  on public.website_score_jobs (ip_address, created_at desc)
  where ip_address is not null;

create index if not exists idx_website_score_jobs_client_created
  on public.website_score_jobs (client_id, created_at desc)
  where client_id is not null;
