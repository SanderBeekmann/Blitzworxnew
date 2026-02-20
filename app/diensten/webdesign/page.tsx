import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Webdesign',
  description:
    'Professioneel webdesign voor ondernemers. Van concept tot visueel ontwerp dat past bij jouw merk. Blitzworx maakt websites die werken.',
  alternates: { canonical: '/diensten/webdesign' },
};

export default function WebdesignPage() {
  return (
    <main className="section min-h-screen">
      <div className="container-narrow">
        <FadeIn>
          <Link
            href="/diensten"
            className="text-small text-grey-olive hover:text-dry-sage transition-colors"
          >
            ← Terug naar home
          </Link>
        </FadeIn>

        <header className="mt-12 md:mt-16">
          <h1 className="text-hero md:text-hero-lg font-bold text-cornsilk">
            Webdesign
          </h1>
          <FadeIn delay={0.1}>
            <p className="mt-6 text-body text-dry-sage max-w-prose">
              Een sterke website begint met goed ontwerp. Blitzworx maakt visueel aantrekkelijke
              websites die jouw merk versterken en bezoekers overtuigen.
            </p>
          </FadeIn>
        </header>

        <div className="mt-16 md:mt-24 space-y-16">
          <section>
            <h2 className="text-h2 font-bold text-cornsilk mb-6">
              Wat levert webdesign op?
            </h2>
            <FadeIn delay={0.1}>
              <ul className="space-y-4 text-body text-dry-sage">
                <li>
                  <strong className="text-cornsilk">Eerste indruk telt</strong> – Een professioneel
                  ontwerp wekt vertrouwen en verhoogt de kans dat bezoekers actie ondernemen.
                </li>
                <li>
                  <strong className="text-cornsilk">Herkenbare uitstraling</strong> – Jouw huisstijl
                  en merkidentiteit komen consistent terug in elk onderdeel van de website.
                </li>
                <li>
                  <strong className="text-cornsilk">Gebruiksvriendelijk</strong> – Duidelijke
                  structuur en logische navigatie zorgen dat bezoekers snel vinden wat ze zoeken.
                </li>
                <li>
                  <strong className="text-cornsilk">Mobiel eerst</strong> – Het ontwerp is
                  geoptimaliseerd voor alle schermen, van telefoon tot desktop.
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
                We starten met jouw doelen en doelgroep. Op basis daarvan ontwerpen we een website
                die past bij jouw visie en je bezoekers aanspreekt. Geen standaard templates, maar
                maatwerk dat echt werkt.
              </p>
              <p className="text-body text-dry-sage leading-relaxed">
                Van wireframes tot definitief ontwerp: we betrekken je bij elke stap en zorgen dat
                het eindresultaat precies is wat je voor ogen hebt.
              </p>
            </FadeIn>
          </section>

          <section>
            <h2 className="text-h2 font-bold text-cornsilk mb-6">
              Klaar voor een website die werkt?
            </h2>
            <FadeIn delay={0.2}>
              <p className="text-body text-dry-sage mb-8">
                Laten we kennismaken en samen ontdekken hoe we jouw online doelen kunnen bereiken.
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
