import { STATUS_LABELS } from '@/lib/podcasts';
import type { PodcastStatus } from '@/lib/podcasts';

const STATUS_STYLES: Record<PodcastStatus, string> = {
  draft: 'bg-[#8b8174]/20 text-[#8b8174]',
  researching: 'bg-amber-500/20 text-amber-400 animate-pulse',
  generating: 'bg-amber-500/20 text-amber-400 animate-pulse',
  review: 'border border-[#cacaaa] text-[#cacaaa]',
  published: 'bg-[#cacaaa] text-[#040711]',
  archived: 'bg-[#545c52]/30 text-[#8b8174]',
};

export function PodcastStatusBadge({ status }: { status: PodcastStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
