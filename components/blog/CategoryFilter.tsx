import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { categoryLabels } from '@/lib/posts';

const categories: (Post['category'] | 'all')[] = ['all', 'webdesign', 'development', 'branding', 'algemeen'];

export function CategoryFilter({ activeCategory }: { activeCategory?: Post['category'] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = cat === 'all' ? !activeCategory : cat === activeCategory;
        const href = cat === 'all' ? '/blog' : `/blog?categorie=${cat}`;
        const label = cat === 'all' ? 'Alles' : categoryLabels[cat];

        return (
          <Link
            key={cat}
            href={href}
            className={`px-4 py-2 text-small rounded-sm border transition-colors ${
              isActive
                ? 'bg-cornsilk text-ink border-cornsilk font-bold'
                : 'border-ebony text-grey-olive hover:text-cornsilk hover:border-cornsilk'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
