import Link from 'next/link';
import { formatDurationLong } from '@/lib/podcasts';

interface PodcastCardProps {
  slug: string;
  title: string;
  description: string | null;
  duration: number | null;
  publishedAt: string | null;
  tags: string[];
}

export function PodcastCard({
  slug,
  title,
  description,
  duration,
  publishedAt,
  tags,
}: PodcastCardProps) {
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <Link
      href={`/podcasts/${slug}`}
      className="block p-6 rounded-lg border border-[#545c52] bg-[#040711]/50 hover:border-[#cacaaa] transition-colors group"
    >
      <div className="flex items-start gap-4">
        {/* Play icon */}
        <div className="w-12 h-12 rounded-full bg-[#cacaaa]/10 flex items-center justify-center shrink-0 group-hover:bg-[#cacaaa]/20 transition-colors">
          <svg className="w-5 h-5 text-[#cacaaa] ml-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.197-1.882a1 1 0 000-1.664L9.555 7.168z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[#fefadc] group-hover:text-[#cacaaa] transition-colors">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-[#cacaaa] line-clamp-2">{description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#8b8174]">
            {date && <span>{date}</span>}
            {duration && (
              <>
                <span className="w-1 h-1 rounded-full bg-[#545c52]" />
                <span>{formatDurationLong(duration)}</span>
              </>
            )}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded bg-[#545c52]/30 text-[#8b8174]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
