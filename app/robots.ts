import { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/llms.txt', '/llms-full.txt'],
      disallow: ['/api/', '/_next/data/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
