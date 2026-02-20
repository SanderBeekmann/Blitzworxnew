# SEO & Organische Vindbaarheid – Blitzworx

**Plan voor organische vindbaarheid en bezoekers naar blitzworx.nl**

---

## 1. Huidige stand van zaken

### ✅ Wat al goed is

| Onderdeel | Status |
|-----------|--------|
| Meta tags | Per pagina (title, description) |
| Open Graph & Twitter Cards | Root + case-specifiek |
| JSON-LD structured data | Organization, WebSite, BreadcrumbList |
| Sitemap | Statisch + dynamisch (cases) |
| Robots.txt | Allow /, disallow /api/ |
| Canonical URLs | Alle hoofdpagina's |
| next/image | Optimalisatie, lazy loading |
| html lang="nl" | Correct ingesteld |
| Admin routes | noindex, nofollow |

### ⚠️ Verbeterpunten

- **Geen LocalBusiness schema** – geen adres/locatie voor lokale SEO
- **Geen FAQ schema** – minder kans op rich snippets
- **Geen blog/content hub** – weinig long-tail keywords
- **Beperkte servicepagina's** – geen aparte pagina's per dienst
- **Case-3 anoniem** – "Client C" is zwak voor vertrouwen
- **Geen alternates** – geen hreflang (niet nodig bij alleen NL)
- **OG image** – gebruikt case-mockup; geen specifieke branding voor homepage

---

## 2. Technische SEO-verbeteringen

### 2.1 LocalBusiness schema (prioriteit: hoog)

Toevoegen aan JSON-LD in `app/layout.tsx`:

```json
{
  "@type": "LocalBusiness",
  "@id": "https://blitzworx.nl/#localbusiness",
  "name": "Blitzworx",
  "image": "...",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "[plaats]",
    "addressRegion": "[provincie]",
    "addressCountry": "NL"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... },
  "url": "https://blitzworx.nl",
  "telephone": "[telefoon]",
  "openingHoursSpecification": "...",
  "priceRange": "€€"
}
```

**Actie:** Vul alleen in als er een fysiek adres/werkplek is. Anders: `Service` schema met `areaServed`.

### 2.2 Service schema

Voor diensten (webdesign, development, branding):

```json
{
  "@type": "Service",
  "serviceType": "Webdesign",
  "provider": { "@id": "https://blitzworx.nl/#organization" },
  "areaServed": "NL"
}
```

### 2.3 Article/CreativeWork voor cases

Cases zijn portfolio-items. Voeg `CreativeWork` of `Article` schema toe op case-detailpagina's:

```json
{
  "@type": "CreativeWork",
  "name": "[case title]",
  "description": "[description]",
  "author": { "@id": "https://blitzworx.nl/#organization" },
  "datePublished": "[year]",
  "image": "[case image]"
}
```

### 2.4 Robots.txt – JSON-data blokkeren

Voorkom indexering van `/_next/data/` JSON-bestanden:

```
Disallow: /_next/data/
```

### 2.5 Core Web Vitals

- LCP: eerste beeld `priority`, lazy voor de rest
- INP: vermijd zware JS in critical path (GSAP al dynamisch geladen)
- CLS: vaste aspect-ratio voor images waar mogelijk

---

## 3. Contentstrategie

### 3.1 Servicepagina's (prioriteit: hoog)

Maak aparte pagina's per dienst met eigen keywords:

| Pagina | Voorbeeld keywords |
|--------|--------------------|
| `/diensten/webdesign` | webdesign bureau, website laten maken |
| `/diensten/development` | webdevelopment, op maat website |
| `/diensten/branding` | branding bureau, huisstijl ontwerpen |

**Structuur:** H1 = dienstnaam, H2 = voordelen/aanpak, CTA naar contact.

### 3.2 Blog / kennisbank (prioriteit: medium)

- **Doel:** Long-tail keywords, E-E-A-T, GEO-vriendelijke content
- **Onderwerpen:** "Hoe kies je een webdesign bureau?", "Website laten maken: waar let je op?", "Wat kost een website op maat?"
- **Formaat:** 800–1500 woorden, duidelijke H2/H3, FAQ-blokken
- **Frequentie:** 1–2 artikelen per maand

### 3.3 Cases uitbreiden

- **FleetCare Connect:** Zodra live, volledige case met echte content
- **Case-3:** Hernoemen naar echte klant (met toestemming) of verwijderen
- **BlueShipment:** Uitbreiden met resultaten, cijfers, testimonial-quotes
- **Extra cases:** Elk nieuw project = nieuwe case-pagina

### 3.4 Keyword-focus (Nederlands)

| Categorie | Voorbeelden |
|-----------|-------------|
| Dienst + intentie | webdesign bureau, website laten maken, branding agency |
| Long-tail | website laten maken voor mkb, op maat website startup |
| Lokaal (indien van toepassing) | webdesign [regio], website maken [stad] |
| GEO/AI-vriendelijk | "beste webdesign bureau voor [doelgroep]" |

---

## 4. Lokale SEO (Nederland)

### 4.1 Google Bedrijfsprofiel

