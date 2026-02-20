import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Webdevelopment',
  description:
    'Op maat gemaakte websites en webapplicaties. Van eenvoudige sites tot complexe dashboards en backends. Blitzworx bouwt oplossingen die meegroeien met je bedrijf.',
  alternates: { canonical: '/diensten/development' },
};

export default function DevelopmentPage() {
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
            Webdevelopment
          </h1>
          <FadeIn delay={0.1}>
            <p className="mt-6 text-body text-dry-sage max-w-prose">
              Van ontwerp naar werkende website of applicatie. Blitzworx bouwt op maat gemaakte
              oplossingen: van eenvoudige websites tot dashboards, CRM-systemen en backends.
            </p>
          </FadeIn>
        </header>

        <div className="mt-16 md:mt-24 space-y-16">
          <section>
            <h2 className="text-h2 font-bold text-cornsilk mb-6">
              Wat kunnen we bouwen?
            </h2>
            <FadeIn delay={0.1}>
              <ul className="space-y-4 text-body text-dry-sage">
                <li>
                  <strong className="text-cornsilk">Websites op maat</strong> – Geen templates,
                  maar een oplossing die precies past bij jouw wensen en doelgroep.
                </li>
                <li>
                  <strong className="text-cornsilk">Dashboards en CRM</strong> – Overzichtelijke
                  systemen voor je bedrijfsvoering, afgestemd op jouw werkwijze.
                </li>
                <li>
                  <strong className="text-cornsilk">Backends en API&apos;s</strong> – Technische
                  basis die processen vereenvoudigt en integreert met bestaande systemen.
                </li>
                <li>
                  <strong className="text-cornsilk">Onderhoud en doorontwikkeling</strong> – Na
                  oplevering blijven we meegroeien met je onderneming.
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
                We bouwen met moderne technieken en houden de code schoon en onderhoudbaar. Alles
                wat we maken is afgestemd op jouw manier van werken: geen overbodige complexiteit,
                maar slimme functies die tijd besparen.
              </p>
              <p className="text-body text-dry-sage leading-relaxed">
                Van eerste prototype tot live product: we itereren samen en zorgen dat het
                eindresultaat precies doet wat je nodig hebt.
              </p>
            </FadeIn>
          </section>

          <section>
            <h2 className="text-h2 font-bold text-cornsilk mb-6">
              Klaar voor een oplossing op maat?
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
