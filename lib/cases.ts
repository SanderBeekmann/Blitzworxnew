export interface Case {
  slug: string;
  title: string;
  client: string;
  description: string;
  image: string;
  imageHover?: string;
  year: string;
}

export const cases: Case[] = [
  {
    slug: 'case-1',
    title: 'Premium Webdesign voor Groeibedrijf',
    client: 'Client A',
    description:
      'Een volledige rebrand en website voor een ambitieus scale-up. Focus op conversie en gebruiksvriendelijkheid.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    imageHover: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    year: '2024',
  },
  {
    slug: 'case-2',
    title: 'E-commerce Platform met Maatwerk',
    client: 'Client B',
    description:
      'Webshop met custom integraties, snelle laadtijden en een naadloze checkout-ervaring.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    imageHover: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop',
    year: '2024',
  },
  {
    slug: 'case-3',
    title: 'Branding & Website voor Startup',
    client: 'Client C',
    description:
      'Van concept tot live: merkidentiteit, huisstijl en een website die opvalt.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    year: '2023',
  },
];
