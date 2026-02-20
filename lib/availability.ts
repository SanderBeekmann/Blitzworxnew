/**
 * Beschikbaarheid configuratie
 * Avonden 18:00-22:00 (ma-vr), hele weekenddagen
 */

export const EVENING_SLOTS = ['18:00', '19:00', '20:00', '21:00', '22:00'] as const;
export const WEEKEND_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
] as const;

export type TimeSlot = (typeof EVENING_SLOTS)[number] | (typeof WEEKEND_SLOTS)[number];

/** Weekdag 0=zondag, 6=zaterdag */
function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/** Is het een weekenddag? */
function isWeekend(date: Date): boolean {
  const day = getDayOfWeek(date);
  return day === 0 || day === 6;
}

/** Is het een doordeweekse dag (ma-vr)? */
function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

/** Geef alle tijdsloten voor een datum */
export function getSlotsForDate(date: Date): readonly string[] {
  if (isWeekend(date)) {
    return WEEKEND_SLOTS;
  }
  if (isWeekday(date)) {
    return EVENING_SLOTS;
  }
  return [];
}

/** Genereer datums voor de komende N dagen */
export function getDateRange(daysAhead: number, startFrom?: Date): Date[] {
  const dates: Date[] = [];
  const start = startFrom ?? new Date();
  const base = new Date(start);
  base.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

/** Format datum als YYYY-MM-DD */
export function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
