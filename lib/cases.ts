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
    slug: 'producerles',
    title: 'Leadgeneratie website voor muziekproducent',
    client: 'Producerles.nl',
    description:
      'Conversiegerichte website voor muziekproducent Millennium. Gebouwd met Next.js, GSAP-animaties en Spotify-integratie. Gericht op het genereren van lesboekingen via een proefles of intakegesprek.',
    fullStory: `De producer achter Millennium heeft meer dan 3 miljoen streams op Spotify en werkte samen met bekende artiesten. Die ervaring wilde hij delen door producerlessen aan te bieden. Daar had hij een website voor nodig die leerlingen binnenhaalt.

Het conversiedoel was helder: bezoekers moeten een proefles boeken of een intakegesprek aanvragen. Elke sectie van de website is daarop ingericht. Van de hero tot het contactformulier, alles stuurt richting die ene actie. Zijn Spotify-profiel is geïntegreerd zodat bezoekers direct horen wat hij maakt. Dat overtuigt sneller dan welke tekst dan ook.

Technisch draait de site op Next.js met GSAP-animaties die de beleving versterken zonder de laadtijd te belasten. Het contactformulier is gekoppeld aan Resend zodat aanvragen direct in zijn inbox landen. De tarievensectie maakt het aanbod concreet: gratis proefles, vier lessen voor 179 euro, acht lessen voor 299 euro. Geen vaagheid, geen drempels.

Het resultaat is een website die zijn muzikale expertise direct laat voelen en bezoekers op een natuurlijke manier richting een boeking leidt.

Heb je een dienst of aanbod dat meer klanten verdient? Laat me weten wat je doet, dan kijk ik hoe we dat online vertalen.`,
    image: '/assets/images/cases/producerles-1.png',
    imageHover: '/assets/images/cases/producerles-3.png',
    images: [
      '/assets/images/cases/producerles-1.png',
      '/assets/images/cases/producerles-2.png',
      '/assets/images/cases/producerles-3.png',
      '/assets/images/cases/producerles-4.png',
    ],
    websiteUrl: 'https://www.producerles.nl',
    year: '2026',
  },
  {
    slug: 'michelangelo',
    title: 'Maatwerk horeca-app voor planning en urenregistratie',
    client: 'Michelangelo',
    description:
      'Volledige webapp voor restaurant Michelangelo met urenregistratie, roosterplanning en beschikbaarheidsbeheer. Gebouwd met Next.js, Supabase en shadcn/ui — mobile-first met push notificaties en Excel-export.',
    fullStory: `Via de bedrijfsleider van restaurant Michelangelo kreeg ik de vraag of ik een oplossing kon bouwen voor hun dagelijkse planning. Urenregistratie ging via losse lijstjes, roosters werden handmatig gemaakt en beschikbaarheid van medewerkers was lastig bij te houden. Dat kostte tijd en zorgde voor fouten.

Ik heb een volledige webapp gebouwd met twee rollen: manager en medewerker. De manager maakt roosters, keurt uren goed en heeft overzicht over beschikbaarheid en verlofaanvragen. Medewerkers registreren hun uren, geven beschikbaarheid door en ontvangen push notificaties bij roosterwijzigingen. Alles draait mobile-first.

De technische basis is stevig. Next.js met TypeScript, Supabase als backend met row-level security, en shadcn/ui voor een strakke interface. Maandafsluitingen worden geëxporteerd naar Excel voor de boekhouding. De app is gebouwd als PWA zodat medewerkers hem als app op hun telefoon kunnen zetten.

Loopt er in jouw bedrijf een proces dat sneller of slimmer kan? Ik bouw graag een oplossing die precies doet wat je nodig hebt.`,
    image: '/assets/images/cases/michelangelo-1.png',
    imageHover: '/assets/images/cases/michelangelo-2.png',
    images: [
      '/assets/images/cases/michelangelo-1.png',
      '/assets/images/cases/michelangelo-2.png',
      '/assets/images/cases/michelangelo-3.png',
      '/assets/images/cases/michelangelo-4.png',
    ],
    websiteUrl: 'https://ristorante-michelangelo.netlify.app',
    year: '2026',
  },
  {
    slug: 'gastvrijmoed',
    title: 'E-commerce webshop voor ambachtelijke snij- en presentatieplanken',
    client: 'Gastvrijmoed',
    description:
      'Op maat gemaakte webshop voor Gastvrijmoed, gespecialiseerd in handgemaakte snijplanken en presentatieplanken. Een online ervaring die het vakmanschap en de kwaliteit van het product uitstraalt.',
    fullStory: `De maker achter Gastvrijmoed maakt met de hand snijplanken en presentatieplanken. Elk stuk is uniek, gemaakt van zorgvuldig geselecteerd hout. Die kwaliteit en dat vakmanschap moesten online net zo goed overkomen als wanneer je zo'n plank in het echt vasthoudt.

De uitdaging bij een webshop voor ambachtelijke producten is dat je niet puur op prijs concurreert. Het gaat om het verhaal, de beleving en het vertrouwen dat je iets bijzonders koopt. Daar heb ik de hele webshop op ingericht. Van de productfotografie tot de manier waarop je door het assortiment bladert, alles ademt kwaliteit.

Het resultaat is een webshop die het vakmanschap van Gastvrijmoed recht doet. Bezoekers zien direct wat ze kopen, begrijpen waarom het de prijs waard is en kunnen zonder drempels bestellen. Een online etalage die past bij een ambachtelijk product.

Verkoop je een product dat je online wilt presenteren zoals het verdient? Neem vrijblijvend contact op, dan bespreken we de mogelijkheden.`,
    image: '/assets/images/cases/gastvrijmoed-1.png',
    imageHover: '/assets/images/cases/gastvrijmoed-2.png',
    images: [
      '/assets/images/cases/gastvrijmoed-1.png',
      '/assets/images/cases/gastvrijmoed-2.png',
      '/assets/images/cases/gastvrijmoed-3.png',
      '/assets/images/cases/gastvrijmoed-4.png',
    ],
    websiteUrl: 'https://gastvrijmoed.netlify.app',
    year: '2026',
  },
  {
    slug: 'rgw-dienstverlening',
    title: 'Professionele online aanwezigheid voor dienstverlener',
    client: 'RGW Dienstverlening',
    description:
      'Heldere, professionele website voor RGW Dienstverlening die de betrouwbaarheid en expertise van het bedrijf direct overbrengt aan potentiële klanten.',
    fullStory: `De eigenaar van RGW Dienstverlening had een duidelijke behoefte: een professionele website die potentiële klanten direct laat zien wat hij doet en waarom ze bij hem aan het juiste adres zijn. Geen complexe site met tientallen pagina's, maar een heldere presentatie die vertrouwen wekt.

Bij een dienstverlener draait het om geloofwaardigheid. Mensen willen weten met wie ze te maken krijgen, wat je aanbiedt en hoe ze je kunnen bereiken. Dat heb ik vertaald naar een website die precies die vragen beantwoordt. Overzichtelijk, snel en zonder afleidingen.

De site is gebouwd met een focus op snelheid en vindbaarheid. Potentiële klanten die zoeken naar de diensten die hij aanbiedt, vinden een website die er professioneel uitziet en direct de informatie geeft die ze nodig hebben om contact op te nemen.

Op zoek naar een website die jouw expertise helder overbrengt? Ik denk graag mee over een aanpak die bij je past.`,
    image: '/assets/images/cases/rgw-dienstverlening-1.png',
    imageHover: '/assets/images/cases/rgw-dienstverlening-3.png',
    images: [
      '/assets/images/cases/rgw-dienstverlening-1.png',
      '/assets/images/cases/rgw-dienstverlening-2.png',
      '/assets/images/cases/rgw-dienstverlening-3.png',
      '/assets/images/cases/rgw-dienstverlening-4.png',
    ],
    websiteUrl: 'https://rgwdienstverlening.netlify.app',
    year: '2026',
  },
  {
    slug: 'fleetcare-connect',
    title: 'Website voor startende LEV-fleetcare onderneming',
    client: 'FleetCare Connect',
    description:
      'Professionele website voor een startend fleetcare-bedrijf gespecialiseerd in lichte elektrische voertuigen. Van eerste concept tot online aanwezigheid die vertrouwen wekt bij potentiële opdrachtgevers.',
    fullStory: `De oprichters van FleetCare Connect leerde ik kennen via het IVA-netwerk en een Instagrampost. Ze waren net begonnen, een bedrijf gespecialiseerd in het onderhoud en beheer van lichte elektrische voertuigen. Goed idee, duidelijke markt. Maar online bestonden ze nog niet.

Dat was precies de uitdaging. Een startend bedrijf heeft geen track record om mee te pronken. De website moest dus direct vertrouwen wekken bij potentiële opdrachtgevers. Wie zijn ze, wat doen ze, waarom zou je met hen in zee gaan. Helder, professioneel en concreet.

Ik heb samen met de oprichters de positionering aangescherpt en dat vertaald naar een website die hun expertise laat zien. Geen overbodige pagina's of vage teksten. Gewoon een strakke presentatie die laat zien dat ze weten waar ze mee bezig zijn.

Het resultaat: FleetCare Connect heeft nu een online aanwezigheid die past bij de professionaliteit die ze in hun werk leggen. Een solide basis om mee te groeien.

Ook net gestart en toe aan een website die direct vertrouwen wekt? Ik denk graag vrijblijvend mee over de beste aanpak.`,
    image: '/assets/images/cases/fleetcare-connect-1.png',
    imageHover: '/assets/images/cases/fleetcare-connect-2.png',
    images: [
      '/assets/images/cases/fleetcare-connect-1.png',
      '/assets/images/cases/fleetcare-connect-2.png',
      '/assets/images/cases/fleetcare-connect-3.png',
      '/assets/images/cases/fleetcare-connect-4.png',
    ],
    websiteUrl: 'https://fleetcareconnect.netlify.app',
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

Maandelijks help ik BlueShipment nu met het doorvoeren van nieuwe ideeën en verbeteringen. Of het nu gaat om kleine aanpassingen of grotere uitbreidingen, ik blijf samen met hen de oplossing verder ontwikkelen zodat deze meegroeit met hun bedrijf.

Wil je een website die meegroeit met je bedrijf? Neem contact op, dan kijken we samen wat er nodig is.`,
    image: '/assets/images/blueshipmentmockup.webp',
    imageHover: '/assets/images/iphonemockupblueship.webp',
    images: [
      '/assets/images/blueshipmentmockup.webp',
      '/assets/images/iphonemockupblueship.webp',
      '/assets/images/cases/blueshipment-1.png',
      '/assets/images/cases/blueshipment-2.png',
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
