-- Podcasts table for lead generation podcast system
CREATE TABLE IF NOT EXISTS public.podcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  topic text NOT NULL,
  audio_url text,
  audio_duration integer,
  thumbnail_url text,
  transcript text,
  show_notes text,
  seo_title text,
  seo_description text,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'researching', 'generating', 'review', 'published', 'archived')),
  sources jsonb DEFAULT '[]',
  notebooklm_notebook_id text,
  blog_slug text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  play_count integer DEFAULT 0,
  download_count integer DEFAULT 0
);

ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_podcasts_slug ON public.podcasts(slug);
CREATE INDEX idx_podcasts_status ON public.podcasts(status);

-- Podcast leads: email-gated downloads and listen unlocks
CREATE TABLE IF NOT EXISTS public.podcast_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  podcast_id uuid NOT NULL REFERENCES public.podcasts(id) ON DELETE CASCADE,
  name text,
  email text NOT NULL,
  source_page text,
  captured_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.podcast_leads ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_podcast_leads_podcast_id ON public.podcast_leads(podcast_id);
CREATE INDEX idx_podcast_leads_email ON public.podcast_leads(email);
