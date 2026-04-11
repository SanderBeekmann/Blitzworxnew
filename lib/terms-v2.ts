// Algemene Voorwaarden BLITZWORX v2.0
// Source: C:/Projects/Sanders leven/BlitzWorx/Algemene Voorwaarden v2.md

export const TERMS_VERSION = "2.0";

export const TERMS_COMPANY_INFO =
  "BLITZWORX, gevestigd te Werverweg 6, Wapenveld, ingeschreven bij de Kamer van Koophandel onder nummer 98139789, BTW-nummer NL004521548B66.";

export interface TermsClause {
  clause?: string;
  term?: string;
  text?: string;
  definition?: string;
  examples?: string[];
}

export interface TermsArticle {
  number: number;
  heading: string;
  clauses: TermsClause[];
}

export const TERMS_ARTICLES: TermsArticle[] = [
  {
    number: 1,
    heading: "Definities",
    clauses: [
      { term: "BLITZWORX", definition: "de opdrachtnemer, eenmanszaak gespecialiseerd in webdesign, webdevelopment, hosting, onderhoud en digitale optimalisatie." },
      { term: "Opdrachtgever", definition: "iedere natuurlijke of rechtspersoon die een overeenkomst aangaat met BLITZWORX (zowel bedrijven als consumenten)." },
      { term: "Overeenkomst", definition: "de afspraak waarbij BLITZWORX tegen betaling diensten levert aan de Opdrachtgever, inclusief alle bijlagen, offertes en nadere afspraken." },
      { term: "Diensten", definition: "alle door BLITZWORX aangeboden werkzaamheden, waaronder webdesign, webdevelopment, prototyping, hosting, onderhoud, automatisering en SEO." },
      { term: "Revisie", definition: "een visuele of inhoudelijke aanpassing van het opgeleverde werk, binnen de reeds overeengekomen scope van de opdracht. Meerdere feedbackpunten die gelijktijdig worden aangeleverd tellen als een revisieronde." },
      { term: "Meerwerk", definition: "werkzaamheden die buiten de oorspronkelijk overeengekomen scope van de opdracht vallen, waaronder maar niet beperkt tot extra pagina's, nieuwe functionaliteit, aanvullende revisierondes en het schrijven of vertalen van content." },
      { term: "Oplevering", definition: "het moment waarop BLITZWORX het (eind)resultaat beschikbaar stelt aan de Opdrachtgever ter beoordeling." },
      { term: "Herroepingsrecht", definition: "het recht van de consument om binnen 14 dagen de overeenkomst zonder opgave van reden te ontbinden, voor zover wettelijk van toepassing." },
    ],
  },
  {
    number: 2,
    heading: "Toepasselijkheid",
    clauses: [
      { clause: "2.1", text: "Deze voorwaarden gelden voor alle offertes, overeenkomsten en leveringen van BLITZWORX." },
      { clause: "2.2", text: "Afwijkingen op deze voorwaarden zijn alleen geldig indien schriftelijk of digitaal overeengekomen." },
      { clause: "2.3", text: "Bij strijdigheid tussen deze voorwaarden en andere documenten van de Opdrachtgever prevaleren de voorwaarden van BLITZWORX, tenzij schriftelijk anders overeengekomen." },
      { clause: "2.4", text: "Indien een bepaling van deze voorwaarden nietig of vernietigbaar blijkt, blijven de overige bepalingen volledig van kracht. Partijen treden in overleg om een vervangende bepaling overeen te komen die het doel van de oorspronkelijke bepaling zo dicht mogelijk benadert." },
    ],
  },
  {
    number: 3,
    heading: "Offertes en totstandkoming",
    clauses: [
      { clause: "3.1", text: "Offertes zijn vrijblijvend en 14 dagen geldig, tenzij anders vermeld." },
      { clause: "3.2", text: "De overeenkomst komt tot stand zodra de Opdrachtgever schriftelijk of digitaal akkoord geeft op de offerte en deze algemene voorwaarden, of wanneer BLITZWORX met instemming van de Opdrachtgever met de uitvoering start." },
      { clause: "3.3", text: "BLITZWORX mag een aanbetaling verlangen voordat werkzaamheden aanvangen. De hoogte van de aanbetaling wordt vermeld in de offerte." },
      { clause: "3.4", text: "De offerte beschrijft de scope van de opdracht. Alleen de werkzaamheden die expliciet in de offerte zijn opgenomen maken deel uit van de overeenkomst. Alle overige werkzaamheden vallen onder meerwerk (artikel 5)." },
    ],
  },
  {
    number: 4,
    heading: "Uitvoering, revisies en termijnen",
    clauses: [
      { clause: "4.1", text: "BLITZWORX voert de opdracht naar beste inzicht en vermogen uit, in overeenstemming met de eisen van goed vakmanschap." },
      { clause: "4.2", text: "Oplevering van producten en diensten is afhankelijk van tijdige en volledige aanlevering van informatie, materialen en content door de Opdrachtgever." },
      { clause: "4.3", text: "Per opdracht zijn maximaal drie (3) revisierondes inbegrepen, tenzij in de offerte een ander aantal is overeengekomen." },
      { clause: "4.4", text: "Een revisieronde bestaat uit het verzameld aanleveren van feedback door de Opdrachtgever. BLITZWORX verwerkt de gebundelde feedback als een revisieronde. Losse, niet-gebundelde feedbackmomenten worden elk als afzonderlijke revisieronde geteld." },
      { clause: "4.5", text: "Revisies betreffen uitsluitend aanpassingen binnen de oorspronkelijk overeengekomen scope. Verzoeken die buiten de scope vallen, worden behandeld als meerwerk (artikel 5), ongeacht of het revisielimiet is bereikt." },
      { clause: "4.6", text: "Na het bereiken van het maximale aantal revisierondes worden aanvullende wijzigingen uitgevoerd als meerwerk tegen het geldende uurtarief van EUR 50 exclusief btw, tenzij schriftelijk anders overeengekomen." },
      { clause: "4.7", text: "De Opdrachtgever is zelf verantwoordelijk voor het tijdig en correct aanleveren van content (teksten, foto's, logo's en overig materiaal). BLITZWORX is niet aansprakelijk voor eventuele inbreuken op rechten van derden door aangeleverd materiaal." },
      { clause: "4.8", text: "Genoemde levertermijnen zijn indicatief en gelden niet als fatale termijnen, tenzij schriftelijk anders overeengekomen." },
    ],
  },
  {
    number: 5,
    heading: "Meerwerk",
    clauses: [
      { clause: "5.1", text: "Werkzaamheden die buiten de in de offerte beschreven scope vallen, worden aangemerkt als meerwerk." },
      { clause: "5.2", text: "BLITZWORX informeert de Opdrachtgever vooraf over de verwachte omvang en kosten van het meerwerk." },
      { clause: "5.3", text: "Meerwerk wordt pas uitgevoerd na schriftelijk of digitaal akkoord van de Opdrachtgever. Een akkoord per e-mail of chatbericht (bijvoorbeeld WhatsApp) volstaat." },
      { clause: "5.4", text: "Meerwerk wordt gefactureerd tegen een uurtarief van EUR 50 exclusief btw, tenzij partijen schriftelijk een ander tarief of vaste prijs overeenkomen." },
      {
        clause: "5.5",
        text: "Voorbeelden van meerwerk (niet-limitatief):",
        examples: [
          "Extra pagina's of functionaliteiten die niet in de offerte staan",
          "Aanvullende revisierondes na het inbegrepen aantal",
          "Het schrijven, vertalen of redigeren van content",
          "Wijzigingen in de scope, het ontwerp of de technische opzet na goedkeuring",
          "Aanpassingen die voortkomen uit gewijzigde wensen of eisen van de Opdrachtgever",
          "Het oplossen van problemen veroorzaakt door de Opdrachtgever of door derden ingeschakeld door de Opdrachtgever",
        ],
      },
    ],
  },
  {
    number: 6,
    heading: "Medewerking en inactiviteit",
    clauses: [
      { clause: "6.1", text: "De Opdrachtgever is gehouden de benodigde informatie, materialen en feedback tijdig aan te leveren. Partijen maken bij aanvang van de opdracht afspraken over de verwachte responstijden." },
      { clause: "6.2", text: "Indien de Opdrachtgever langer dan 14 dagen niet reageert op een verzoek om informatie, feedback of goedkeuring, stuurt BLITZWORX een schriftelijke herinnering (per e-mail)." },
      { clause: "6.3", text: "Reageert de Opdrachtgever niet binnen 14 dagen na de herinnering (totaal 28 dagen inactiviteit), dan heeft BLITZWORX het recht de opdracht op te schorten. BLITZWORX stelt de Opdrachtgever hiervan schriftelijk op de hoogte." },
      { clause: "6.4", text: "Bij hervatting van een opgeschorte opdracht brengt BLITZWORX een opstarttoeslag van EUR 50 exclusief btw in rekening, ter dekking van de kosten voor het opnieuw inwerken in het project." },
      { clause: "6.5", text: "Indien de Opdrachtgever langer dan 90 dagen na de opschorting niet reageert, heeft BLITZWORX het recht de overeenkomst te ontbinden. In dat geval worden alle reeds verrichte werkzaamheden en gemaakte kosten gefactureerd." },
      { clause: "6.6", text: "Vertragingen in de oplevering die het gevolg zijn van het niet tijdig aanleveren van informatie of feedback door de Opdrachtgever komen voor rekening en risico van de Opdrachtgever." },
    ],
  },
  {
    number: 7,
    heading: "Oplevering en acceptatie",
    clauses: [
      { clause: "7.1", text: "Na oplevering heeft de Opdrachtgever 14 dagen om het resultaat te beoordelen en eventuele gebreken schriftelijk te melden bij BLITZWORX. Gebreken betreffen afwijkingen van de overeengekomen specificaties." },
      { clause: "7.2", text: "Indien de Opdrachtgever niet binnen 14 dagen na oplevering schriftelijk reageert, wordt het opgeleverde geacht stilzwijgend te zijn geaccepteerd." },
      { clause: "7.3", text: "Het in gebruik nemen van het opgeleverde (bijvoorbeeld het livegang laten gaan van een website) geldt als acceptatie." },
      { clause: "7.4", text: "Na acceptatie vallen alle aanpassingen en wijzigingen onder meerwerk (artikel 5), ongeacht het aantal eerder gebruikte revisierondes." },
      { clause: "7.5", text: "BLITZWORX herstelt gebreken die binnen de acceptatietermijn zijn gemeld kosteloos, mits deze vallen binnen de overeengekomen scope." },
    ],
  },
  {
    number: 8,
    heading: "Prijzen en betaling",
    clauses: [
      { clause: "8.1", text: "Voor zakelijke klanten gelden prijzen exclusief btw, voor consumenten inclusief btw, tenzij anders vermeld." },
      { clause: "8.2", text: "Consumenten betalen een aanbetaling (percentage in overleg) en het resterende bedrag uiterlijk bij oplevering." },
      { clause: "8.3", text: "Zakelijke facturen dienen binnen 14 dagen na factuurdatum te worden betaald." },
      { clause: "8.4", text: "Bij te late betaling is de Opdrachtgever van rechtswege in verzuim en is wettelijke (handels)rente verschuldigd over het openstaande bedrag. Alle redelijke incassokosten komen voor rekening van de Opdrachtgever, met een minimum van EUR 40." },
      { clause: "8.5", text: "BLITZWORX kan levering, livegang of toegang tot hosting en onderhoud opschorten zolang betalingen uitstaan." },
    ],
  },
  {
    number: 9,
    heading: "Herroepingsrecht (consumenten)",
    clauses: [
      { clause: "9.1", text: "Consumenten hebben op grond van de Wet Koop op Afstand in beginsel recht op 14 dagen bedenktijd." },
      { clause: "9.2", text: "Het herroepingsrecht geldt niet voor diensten die volgens specificaties van de consument zijn vervaardigd of duidelijk persoonlijk van aard zijn, zoals websites, prototypes en maatwerkdesigns." },
      { clause: "9.3", text: "Door akkoord te gaan met de overeenkomst verklaart de consument dat BLITZWORX direct mag beginnen met de uitvoering van maatwerkdiensten en dat het herroepingsrecht voor deze diensten vervalt." },
      { clause: "9.4", text: "Voor niet-maatwerkdiensten (zoals hosting en onderhoudsabonnementen) geldt het herroepingsrecht wel, zolang BLITZWORX nog niet met de uitvoering is begonnen." },
      { clause: "9.5", text: "Om gebruik te maken van het herroepingsrecht dient de consument binnen 14 dagen na het sluiten van de overeenkomst een ondubbelzinnige verklaring per e-mail te sturen aan BLITZWORX." },
    ],
  },
  {
    number: 10,
    heading: "Hosting en onderhoud",
    clauses: [
      { clause: "10.1", text: "BLITZWORX biedt onderhoud in verschillende abonnementsvormen. De specifieke inhoud en tarieven van elk abonnement worden vermeld in de offerte of op de website van BLITZWORX." },
      { clause: "10.2", text: "BLITZWORX spant zich in voor hoge beschikbaarheid, maar garandeert geen 100% uptime of foutloze werking." },
      { clause: "10.3", text: "Storingen of schade veroorzaakt door derden (zoals hostingproviders, softwareleveranciers of aanvallen door kwaadwillenden) vallen buiten de aansprakelijkheid van BLITZWORX." },
      { clause: "10.4", text: "Indien de Opdrachtgever ervoor kiest zelf hosting te regelen bij een externe partij, is BLITZWORX niet verantwoordelijk voor de prestaties, beveiliging, back-ups, updates, storingen of dataverlies van deze hosting. Eventuele problemen of kosten die hieruit voortvloeien komen volledig voor rekening van de Opdrachtgever." },
      { clause: "10.5", text: "Na beeindiging van een onderhoudsabonnement is BLITZWORX niet verplicht toekomstige problemen of storingen aan de website op te lossen, tenzij daar een nieuwe overeenkomst voor wordt gesloten." },
      { clause: "10.6", text: "Onderhoudsabonnementen zijn maandelijks opzegbaar met een opzegtermijn van een kalendermaand." },
    ],
  },
  {
    number: 11,
    heading: "Intellectueel eigendom en tooling",
    clauses: [
      { clause: "11.1", text: "Alle door BLITZWORX gemaakte ontwerpen, code, teksten en overige materialen blijven eigendom van BLITZWORX totdat volledige betaling heeft plaatsgevonden. Na volledige betaling verkrijgt de Opdrachtgever een gebruiksrecht op het opgeleverde voor het overeengekomen doel." },
      { clause: "11.2", text: "BLITZWORX behoudt het recht om het werk te gebruiken als referentie voor portfolio en marketingdoeleinden, tenzij schriftelijk anders overeengekomen." },
      { clause: "11.3", text: "BLITZWORX is gerechtigd bij de uitvoering van de opdracht gebruik te maken van hulpmiddelen, waaronder AI-tools, softwarebibliotheken en diensten van derden, mits het eindresultaat voldoet aan de overeengekomen specificaties." },
      { clause: "11.4", text: "Het is de Opdrachtgever niet toegestaan de door BLITZWORX geleverde materialen te verveelvoudigen, openbaar te maken of aan derden beschikbaar te stellen buiten het overeengekomen gebruik, zonder voorafgaande schriftelijke toestemming van BLITZWORX." },
    ],
  },
  {
    number: 12,
    heading: "Aansprakelijkheid",
    clauses: [
      { clause: "12.1", text: "BLITZWORX is uitsluitend aansprakelijk voor directe schade die aantoonbaar het gevolg is van een toerekenbare tekortkoming in de nakoming van de overeenkomst." },
      { clause: "12.2", text: "De aansprakelijkheid van BLITZWORX is beperkt tot het bedrag dat door de verzekering wordt uitbetaald, dan wel tot maximaal het factuurbedrag van de betreffende opdracht. Bij doorlopende overeenkomsten geldt een maximum van het factuurbedrag over de laatste 12 maanden." },
      { clause: "12.3", text: "BLITZWORX is niet aansprakelijk voor indirecte schade, waaronder maar niet beperkt tot gederfde winst, gemiste besparingen, gevolgschade of schade door bedrijfsstagnatie." },
      { clause: "12.4", text: "De Opdrachtgever vrijwaart BLITZWORX tegen alle aanspraken van derden die voortvloeien uit het gebruik van de door de Opdrachtgever aangeleverde materialen." },
    ],
  },
  {
    number: 13,
    heading: "Annulering",
    clauses: [
      { clause: "13.1", text: "Bij annulering door de Opdrachtgever voor aanvang van de uitvoering worden uitsluitend de reeds gemaakte voorbereidingskosten in rekening gebracht, met een minimum van 10% van de overeengekomen prijs." },
      { clause: "13.2", text: "Bij annulering door de Opdrachtgever na aanvang van de uitvoering is de Opdrachtgever de kosten verschuldigd voor alle reeds verrichte werkzaamheden en gemaakte kosten, met een minimum van 50% van de overeengekomen projectprijs." },
      { clause: "13.3", text: "BLITZWORX behoudt te allen tijde het recht op vergoeding van reeds gemaakte uren en kosten." },
      { clause: "13.4", text: "BLITZWORX heeft het recht de overeenkomst te ontbinden indien de Opdrachtgever zijn verplichtingen niet nakomt, onverminderd het recht op schadevergoeding." },
    ],
  },
  {
    number: 14,
    heading: "Privacy en AVG",
    clauses: [
      { clause: "14.1", text: "BLITZWORX verwerkt persoonsgegevens conform de Algemene Verordening Gegevensbescherming (AVG)." },
      { clause: "14.2", text: "Indien BLITZWORX in opdracht persoonsgegevens verwerkt, wordt een verwerkersovereenkomst gesloten." },
      { clause: "14.3", text: "De privacyverklaring van BLITZWORX is van toepassing op alle verwerkingen." },
    ],
  },
  {
    number: 15,
    heading: "Overmacht",
    clauses: [
      { clause: "15.1", text: "BLITZWORX is niet gehouden verplichtingen na te komen indien dit redelijkerwijs onmogelijk is door overmacht, waaronder maar niet beperkt tot: internet- of netwerkstoringen, leveranciersproblemen, stroomuitval, ziekte, stakingen, pandemie, overheidsmaatregelen of andere omstandigheden buiten de macht van BLITZWORX." },
      { clause: "15.2", text: "In geval van overmacht kan BLITZWORX de overeenkomst opschorten zonder schadeplichtigheid." },
      { clause: "15.3", text: "Indien de overmacht langer dan 60 dagen voortduurt, hebben beide partijen het recht de overeenkomst schriftelijk te ontbinden. Reeds verrichte werkzaamheden worden in dat geval naar rato gefactureerd." },
    ],
  },
  {
    number: 16,
    heading: "Duur en beeindiging",
    clauses: [
      { clause: "16.1", text: "Losse opdrachten eindigen na acceptatie van de oplevering conform artikel 7." },
      { clause: "16.2", text: "Hosting- en onderhoudsabonnementen zijn maandelijks opzegbaar met een opzegtermijn van een kalendermaand." },
      { clause: "16.3", text: "BLITZWORX kan de overeenkomst per direct beindigen bij wanbetaling, faillissement, surseance van betaling of stillegging van de onderneming van de Opdrachtgever." },
    ],
  },
  {
    number: 17,
    heading: "Toepasselijk recht en geschillen",
    clauses: [
      { clause: "17.1", text: "Op alle overeenkomsten is Nederlands recht van toepassing." },
      { clause: "17.2", text: "Geschillen met consumenten worden voorgelegd aan de bevoegde rechter in de woonplaats van de consument." },
      { clause: "17.3", text: "Geschillen met zakelijke klanten worden voorgelegd aan de bevoegde rechter in Gelderland." },
      { clause: "17.4", text: "Partijen spannen zich in om geschillen eerst in onderling overleg op te lossen alvorens een gerechtelijke procedure te starten." },
    ],
  },
];
