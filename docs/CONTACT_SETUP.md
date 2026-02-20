# Contactfunnel & Admin Setup

## Overzicht

De contactfunnel heeft nu:
- **5 stappen:** Projecttype → Naam/E-mail/Telefoon → Bericht → Agenda → Overzicht
- **Agenda:** Avonden 18:00–22:00 (ma–vr), hele weekenddagen
- **E-mails:** Lead naar jou + samenvatting naar klant (via contact@blitzworx.nl)
- **Database:** Supabase voor leads en bezette tijdsloten
- **Admin:** `/admin/leads` voor overzicht en status

## 1. Supabase

Zie **docs/SUPABASE_NIEUW_PROJECT.md** voor een stapsgewijze handleiding.

Kort:
1. Maak een nieuw project op [supabase.com/dashboard](https://supabase.com/dashboard)
2. Voer de SQL uit uit `supabase/migrations/001_create_leads.sql` in de SQL Editor
3. Kopieer Project URL en service_role key naar `.env`

## 2. E-mailtemplates (Supabase)

Templates staan in de tabel `email_templates` en kunnen in Supabase worden aangepast zonder code-deploy.

**Slugs:** `lead_notification` (naar jou), `client_confirmation` (naar klant)

**Placeholders:** `{{name}}`, `{{email}}`, `{{phone}}`, `{{phoneTel}}`, `{{message}}`, `{{projectLabel}}`, `{{preferredDate}}`, `{{preferredTime}}`

**Stijl (styleguide):** Achtergrond `#040711`, tekst `#fefadc`, accent `#cacaaa`, rand `#545c52`. Font: Gilroy.

Als Supabase niet beschikbaar is of de template ontbreekt, wordt de ingebouwde fallback gebruikt.

## 3. Resend

1. Maak een API key aan op [resend.com/api-keys](https://resend.com/api-keys)
2. Verifieer het domein **blitzworx.nl** in het [Resend-dashboard](https://resend.com/domains)
3. Voeg het adres **contact@blitzworx.nl** toe als verified sender
4. Zet `RESEND_API_KEY` en optioneel `RESEND_FROM_EMAIL=contact@blitzworx.nl` in `.env`
5. **Test:** Vul het contactformulier in en verstuur. Je ontvangt een lead-mail op sander@blitzworx.nl en de klant krijgt een bevestiging. Zonder geldige key krijg je een foutmelding bij verzenden.

## 4. Admin

1. Zet `ADMIN_PASSWORD` in `.env` (sterk wachtwoord)
2. Ga naar `/admin/leads` en log in
3. **Leads:** Bekijk leads in de funnel (Nieuw, Contact opgenomen, Offerte, etc.) en voeg notities toe
4. **Klanten:** Automatisch aangemaakt bij eerste lead (op e-mail). Beheer bedrijfsnaam en notities per klant. Zie alle projecten per klant.
5. **Agenda:** Weekoverzicht met ingeplande gesprekken. Koppel met Apple Calendar via een feed – zie **docs/CALENDAR_FEED.md**

## 6. Environment variables

Voeg toe aan `.env` of `.env.local`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend (contact@blitzworx.nl moet geverifieerd zijn)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=contact@blitzworx.nl

# Admin
ADMIN_PASSWORD=jouw-wachtwoord
```

## Agenda

- **Doordeweeks (ma–vr):** 18:00, 19:00, 20:00, 21:00, 22:00
- **Weekend:** 09:00–22:00 (elk heel uur)
- Bezette sloten worden automatisch uit de database gehaald
