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
  year: string;
}

export const cases: Case[] = [
  {
    slug: 'fleetcare-connect',
    title: 'Op maat gemaakte website voor startend LEV-Fleetcare onderneming',
    client: 'FleetCare Connect',
    description:
      'Vlotte website voor een startend LEV-Fleetcare onderneming.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    imageHover: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
    ],
    year: '2026',
  },
  {
    slug: 'blueshipment',
    title: 'Kickstart voor fulfillment center',
    client: 'BlueShipment',
    description:
      'Op maat gemaakte oplossing op basis van hun voorbeelden, plus maandelijks abonnement voor nieuwe ideeën.',
    fullStory: `BlueShipment is een fulfillment center dat een op maat gemaakte oplossing zocht. Het project startte met voorbeelden die zij zelf aanleverden. Op basis hiervan ben ik aan de slag gegaan om een oplossing te bouwen die precies aansluit bij hun werkwijze en wensen.

De samenwerking verliep soepel: door hun concrete input kon ik snel schakelen en iteratief tot het gewenste resultaat komen. Na de oplevering hebben zij een abonnement afgenomen, waardoor we de samenwerking hebben voortgezet.

Maandelijks help ik BlueShipment nu met het doorvoeren van nieuwe ideeën en verbeteringen. Of het nu gaat om kleine aanpassingen of grotere uitbreidingen, we blijven samen de oplossing verder ontwikkelen zodat deze meegroeit met hun bedrijf.`,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    imageHover: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    ],
    year: '2026',
  },
  {
    slug: 'case-3',
    title: 'Branding & Website voor Startup',
    client: 'Client C',
    description:
      'Van concept tot live: merkidentiteit, huisstijl en website.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    ],
    year: '2023',
  },
];
