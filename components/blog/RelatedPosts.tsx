import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { categoryLabels } from '@/lib/posts';

interface RelatedPostsProps {
  posts: Post[];
  variant?: 'default' | 'sidebar';
}

export function RelatedPosts({ posts, variant = 'default' }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  const isSidebar = variant === 'sidebar';

  return (
    <section className={isSidebar ? '' : 'mt-16 pt-12 border-t border-ebony'}>
      <h2 className={`font-bold text-cornsilk ${isSidebar ? 'text-h3' : 'text-h2'}`}>
        {isSidebar ? 'Volgende artikelen' : 'Gerelateerde artikelen'}
      </h2>
      <div className={isSidebar ? 'mt-4 grid gap-4 grid-cols-1' : 'mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'}>
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
