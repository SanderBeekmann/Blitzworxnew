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
      const { data: bookedSlots, error } = await supabase
        .from('leads')
        .select('preferred_date, preferred_time')
        .not('preferred_date', 'is', null)
        .not('preferred_time', 'is', null);

      if (!error && bookedSlots) {
        for (const row of bookedSlots) {
          if (row.preferred_date && row.preferred_time) {
            bookedSet.add(`${row.preferred_date}T${row.preferred_time}`);
          }
        }
      }
    } catch (err) {
      console.error('Supabase availability error:', err);
    }
  }

  try {

    const result: Record<string, string[]> = {};
    const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
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
