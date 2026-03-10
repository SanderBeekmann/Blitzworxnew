import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { categoryLabels } from '@/lib/posts';

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-ebony">
      <h2 className="text-h2 font-bold text-cornsilk">Gerelateerde artikelen</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <span className="text-caption uppercase tracking-wider text-grey-olive">
              {categoryLabels[post.category]}
            </span>
            <h3 className="mt-2 text-h3 font-bold text-cornsilk group-hover:text-dry-sage transition-colors">
              {post.title}
            </h3>
            <p className="mt-2 text-body text-dry-sage line-clamp-2">
              {post.description}
            </p>
            <span className="mt-3 inline-block text-small text-grey-olive">
              {post.readingTime} min leestijd
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
