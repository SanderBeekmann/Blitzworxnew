# Nieuw Supabase-project aanmaken

## Stap 1: Project aanmaken

1. Ga naar [supabase.com/dashboard](https://supabase.com/dashboard)
2. Klik op **New project**
3. Kies je organization (of maak een nieuwe)
4. Vul in:
   - **Name:** blitzworx (of een andere naam)
   - **Database password:** Kies een sterk wachtwoord en bewaar dit
   - **Region:** eu-central-1 (Frankfurt) of eu-west-1 (Ierland)
5. Klik op **Create new project**
6. Wacht tot het project klaar is (1–2 minuten)

## Stap 2: Leads-tabel aanmaken

1. Ga in je project naar **SQL Editor**
2. Klik op **New query**
3. Plak de onderstaande SQL en voer uit (Run):

```sql
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
```

## Stap 3: API-gegevens ophalen

1. Ga naar **Settings** (tandwiel) → **API**
2. Kopieer:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key (onder Project API keys) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ Deel de service_role key nooit publiekelijk. Gebruik deze alleen in server-side code (.env).

## Stap 4: .env bijwerken

Voeg toe aan je `.env` of `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://JOUW_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Vervang `JOUW_PROJECT_REF` door de project reference uit de URL (bijv. `abcdefghijk`).
