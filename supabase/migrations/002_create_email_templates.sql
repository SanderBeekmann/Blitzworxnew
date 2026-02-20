-- Email templates for Resend (lead notification + client confirmation)
-- Stored in Supabase so they can be edited without code changes
-- Placeholders: {{name}}, {{email}}, {{phone}}, {{message}}, {{projectLabel}}, {{preferredDate}}, {{preferredTime}}

CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  subject text NOT NULL,
  html_body text NOT NULL,
  from_name text DEFAULT 'Blitzworx',
  updated_at timestamptz DEFAULT now()
);

-- Default templates with Blitzworx style: dark bg #040711, light text #fefadc, accent #cacaaa
INSERT INTO email_templates (slug, subject, html_body, from_name) VALUES
(
  'lead_notification',
  'Lead: {{name}} – {{projectLabel}} – {{preferredDate}} {{preferredTime}}',
  '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:''Gilroy'';src:url(''https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Regular.woff'') format(''woff'');font-weight:400}@font-face{font-family:''Gilroy'';src:url(''https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Bold.woff'') format(''woff'');font-weight:700}</style></head><body style="margin:0;padding:0;background:#040711;font-family:''Gilroy'',system-ui,sans-serif;font-size:16px;line-height:1.5;color:#fefadc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#040711"><tr><td style="padding:32px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px"><tr><td><h1 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#fefadc">Nieuwe lead – Blitzworx</h1><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #545c52;border-radius:8px"><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">Project</td><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#fefadc">{{projectLabel}}</td></tr><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">Naam</td><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#fefadc">{{name}}</td></tr><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">E-mail</td><td style="padding:12px 16px;border-bottom:1px solid #545c52"><a href="mailto:{{email}}" style="color:#cacaaa;text-decoration:underline">{{email}}</a></td></tr><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">Telefoon</td><td style="padding:12px 16px;border-bottom:1px solid #545c52"><a href="tel:{{phone}}" style="color:#cacaaa;text-decoration:underline">{{phone}}</a></td></tr><tr><td style="padding:12px 16px;color:#cacaaa;font-weight:600">Gesprek</td><td style="padding:12px 16px;color:#fefadc">{{preferredDate}} om {{preferredTime}}</td></tr></table><p style="margin:20px 0 8px;color:#cacaaa;font-weight:600">Bericht</p><p style="margin:0;padding:16px;background:#545c52;border:1px solid #545c52;border-radius:8px;color:#fefadc;white-space:pre-wrap">{{message}}</p></td></tr></table></td></tr></table></body></html>',
  'Blitzworx'
),
(
  'client_confirmation',
  'Bedankt voor je bericht – Blitzworx',
  '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:''Gilroy'';src:url(''https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Regular.woff'') format(''woff'');font-weight:400}@font-face{font-family:''Gilroy'';src:url(''https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Bold.woff'') format(''woff'');font-weight:700}</style></head><body style="margin:0;padding:0;background:#040711;font-family:''Gilroy'',system-ui,sans-serif;font-size:16px;line-height:1.5;color:#fefadc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#040711"><tr><td style="padding:32px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px"><tr><td><h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#fefadc">Bedankt voor je bericht!</h1><p style="margin:0 0 24px;color:#fefadc">We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact op.</p><h2 style="margin:0 0 12px;font-size:18px;font-weight:600;color:#cacaaa">Samenvatting</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #545c52;border-radius:8px;margin-bottom:24px"><tr><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#cacaaa;font-weight:600">Project</td><td style="padding:12px 16px;border-bottom:1px solid #545c52;color:#fefadc">{{projectLabel}}</td></tr><tr><td style="padding:12px 16px;color:#cacaaa;font-weight:600">Gesprek gepland</td><td style="padding:12px 16px;color:#fefadc">{{preferredDate}} om {{preferredTime}}</td></tr></table><p style="margin:0;color:#8b8174;font-size:14px">Heb je vragen? Mail naar <a href="mailto:sander@blitzworx.nl" style="color:#cacaaa;text-decoration:underline">sander@blitzworx.nl</a>.</p></td></tr></table></td></tr></table></body></html>',
  'Blitzworx'
)
ON CONFLICT (slug) DO NOTHING;
