import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn } from '@/components/animations/FadeIn';
import { posts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artikelen over webdesign, websites laten maken en online groeien. Tips en inzichten van Blitzworx.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );

  return (
    <main className="section min-h-screen">
      <div className="container-narrow">
        <FadeIn>
          <Link
            href="/"
            className="text-small text-grey-olive hover:text-dry-sage transition-colors"
          >
            ← Terug naar home
          </Link>
        </FadeIn>

        <header className="mt-12 md:mt-16">
          <h1 className="text-hero md:text-hero-lg font-bold text-cornsilk">
            Blog
          </h1>
          <FadeIn delay={0.1}>
            <p className="mt-6 text-body text-dry-sage max-w-prose">
              Tips en inzichten over webdesign, websites laten maken en online groeien.
            </p>
          </FadeIn>
        </header>

        <div className="mt-16 md:mt-24 space-y-12">
          {sortedPosts.map((post, i) => (
            <FadeIn key={post.slug} delay={0.1 + i * 0.05}>
              <article>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
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
        </div>
      </div>
    </main>
  );
}
