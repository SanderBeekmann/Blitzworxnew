import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Diensten',
  description:
    'Webdesign, webdevelopment en branding voor ondernemers. Blitzworx helpt je online groeien met maatwerk dat werkt.',
  alternates: { canonical: '/diensten' },
};

const SERVICES = [
  {
    href: '/diensten/webdesign',
    title: 'Webdesign',
    description: 'Visueel ontwerp dat jouw merk versterkt en bezoekers overtuigt.',
  },
  {
    href: '/diensten/development',
    title: 'Webdevelopment',
    description: 'Op maat gemaakte websites, dashboards en backends die meegroeien.',
  },
  {
    href: '/diensten/branding',
    title: 'Branding',
    description: 'Merkidentiteit en huisstijl die je onderneming herkenbaar maken.',
  },
] as const;

export default function DienstenPage() {
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
            Diensten
          </h1>
          <FadeIn delay={0.1}>
            <p className="mt-6 text-body text-dry-sage max-w-prose">
              Blitzworx biedt het totaalpakket voor ondernemers die online willen groeien. Van
              merkidentiteit tot werkende website: we begeleiden je van concept tot live.
            </p>
          </FadeIn>
        </header>

        <div className="mt-16 md:mt-24 grid md:grid-cols-3 gap-8 md:gap-12 md:items-stretch">
          {SERVICES.map((service, i) => (
            <FadeIn key={service.href} delay={0.1 + i * 0.05} className="h-full">
              <Link
                href={service.href}
                className="flex flex-col h-full p-6 md:p-8 rounded-md bg-ink border border-ebony hover:border-grey-olive transition-shadow transition-colors duration-300 hover:shadow-[0_0_24px_rgba(254,250,220,0.15),0_0_48px_rgba(254,250,220,0.08)] group"
              >
                <h2 className="text-h3 font-semibold text-cornsilk group-hover:text-dry-sage transition-colors">
                  {service.title}
                </h2>
                <p className="mt-3 text-body text-dry-sage flex-1">{service.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-small text-dry-sage group-hover:text-cornsilk transition-colors">
                  Lees meer
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
}
