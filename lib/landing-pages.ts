import { supabase } from '@/lib/supabase';

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  body: string;
  pillar: string | null;
  created_at: string;
  updated_at: string | null;
}

export async function getAllLandingPages(): Promise<LandingPage[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('content_drafts')
    .select('id, slug, title, body, pillar, created_at, updated_at')
    .eq('channel', 'landingspagina')
    .eq('status', 'approved')
    .not('slug', 'is', null)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as LandingPage[];
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('content_drafts')
    .select('id, slug, title, body, pillar, created_at, updated_at')
    .eq('channel', 'landingspagina')
    .eq('status', 'approved')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as LandingPage;
}

export function getAllLandingPageSlugs(pages: LandingPage[]): string[] {
  return pages.map((p) => p.slug);
}
