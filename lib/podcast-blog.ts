import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/posts';
import type { Podcast } from '@/lib/podcasts';

function formatDateNl(isoDate: string): string {
  const months = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ];
  const d = new Date(isoDate);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function podcastToPost(podcast: Podcast): Post {
  const publishedDate = podcast.published_at || podcast.created_at;
  const readingTime = Math.max(1, Math.ceil((podcast.show_notes || '').split(/\s+/).length / 200));

  const content = [
    podcast.description ? `${podcast.description}\n\n` : '',
    podcast.audio_url
      ? `> Luister de volledige aflevering op [onze podcastpagina](/podcasts/${podcast.slug}).\n\n`
      : '',
    podcast.show_notes || '',
    podcast.transcript
      ? `\n\n## Transcript\n\n${podcast.transcript.substring(0, 2000)}${podcast.transcript.length > 2000 ? '...\n\n[Lees het volledige transcript](/podcasts/' + podcast.slug + ')' : ''}`
      : '',
  ].join('');

  return {
    slug: `podcast-${podcast.slug}`,
    title: podcast.title,
    description: podcast.seo_description || podcast.description || podcast.topic,
    date: formatDateNl(publishedDate),
    dateISO: publishedDate.split('T')[0],
    content,
    category: 'algemeen',
    tags: ['podcast', ...podcast.tags],
    readingTime,
  };
}

export async function getPodcastBlogPosts(): Promise<Post[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('podcasts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch podcast blog posts:', error);
    return [];
  }

  return (data || []).map(podcastToPost);
}
