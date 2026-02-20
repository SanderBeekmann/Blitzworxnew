-- Leads table for contact form submissions
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  project_type text not null,
  preferred_date date,
  preferred_time text,
  status text not null default 'new' check (status in ('new', 'contacted', 'completed'))
);

-- Enable RLS (service role bypasses RLS - API uses service key)
alter table public.leads enable row level security;
