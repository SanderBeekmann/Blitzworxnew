import type { Metadata } from 'next';
import Image from 'next/image';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Introducing Blitzworx – visie, werkwijze en kernwaarden. Ontmoet Sander en ontdek wat Blitzworx uniek maakt.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <section
        className="section py-24 md:py-32 text-center"
        aria-labelledby="about-hero-title"
      >
        <div className="container-narrow">
          <FadeIn>
            <h1
              id="about-hero-title"
              className="text-hero md:text-hero-lg font-bold text-cornsilk tracking-tight"
            >
              Introducing
              <br />
              Blitzworx!
            </h1>
          </FadeIn>
        </div>
      </section>

      <section className="section" aria-labelledby="vision-title">
        <div className="container-narrow max-w-prose mx-auto">
          <FadeIn>
            <h2 id="vision-title" className="text-h2 md:text-h2-lg font-bold text-cornsilk">
              Webdesign That Worx!
            </h2>
            <div className="mt-6 space-y-4 text-body text-dry-sage leading-relaxed">
              <p>
                Blitzworx gelooft in kwaliteit, creativiteit en resultaat. Onze visie is simpel:
                ondernemers helpen groeien met een online omgeving die past bij hun ambities.
              </p>
              <p>
                We werken nauw samen, denken mee en leveren maatwerk. Geen standaard templates,
                maar oplossingen die echt werken. Van eerste idee tot live website – en daarna.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section" aria-labelledby="creator-title">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn>
              <h2 id="creator-title" className="text-h2 md:text-h2-lg font-bold text-cornsilk">
                Meet the Creator
              </h2>
              <p className="mt-4 text-h3 text-dry-sage">Sander</p>
              <div className="mt-6 space-y-4 text-body text-dry-sage leading-relaxed">
                <p>
                  Als oprichter van Blitzworx combineer ik creativiteit met technische kennis. Mijn
                  motivatie? Ondernemers helpen hun online doelen te bereiken met websites die
                  echt werken.
                </p>
                <p>
                  Van concept tot code – ik begeleid het hele traject en zorg ervoor dat het
                  resultaat past bij jouw visie en je doelgroep.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="relative aspect-square rounded-md overflow-hidden bg-ebony">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                  alt="Sander - Oprichter Blitzworx"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
