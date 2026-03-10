export interface Case {
  slug: string;
  title: string;
  client: string;
  description: string;
  fullStory?: string;
  image: string;
  imageHover?: string;
  /** Images shown during scroll on case detail page. Falls back to [image, imageHover].filter(Boolean) */
  images?: string[];
  /** Optional website URL for case CTA */
  websiteUrl?: string;
  /** Show placeholder with "Coming soon" instead of images */
  imagePlaceholder?: boolean;
  year: string;
  /** Optional client testimonial */
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export const cases: Case[] = [
  {
    slug: 'fleetcare-connect',
    title: 'Op maat gemaakte website voor startend LEV-Fleetcare onderneming',
    client: 'FleetCare Connect',
    description:
      'Vlotte website voor een startend LEV-Fleetcare onderneming.',
    image: '',
    imagePlaceholder: true,
    images: [],
    year: '2026',
  },
  {
    slug: 'blueshipment',
    title: 'Kickstart voor fulfillment center',
    client: 'BlueShipment',
    description:
      'Op maat gemaakte oplossing op basis van hun voorbeelden, plus maandelijks abonnement voor nieuwe ideeën.',
    fullStory: `BlueShipment is een fulfillment center dat een op maat gemaakte oplossing zocht. Het project startte met voorbeelden die zij zelf aanleverden. Op basis hiervan ben ik aan de slag gegaan om een oplossing te bouwen die precies aansluit bij hun werkwijze en wensen.

De samenwerking verliep soepel: door hun concrete input kon ik snel schakelen en iteratief tot het gewenste resultaat komen. Na de oplevering hebben zij een abonnement afgenomen, waardoor ik de samenwerking heb voortgezet.

Maandelijks help ik BlueShipment nu met het doorvoeren van nieuwe ideeën en verbeteringen. Of het nu gaat om kleine aanpassingen of grotere uitbreidingen, ik blijf samen met hen de oplossing verder ontwikkelen zodat deze meegroeit met hun bedrijf.`,
    image: '/assets/images/blueshipmentmockup.webp',
    imageHover: '/assets/images/iphonemockupblueship.webp',
    images: [
      '/assets/images/blueshipmentmockup.webp',
      '/assets/images/iphonemockupblueship.webp',
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    ],
    websiteUrl: 'https://blueshipment.nl',
    year: '2026',
    testimonial: {
      quote:
        'Sander van Blitzworx heeft voor ons fulfilment center een hele mooie website gebouwd (blueshipment.nl). We zijn erg tevreden met het eindresultaat. Naast het bouwen van de website dacht Sander ook actief mee over de opzet en uitstraling, wat voor ons echt meerwaarde had. De samenwerking verliep prettig en duidelijk. Al met al zeer tevreden en we zullen in de toekomst zeker weer bij Blitzworx aankloppen.',
      author: 'Reitze Douma',
      role: 'Co-founder',
    },
  },
];
