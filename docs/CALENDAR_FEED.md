# Apple Calendar feed – Blitzworx gesprekken

De admin-agenda kan worden gekoppeld aan Apple Calendar via een abonnement. Alle ingeplande gesprekken (leads met datum + tijd) verschijnen automatisch in je agenda.

## 1. Token aanmaken

Genereer een geheim token (minimaal 32 tekens):

```bash
openssl rand -hex 24
```

Voeg toe aan `.env`:

```
CALENDAR_FEED_TOKEN=de-gegenereerde-token
```

## 2. Deploy

Zet `CALENDAR_FEED_TOKEN` ook in Netlify (of je hosting) onder Environment variables. Deploy opnieuw.

## 3. Feed-URL

Je persoonlijke feed-URL:

```
https://blitzworx.nl/api/calendar/feed?token=JOUW_TOKEN
```

Vervang `JOUW_TOKEN` door de waarde uit `.env`.

## 4. Toevoegen in Apple Calendar

### Mac

1. Open **Calendar** (Agenda)
2. Menu **Bestand** → **Nieuw abonnement op agenda**
3. Plak de feed-URL (inclusief `?token=...`)
4. Klik **Abonneren**
5. De kalender "Blitzworx Gesprekken" verschijnt in de zijbalk

### iPhone / iPad

1. Open **Instellingen** → **Agenda** → **Accounts** → **Account toevoegen**
2. Kies **Andere**
3. Kies **Abonnement op agenda toevoegen**
4. Plak de feed-URL
5. Tik **Volgende** → **Opslaan**

## 5. Wat zie je?

- **Titel:** Naam van de lead + projecttype (bijv. "Jan de Vries – Nieuwe website")
- **Tijd:** 1 uur blok (gesprekstijd + 1 uur)
- **Beschrijving:** Naam, project, e-mail, begin van het bericht

## 6. Vernieuwen

Apple Calendar haalt de feed periodiek op (vaak elk uur). Je kunt handmatig vernieuwen via de agenda-instellingen.

## Beveiliging

- De token is geheim – deel de URL niet
- Zet `CALENDAR_FEED_TOKEN` als **secret** in Netlify
- Zonder token krijg je een 401 Unauthorized

## Troubleshooting: geen events zichtbaar

Als je het abonnement ziet maar geen events:

1. **Vernieuwen** – Agenda → Instellingen → Accounts → [jouw abonnement] → Vernieuw nu
2. **Kalender aan** – Controleer of "Blitzworx Gesprekken" aanstaat in de zijbalk (vinkje)
3. **Datumweergave** – Zoom in op de juiste week (20–21 feb 2026)
4. **Abonnement opnieuw** – Verwijder het abonnement en voeg de feed-URL opnieuw toe
5. **Deploy** – Na wijzigingen aan de feed: opnieuw deployen, daarna in Agenda vernieuwen
