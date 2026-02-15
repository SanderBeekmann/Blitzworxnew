# Blitzworx Website

Marketing website voor Blitzworx – creative agency voor ondernemers die online willen groeien.

## Techstack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **GSAP** (animaties, transform/opacity only)
- **PostCSS** + next/image

## Pagina's

| Route | Beschrijving |
|-------|--------------|
| `/` | Homepage – Hero, About intro, Recent Cases, How It Worx, Skills |
| `/about` | Over Blitzworx, visie, Meet the Creator (Sander) |
| `/cases` | Overzicht van cases |
| `/cases/[slug]` | Case detailpagina |
| `/contact` | Contactgegevens + formulier |

## Ontwikkeling

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Design System

- **4px grid** – alle spacing deelbaar door 4
- **60-30-10** – neutraal, secundair, accent
- **Container** – max 1200px
- **Touch targets** – min 44×44px

## SEO

- Metadata API per pagina
- Canonical URLs
- `sitemap.xml` en `robots.txt` via Next.js conventions
- Stel `NEXT_PUBLIC_SITE_URL` in voor productie

## Aannames

- Geen aparte PRD; wireframe (Sitemap.md) en designrules.md zijn de bronnen
- Contactformulier: mock submit (client-side validatie)
- Case-afbeeldingen: Unsplash placeholders
- Foto Sander: placeholder
