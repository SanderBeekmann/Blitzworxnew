-- Verwijder offerte_aangevraagd en onderhandeling uit de leadfase
-- Bestaande leads met die fases worden gezet op offerte_verzonden

UPDATE leads SET phase = 'offerte_verzonden' WHERE phase IN ('offerte_aangevraagd', 'onderhandeling');

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_phase_check;
ALTER TABLE leads ADD CONSTRAINT leads_phase_check CHECK (phase IN ('lead', 'contact_opgenomen', 'offerte_verzonden', 'gewonnen', 'verloren'));
