import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contact@blitzworx.nl';

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function fillTemplate(html: string, vars: Record<string, string>): string {
  let out = html;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return out;
}

export function emailShell(content: string, unsubscribeUrl?: string): string {
  const footer = unsubscribeUrl
    ? `<p style="margin:0 0 8px;color:#8b8174;font-size:13px">Webdesign That Worx!</p><p style="margin:0 0 8px;color:#545c52;font-size:12px">&copy; ${new Date().getFullYear()} BLITZWORX. Alle rechten voorbehouden.</p><p style="margin:0"><a href="${unsubscribeUrl}" style="color:#545c52;font-size:11px;text-decoration:underline">Uitschrijven</a></p>`
    : `<p style="margin:0 0 8px;color:#8b8174;font-size:13px">Webdesign That Worx!</p><p style="margin:0;color:#545c52;font-size:12px">&copy; ${new Date().getFullYear()} BLITZWORX. Alle rechten voorbehouden.</p>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:'Gilroy';src:url('https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Regular.woff') format('woff');font-weight:400}@font-face{font-family:'Gilroy';src:url('https://cdn.jsdelivr.net/npm/@qpokychuk/gilroy@1.0.2/src/Gilroy-Bold.woff') format('woff');font-weight:700}</style></head><body style="margin:0;padding:0;background:#040711;font-family:'Gilroy',system-ui,sans-serif;font-size:16px;line-height:1.6;color:#fefadc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#040711"><tr><td align="center" style="padding:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px"><tr><td style="padding:40px 32px 32px;border-bottom:1px solid #545c52"><a href="https://blitzworx.nl" style="text-decoration:none;color:#fefadc;font-size:22px;font-weight:700;letter-spacing:0.5px;font-family:'Gilroy',system-ui,sans-serif">BLITZWORX</a></td></tr><tr><td style="padding:32px">${content}</td></tr><tr><td style="padding:24px 32px;border-top:1px solid #545c52"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td>${footer}</td><td align="right" valign="top"><a href="https://blitzworx.nl" style="color:#cacaaa;font-size:13px;text-decoration:none">blitzworx.nl</a></td></tr></table></td></tr></table></td></tr></table></body></html>`;
}

export function unsubscribeUrl(email: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzworx.nl';
  const token = Buffer.from(email).toString('base64url');
  return `${siteUrl}/api/email/unsubscribe?token=${token}`;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ id: string } | null> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_xxxx')) {
    console.error('Resend API key not configured');
    return null;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: `Blitzworx <${FROM_EMAIL}>`,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error('Resend send error:', error);
    return null;
  }

  return data ? { id: data.id } : null;
}

export async function sendTemplateEmail(
  to: string,
  templateSlug: string,
  vars: Record<string, string>,
  subscriberId?: string,
): Promise<boolean> {
  if (!supabase) return false;

  // Fetch template
  const { data: template } = await supabase
    .from('email_templates')
    .select('subject, html_body')
    .eq('slug', templateSlug)
    .single();

  if (!template) {
    console.error(`Email template not found: ${templateSlug}`);
    return false;
  }

  const subject = fillTemplate(template.subject, vars);
  const unsub = unsubscribeUrl(to);
  const html = emailShell(fillTemplate(template.html_body, vars), unsub);

  const result = await sendEmail(to, subject, html);
  if (!result) return false;

  // Track the send
  if (subscriberId) {
    await supabase.from('email_sends').insert({
      subscriber_id: subscriberId,
      template_slug: templateSlug,
      resend_id: result.id,
    });
  }

  return true;
}

export async function upsertSubscriber(
  email: string,
  name: string | null,
  source: string,
  sourceDetail?: string,
  tags?: string[],
): Promise<string | null> {
  if (!supabase) return null;

  const emailNorm = email.trim().toLowerCase();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('email_subscribers')
    .select('id, unsubscribed_at')
    .eq('email', emailNorm)
    .single();

  if (existing) {
    // Re-subscribe if previously unsubscribed, add tags
    if (existing.unsubscribed_at) {
      await supabase
        .from('email_subscribers')
        .update({ unsubscribed_at: null })
        .eq('id', existing.id);
    }
    if (tags && tags.length > 0) {
      const { data: current } = await supabase
        .from('email_subscribers')
        .select('tags')
        .eq('id', existing.id)
        .single();
      const merged = Array.from(new Set([...(current?.tags || []), ...tags]));
      await supabase
        .from('email_subscribers')
        .update({ tags: merged })
        .eq('id', existing.id);
    }
    return existing.id;
  }

  // Create new subscriber
  const { data: newSub, error } = await supabase
    .from('email_subscribers')
    .insert({
      email: emailNorm,
      name: name || null,
      source,
      source_detail: sourceDetail || null,
      tags: tags || [],
    })
    .select('id')
    .single();

  if (error) {
    console.error('Subscriber upsert error:', error);
    return null;
  }

  return newSub?.id || null;
}

export async function hasBeenSent(subscriberId: string, templateSlug: string): Promise<boolean> {
  if (!supabase) return false;

  const { count } = await supabase
    .from('email_sends')
    .select('*', { count: 'exact', head: true })
    .eq('subscriber_id', subscriberId)
    .eq('template_slug', templateSlug);

  return (count || 0) > 0;
}
