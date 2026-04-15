import { Button } from '@/components/ui/Button';
import type { Package, Feature } from './packages';

interface PackageCardProps {
  pkg: Package;
}

function FeatureItem({ feature }: { feature: Feature }) {
  const text = typeof feature === 'string' ? feature : feature.text;
  const info = typeof feature === 'string' ? null : feature.info;

  return (
    <li className="flex items-start gap-3">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="text-dry-sage/60 shrink-0 mt-0.5"
        aria-hidden
      >
        <path
          d="M5 12l5 5L20 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-small text-dry-sage/80 flex-1">
        {text}
        {info && (
          <span className="relative inline-flex group/tip align-middle ml-1.5">
            <button
              type="button"
              aria-label={`Meer info: ${text}`}
              className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-dry-sage/40 text-[0.6rem] font-mono text-dry-sage/70 cursor-help hover:border-cornsilk/60 hover:text-cornsilk focus:outline-none focus:border-cornsilk focus:text-cornsilk transition-colors"
            >
              ?
            </button>
            <span
              role="tooltip"
              className="absolute right-0 top-full mt-2 w-60 max-w-[15rem] p-3 text-caption text-cornsilk bg-black border border-white/15 rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] leading-snug opacity-0 scale-95 translate-y-1 group-hover/tip:opacity-100 group-hover/tip:scale-100 group-hover/tip:translate-y-0 group-focus-within/tip:opacity-100 group-focus-within/tip:scale-100 group-focus-within/tip:translate-y-0 pointer-events-none transition-all duration-200 z-30"
            >
              {info}
            </span>
          </span>
        )}
      </span>
    </li>
  );
}

export function PackageCard({ pkg }: PackageCardProps) {
  const isHighlighted = pkg.highlighted;

  return (
    <div className="maintenance-animate opacity-0 motion-reduce:opacity-100 group relative h-full flex">
      {isHighlighted && (
        <div
          className="absolute -inset-10 blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(254,250,220,0.28) 0%, rgba(254,250,220,0.12) 40%, transparent 75%)',
          }}
          aria-hidden
        />
      )}

      <div
        className={`relative flex-1 flex flex-col rounded-lg p-8 lg:p-10 border backdrop-blur-xl transition-colors duration-500 ${
          isHighlighted
            ? 'border-cornsilk/25 group-hover:border-cornsilk/40'
            : 'border-white/[0.08] group-hover:border-white/[0.15]'
        } shadow-[0_2px_4px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.25),0_24px_48px_rgba(0,0,0,0.3),0_48px_96px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]`}
        style={{
          background: isHighlighted
            ? 'linear-gradient(135deg, rgba(254,250,220,0.1) 0%, rgba(254,250,220,0.03) 50%, rgba(254,250,220,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(202,202,170,0.04) 100%)',
        }}
      >
        {pkg.badge && (
          <span className="absolute top-5 right-5 lg:top-6 lg:right-6 inline-flex items-center px-2.5 py-1 rounded-full bg-cornsilk text-ink text-caption font-mono tracking-[0.15em] uppercase font-medium shadow-[0_4px_20px_rgba(254,250,220,0.35)]">
            {pkg.badge}
          </span>
        )}

        <span className="inline-flex items-center gap-2 text-caption font-mono tracking-[0.3em] uppercase text-cornsilk/70 mb-5">
          {pkg.name}
        </span>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-body text-grey-olive/50">&euro;</span>
          <span className="text-[3rem] md:text-[3.25rem] font-bold text-cornsilk leading-none tracking-tight">
            {pkg.price}
          </span>
          <span className="text-body text-grey-olive/50">/maand</span>
        </div>

        <p className="text-small text-dry-sage/70 leading-relaxed mb-6 min-h-[3rem]">
          {pkg.pitch}
        </p>

        <div className="w-full h-px bg-white/10 mb-6" aria-hidden />

        <ul className="space-y-3 mb-8 flex-1">
          {pkg.features.map((feature) => {
            const key = typeof feature === 'string' ? feature : feature.text;
            return <FeatureItem key={key} feature={feature} />;
          })}
        </ul>

        <div className="mb-6">
          <span className="block text-caption font-mono tracking-[0.15em] uppercase text-grey-olive/50 mb-1">
            Ideaal voor
          </span>
          <span className="text-small text-dry-sage/60 italic">{pkg.ideal}</span>
        </div>

        <Button
          href={`/contact?pakket=${pkg.id}`}
          variant={isHighlighted ? 'primary' : 'secondary'}
          className="w-full"
        >
          Kies {pkg.name}
        </Button>
      </div>
    </div>
  );
}
