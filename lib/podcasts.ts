export type PodcastStatus =
  | 'draft'
  | 'researching'
  | 'generating'
  | 'review'
  | 'published'
  | 'archived';

export interface PodcastSource {
  type: 'youtube' | 'article' | 'other';
  url: string;
  title: string;
  metadata?: Record<string, unknown>;
}

export interface Podcast {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  topic: string;
  audio_url: string | null;
  audio_duration: number | null;
  thumbnail_url: string | null;
  transcript: string | null;
  show_notes: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  status: PodcastStatus;
  sources: PodcastSource[];
  notebooklm_notebook_id: string | null;
  blog_slug: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  play_count: number;
  download_count: number;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDurationLong(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}u ${remainingMins}min`;
}

export const STATUS_LABELS: Record<PodcastStatus, string> = {
  draft: 'Concept',
  researching: 'Onderzoek',
  generating: 'Genereren',
  review: 'Review',
  published: 'Gepubliceerd',
  archived: 'Gearchiveerd',
};

export const FREEMIUM_LIMIT_SECONDS = 240; // 4 minutes
