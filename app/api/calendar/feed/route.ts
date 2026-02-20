import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const PROJECT_LABELS: Record<string, string> = {
  website: 'Nieuwe website',
  redesign: 'Website redesign',
  branding: 'Branding / huisstijl',
  other: 'Anders',
};

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function formatIcsDateTime(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const expected = process.env.CALENDAR_FEED_TOKEN;

  if (!expected || token !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 });
  }

  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('id, name, email, project_type, preferred_date, preferred_time, message')
      .not('preferred_date', 'is', null)
      .not('preferred_time', 'is', null)
      .order('preferred_date', { ascending: true })
      .order('preferred_time', { ascending: true });

    if (error) {
      console.error('Calendar feed error:', error);
      return NextResponse.json({ error: 'Kon agenda niet ophalen' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzworx.nl';
    const now = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Blitzworx//Agenda//NL',
      'CALSCALE:GREGORIAN',
      'X-WR-CALNAME:Blitzworx Gesprekken',
    ].join('\r\n');

    for (const lead of leads ?? []) {
      const projectLabel = PROJECT_LABELS[lead.project_type] ?? lead.project_type;
      const summary = `${escapeIcsText(lead.name)} – ${escapeIcsText(projectLabel)}`;
      const desc = `Lead: ${escapeIcsText(lead.name)}\\nProject: ${escapeIcsText(projectLabel)}\\nE-mail: ${escapeIcsText(lead.email)}${lead.message ? `\\nBericht: ${escapeIcsText(lead.message.slice(0, 200))}` : ''}`;

      const dtStart = formatIcsDateTime(lead.preferred_date!, lead.preferred_time!);
      const [h, m] = lead.preferred_time!.split(':').map(Number);
      const endH = h < 23 ? h + 1 : 23;
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dtEnd = formatIcsDateTime(lead.preferred_date!, `${pad(endH)}:${pad(m)}`);

      ics += [
        '',
        'BEGIN:VEVENT',
        `UID:${lead.id}@blitzworx.nl`,
        `DTSTAMP:${now}`,
        `DTSTART;TZID=Europe/Amsterdam:${dtStart}`,
        `DTEND;TZID=Europe/Amsterdam:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${desc}`,
        'END:VEVENT',
      ].join('\r\n');
    }

    ics += '\r\nEND:VCALENDAR';

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'inline; filename="blitzworx-gesprekken.ics"',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err) {
    console.error('Calendar feed error:', err);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
