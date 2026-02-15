# DESIGN SYSTEM & UI RULES


Dit document bevat de strikte designregels voor dit project. Alle gegenereerde code (CSS/Tailwind/Componenten) moet voldoen aan deze richtlijnen.


## 1. Mathematische Basis (The 4-Pixel Rule)
**Kernregel:** Elk visueel element, afmeting, padding en margin **MOET** deelbaar zijn door 4.
*   **Voorkeur:** Gebruik het **8-point grid** (8, 16, 24, 32, 40, etc.) voor grove structuur.
*   **Uitzondering:** Gebruik 4px stappen voor fijne details (iconen, dichte groeperingen).
*   **Verboden:** Geen willekeurige getallen (bijv. 13px, 7px). Rond altijd af naar het dichtstbijzijnde viervoud.


## 2. Layout & Grid Systeem
Gebruik een responsief kolomraster.
*   **Desktop:** 12 kolommen.
*   **Tablet:** 8 kolommen.
*   **Mobiel:** 4 kolommen.
*   **Container Max-Width:** Berekenen op basis van (N containers × breedte) + (N-1 gaps).
    *   *Richtlijn:* ~1128px of 1200px breed.
*   **Gutter/Gap:** Standaard 24px (alternatieven: 32px, 40px).


## 3. Spacing Systeem (Witruimte)
Gebruik vaste waarden om hiërarchie aan te brengen.
*   **xs (4px):** Zeer nauw verwant (bv. icoon + tekst, elementen binnen een knop).
*   **sm (8px):** Nauw verwant (bv. items in een lijst, labels bij input).
*   **md (16px):** Standaard component spacing (bv. kop + subkop).
*   **lg (24px - 32px):** Tussen losse componenten in een container.
*   **xl (64px+):** Sectie scheidingen. *Regel: Minimaal 2x de component-spacing.*


## 4. Typografie Systeem
**Base Font Size:** 16px (1rem).
**Schaal:** Gebruik een vaste schaal (bijv. Major Third 1.250) of vaste stappen van 4px.


| Rol | Grootte (px) | Line-Height | Tracking (Letter-spacing) |
| :--- | :--- | :--- | :--- |
| **Hero / H1** | 48px - 64px | 1.1 - 1.2 | -1% tot -2% (Tighter) |
| **H2** | 32px - 40px | 1.2 - 1.3 | -1% |
| **H3** | 24px - 28px | 1.3 | Normal |
| **Body (Base)** | 16px | 1.5 (150%) | Normal |
| **Small / Caption**| 12px - 14px | 1.5 | Normal |


*   **Line-Length:** Beperk tekstregels tot 50-75 karakters (max-width ~60ch) voor leesbaarheid.
*   **Uitlijning:** Links uitlijnen (left-align) voor teksten langer dan 3 regels. Centreer alleen koppen of korte snippets.


## 5. Kleurgebruik (60-30-10 Regel)
Beperk het palet strikt om visuele ruis te voorkomen.
*   **60% Neutraal:** Achtergrond, witruimte, en basis tekstkleuren (Zwart/Wit/Grijs).
*   **30% Secundair:** Headers, kaarten, subtiele achtergronden, randen.
*   **10% Accent:** **ALLEEN** voor primaire acties (CTA's) en interactieve elementen.


*   **Variaties:** Maak geen nieuwe kleurcodes aan voor hover/active states. Gebruik `opacity` (dekking) van de basiskleur of pas brightness aan.
*   **Contrast:**
    *   Kleine tekst: Minimaal 4.5:1 ratio.
    *   Grote tekst (>18pt): Minimaal 3:1 ratio.


## 6. Component Regels & UX
*   **Knoppen & Touch Targets:**
    *   Minimale grootte interactief gebied: **44px x 44px** (Fitts's Law).
    *   Zorg voor duidelijke `hover` en `focus` states.
*   **Radius (Afronding):** Wees consistent (bv. altijd 4px, 8px of 'pill-shape').
*   **Schaduwen:** Gebruik subtiele schaduwen voor diepte, geen harde zwarte schaduwen.


## 7. Conversie Principes
*   **Primaire CTA:** Eén duidelijk hoofddoel per pagina/sectie. Plaats in Hero, Navigatie, en herhaal bij lange pagina's.
*   **Hierarchy:** Belangrijke elementen moeten groter zijn of meer contrast hebben.
*   **Feedback:** UI moet reageren op interactie (loading spinners, success messages).


## Implementatie Instructies voor AI
1.  Controleer bij elke gegenereerde component of de marges/paddings deelbaar zijn door 4.
2.  Gebruik `rem` voor font-sizes (waarbij 1rem = 16px).
3.  Definieer kleuren als CSS variabelen of Tailwind config volgens de 60-30-10 regel.
4.  Genereer geen 'magic numbers'; gebruik variabelen uit het designsysteem.
