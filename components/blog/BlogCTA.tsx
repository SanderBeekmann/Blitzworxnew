import Link from 'next/link';
import type { Post } from '@/lib/posts';

const ctaConfig: Record<Post['category'], { heading: string; text: string; href: string; label: string }> = {
  webdesign: {
    heading: 'Op zoek naar een professionele website?',
    text: 'Blitzworx ontwerpt websites die er niet alleen goed uitzien, maar ook écht resultaat opleveren.',
    href: '/diensten/webdesign',
    label: 'Bekijk mijn webdesign diensten',
  },
  development: {
    heading: 'Klaar voor een website die écht presteert?',
    text: 'Ik bouw razendsnelle websites en webapplicaties op maat met moderne technologie.',
    href: '/diensten/development',
    label: 'Bekijk mijn development diensten',
  },
  branding: {
    heading: 'Wil je een merk dat opvalt?',
    text: 'Van logo tot complete huisstijl — ik help je een merk bouwen dat blijft hangen.',
    href: '/diensten/branding',
    label: 'Bekijk mijn branding diensten',
  },
  algemeen: {
    heading: 'Wil je online groeien?',
    text: 'Blitzworx helpt ondernemers met webdesign, development en branding. Alles onder één dak.',
    href: '/contact',
    label: 'Neem vrijblijvend contact op',
  },
};

export function BlogCTA({ category }: { category: Post['category'] }) {
  const cta = ctaConfig[category];

  return (
    <section className="mt-16 p-8 md:p-12 border border-ebony rounded-sm bg-ink/50">
      <h2 className="text-h2 font-bold text-cornsilk">{cta.heading}</h2>
      <p className="mt-4 text-body text-dry-sage max-w-prose">{cta.text}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={cta.href}
          className="inline-flex items-center px-6 py-3 bg-cornsilk text-ink font-bold text-body rounded-sm hover:bg-dry-sage transition-colors"
        >
          {cta.label}
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-3 border border-cornsilk text-cornsilk font-bold text-body rounded-sm hover:bg-cornsilk hover:text-ink transition-colors"
        >
          Gratis adviesgesprek
        </Link>
      </div>
    </section>
  );
}