- Profiel aanmaken/claimen op [Google Business Profile](https://business.google.com)
- Volledig invullen: categorieën, diensten, openingstijden, foto's
- Consistent NAW op website, GMB en directories

### 4.2 NAP-consistentie

- Naam, adres, telefoon overal identiek
- Footer, contactpagina, schema, GMB

### 4.3 Reviews

- Trustpilot-link al aanwezig; actief reviews verzamelen
- Korte, eerlijke reviews met specifieke projecten

### 4.4 Lokale content (indien regio relevant)

- Pagina "Werkgebied" of "Regio" met plaatsen/gebieden
- Cases met lokale verwijzingen ("fulfillment center in [regio]")

---

## 5. GEO – Generative Engine Optimization

AI-zoekmachines (ChatGPT, Perplexity, Google AI Overviews) gebruiken andere signalen dan klassieke SEO.

### 5.1 Content-structuur voor AI

- **Atomic blocks:** Definities, stappen, pros/cons, FAQ in aparte secties
- **Descriptive headers:** H2/H3 die direct antwoord geven ("Wat kost een website op maat?")
- **Linkbare fragmenten:** Duidelijke ankers voor citaties

### 5.2 Authority-signalen

- E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness
- Over-pagina met achtergrond, cases, testimonials
- Consistente entity naming (altijd "Blitzworx", geen wisselende benamingen)

### 5.3 Schema voor AI-parsing

- `FAQPage` schema bij FAQ-secties
- `HowTo` schema bij uitleg-artikelen
- Duidelijke `author` en `publisher` in structured data

---

## 6. Andere organische kanalen

### 6.1 Sociale media

- **LinkedIn:** Cases, inzichten, korte posts → link naar website
- **Instagram:** Visueel werk, behind-the-scenes
- **X/Twitter:** Korte updates, link naar blog/cases

### 6.2 Gastbijdragen & partnerships

- Artikelen op branche-sites (bijv. MKB, startup-platforms)
- Backlinks van klanten (footer "Website door Blitzworx")
- Vermelding in lijsten ("Beste webdesign bureaus 2025")

### 6.3 Directories & vermeldingen

- Kamer van Koophandel
- Branche-directories (Creative Holland, BNO, etc.)
- Clutch, DesignRush (indien relevant)

### 6.4 E-mail & nieuwsbrief

- Nieuwsbrief voor bestaande klanten en leads
- Link naar nieuwe cases en blogposts
- Verhoogt terugkeer en indirecte SEO (brand searches)

---

## 7. Implementatieroadmap

### Fase 1 – Quick wins (1–2 weken)

| Actie | Impact | Status |
|-------|--------|--------|
| LocalBusiness/Service schema toevoegen | Lokale SEO, rich results | ✅ Service schema toegevoegd |
| Robots.txt: `/_next/data/` disallowen | Voorkom dubbele content | ✅ |
| Case-3 hernoemen of verwijderen | Betere E-E-A-T | ✅ Verwijderd |
| OG image homepage: aparte branded afbeelding | Hogere CTR bij delen | ⏳ Voeg `og-home.png` (1200×630) toe in `/assets/images/` en pas layout aan |

### Fase 2 – Content (2–4 weken)

| Actie | Impact | Status |
|-------|--------|--------|
| Eerste servicepagina (bijv. /diensten/webdesign) | Nieuwe keywords | ✅ |
| CreativeWork schema op cases | Rijkere resultaten | ✅ |
| FAQ-sectie op contact + FAQPage schema | Featured snippets | ✅ |

### Fase 3 – Uitbreiding (1–3 maanden)

| Actie | Impact | Status |
|-------|--------|--------|
| Blog/kennisbank opzetten | Long-tail, GEO | ✅ `/blog` + Article schema |
| Google Bedrijfsprofiel optimaliseren | Lokale vindbaarheid | ✅ Zie `docs/GOOGLE_BEDRIJFSPROFIEL.md` |
| 2–3 blogposts publiceren | Authority, backlinks | ✅ 3 artikelen live |
| Servicepagina's development & branding | Nieuwe keywords | ✅ `/diensten/development`, `/diensten/branding` |

### Fase 4 – Doorlopend

| Actie | Impact |
|-------|--------|
| Maandelijks 1–2 blogposts | Consistent traffic |
| Reviews verzamelen | Lokale rankings |
| Gastbijdragen en partnerships | Backlinks, autoriteit |
| Sociale posts met links | Referral traffic |

---

## 8. Meetbare doelen

| KPI | Doel (6 maanden) | Tool |
|-----|------------------|------|
| Organisch verkeer | +50–100% | Google Analytics |
| Indexeerbare pagina's | 15+ | Google Search Console |
| Ranking keywords | 20+ in top 50 | GSC / Ahrefs |
| Core Web Vitals | Alle groen | PageSpeed Insights |
| Backlinks | 5–10 kwalitatieve | Ahrefs / Semrush |
| GMB views/clicks | Meetbaar | Google Business Profile |

---

## 9. Tools & bronnen

- **Google Search Console** – indexering, queries, fouten
- **Google Analytics 4** – verkeer, conversies
- **PageSpeed Insights** – Core Web Vitals
- **Schema.org Validator** – structured data controleren
- **Ahrefs / Semrush** – keywords, backlinks (optioneel, betaald)

---

*Document opgesteld: februari 2025*
