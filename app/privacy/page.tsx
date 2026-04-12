import type { Metadata } from 'next';
import Link from 'next/link';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacyverklaring - BlitzWorx',
  description:
    'Hoe BlitzWorx persoonsgegevens verwerkt conform de AVG. Lees welke data we verzamelen, met welk doel en wat je rechten zijn.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '11 april 2026';

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Privacyverklaring', item: `${siteUrl}/privacy` },
  ],
};

export default function PrivacyPage() {
  return (
    <section className="section" aria-labelledby="privacy-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto">
          <h1 id="privacy-title" className="text-hero font-bold text-cornsilk mb-4">
            Privacyverklaring
          </h1>
          <p className="text-small text-grey-olive mb-12">
            Laatst bijgewerkt: {LAST_UPDATED}
          </p>

          <div className="space-y-10 text-body text-dry-sage leading-relaxed">
            <p>
              BlitzWorx respecteert je privacy en gaat zorgvuldig om met je persoonsgegevens.
              In deze verklaring lees je welke gegevens we verzamelen, waarvoor we ze gebruiken
              en welke rechten je hebt. Deze verklaring is opgesteld volgens de Algemene Verordening
              Gegevensbescherming (AVG / GDPR).
            </p>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">1. Verwerkingsverantwoordelijke</h2>
              <p>
                BlitzWorx, gevestigd in Nederland, is de verwerkingsverantwoordelijke voor de
                verwerking van je persoonsgegevens. Voor vragen over deze privacyverklaring kun je
                contact opnemen via{' '}
                <a
                  href="mailto:contact@blitzworx.nl"
                  className="text-cornsilk underline hover:text-dry-sage"
                >
                  contact@blitzworx.nl
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">2. Welke gegevens we verzamelen</h2>
              <p className="mb-4">
                Afhankelijk van hoe je met ons in contact komt, verwerken we de volgende gegevens:
              </p>
              <ul className="space-y-2 list-disc list-outside pl-6">
                <li>
                  <strong className="text-cornsilk">Contactformulier:</strong> naam, e-mailadres,
                  bedrijfsnaam (optioneel) en het bericht dat je stuurt.
                </li>
                <li>
                  <strong className="text-cornsilk">Website Score tool:</strong> de ingevoerde URL,
                  je e-mailadres (voor het toesturen van het rapport) en, als je actief akkoord
                  geeft voor de nieuwsbrief, je IP-adres en de versie van de consent-tekst
                  (als bewijs van toestemming volgens Art. 7 AVG).
                </li>
                <li>
                  <strong className="text-cornsilk">Podcast leads:</strong> naam en e-mailadres
                  wanneer je aangeeft de podcast te willen ontvangen.
                </li>
                <li>
                  <strong className="text-cornsilk">Nieuwsbrief:</strong> e-mailadres en de bron
                  waar je je hebt aangemeld.
                </li>
                <li>
                  <strong className="text-cornsilk">Technische gegevens:</strong> beperkte
                  serverlogs voor beveiliging en stabiliteit. We gebruiken geen tracking-cookies
                  van derden.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">3. Doelen en grondslagen</h2>
              <ul className="space-y-3 list-disc list-outside pl-6">
                <li>
                  <strong className="text-cornsilk">Uitvoering van een dienst</strong> (Art. 6 lid 1
                  sub b AVG): het versturen van je Website Score rapport, het beantwoorden van je
                  contactverzoek en het leveren van overeengekomen werk.
                </li>
                <li>
                  <strong className="text-cornsilk">Toestemming</strong> (Art. 6 lid 1 sub a AVG):
                  het versturen van onze nieuwsbrief met tips over webdesign, SEO en online groei.
                  Je kunt deze toestemming op elk moment intrekken.
                </li>
                <li>
                  <strong className="text-cornsilk">Gerechtvaardigd belang</strong> (Art. 6 lid 1
                  sub f AVG): basale beveiliging, misbruikbestrijding en het verbeteren van onze
                  diensten op basis van geaggregeerde, niet-identificeerbare gegevens.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">4. Bewaartermijnen</h2>
              <p>
                We bewaren je gegevens niet langer dan nodig. Contactverzoeken worden maximaal
                24 maanden bewaard. Nieuwsbrief-inschrijvingen bewaren we totdat je je uitschrijft.
                Website Score scans worden maximaal 24 maanden bewaard voor analyse en support.
                Bij uitschrijving verwijderen of anonimiseren we je persoonsgegevens binnen
                redelijke termijn, tenzij een wettelijke bewaarplicht anders vereist.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">5. Delen met derden</h2>
              <p className="mb-4">
                We verkopen je gegevens nooit. We delen ze alleen met verwerkers die nodig zijn
                om onze diensten te leveren, op basis van een verwerkersovereenkomst:
              </p>
              <ul className="space-y-2 list-disc list-outside pl-6">
                <li>Supabase (database hosting)</li>
                <li>Netlify (website hosting)</li>
                <li>Resend (e-mailverzending)</li>
                <li>Google PageSpeed Insights (alleen URL, voor website-analyse)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">6. Je rechten</h2>
              <p className="mb-4">Onder de AVG heb je de volgende rechten:</p>
              <ul className="space-y-2 list-disc list-outside pl-6">
                <li>Recht op inzage in je persoonsgegevens</li>
                <li>Recht op correctie van onjuiste gegevens</li>
                <li>Recht op verwijdering (&quot;recht om vergeten te worden&quot;)</li>
                <li>Recht op beperking van de verwerking</li>
                <li>Recht op dataportabiliteit</li>
                <li>Recht van bezwaar tegen verwerking</li>
                <li>Recht om toestemming op elk moment in te trekken</li>
                <li>
                  Recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens via{' '}
                  <a
                    href="https://autoriteitpersoonsgegevens.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cornsilk underline hover:text-dry-sage"
                  >
                    autoriteitpersoonsgegevens.nl
                  </a>
                </li>
              </ul>
              <p className="mt-4">
                Voor het uitoefenen van deze rechten kun je een e-mail sturen naar{' '}
                <a
                  href="mailto:contact@blitzworx.nl"
                  className="text-cornsilk underline hover:text-dry-sage"
                >
                  contact@blitzworx.nl
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">7. Uitschrijven van de nieuwsbrief</h2>
              <p>
                In elke e-mail die we sturen staat onderaan een uitschrijflink. Eén klik is genoeg
                om je direct uit te schrijven. Je kunt ook een e-mail sturen naar{' '}
                <a
                  href="mailto:contact@blitzworx.nl"
                  className="text-cornsilk underline hover:text-dry-sage"
                >
                  contact@blitzworx.nl
                </a>{' '}
                met het verzoek tot uitschrijving.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">8. Cookies</h2>
              <p>
                BlitzWorx.nl gebruikt geen tracking-cookies en geen marketingcookies van derden.
                We gebruiken alleen functionele voorzieningen die noodzakelijk zijn voor het
                functioneren van de website.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">9. Beveiliging</h2>
              <p>
                We nemen passende technische en organisatorische maatregelen om je gegevens te
                beschermen tegen verlies, ongeoorloofde toegang en misbruik. Alle data wordt
                versleuteld verstuurd via HTTPS.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-cornsilk mb-4">10. Wijzigingen</h2>
              <p>
                We kunnen deze privacyverklaring aanpassen. De meest recente versie vind je altijd
                op deze pagina. Bij ingrijpende wijzigingen informeren we je actief via e-mail als
                je bent ingeschreven voor de nieuwsbrief.
              </p>
            </section>

            <div className="pt-8 mt-12 border-t border-ebony">
              <Link
                href="/"
                className="text-small text-dry-sage hover:text-cornsilk underline"
              >
                Terug naar home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
