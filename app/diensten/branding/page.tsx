import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Branding',
  description:
    'Merkidentiteit en huisstijl voor ondernemers. Van logo tot complete visuele identiteit. Blitzworx helpt je merk herkenbaar en onderscheidend te maken.',
  alternates: { canonical: '/diensten/branding' },
};

export default function BrandingPage() {
  return (
    <main className="section min-h-screen">
      <div className="container-narrow">
        <FadeIn>
          <Link
            href="/diensten/webdesign"
            className="text-small text-grey-olive hover:text-dry-sage transition-colors"
          >
            ← Terug naar diensten
          </Link>
        </FadeIn>

        <header className="mt-12 md:mt-16">
          <h1 className="text-hero md:text-hero-lg font-bold text-cornsilk">
            Branding
          </h1>
          <FadeIn delay={0.1}>
            <p className="mt-6 text-body text-dry-sage max-w-prose">
              Een sterk merk begint met een duidelijke identiteit. Blitzworx ontwikkelt logo&apos;s,
              huisstijlen en visuele richtlijnen die jouw onderneming herkenbaar maken.
            </p>
          </FadeIn>
        </header>

        <div className="mt-16 md:mt-24 space-y-16">
          <section>
            <h2 className="text-h2 font-bold text-cornsilk mb-6">
              Wat omvat branding?
            </h2>
            <FadeIn delay={0.1}>
              <ul className="space-y-4 text-body text-dry-sage">
                <li>
                  <strong className="text-cornsilk">Logo en woordmerk</strong> – Een herkenbaar
                  symbool dat past bij jouw merk en doelgroep.
                </li>
                <li>
                  <strong className="text-cornsilk">Huisstijl</strong> – Kleuren, typografie en
                  beeldtaal die consistent terugkomen in al je uitingen.
                </li>
                <li>
                  <strong className="text-cornsilk">Visuele richtlijnen</strong> – Een handboek
                  zodat je merk consistent blijft, ook als je zelf verder ontwerpt.
                </li>
                <li>
                  <strong className="text-cornsilk">Toepassing</strong> – Van visitekaartjes tot
                  website: we zorgen dat je merk overal hetzelfde uitstraalt.
                </li>
              </ul>
            </FadeIn>
          </section>

          <section>
            <h2 className="text-h2 font-bold text-cornsilk mb-6">
              Onze aanpak
            </h2>
            <FadeIn delay={0.1}>
              <p className="text-body text-dry-sage leading-relaxed mb-6">
                We starten met jouw verhaal, doelgroep en concurrentie. Op basis daarvan
                ontwikkelen we een merkidentiteit die onderscheidend is en aansluit bij wat je wilt
                uitstralen.
              </p>
              <p className="text-body text-dry-sage leading-relaxed">
                Van eerste schetsen tot definitieve huisstijl: we betrekken je bij elke stap en
                zorgen dat het resultaat past bij jouw visie.
              </p>
            </FadeIn>
          </section>

          <section>
            <h2 className="text-h2 font-bold text-cornsilk mb-6">
              Klaar om je merk te versterken?
            </h2>
            <FadeIn delay={0.2}>
              <p className="text-body text-dry-sage mb-8">
                Laten we kennismaken en samen ontdekken hoe we jouw merk kunnen laten opvallen.
              </p>
              <Button href="/contact" variant="primary">
                Neem contact op
              </Button>
            </FadeIn>
          </section>
        </div>
      </div>
    </main>
  );
}
