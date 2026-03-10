# CLAUDE.md — Blitzworx

## Project Overview

Blitzworx is a Dutch creative agency website built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, and **Tailwind CSS**. The site is fully in Dutch.

## Tech Stack

- **Framework**: Next.js 14.2.18 (App Router, `app/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4 + `@tailwindcss/typography` + custom design tokens in `globals.css`
- **Backend**: Supabase (leads, clients, email templates, AgencyOS sync)
- **Email**: Resend (`contact@blitzworx.nl`)
- **Animations**: GSAP (scroll-triggered)
- **Fonts**: Gilroy (local WOFF2 files in `public/assets/fonts/`)
- **Blog**: Markdown-based via `lib/posts.ts` with `react-markdown` + `remark-gfm`

## Project Structure

```
app/
  api/          # Route handlers (contact, admin, calendar, availability)
  admin/        # Protected admin dashboard
  blog/         # Blog pages (markdown-based)
  cases/        # Case studies
  diensten/     # Services (webdesign, branding, development)
  contact/      # Contact page
  about/        # About page
  sections/     # Reusable page sections (home)
  fonts.ts      # Gilroy font config
  globals.css   # Design tokens + Tailwind layers
  sitemap.ts    # Dynamic sitemap
components/
  animations/   # GSAP scroll animations
  blog/         # Blog components (MarkdownContent, AuthorCard, TableOfContents, etc.)
  cases/        # Case study components
  contact/      # Contact form
  layout/       # Header, Footer, SiteShell, AnnouncementBar
  ui/           # Button, ScrollProgressIndicator
lib/
  supabase.ts   # Supabase client
  posts.ts      # Blog post data + metadata
  cases.ts      # Case study data
  site.ts       # Site config
  announcements.ts
  availability.ts
```

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm run clean` — Remove `.next` and cache

## Code Conventions

- **Language**: All UI text, form labels, validation messages, and email templates are in **Dutch**
- **Formatting**: Prettier — semicolons, single quotes, 2-space tabs, trailing comma (es5), 100 char line width
- **Linting**: ESLint with `next/core-web-vitals`; `@next/next/no-img-element` is disabled
- **Path alias**: `@/*` maps to project root (e.g. `import { Button } from '@/components/ui/Button'`)
- **Component pattern**: Server components by default; use `'use client'` only when needed (interactivity, hooks, browser APIs)
- **Page clients**: Interactive pages use a `*PageClient.tsx` pattern (e.g. `BrandingPageClient.tsx`) imported by the server-rendered `page.tsx`

## Design System

The design tokens are defined in `app/globals.css` as CSS variables:

- **Colors**: ink-black (`#040711`), ebony (`#545c52`), grey-olive, dry-sage, cornsilk — configured in `tailwind.config.ts`
- **Typography**: Custom font sizes (hero, h2, h3, body, small, caption) with responsive variants
- **Shadows**: `shadow-soft`, `shadow-card`
- **Custom classes**: `.container-narrow`, `.section`, `.btn-secondary-cta`, `.hero-title-depth`

## Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — Site URL (blitzworx.nl)
- `RESEND_API_KEY` — Resend email service
- `RESEND_FROM_EMAIL` — Sender address
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase auth
- `ADMIN_PASSWORD` — Admin dashboard access
- `CALENDAR_FEED_TOKEN` — Calendar feed security
- `NEXT_PUBLIC_GA_ID` — Google Analytics (optional)

## Key Patterns

- **Blog posts** are defined as TypeScript objects in `lib/posts.ts` with metadata (slug, category, tags, readingTime, featured, FAQs, ISO dates)
- **Cases** are defined in `lib/cases.ts`
- **Contact form** submits to `/api/contact` which sends email via Resend and syncs lead to Supabase/AgencyOS
- **Admin** routes are password-protected via `ADMIN_PASSWORD`
- **SEO**: JSON-LD schema in root layout, dynamic sitemap, robots.ts, FAQ schema on blog posts
- **Images**: Remote patterns allowed for unsplash.com and placehold.co (configured in `next.config.mjs`)
