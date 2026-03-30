import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { siteUrl } from '@/lib/site';
import { formatDuration } from '@/lib/podcasts';

export async function GET() {
  if (!supabase) {
    return new NextResponse('Database niet geconfigureerd', { status: 503 });
  }

  try {
    const { data: podcasts, error } = await supabase
      .from('podcasts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Supabase podcast feed error:', error);
      return new NextResponse('Kon feed niet genereren', { status: 500 });
    }

    const items = (podcasts || [])
      .map((p) => {
        const pubDate = p.published_at
          ? new Date(p.published_at).toUTCString()
          : new Date(p.created_at).toUTCString();
        const duration = p.audio_duration ? formatDuration(p.audio_duration) : '00:00';

        return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <description><![CDATA[${p.description || p.topic}]]></description>
      <link>${siteUrl}/podcasts/${p.slug}</link>
      <guid isPermaLink="true">${siteUrl}/podcasts/${p.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${p.audio_url}" type="audio/mpeg" />
      <itunes:duration>${duration}</itunes:duration>
      <itunes:summary><![CDATA[${p.seo_description || p.description || p.topic}]]></itunes:summary>
      <itunes:explicit>false</itunes:explicit>
    </item>`;
      })
      .join('\n');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blitzworx Podcast</title>
    <link>${siteUrl}/podcasts</link>
    <language>nl</language>
    <description>Inzichten over webdesign, development en branding door Blitzworx</description>
    <atom:link href="${siteUrl}/api/podcasts/feed" rel="self" type="application/rss+xml" />
    <itunes:author>Blitzworx</itunes:author>
    <itunes:owner>
      <itunes:name>Blitzworx</itunes:name>
      <itunes:email>contact@blitzworx.nl</itunes:email>
    </itunes:owner>
    <itunes:category text="Technology" />
    <itunes:category text="Business" />
    <itunes:explicit>false</itunes:explicit>
${items}
  </channel>
</rss>`;

    return new NextResponse(feed, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    console.error('Podcast feed error:', err);
    return new NextResponse('Er ging iets mis', { status: 500 });
  }
}
