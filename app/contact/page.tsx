import type { Metadata } from 'next';
import { FadeIn } from '@/components/animations/FadeIn';
import { TitleReveal } from '@/components/animations/TitleReveal';
import { ContactOnboarding } from '@/components/contact/ContactOnboarding';
import { PhoneLink } from '@/components/contact/PhoneLink';

export const metadata: Metadata = {
  title: 'Contact',
  alternates: { canonical: '/contact' },
  description:
    'Neem contact op met Blitzworx. E-mail, telefoon of vul het formulier in voor een vrijblijvend gesprek.',
};

export default function ContactPage() {
  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="container-narrow">
        <TitleReveal
          as="h1"
          id="contact-title"
          className="text-hero md:text-hero-lg font-bold text-cornsilk mb-16"
        >
          Contact
        </TitleReveal>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-h3 font-semibold text-cornsilk">Contactgegevens</h2>
              <address className="mt-6 not-italic space-y-4">
                <p className="text-body text-dry-sage">
                  <strong className="text-cornsilk">E-mail</strong>
                  <br />
                  <a
                    href="mailto:sander@blitzworx.nl"
                    className="text-dry-sage hover:text-cornsilk hover:underline"
                  >
                    sander@blitzworx.nl
                  </a>
                </p>
                <PhoneLink />
              </address>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <ContactOnboarding />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
