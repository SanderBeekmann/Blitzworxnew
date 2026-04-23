import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  getSlotsForDate,
  getDateRange,
  formatDateKey,
} from '@/lib/availability';

const DAYS_AHEAD = 21;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let startDate: Date;
  let endDate: Date;

  if (from && to) {
    startDate = new Date(from);
    endDate = new Date(to);
  } else {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + DAYS_AHEAD);
  }

  const bookedSet = new Set<string>();
  if (supabase) {
    try {
      const fromKey = formatDateKey(startDate);
      const toKey = formatDateKey(endDate);
      const { data: events, error } = await supabase
        .from('calendar_events')
        .select('datum, start_tijd, status')
        .gte('datum', fromKey)
        .lte('datum', toKey)
        .not('status', 'eq', 'geannuleerd');

      if (!error && events) {
        for (const row of events) {
          if (row.datum && row.start_tijd) {
            const time = String(row.start_tijd).slice(0, 5);
            bookedSet.add(`${row.datum}T${time}`);
          }
        }
      }
    } catch (err) {
      console.error('Supabase availability error:', err);
    }
  }

  try {
    const result: Record<string, string[]> = {};
    const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dates = getDateRange(Math.max(1, daysCount), startDate);

    for (const date of dates) {
      const key = formatDateKey(date);
      const slots = getSlotsForDate(date);
      const available = slots.filter(
        (slot) => !bookedSet.has(`${key}T${slot}`)
      );
      if (available.length > 0) {
        result[key] = [...available];
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('Availability API error:', err);
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    );
  }
}
