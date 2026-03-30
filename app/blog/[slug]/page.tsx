import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteUrl } from '@/lib/site';
import {
  getPostBySlug,
  getAllPostSlugs,
  getRelatedPosts,
  extractHeadings,
  getWordCount,
  categoryLabels,
} from '@/lib/posts';
import { FadeIn } from '@/components/animations/FadeIn';
import { MarkdownContent } from '@/components/blog/MarkdownContent';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { BlogCTA } from '@/components/blog/BlogCTA';
import { AuthorCard } from '@/components/blog/AuthorCard';
import { BlogFAQ } from '@/components/blog/BlogFAQ';

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

  const ogImage =
    post.category === 'webdesign'
      ? '/assets/images/og-image.png'
      : '/assets/images/og-image.png';

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
      modifiedTime: post.dateModifiedISO ?? post.dateISO,
      section: categoryLabels[post.category],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const wordCount = getWordCount(post.content);
  const related = getRelatedPosts(slug, 3);

  /* ---------- JSON-LD: Article ---------- */
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.dateISO,
    dateModified: post.dateModifiedISO ?? post.dateISO,
    wordCount,
    articleSection: categoryLabels[post.category],
    image: `${siteUrl}/assets/images/og-image.png`,
    author: {
      '@type': 'Person',
      name: 'Sander Beekman',
      url: `${siteUrl}/about`,
      sameAs: 'https://www.linkedin.com/in/sander-beekman-38b054251/',
    },
    publisher: { '@id': `${siteUrl}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`,
    },
    url: `${siteUrl}/blog/${slug}`,
  };

  /* ---------- JSON-LD: Breadcrumb ---------- */
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${slug}`,
      },
    ],
  };

  /* ---------- JSON-LD: FAQ ---------- */
  const faqJsonLd =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <main className="section min-h-screen">
        <div className="container-narrow">
          {/* Breadcrumb navigation */}
          <FadeIn>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-small text-grey-olive">
              <Link href="/" className="hover:text-dry-sage transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-dry-sage transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-dry-sage">{post.title}</span>
            </nav>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 mt-12 md:mt-16">
            {/* Article content */}
            <article className="max-w-prose">
              <header>
                <div className="flex items-center gap-3 mb-4">
                  <Link
                    href={`/blog?categorie=${post.category}`}
                    className="text-caption uppercase tracking-wider text-grey-olive hover:text-cornsilk transition-colors border border-ebony px-3 py-1 rounded-sm"
                  >
                    {categoryLabels[post.category]}
                  </Link>
                  <span className="text-caption text-grey-olive">
                    {post.readingTime} min leestijd
                  </span>
                </div>
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
                <BlogCTA category={post.category} />
              </FadeIn>
            </article>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-8 lg:self-start space-y-8">
              <FadeIn delay={0.2}>
                <div className="space-y-8">
                  <AuthorCard />
                  <TableOfContents headings={headings} />
                  <BlogFAQ faqs={post.faqs} />
                  <RelatedPosts posts={related} variant="sidebar" />
                </div>
              </FadeIn>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
