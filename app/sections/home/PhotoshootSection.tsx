'use client';

import Image from 'next/image';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { MagicText } from '@/components/ui/MagicText';
import { Button } from '@/components/ui/Button';

interface Photo {
  src: string;
  alt: string;
}

const ROW_1_PHOTOS: Photo[] = [
  { src: '/assets/images/photos/photo-13.webp', alt: 'Zakelijke portretfoto voor bedrijfswebsite' },
  { src: '/assets/images/photos/photo-3.webp', alt: 'Professionele bedrijfsfotografie op locatie' },
  { src: '/assets/images/photos/photo-19.webp', alt: 'Team aan het werk op kantoor' },
  { src: '/assets/images/photos/photo-7.webp', alt: 'Sfeerbeeld van werkplek voor website' },
  { src: '/assets/images/photos/photo-22.webp', alt: 'Ondernemer in actie tijdens fotoshoot' },
  { src: '/assets/images/photos/photo-1.webp', alt: 'Portretfoto voor professionele uitstraling online' },
  { src: '/assets/images/photos/photo-14.webp', alt: 'Bedrijfsruimte vastgelegd voor branding' },
  { src: '/assets/images/photos/photo-9.webp', alt: 'Detail van product tijdens fotosessie' },
  { src: '/assets/images/photos/photo-16.webp', alt: 'Buitenopname voor zakelijke website' },
  { src: '/assets/images/photos/photo-5.webp', alt: 'Professioneel portret voor bedrijfsprofiel' },
  { src: '/assets/images/photos/photo-21.webp', alt: 'Werkproces vastgelegd op locatie' },
  { src: '/assets/images/photos/photo-11.webp', alt: 'Sfeervolle bedrijfsfoto voor online presentatie' },
];
const ROW_2_PHOTOS: Photo[] = [
  { src: '/assets/images/photos/photo-10.webp', alt: 'Authentieke bedrijfsfotografie voor website' },
  { src: '/assets/images/photos/photo-4.webp', alt: 'Ondernemer op de werkvloer' },
  { src: '/assets/images/photos/photo-18.webp', alt: 'Zakelijke fotoshoot voor merkidentiteit' },
  { src: '/assets/images/photos/photo-8.webp', alt: 'Productfotografie voor webshop' },
  { src: '/assets/images/photos/photo-23.webp', alt: 'Locatiefoto voor professionele website' },
  { src: '/assets/images/photos/photo-2.webp', alt: 'Portretfotografie voor bedrijfswebsite' },
  { src: '/assets/images/photos/photo-15.webp', alt: 'Interieur vastgelegd voor online aanwezigheid' },
  { src: '/assets/images/photos/photo-6.webp', alt: 'Team portret voor about-pagina' },
  { src: '/assets/images/photos/photo-20.webp', alt: 'Dronebeeld van bedrijfslocatie' },
  { src: '/assets/images/photos/photo-12.webp', alt: 'Natuurlijke bedrijfsfoto op locatie' },
  { src: '/assets/images/photos/photo-17.webp', alt: 'Sfeerbeeld voor website en social media' },
];

