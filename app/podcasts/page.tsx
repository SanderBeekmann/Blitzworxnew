import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { siteUrl } from '@/lib/site';
import { PodcastCard } from '@/components/podcast/PodcastCard';
import type { Podcast } from '@/lib/podcasts';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Podcast - Blitzworx',
  description:
    'Luister naar de Blitzworx Podcast over webdesign, development en branding. Praktische inzichten en trends voor ondernemers.',
  openGraph: {
    title: 'Podcast - Blitzworx',
    description:
      'Luister naar de Blitzworx Podcast over webdesign, development en branding.',
    url: `${siteUrl}/podcasts`,
    type: 'website',
  },
  alternates: {
    types: {
      'application/rss+xml': `${siteUrl}/api/podcasts/feed`,
    },
  },
};

async function getPublishedPodcasts(): Promise<Podcast[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('podcasts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch podcasts:', error);
    return [];
  }

  return data || [];
}

export default async function PodcastsPage() {
  const podcasts = await getPublishedPodcasts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: 'Blitzworx Podcast',
    description:
      'Inzichten over webdesign, development en branding door Blitzworx',
    url: `${siteUrl}/podcasts`,
    author: {
      '@type': 'Organization',
      name: 'Blitzworx',
      url: siteUrl,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Podcast', item: `${siteUrl}/podcasts` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#040711] text-[#fefadc]">
        <div className="container-narrow py-16">
          {/* Hero */}
          <div className="mb-12">
            <nav className="text-xs text-[#8b8174] mb-6">
              <a href="/" className="hover:text-[#cacaaa]">Home</a>
              <span className="mx-2">/</span>
              <span className="text-[#cacaaa]">Podcast</span>
            </nav>

            <h1 className="text-hero font-bold text-[#fefadc] mb-4">Podcast</h1>
            <p className="text-lg text-[#cacaaa] max-w-2xl">
              Luister naar onze podcast over webdesign, development en branding.
              Praktische inzichten en de laatste trends - speciaal voor ondernemers
              die hun online aanwezigheid willen versterken.
            </p>

            {/* RSS feed link */}
            <a
              href="/api/podcasts/feed"
              className="inline-flex items-center gap-2 mt-4 text-sm text-[#8b8174] hover:text-[#cacaaa] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
                <path d="M4 9a1 1 0 011-1 8 8 0 018 8 1 1 0 11-2 0A6 6 0 005 10a1 1 0 01-1-1z" />
                <path d="M3 15a2 2 0 114 0 2 2 0 01-4 0z" />
              </svg>
              RSS Feed
            </a>
          </div>

          {/* Podcast list */}
          {podcasts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#8b8174]">
                Binnenkort verschijnt hier onze eerste aflevering. Blijf op de hoogte!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {podcasts.map((podcast) => (
                <PodcastCard
                  key={podcast.id}
                  slug={podcast.slug}
                  title={podcast.title}
                  description={podcast.description}
                  duration={podcast.audio_duration}
                  publishedAt={podcast.published_at}
                  tags={podcast.tags}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 rounded-lg border border-[#545c52] bg-[#040711]/50 text-center">
            <h2 className="text-xl font-semibold text-[#fefadc] mb-2">
              Wil je op de hoogte blijven?
            </h2>
            <p className="text-sm text-[#8b8174] mb-4">
              Abonneer je via je favoriete podcast app of volg ons voor nieuwe afleveringen.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/api/podcasts/feed"
                className="inline-flex items-center min-h-[44px] px-5 py-2.5 bg-[#cacaaa] text-[#040711] font-medium rounded-md hover:bg-[#fefadc] transition-colors text-sm"
              >
                Abonneer via RSS
              </a>
              <a
                href="/contact"
                className="inline-flex items-center min-h-[44px] px-5 py-2.5 border border-[#545c52] text-[#8b8174] rounded-md hover:border-[#cacaaa] hover:text-[#fefadc] transition-colors text-sm"
              >
                Neem contact op
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
