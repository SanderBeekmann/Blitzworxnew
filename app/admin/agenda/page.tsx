'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  preferred_date: string | null;
  preferred_time: string | null;
};

const PROJECT_LABELS: Record<string, string> = {
  website: 'Nieuwe website',
  redesign: 'Website redesign',
  branding: 'Branding / huisstijl',
  other: 'Anders',
};

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

const DUTCH_DAYS = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

function getWeekDates(centerDate: Date): Date[] {
  const dates: Date[] = [];
  const d = new Date(centerDate);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function formatDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getSlotIndex(time: string): number {
  const idx = TIME_SLOTS.indexOf(time);
  return idx >= 0 ? idx : 0;
}

export default function AdminAgendaPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((r) => {
        if (r.status === 401) {
          setAuthenticated(false);
          return [];
        }
        setAuthenticated(true);
        return r.json();
      })
      .then((data) => {
        setLeads(Array.isArray(data) ? data : []);
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Login mislukt');
      setAuthenticated(true);
      const leadsRes = await fetch('/api/admin/leads');
      const leadsData = await leadsRes.json();
      setLeads(Array.isArray(leadsData) ? leadsData : []);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login mislukt');
    } finally {
      setLoginLoading(false);
    }
  }

  const weekDates = getWeekDates(weekStart);
  const scheduledLeads = leads.filter(
    (l) => l.preferred_date && l.preferred_time
  );

  const eventsByDayAndSlot: Record<string, Record<number, Lead[]>> = {};
  weekDates.forEach((d) => {
    const key = formatDateKey(d);
    eventsByDayAndSlot[key] = {};
    TIME_SLOTS.forEach((_, i) => {
      eventsByDayAndSlot[key][i] = [];
    });
  });

  scheduledLeads.forEach((lead) => {
    const date = lead.preferred_date!;
    const time = lead.preferred_time!;
    const slotIdx = getSlotIndex(time);
    if (!eventsByDayAndSlot[date]) {
      eventsByDayAndSlot[date] = {};
    }
    if (!eventsByDayAndSlot[date][slotIdx]) {
      eventsByDayAndSlot[date][slotIdx] = [];
    }
    eventsByDayAndSlot[date][slotIdx].push(lead);
  });

  function prevWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  }

  function nextWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  }

  function goToToday() {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    setWeekStart(d);
  }

  if (loading || authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8b8174]">Laden...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-8">
          <h1 className="text-2xl font-bold text-[#fefadc] mb-6">Admin login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wachtwoord"
            className="w-full min-h-[44px] px-4 py-3 rounded-lg border border-[#545c52] bg-[#040711] text-[#fefadc] placeholder:text-[#8b8174] focus:border-[#cacaaa] focus:ring-2 focus:ring-[#cacaaa]/30 focus:outline-none"
            autoFocus
          />
          {loginError && (
            <p className="mt-2 text-sm text-red-400">{loginError}</p>
          )}
          <button
            type="submit"
            disabled={loginLoading}
            className="mt-4 w-full min-h-[44px] px-6 py-3 bg-[#cacaaa] text-[#040711] font-medium rounded-lg hover:bg-[#fefadc] disabled:opacity-70 transition-colors"
          >
            {loginLoading ? 'Inloggen...' : 'Inloggen'}
          </button>
        </form>
      </div>
    );
  }

  const weekLabel = `${weekDates[0].getDate()} ${weekDates[0].toLocaleDateString('nl-NL', { month: 'short' })} – ${weekDates[6].getDate()} ${weekDates[6].toLocaleDateString('nl-NL', { month: 'short' })} ${weekDates[6].getFullYear()}`;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      <div className="flex-none px-4 sm:px-6 py-4 border-b border-[#545c52] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevWeek}
            className="p-2 rounded-lg text-[#8b8174] hover:bg-[#545c52]/40 hover:text-[#fefadc] transition-colors"
            aria-label="Vorige week"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextWeek}
            className="p-2 rounded-lg text-[#8b8174] hover:bg-[#545c52]/40 hover:text-[#fefadc] transition-colors"
            aria-label="Volgende week"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-[#fefadc] min-w-[220px]">
            {weekLabel}
          </h2>
          <button
            type="button"
            onClick={goToToday}
            className="text-sm text-[#cacaaa] hover:text-[#fefadc] hover:underline"
          >
            Vandaag
          </button>
          <span
            className="text-sm text-[#8b8174] ml-auto"
            title="Koppel met Apple Calendar: zie docs/CALENDAR_FEED.md"
          >
            📅 Koppel Apple Calendar
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">
          {/* Header: time column + day columns */}
          <div className="flex border-b border-[#545c52] sticky top-0 bg-[#040711] z-10">
            <div className="w-14 sm:w-16 flex-shrink-0 border-r border-[#545c52]" />
            {weekDates.map((d) => {
              const isToday = formatDateKey(d) === formatDateKey(new Date());
              return (
                <div
                  key={formatDateKey(d)}
                  className={`flex-1 min-w-[100px] py-3 px-2 text-center border-r border-[#545c52] last:border-r-0 ${
                    isToday ? 'bg-[#cacaaa]/10' : ''
                  }`}
                >
                  <p className="text-xs text-[#8b8174] font-medium">
                    {DUTCH_DAYS[d.getDay()]}
                  </p>
                  <p
                    className={`text-sm font-semibold mt-0.5 ${
                      isToday ? 'text-[#cacaaa]' : 'text-[#fefadc]'
                    }`}
                  >
                    {d.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="flex">
            <div className="w-14 sm:w-16 flex-shrink-0 border-r border-[#545c52]">
              {TIME_SLOTS.map((time) => (
                <div
                  key={time}
                  className="h-14 border-b border-[#545c52]/30 flex items-start justify-end pr-2 pt-0.5"
                >
                  <span className="text-xs text-[#8b8174]">{time}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 flex">
              {weekDates.map((date) => {
                const dateKey = formatDateKey(date);
                const isToday = dateKey === formatDateKey(new Date());
                return (
                  <div
                    key={dateKey}
                    className={`flex-1 min-w-[100px] border-r border-[#545c52] last:border-r-0 ${
                      isToday ? 'bg-[#cacaaa]/5' : ''
                    }`}
                  >
                    {TIME_SLOTS.map((time, slotIdx) => {
                      const events = eventsByDayAndSlot[dateKey]?.[slotIdx] ?? [];
                      return (
                        <div
                          key={time}
                          className="h-14 border-b border-[#545c52]/20 px-1 py-0.5 overflow-y-auto"
                        >
                          {events.map((lead) => (
                            <Link
                              key={lead.id}
                              href="/admin/leads"
                              className="block w-full rounded-lg px-2 py-1.5 text-left overflow-hidden bg-[#cacaaa]/20 hover:bg-[#cacaaa]/30 border-l-[3px] border-[#cacaaa] transition-all hover:shadow-[0_2px_8px_rgba(202,202,170,0.15)] group mb-1 last:mb-0"
                            >
                              <p className="text-xs font-semibold text-[#fefadc] truncate">
                                {lead.name}
                              </p>
                              <p className="text-[10px] text-[#8b8174] truncate mt-0.5">
                                {PROJECT_LABELS[lead.project_type] ?? lead.project_type}
                              </p>
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
