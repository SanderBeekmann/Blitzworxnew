import { formatDurationLong } from '@/lib/podcasts';

interface PodcastHeroProps {
  title: string;
  description: string | null;
  publishedAt: string | null;
  duration: number | null;
  playCount: number;
  tags: string[];
}

export function PodcastHero({
  title,
  description,
  publishedAt,
  duration,
  playCount,
  tags,
}: PodcastHeroProps) {
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="mb-8">
      <h1 className="text-hero font-bold text-[#fefadc] mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-[#cacaaa] mb-6 max-w-2xl">{description}</p>
      )}
      <div className="flex flex-wrap items-center gap-3 text-sm text-[#8b8174]">
        {date && <span>{date}</span>}
        {duration && (
          <>
            <span className="w-1 h-1 rounded-full bg-[#545c52]" />
            <span>{formatDurationLong(duration)}</span>
          </>
        )}
        {playCount > 0 && (
          <>
            <span className="w-1 h-1 rounded-full bg-[#545c52]" />
            <span>{playCount}x beluisterd</span>
          </>
        )}
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs rounded-md bg-[#545c52]/30 text-[#8b8174]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
