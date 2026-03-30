import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { siteUrl } from '@/lib/site';
import { AudioPlayer } from '@/components/podcast/AudioPlayer';
import { PodcastHero } from '@/components/podcast/PodcastHero';
import { ShowNotes } from '@/components/podcast/ShowNotes';
import { TranscriptAccordion } from '@/components/podcast/TranscriptAccordion';
import { LeadCaptureForm } from '@/components/podcast/LeadCaptureForm';
import type { Podcast } from '@/lib/podcasts';

export const revalidate = 3600;

async function getPodcast(slug: string): Promise<Podcast | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('podcasts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const podcast = await getPodcast(slug);

  if (!podcast) {
    return { title: 'Podcast niet gevonden - Blitzworx' };
  }

  return {
    title: `${podcast.seo_title || podcast.title} - Blitzworx Podcast`,
    description: podcast.seo_description || podcast.description || podcast.topic,
    openGraph: {
      title: podcast.seo_title || podcast.title,
      description: podcast.seo_description || podcast.description || podcast.topic,
      url: `${siteUrl}/podcasts/${slug}`,
      type: 'article',
      ...(podcast.audio_url
        ? {
            audio: [
              {
                url: podcast.audio_url,
                type: 'audio/mpeg',
              },
            ],
          }
        : {}),
    },
    alternates: {
      canonical: `${siteUrl}/podcasts/${slug}`,
    },
  };
}

export default async function PodcastDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const podcast = await getPodcast(slug);

  if (!podcast) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: podcast.title,
    description: podcast.description || podcast.topic,
    url: `${siteUrl}/podcasts/${slug}`,
    datePublished: podcast.published_at,
    ...(podcast.audio_duration
      ? { timeRequired: `PT${Math.ceil(podcast.audio_duration / 60)}M` }
      : {}),
    ...(podcast.audio_url
      ? {
          associatedMedia: {
            '@type': 'MediaObject',
            contentUrl: podcast.audio_url,
            encodingFormat: 'audio/mpeg',
          },
        }
      : {}),
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: 'Blitzworx Podcast',
      url: `${siteUrl}/podcasts`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#040711] text-[#fefadc]">
        <div className="container-narrow py-16">
          {/* Breadcrumb */}
          <nav className="text-xs text-[#8b8174] mb-6">
            <a href="/" className="hover:text-[#cacaaa]">Home</a>
            <span className="mx-2">/</span>
            <a href="/podcasts" className="hover:text-[#cacaaa]">Podcast</a>
            <span className="mx-2">/</span>
            <span className="text-[#cacaaa]">{podcast.title}</span>
          </nav>

          {/* Hero */}
          <PodcastHero
            title={podcast.title}
            description={podcast.description}
            publishedAt={podcast.published_at}
            duration={podcast.audio_duration}
            playCount={podcast.play_count}
            tags={podcast.tags}
          />

          {/* Audio Player */}
          {podcast.audio_url && (
            <AudioPlayer
              src={podcast.audio_url}
              slug={podcast.slug}
              title={podcast.title}
              duration={podcast.audio_duration}
            />
          )}

          {/* Show Notes */}
          {podcast.show_notes && <ShowNotes content={podcast.show_notes} />}

          {/* Transcript */}
          {podcast.transcript && (
            <TranscriptAccordion transcript={podcast.transcript} />
          )}

          {/* Download CTA */}
          <div className="mt-12 p-8 rounded-lg border border-[#545c52] bg-[#040711]/50">
            <h2 className="text-xl font-semibold text-[#fefadc] mb-2">
              Download deze aflevering
            </h2>
            <p className="text-sm text-[#8b8174] mb-4">
              Wil je deze aflevering offline beluisteren? Vul je e-mailadres in
              voor de download link.
            </p>
            <div className="max-w-md">
              <LeadCaptureForm slug={podcast.slug} />
            </div>
          </div>

          {/* Related blog post link */}
          {podcast.blog_slug && (
            <div className="mt-8">
              <a
                href={`/blog/${podcast.blog_slug}`}
                className="inline-flex items-center gap-2 text-sm text-[#cacaaa] hover:text-[#fefadc] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Lees het bijbehorende blogartikel
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
