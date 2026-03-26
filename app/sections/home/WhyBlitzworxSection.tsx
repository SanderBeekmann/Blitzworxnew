'use client';

import { useState, useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { MagicText } from '@/components/ui/MagicText';
import { TitleReveal } from '@/components/animations/TitleReveal';

const usps = [
  {
    title: 'Geen templates, altijd maatwerk',
    description:
      'Elk ontwerp wordt vanaf nul opgebouwd. Geen standaard thema\'s, maar een uniek design dat past bij jouw merk en doelen.',
  },
  {
    title: 'Ontwerp + techniek onder één dak',
    description:
      'Ik kan niet alleen de website ontwikkelen, maar ook alle achterliggende processen. Van geautomatiseerde e-mails in huisstijl tot complete systemen die je bedrijfsvoering optimaliseren.',
  },
  {
    title: 'Persoonlijke samenwerking',
    description:
      'Je werkt direct met de ontwerper, zonder tussenlagen. Korte lijnen, snelle feedback en een resultaat waar je écht achter staat.',
  },
];

const devices = [
  { key: 'phone' as const, label: 'Mobiel' },
  { key: 'tablet' as const, label: 'Tablet' },
  { key: 'desktop' as const, label: 'Desktop' },
];

const DEVICE_WIDTHS = [100, 160, 240];
const DEVICE_HEIGHTS = [180, 200, 160];
const DEVICE_RADII = [12, 8, 2];

export function WhyBlitzworxSection() {
  const [activeDevice, setActiveDevice] = useState(2);
  const deviceRef = useRef<HTMLDivElement>(null);

  // Auto-cycle devices
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveDevice((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // GSAP morph animation on device change
  useEffect(() => {
    const el = deviceRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    import('gsap').then(({ gsap }) => {
      const frame = el.querySelector('.device-frame');
      if (!frame) return;

      gsap.to(frame, {
        width: DEVICE_WIDTHS[activeDevice],
        height: DEVICE_HEIGHTS[activeDevice],
        borderRadius: DEVICE_RADII[activeDevice],
        duration: 0.6,
        ease: 'power2.inOut',
      });
    });
  }, [activeDevice]);

  return (
    <section className="section relative overflow-hidden md:min-h-screen md:flex md:items-center" aria-labelledby="home-usp-title">
      <div className="container-narrow w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left: Title + Device showcase */}
          <div>
            <TitleReveal
              as="h2"
              id="home-usp-title"
              className="text-h2 md:text-h2-lg font-bold text-cornsilk mb-6"
            >
              Waarom Blitzworx?
            </TitleReveal>
            <div className="mb-10">
              <MagicText
                text="Ik kan niet alleen de website ontwikkelen, maar ook alle achterliggende processen. Van geautomatiseerde e-mails in huisstijl tot complete systemen die je bedrijfsvoering optimaliseren."
                className="text-body text-dry-sage leading-relaxed"
              />
            </div>

            {/* Device morph showcase */}
            <FadeIn delay={0.3}>
              <div className="flex flex-col items-center">
                <div
                  ref={deviceRef}
                  className="flex items-center justify-center mb-6"
                  style={{ minHeight: 220 }}
                  aria-hidden
                >
                  <div
                    className="device-frame bg-ink border border-ebony overflow-hidden"
                    style={{
                      width: DEVICE_WIDTHS[2],
                      height: DEVICE_HEIGHTS[2],
                      borderRadius: DEVICE_RADII[2],
                    }}
                  >
                    {/* Device top bar */}
                    <div className="flex items-center gap-1 px-2 py-1.5 border-b border-ebony bg-ebony/30">
                      {activeDevice === 0 ? (
                        <div className="mx-auto w-8 h-1 bg-grey-olive/20 rounded-full" />
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-grey-olive/30" />
                          <span className="w-1.5 h-1.5 rounded-full bg-grey-olive/30" />
                          <span className="w-1.5 h-1.5 rounded-full bg-grey-olive/30" />
                        </>
                      )}
                    </div>

                    {/* Device content */}
                    <div className="device-inner p-2 flex-1">
                      {activeDevice === 0 && (
                        <div className="space-y-1.5">
                          <div className="w-full h-2 bg-grey-olive/15" />
                          <div className="w-3/4 h-2 bg-grey-olive/10" />
                          <div className="w-full h-8 bg-cornsilk/5 mt-2" />
                          <div className="w-full h-6 bg-dry-sage/5" />
                          <div className="w-full h-6 bg-dry-sage/5" />
                        </div>
                      )}
                      {activeDevice === 1 && (
                        <div className="space-y-1.5">
                          <div className="w-2/3 h-2 bg-grey-olive/15" />
                          <div className="grid grid-cols-2 gap-1.5 mt-2">
                            <div className="h-10 bg-cornsilk/5" />
                            <div className="h-10 bg-cornsilk/5" />
                            <div className="h-8 bg-dry-sage/5" />
                            <div className="h-8 bg-dry-sage/5" />
                          </div>
                        </div>
                      )}
                      {activeDevice === 2 && (
                        <div className="space-y-1.5">
                          <div className="flex gap-1.5">
                            <div className="w-8 h-2 bg-cornsilk/15" />
                            <div className="w-6 h-2 bg-grey-olive/10" />
                            <div className="w-6 h-2 bg-grey-olive/10" />
                            <div className="flex-1" />
                            <div className="w-10 h-2 bg-dry-sage/15" />
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 mt-2">
                            <div className="col-span-2 h-12 bg-cornsilk/5" />
                            <div className="h-12 bg-dry-sage/5" />
                            <div className="h-8 bg-cornsilk/5" />
                            <div className="h-8 bg-cornsilk/5" />
                            <div className="h-8 bg-dry-sage/5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Device indicators */}
                <div className="flex gap-6 relative">
                  {devices.map((device, i) => (
                    <button
                      key={device.key}
                      onClick={() => setActiveDevice(i)}
                      className={`text-caption font-mono tracking-wider pb-2 transition-colors duration-300 ${
                        activeDevice === i ? 'text-cornsilk' : 'text-grey-olive hover:text-dry-sage'
                      }`}
                      aria-label={`Toon ${device.label} weergave`}
                    >
                      {device.label}
                    </button>
                  ))}
                  <div
                    className="absolute bottom-0 h-px bg-cornsilk transition-all duration-300"
                    style={{
                      width: '33.333%',
                      left: `${activeDevice * 33.333}%`,
                    }}
                    aria-hidden
                  />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: USP cards with left border */}
          <div className="space-y-8 md:mt-8">
            {usps.map((usp, index) => (
              <FadeIn key={usp.title} delay={index * 0.15}>
                <div className="border-l-2 border-dry-sage pl-6">
                  <h3 className="text-h3 font-semibold text-cornsilk">{usp.title}</h3>
                  <p className="mt-2 text-body text-dry-sage leading-relaxed">
                    {usp.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
