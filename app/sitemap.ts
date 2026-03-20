import { MetadataRoute } from 'next';
import { cases } from '@/lib/cases';
import { posts } from '@/lib/posts';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  // Fixed date for static pages — update manually on significant content changes
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

  return [...staticPages, ...casePages, ...blogPages];
}
