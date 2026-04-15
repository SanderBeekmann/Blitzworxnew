export type Feature = string | { text: string; info: string };

export interface Package {
  id: 'start' | 'groei' | 'schaal';
  name: string;
  price: number;
  pitch: string;
  features: Feature[];
  ideal: string;
  highlighted: boolean;
  badge?: string;
}

export const packages: Package[] = [
  {
    id: 'start',
    name: 'Start',
    price: 49,
    pitch: 'Voor een website die soepel online moet blijven, zonder gedoe over hosting of updates.',
    features: [
      {
        text: 'Hosting',
        info: 'Je website draait op een beheerde hostingomgeving met SSL-certificaat en automatische updates van de serveromgeving.',
      },
      'Beveiligingsupdates en software-updates',
      'Dagelijkse backup met 30 dagen retentie',
      {
        text: 'Uptime monitoring, 24 uur per dag',
        info: 'Ik krijg direct een melding zodra je site offline gaat, ook midden in de nacht. Zo ben jij er als eerste bij.',
      },
      '1 uur wijzigingen per maand',
      {
        text: 'Gratis database met beperkingen',
        info: 'Een gratis database-plan via Supabase, ruim voldoende voor formulieren en lichte data. Bij meer volume kun je opschalen via de add-on.',
      },
      'Support per e-mail binnen 2 werkdagen',
    ],
    ideal: 'Bedrijven met een vaste site die stabiel en veilig moet blijven draaien.',
    highlighted: false,
  },
  {
    id: 'groei',
    name: 'Groei',
    price: 129,
    pitch: 'Voor bedrijven die hun site ook echt zien terugkomen in bezoekers en aanvragen.',
    features: [
      'Alles uit Start',
      {
        text: 'Database hosting via Supabase, dagelijkse backup',
        info: 'Je database draait stabiel op Supabase, inclusief dagelijkse backup en basis-monitoring. Passief beheer.',
      },
      "3 uur wijzigingen per maand, ook voor nieuwe pagina's en features",
      {
        text: '2 SEO-artikelen per maand',
        info: 'Per artikel: keyword-onderzoek, schrijven in jouw branche en toon, publiceren op je site en intern linken met bestaande pagina\u2019s.',
      },
      {
        text: 'Maandelijkse rapportage: bezoekers, top-pagina\u2019s, formulieren',
        info: 'Een helder maandrapport met de cijfers die ertoe doen, geen 40 pagina\u2019s Google Analytics: hoeveel bezoekers, waar ze vandaan komen, welke pagina\u2019s werken en hoeveel aanvragen je kreeg.',
      },
      {
        text: 'Performance check per kwartaal op snelheid en Core Web Vitals',
        info: 'Core Web Vitals zijn de snelheidsmetrics die Google gebruikt voor je ranking (LCP, CLS, INP). Elk kwartaal meet en optimaliseer ik je site zodat je hoog blijft scoren.',
      },
      'Support binnen 1 werkdag',
    ],
    ideal: 'Gevestigde bedrijven die hun website zien als groeimotor, niet alleen als digitale visitekaart.',
    highlighted: true,
    badge: 'Meest gekozen',
  },
  {
    id: 'schaal',
    name: 'Schaal',
    price: 279,
    pitch: 'Voor bedrijven die hun site actief inzetten als leadmotor of klantportaal.',
    features: [
      'Alles uit Groei',
      '6 uur wijzigingen per maand',
      {
        text: '3 SEO-artikelen per maand, plus maandelijkse keyword-update',
        info: '3 volledig uitgewerkte artikelen per maand, plus een maandelijkse check of je keywords nog kloppen. Shift in zoekgedrag? Dan verschuift de strategie mee.',
      },
      {
        text: 'Database management op Supabase of Render',
        info: 'Actief databasebeheer: schema-updates bij nieuwe features, query-optimalisatie als iets traag wordt en meeschalen als je applicatie groeit. Dus niet alleen draaien, maar actief gezond houden.',
      },
      {
        text: 'Conversie-rapportage met concrete aanbevelingen',
        info: 'Maandelijks overzicht van wat bezoekers doen op je site en waar ze afhaken. Inclusief concrete verbetervoorstellen, niet alleen cijfers.',
      },
      {
        text: 'Strategiegesprek per kwartaal (1 uur)',
        info: 'Elk kwartaal een uur samen zitten: waar staat je site, wat werkt, wat kan beter. Daar rollen concrete acties uit voor het volgende kwartaal.',
      },
      {
        text: 'WhatsApp-lijn voor urgente zaken',
        info: 'Directe lijn voor echt urgente zaken (site down, kritieke bug). Voor normale vragen gebruiken we gewoon e-mail.',
      },
      'Support binnen 4 werkuren',
    ],
    ideal: 'Bedrijven die continu met hun website bouwen: meer content, meer leads, meer features.',
    highlighted: false,
  },
];

export interface ComparisonRow {
  label: string;
  values: [string, string, string];
}

export const comparisonRows: ComparisonRow[] = [
  { label: 'Prijs per maand', values: ['€49', '€129', '€279'] },
  { label: 'Hosting en security', values: ['Ja', 'Ja', 'Ja'] },
  { label: 'Dagelijkse backups', values: ['Ja', 'Ja', 'Ja'] },
  { label: 'Uptime monitoring', values: ['Ja', 'Ja', 'Ja'] },
  { label: 'Wijzigingen per maand', values: ['1 uur', '3 uur', '6 uur'] },
  { label: 'SEO-artikelen per maand', values: ['-', '2', '3'] },
  { label: 'Maandelijkse rapportage', values: ['-', 'Ja', 'Ja + advies'] },
  { label: 'Database', values: ['Gratis versie', 'Basis Supabase', 'Management'] },
  { label: 'Strategiegesprek', values: ['-', '-', 'Per kwartaal'] },
  { label: 'Max support-responstijd', values: ['2 werkdagen', '1 werkdag', '4 werkuren'] },
];

export interface Addon {
  name: string;
  price: string;
}

export const addons: Addon[] = [
  { name: 'Extra domein beheren', price: '€5 per maand per domein' },
  { name: 'Microsoft 365 licentie', price: '€15 per maand per gebruiker' },
  { name: 'Extra SEO-artikel', price: '€50 per stuk' },
  { name: 'Extra ontwikkeluur', price: '€50 per uur' },
  { name: 'Database opschaling (Supabase Pro of Render)', price: 'Doorbelasting plus €15 beheer per maand' },
];