function MarqueeRow({ photos, direction }: { photos: Photo[]; direction: 'left' | 'right' }) {
  const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <div className={`flex ${animClass}`} style={{ width: 'max-content' }}>
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {photos.map((photo, i) => (
              <div
                key={`${copy}-${i}`}
                className="relative shrink-0 w-56 md:w-72 aspect-[4/5] bg-ebony/15 overflow-hidden rounded-sm mr-4"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 448px, 576px"
                  quality={85}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const benefits = [
  {
    title: 'Echte beelden, echt vertrouwen',
    description:
      'Bezoekers herkennen stockfoto\'s in een oogopslag. Eigen fotografie laat zien wie er achter je bedrijf staat en maakt je merk direct geloofwaardiger.',
  },
  {
    title: 'Alles in één traject',
    description:
      'Website en fotoshoot worden samen gepland. Zo passen de beelden perfect bij het ontwerp en hoef je niet zelf een fotograaf te zoeken.',
  },
  {
    title: 'Direct inzetbaar overal',
    description:
      'De foto\'s zijn niet alleen voor je website. Gebruik ze voor social media, presentaties, offertes en alles waar je merk zichtbaar moet zijn.',
  },
];


export function PhotoshootSection() {
  return (
    <section
      className="section relative"
      aria-labelledby="photoshoot-title"
    >
      {/* Full-width photo marquee carousel with text in between */}
      <FadeIn delay={0.3}>
        <MarqueeRow photos={ROW_1_PHOTOS} direction="left" />
      </FadeIn>

      {/* Centered text between carousels with floating drone + camera icons */}
      <div className="container-narrow py-16 md:py-24 relative">
        {/* Drone - floats top-left, tilted as if banking */}
        <FadeIn delay={0.15}>
          <svg
            width="60"
            height="60"
            viewBox="0 0 80 80"
            fill="none"
            className="hidden md:block absolute -left-4 lg:left-4 -top-2 opacity-20 -rotate-12 pointer-events-none"
            aria-hidden="true"
          >
            {/* Drone body */}
            <rect x="28" y="34" width="24" height="12" rx="4" stroke="var(--cornsilk)" strokeWidth="2" />
            {/* Camera lens */}
            <circle cx="40" cy="40" r="3" stroke="var(--cornsilk)" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="1" fill="var(--cornsilk)" opacity="0.5" />
            {/* Arms */}
            <path d="M28 36L16 26" stroke="var(--cornsilk)" strokeWidth="2" strokeLinecap="round" />
            <path d="M52 36L64 26" stroke="var(--cornsilk)" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 44L16 54" stroke="var(--cornsilk)" strokeWidth="2" strokeLinecap="round" />
            <path d="M52 44L64 54" stroke="var(--cornsilk)" strokeWidth="2" strokeLinecap="round" />
            {/* Propellers */}
            <ellipse cx="16" cy="24" rx="8" ry="2" stroke="var(--cornsilk)" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="64" cy="24" rx="8" ry="2" stroke="var(--cornsilk)" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="16" cy="56" rx="8" ry="2" stroke="var(--cornsilk)" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="64" cy="56" rx="8" ry="2" stroke="var(--cornsilk)" strokeWidth="1.5" opacity="0.6" />
            {/* Motor dots */}
            <circle cx="16" cy="26" r="2" fill="var(--cornsilk)" opacity="0.3" />
            <circle cx="64" cy="26" r="2" fill="var(--cornsilk)" opacity="0.3" />
            <circle cx="16" cy="54" r="2" fill="var(--cornsilk)" opacity="0.3" />
            <circle cx="64" cy="54" r="2" fill="var(--cornsilk)" opacity="0.3" />
            {/* Landing gear */}
            <path d="M32 46v4h16v-4" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
          </svg>
        </FadeIn>

        {/* Camera - floats bottom-right, slightly tilted */}
        <FadeIn delay={0.25}>
          <svg
            width="55"
            height="55"
            viewBox="0 0 80 80"
            fill="none"
            className="hidden md:block absolute -right-2 lg:right-8 -bottom-4 opacity-20 rotate-6 pointer-events-none"
            aria-hidden="true"
          >
            {/* Camera body */}
            <rect x="12" y="28" width="56" height="36" rx="6" stroke="var(--cornsilk)" strokeWidth="2" />
            {/* Top hump / flash mount */}
            <path d="M28 28V22a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v6" stroke="var(--cornsilk)" strokeWidth="2" strokeLinejoin="round" />
            {/* Main lens */}
            <circle cx="40" cy="46" r="12" stroke="var(--cornsilk)" strokeWidth="2" />
            <circle cx="40" cy="46" r="7" stroke="var(--cornsilk)" strokeWidth="1.5" opacity="0.6" />
            <circle cx="40" cy="46" r="3" fill="var(--cornsilk)" opacity="0.3" />
            {/* Lens reflection */}
            <path d="M35 41a7 7 0 0 1 4-2" stroke="var(--cornsilk)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            {/* Viewfinder */}
            <rect x="55" y="32" width="8" height="5" rx="1" stroke="var(--cornsilk)" strokeWidth="1.5" opacity="0.5" />
            {/* Shutter button */}
            <circle cx="54" cy="22" r="3" stroke="var(--cornsilk)" strokeWidth="1.5" />
            <circle cx="54" cy="22" r="1" fill="var(--cornsilk)" opacity="0.5" />
            {/* Grip texture */}
            <path d="M16 34v24" stroke="var(--cornsilk)" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            <path d="M19 34v24" stroke="var(--cornsilk)" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
          </svg>
        </FadeIn>

        {/* Text content */}
        <div className="text-center relative z-10">
          <TitleReveal
            as="h2"
            id="photoshoot-title"
            className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
          >
            Jouw verhaal professioneel in beeld gebracht
          </TitleReveal>

          <MagicText
            text="Stockfoto's vertellen het verhaal van iemand anders. Bezoekers prikken daar doorheen en je geloofwaardigheid betaalt de prijs. Met een professionele fotoshoot op locatie leg je vast wie je echt bent. Alle shoots worden gemaakt met een Sony A7 IV. Scherp, natuurlijk licht en kleuren die kloppen. Wil je je locatie of project vanuit de lucht laten zien? Droneshots zijn ook mogelijk. Zo heb je beelden die je overal kunt inzetten, van website tot social media."
            className="text-body text-dry-sage leading-relaxed mb-10 max-w-2xl mx-auto text-center justify-center"
          />

          <FadeIn delay={0.3}>
            <p className="text-cornsilk/70 text-base mb-4 font-bold">
              Benieuwd naar onze fotoshoot en video pakketten?
            </p>
            <Button href="/contact" variant="primary">
              Plan een kennismaking
            </Button>
          </FadeIn>
        </div>
      </div>

      {/* Row 2 - scrolls right */}
      <FadeIn delay={0.4}>
        <MarqueeRow photos={ROW_2_PHOTOS} direction="right" />
      </FadeIn>

      {/* Benefits */}
      <div className="container-narrow">
        <FadeIn delay={0.5}>
          <div className="mt-16 pt-12">
            <h3 className="text-h3 font-bold text-cornsilk text-center mb-8">
              De voordelen
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <FadeIn key={benefit.title} delay={0.55 + index * 0.1}>
                  <div className="text-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-5" aria-hidden>
                      {index === 0 && (
                        /* Heart in viewfinder - echte beelden, echt vertrouwen */
                        <>
                          <rect x="6" y="6" width="36" height="36" rx="4" stroke="var(--cornsilk)" strokeWidth="2" />
                          {/* Viewfinder corners */}
                          <path d="M6 16V10a4 4 0 0 1 4-4h6" stroke="var(--cornsilk)" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M32 6h6a4 4 0 0 1 4 4v6" stroke="var(--cornsilk)" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M42 32v6a4 4 0 0 1-4 4h-6" stroke="var(--cornsilk)" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M16 42h-6a4 4 0 0 1-4-4v-6" stroke="var(--cornsilk)" strokeWidth="2.5" strokeLinecap="round" />
                          {/* Heart = trust */}
                          <path d="M24 32s-9-5.5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 11-9 11z" fill="var(--cornsilk)" opacity="0.25" stroke="var(--cornsilk)" strokeWidth="1.5" />
                        </>
                      )}
                      {index === 1 && (
                        /* Camera + code bracket linked - alles in een traject */
                        <>
                          {/* Camera */}
                          <rect x="4" y="12" width="18" height="14" rx="3" stroke="var(--cornsilk)" strokeWidth="2" />
                          <path d="M10 12V9h8v3" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinejoin="round" />
                          <circle cx="13" cy="19" r="4" stroke="var(--cornsilk)" strokeWidth="1.5" />
                          <circle cx="13" cy="19" r="1.5" fill="var(--cornsilk)" opacity="0.4" />
                          {/* Code bracket */}
                          <path d="M30 12l-4 8 4 8" stroke="var(--cornsilk)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M38 12l4 8-4 8" stroke="var(--cornsilk)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          {/* Link chain */}
                          <path d="M13 32v4a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3v-4" stroke="var(--dry-sage)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
                          <circle cx="24" cy="38" r="2" fill="var(--cornsilk)" opacity="0.5" />
                        </>
                      )}
                      {index === 2 && (
                        /* Share/broadcast from center - direct inzetbaar overal */
                        <>
                          {/* Center image */}
                          <rect x="16" y="16" width="16" height="16" rx="3" stroke="var(--cornsilk)" strokeWidth="2" />
                          <path d="M20 26l3-3 2 1.5 3-3.5" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          {/* Broadcast waves */}
                          <path d="M10 10a20 20 0 0 0 0 28" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                          <path d="M38 10a20 20 0 0 1 0 28" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                          <path d="M14 14a14 14 0 0 0 0 20" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35" />
                          <path d="M34 14a14 14 0 0 1 0 20" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35" />
                          {/* Arrow up */}
                          <path d="M24 16V6m-3 3l3-3 3 3" stroke="var(--cornsilk)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                    </svg>
                    <h4 className="text-body font-semibold text-cornsilk">
                      {benefit.title}
                    </h4>
                    <p className="mt-2 text-small text-dry-sage leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
