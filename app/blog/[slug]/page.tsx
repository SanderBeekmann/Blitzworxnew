import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteUrl } from '@/lib/site';
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { FadeIn } from '@/components/animations/FadeIn';
import { MarkdownContent } from '@/components/blog/MarkdownContent';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Artikel niet gevonden' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: post.dateISO,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.dateISO,
    author: { '@id': `${siteUrl}/#organization` },
    publisher: { '@id': `${siteUrl}/#organization` },
    url: `${siteUrl}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <main className="section min-h-screen">
        <div className="container-narrow">
          <FadeIn>
            <Link
              href="/blog"
              className="text-small text-grey-olive hover:text-dry-sage transition-colors"
            >
              ← Terug naar blog
            </Link>
          </FadeIn>

          <article className="mt-12 md:mt-16 max-w-prose">
            <header>
              <h1 className="text-hero md:text-hero-lg font-bold text-cornsilk">
                {post.title}
              </h1>
              <time
                dateTime={post.dateISO}
                className="mt-4 block text-body text-grey-olive"
              >
                {post.date}
              </time>
            </header>

            <FadeIn delay={0.1}>
              <div className="mt-12">
                <MarkdownContent content={post.content} />
              </div>
            </FadeIn>
          </article>
        </div>
      </main>
    </>
  );
}
