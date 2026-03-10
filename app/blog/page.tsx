import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn } from '@/components/animations/FadeIn';
import { posts, categoryLabels } from '@/lib/posts';
import type { Post } from '@/lib/posts';
import { siteUrl } from '@/lib/site';
import { CategoryFilter } from '@/components/blog/CategoryFilter';

export const metadata: Metadata = {
  title: 'Blog | Tips over webdesign, development en branding',
  description:
    'Praktische artikelen over webdesign, development, branding en online groeien. Tips, checklists en gidsen voor ondernemers die meer uit hun website willen halen.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage({
  searchParams,
}: {
  searchParams: { categorie?: string };
}) {
  const activeCategory = searchParams.categorie as Post['category'] | undefined;

  const sortedPosts = [...posts]
    .filter((p) => !activeCategory || p.category === activeCategory)
    .sort(
      (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
    );

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="section min-h-screen">
        <div className="container-narrow">
          <FadeIn>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-small text-grey-olive">
              <Link href="/" className="hover:text-dry-sage transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-dry-sage">Blog</span>
            </nav>
          </FadeIn>

          <header className="mt-12 md:mt-16">
            <h1 className="text-hero md:text-hero-lg font-bold text-cornsilk">
              Blog
            </h1>
            <FadeIn delay={0.1}>
              <p className="mt-6 text-body text-dry-sage max-w-prose">
                Praktische artikelen over webdesign, development, branding en online
                groeien. Tips, checklists en gidsen voor ondernemers.
              </p>
            </FadeIn>
          </header>

          {/* Category filter */}
          <FadeIn delay={0.15}>
            <CategoryFilter activeCategory={activeCategory} />
          </FadeIn>

          <div className="mt-12 md:mt-16 space-y-12">
            {sortedPosts.map((post, i) => (
              <FadeIn key={post.slug} delay={0.1 + i * 0.05}>
                <article>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-caption uppercase tracking-wider text-grey-olive">
                        {categoryLabels[post.category]}
                      </span>
                      <span className="text-caption text-grey-olive">
                        {post.readingTime} min leestijd
                      </span>
                    </div>
                    <h2 className="text-h2 font-bold text-cornsilk group-hover:text-dry-sage transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-body text-dry-sage">{post.description}</p>
                    <time
                      dateTime={post.dateISO}
                      className="mt-2 block text-small text-grey-olive"
                    >
                      {post.date}
                    </time>
                  </Link>
                </article>
              </FadeIn>
            ))}

            {sortedPosts.length === 0 && (
              <p className="text-body text-grey-olive">
                Geen artikelen gevonden in deze categorie.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
