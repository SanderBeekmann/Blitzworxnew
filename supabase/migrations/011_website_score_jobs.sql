-- Async job queue for website score analysis
create table if not exists website_score_jobs (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  result jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for polling
create index if not exists idx_website_score_jobs_status on website_score_jobs (id, status);
