import { MetadataRoute } from 'next';
import { cases } from '@/lib/cases';
import { posts } from '@/lib/posts';
import { siteUrl } from '@/lib/site';
import { supabase } from '@/lib/supabase';
import { getAllLandingPages } from '@/lib/landing-pages';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fixed date for static pages - update manually on significant content changes
  const staticLastModified = new Date('2026-03-09');

  const staticPages = [
    { url: siteUrl, lastModified: staticLastModified, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${siteUrl}/about`, lastModified: staticLastModified, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/cases`, lastModified: staticLastModified, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: staticLastModified, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/diensten`, lastModified: staticLastModified, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/diensten/webdesign`, lastModified: staticLastModified, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/diensten/development`, lastModified: staticLastModified, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/diensten/branding`, lastModified: staticLastModified, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/diensten/ai-automatiseringen`, lastModified: staticLastModified, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: staticLastModified, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/podcasts`, lastModified: staticLastModified, changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  const blogPages = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.dateModifiedISO ?? p.dateISO),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const casePages = cases.map((c) => ({
    url: `${siteUrl}/cases/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Podcast pages from Supabase
  let podcastPages: MetadataRoute.Sitemap = [];
  if (supabase) {
    const { data: podcasts } = await supabase
      .from('podcasts')
      .select('slug, published_at, updated_at')
      .eq('status', 'published');

    podcastPages = (podcasts || []).map((p) => ({
      url: `${siteUrl}/podcasts/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  }

  // Landing pages from Supabase
  const landingPages = await getAllLandingPages();
  const landingPageEntries = landingPages.map((p) => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...casePages,
    ...blogPages,
    ...podcastPages,
    ...landingPageEntries,
  ];
}
