'use client';

import { useState, FormEvent, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { packages, addons, type Package } from '@/components/sections/maintenance/packages';

const PROJECT_STEPS = 5;
const SERVICE_STEPS = 3;

const PROJECT_TYPES = [
  { id: 'website', label: 'Nieuwe website' },
  { id: 'redesign', label: 'Website redesign' },
  { id: 'branding', label: 'Branding / huisstijl' },
  { id: 'fotografie', label: 'Fotografie' },
  { id: 'ai-automatiseringen', label: 'AI-automatiseringen' },
  { id: 'other', label: 'Anders' },
] as const;

type PackageId = Package['id'];
const VALID_PACKAGE_IDS: PackageId[] = ['start', 'groei', 'schaal'];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const DUTCH_DAY_HEADERS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const DUTCH_MONTH_NAMES = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
];

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDate();
  const month = DUTCH_MONTH_NAMES[d.getMonth()];
  return `${day} ${month}`;
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  // Monday = 0, Sunday = 6
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  // Pad to complete last row
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

function ContactOnboardingInner() {
  const searchParams = useSearchParams();
  const pakketParam = searchParams.get('pakket');
  const preselectedPackage = pakketParam && VALID_PACKAGE_IDS.includes(pakketParam as PackageId)
    ? (pakketParam as PackageId)
    : null;
  const hasDiensten = searchParams.has('diensten') || !!preselectedPackage;

  // Mode: 'project' (5 steps) or 'diensten' (3 steps)
  const [mode, setMode] = useState<'project' | 'diensten'>(hasDiensten ? 'diensten' : 'project');
  const totalSteps = mode === 'diensten' ? SERVICE_STEPS : PROJECT_STEPS;

  const [step, setStep] = useState(1);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PackageId | null>(preselectedPackage);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [preferredDate, setPreferredDate] = useState<string | null>(null);
  const [preferredTime, setPreferredTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [hasNavigated, setHasNavigated] = useState(false);
  const [confirmedDate, setConfirmedDate] = useState<string | null>(null);
  const now = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });

  function toggleAddon(name: string) {
    setSelectedAddons((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  const selectedPackageData = selectedPackage ? packages.find((p) => p.id === selectedPackage) : null;

  useEffect(() => {
    if (mode === 'project' && step === 4) {
      const { year, month } = calendarMonth;
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const from = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}-${String(firstDay.getDate()).padStart(2, '0')}`;
      const to = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
      fetch(`/api/availability?from=${from}&to=${to}`)
        .then((r) => r.json())
        .then((data) => setAvailability((prev) => ({ ...prev, ...data })))
        .catch(() => {});
    }
  }, [mode, step, calendarMonth]);

  function validateStep(): boolean {
    const err: Record<string, string> = {};

    if (mode === 'diensten' && step === 1) {
      if (!selectedPackage) err.pakket = 'Kies een pakket';
    }

    if (mode === 'project' && step === 2 || mode === 'diensten' && step === 2) {
      const name = formData.name.trim();
      const email = formData.email.trim();
      const phone = formData.phone.trim();
      if (!name || name.length < 2) err.name = 'Vul een geldige naam in (min. 2 tekens)';
      if (!email) err.email = 'Vul een e-mailadres in';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = 'Vul een geldig e-mailadres in';
      const company = formData.company.trim();
      if (!company || company.length < 2) err.company = 'Vul een bedrijfsnaam in (min. 2 tekens)';
      const digitsOnly = phone.replace(/\D/g, '');
      if (!phone || digitsOnly.length < 9) err.phone = 'Vul een geldig telefoonnummer in (min. 9 cijfers)';
    }

    if (mode === 'project' && step === 3) {
      const msg = formData.message.trim();
      if (!msg || msg.length < 10) err.message = 'Vul een bericht in (min. 10 tekens)';
    }

    if (mode === 'project' && step === 4) {
      if (!preferredDate || !preferredTime) err.slot = 'Kies een datum en tijd voor je gesprek';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleNext() {
    if (mode === 'project' && step === 1 && projectTypes.length === 0) return;
    if (mode === 'project' && step === 1 && projectTypes.includes('other') && otherText.trim().length < 2) return;
    if (mode === 'diensten' && step === 1 && !validateStep()) return;
    if (mode === 'diensten' && step === 1 && !selectedPackage) return;
    if (step === 2 && !validateStep()) return;
    if (mode === 'project' && (step === 3 || step === 4) && !validateStep()) return;
    setDirection('forward');
    setHasNavigated(true);
    if (step < totalSteps) setStep(step + 1);
  }

  function handleBack() {
    setDirection('back');
    setHasNavigated(true);
    if (step > 1) setStep(step - 1);
  }

  async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 3,
    delay = 1500
  ): Promise<Response> {
    let lastError: Error | null = null;
    for (let i = 0; i < retries; i++) {
      const res = await fetch(url, options);
      if (res.status !== 503) return res;
      lastError = new Error(`Service tijdelijk niet beschikbaar (503). Poging ${i + 1}/${retries}.`);
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
    }
    throw lastError ?? new Error('Verzenden mislukt');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep()) return;
    setStatus('submitting');
    try {
      const payload = mode === 'diensten'
        ? {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            company: formData.company.trim(),
            message: (() => {
              const pkg = packages.find((p) => p.id === selectedPackage);
              const base = pkg ? `Pakket: ${pkg.name} (\u20ac${pkg.price}/maand)` : 'Pakket: -';
              const addonLine = selectedAddons.length
                ? `\nAdd-ons: ${selectedAddons.join(', ')}`
                : '';
              return `${base}${addonLine}`;
            })(),
            projectType: `onderhoud-${selectedPackage ?? 'onbekend'}`,
          }
        : {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            company: formData.company.trim(),
            message: formData.message.trim(),
            projectType: projectTypes.map((t) => t === 'other' ? `Anders: ${otherText.trim()}` : t).join(', '),
            preferredDate,
            preferredTime,
          };

      const res = await fetchWithRetry('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Verzenden mislukt');
      setConfirmedDate(preferredDate && preferredTime ? `${formatDisplayDate(preferredDate)} om ${preferredTime}` : null);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setProjectTypes([]);
      setOtherText('');
      setSelectedPackage(null);
      setSelectedAddons([]);
      setPreferredDate(null);
      setPreferredTime(null);
      setStep(1);
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="relative p-8 rounded-lg border border-dry-sage/30 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(202,202,170,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative">
          <Image
            src="/assets/images/sander1.png"
            alt="Sander"
            width={80}
            height={80}
            className="mx-auto mb-4 rounded-full object-cover object-top brightness-[0.85]"
          />
          <p className="text-h3 font-semibold text-cornsilk mb-2">Bedankt!</p>
          {confirmedDate && (
            <p className="text-body text-cornsilk">
              Ik kijk er naar uit om met je in gesprek te gaan op {confirmedDate}!
            </p>
          )}
          <p className="mt-2 text-small italic text-grey-olive">
            Er is een bevestigingsmail verstuurd naar het ingevulde e-mailadres.
          </p>
        </div>
      </div>
    );
  }

  const dates = Object.keys(availability).sort();

  return (
    <div className="relative p-6 md:p-8 rounded-lg border border-dry-sage/20 overflow-hidden">
      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 0%, rgba(202,202,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(84,92,82,0.08) 0%, transparent 50%)',
        }}
        aria-hidden
      />

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-dry-sage/30 rounded-tl-lg pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-dry-sage/30 rounded-br-lg pointer-events-none" aria-hidden />

      <div className="relative">
        <p className="text-caption font-mono tracking-[0.2em] uppercase text-dry-sage/50 mb-2">
          {mode === 'diensten' ? 'Pakket aanvragen' : 'Start je project'}
        </p>
        <h2 className="text-h2 md:text-h2-lg font-bold text-cornsilk">
          {mode === 'diensten' ? 'Welk pakket past bij jou?' : 'Waar kan ik je mee helpen?'}
        </h2>

        <div className="mt-6 h-1 rounded-full bg-ebony/40 overflow-hidden mb-8" aria-hidden>
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${(step / totalSteps) * 100}%`,
              background: 'linear-gradient(90deg, rgba(202,202,170,0.6) 0%, rgba(254,250,220,1) 100%)',
            }}
          />
        </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Step 1: Project type selection (project mode) */}
        {step === 1 && mode === 'project' && (
          <div key="step-1-project" className={`space-y-6 ${hasNavigated ? (direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left') : ''}`}>
            <div className="flex flex-wrap gap-3">
              {PROJECT_TYPES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setProjectTypes((prev) =>
                    prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
                  )}
                  className={`px-4 py-3 rounded-md border font-medium transition-all duration-300 ease-out ${
                    projectTypes.includes(id)
                      ? 'border-cornsilk bg-cornsilk text-ink'
                      : 'border-ebony text-dry-sage hover:border-grey-olive hover:text-cornsilk'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {projectTypes.includes('other') && (
              <div className="mt-4">
                <label htmlFor="onboard-other" className="block text-small font-medium text-dry-sage mb-2">
                  Namelijk:
                </label>
                <input
                  id="onboard-other"
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  className="block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
                  placeholder="Waar kan ik je mee helpen?"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* Step 1: Package + add-ons selection (diensten mode) */}
        {step === 1 && mode === 'diensten' && (
          <div key="step-1-diensten" className={`space-y-6 ${hasNavigated ? (direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left') : ''}`}>
            <div className="space-y-3">
              <p className="text-caption font-mono tracking-[0.2em] uppercase text-grey-olive/60">Pakket</p>
              {packages.map((pkg) => {
                const checked = selectedPackage === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`w-full text-left p-4 rounded-md border transition-all duration-300 ${
                      checked
                        ? 'border-cornsilk bg-cornsilk/5'
                        : 'border-ebony hover:border-grey-olive'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? 'border-cornsilk' : 'border-grey-olive/50'
                      }`}>
                        {checked && <span className="w-2.5 h-2.5 rounded-full bg-cornsilk" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-body font-medium text-cornsilk">{pkg.name}</span>
                          {pkg.badge && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-cornsilk text-ink text-[0.65rem] font-mono tracking-[0.1em] uppercase font-medium">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <span className="block text-caption text-grey-olive/60 mt-0.5">{pkg.pitch}</span>
                      </div>
                      <span className="text-small text-dry-sage/80 shrink-0">&euro;{pkg.price}/mnd</span>
                    </div>
                  </button>
                );
              })}
              {errors.pakket && (
                <p className="text-small text-red-400" role="alert">{errors.pakket}</p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-caption font-mono tracking-[0.2em] uppercase text-grey-olive/60">Add-ons (optioneel)</p>
              {addons.map((addon) => {
                const checked = selectedAddons.includes(addon.name);
                return (
                  <button
                    key={addon.name}
                    type="button"
                    onClick={() => toggleAddon(addon.name)}
                    className={`w-full text-left p-3 rounded-md border transition-all duration-300 ${
                      checked
                        ? 'border-dry-sage/50 bg-dry-sage/5'
                        : 'border-ebony hover:border-grey-olive'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? 'border-dry-sage bg-dry-sage' : 'border-grey-olive/50'
                      }`}>
                        {checked && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M5 12l5 5L20 7" stroke="#040711" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="flex-1 text-small text-cornsilk/90">{addon.name}</span>
                      <span className="text-caption text-dry-sage/70 shrink-0">{addon.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div key="step-2" className={`space-y-4 ${direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
            <div>
              <label htmlFor="onboard-name" className="block text-small font-medium text-dry-sage">
                Naam
              </label>
              <input
                id="onboard-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                autoComplete="name"
                aria-invalid={!!errors.name}
                className="mt-2 block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
                placeholder="Je naam"
              />
              {errors.name && (
                <p className="mt-1 text-small text-red-600" role="alert">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="onboard-company" className="block text-small font-medium text-dry-sage">
                Bedrijfsnaam
              </label>
              <input
                id="onboard-company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData((d) => ({ ...d, company: e.target.value }))}
                autoComplete="organization"
                aria-invalid={!!errors.company}
                className="mt-2 block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
                placeholder="Je bedrijf"
              />
              {errors.company && (
                <p className="mt-1 text-small text-red-600" role="alert">{errors.company}</p>
              )}
            </div>
            <div>
              <label htmlFor="onboard-email" className="block text-small font-medium text-dry-sage">
                E-mail
              </label>
              <input
                id="onboard-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="mt-2 block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
                placeholder="je@email.nl"
              />
              {errors.email && (
                <p className="mt-1 text-small text-red-600" role="alert">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="onboard-phone" className="block text-small font-medium text-dry-sage">
                Telefoonnummer
              </label>
              <input
                id="onboard-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                className="mt-2 block w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
                placeholder="06-12345678"
              />
              {errors.phone && (
                <p className="mt-1 text-small text-red-600" role="alert">{errors.phone}</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && mode === 'project' && (
          <div key="step-3" className={`space-y-4 ${direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
            <div>
              <label htmlFor="onboard-message" className="block text-small font-medium text-dry-sage">
                Bericht
              </label>
              <textarea
                id="onboard-message"
                value={formData.message}
                onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                rows={5}
                aria-invalid={!!errors.message}
                className="mt-2 block w-full min-h-[120px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none resize-y"
                placeholder="Vertel over je project..."
              />
              {errors.message && (
                <p className="mt-1 text-small text-red-600" role="alert">{errors.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 4 && mode === 'project' && (() => {
          const { year, month } = calendarMonth;
          const calDays = getCalendarDays(year, month);
          const todayKey = formatDateKey(new Date());
          const availableDates = new Set(Object.keys(availability));
          const canGoPrev = year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth());
          const maxMonth = now.getMonth() + 2;
          const maxYear = now.getFullYear() + (maxMonth > 11 ? 1 : 0);
          const canGoNext = year < maxYear || (year === maxYear && month < maxMonth % 12);
          const slotsForSelected = preferredDate ? (availability[preferredDate] ?? []) : [];

          return (
            <div key="step-4" className={`space-y-4 ${direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
              <p className="text-body text-dry-sage">
                Kies een datum en tijd voor een vrijblijvend gesprek.
              </p>
              {errors.slot && (
                <p className="text-small text-red-600" role="alert">{errors.slot}</p>
              )}

              {dates.length === 0 ? (
                <p className="text-small text-grey-olive">Laden...</p>
              ) : (
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Calendar */}
                  <div className="space-y-4 flex-1 min-w-0">
                    {/* Calendar header */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          const prev = month === 0 ? 11 : month - 1;
                          const prevYear = month === 0 ? year - 1 : year;
                          setCalendarMonth({ year: prevYear, month: prev });
                        }}
                        disabled={!canGoPrev}
                        className="p-2 text-dry-sage hover:text-cornsilk disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        aria-label="Vorige maand"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <span className="text-body font-semibold text-cornsilk">
                        {DUTCH_MONTH_NAMES[month]} {year}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = month === 11 ? 0 : month + 1;
                          const nextYear = month === 11 ? year + 1 : year;
                          setCalendarMonth({ year: nextYear, month: next });
                        }}
                        disabled={!canGoNext}
                        className="p-2 text-dry-sage hover:text-cornsilk disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        aria-label="Volgende maand"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1">
                      {DUTCH_DAY_HEADERS.map((d) => (
                        <div key={d} className="text-center text-caption font-mono text-grey-olive/50 py-1">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {calDays.map((day, i) => {
                        if (day === null) return <div key={`empty-${i}`} />;

                        const dateKey = formatDateKey(new Date(year, month, day));
                        const isAvailable = availableDates.has(dateKey);
                        const isPast = dateKey < todayKey;
                        const isSelected = preferredDate === dateKey;

                        return (
                          <button
                            key={dateKey}
                            type="button"
                            disabled={!isAvailable || isPast}
                            onClick={() => {
                              setPreferredDate(dateKey);
                              setPreferredTime(null);
                            }}
                            className={`
                              relative aspect-square flex items-center justify-center rounded-md text-small font-medium transition-all duration-200
                              ${isSelected
                                ? 'bg-cornsilk text-ink ring-2 ring-cornsilk/50'
                                : isAvailable && !isPast
                                  ? 'text-cornsilk hover:bg-dry-sage/15 hover:text-cornsilk'
                                  : 'text-grey-olive/30 cursor-not-allowed'
                              }
                            `}
                            style={!isAvailable || isPast ? {
                              backgroundImage:
                                'repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(84,92,82,0.15) 3px, rgba(84,92,82,0.15) 4px)',
                              backgroundColor: 'rgba(84,92,82,0.06)',
                            } : undefined}
                          >
                            {day}
                            {isAvailable && !isPast && !isSelected && (
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-dry-sage/60" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots next to calendar */}
                  {preferredDate && (
                    <div className="md:w-36 md:border-l md:border-ebony/40 md:pl-4 border-t md:border-t-0 border-ebony/40 pt-4 md:pt-0">
                      <p className="text-small font-medium text-dry-sage mb-3">
                        {formatDisplayDate(preferredDate)}
                      </p>
                      <div className="flex flex-wrap md:flex-col gap-2">
                        {slotsForSelected.length === 0 ? (
                          <p className="text-small text-grey-olive">Geen tijden beschikbaar</p>
                        ) : (
                          slotsForSelected.map((time) => {
                            const isTimeSelected = preferredTime === time;
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setPreferredTime(time)}
                                className={`px-4 py-2 rounded-md border text-small font-medium transition-all duration-200 ${
                                  isTimeSelected
                                    ? 'border-cornsilk bg-cornsilk text-ink'
                                    : 'border-ebony text-dry-sage hover:border-dry-sage/50 hover:text-cornsilk'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Diensten confirmation (step 3 in diensten mode) */}
        {step === 3 && mode === 'diensten' && (
          <div key="step-3-diensten" className={`space-y-6 ${direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
            <div className="p-4 rounded-md border border-ebony bg-ink/50 space-y-3">
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Pakket:</span>{' '}
                {selectedPackageData
                  ? `${selectedPackageData.name} (\u20ac${selectedPackageData.price}/mnd)`
                  : '-'}
              </p>
              {selectedAddons.length > 0 && (
                <p className="text-small text-grey-olive">
                  <span className="text-dry-sage">Add-ons:</span> {selectedAddons.join(', ')}
                </p>
              )}
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Naam:</span> {formData.name}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Bedrijf:</span> {formData.company}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">E-mail:</span> {formData.email}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Telefoon:</span> {formData.phone}
              </p>
            </div>
            {status === 'error' && (
              <p className="text-body text-red-600" role="alert">
                Er ging iets mis. Probeer het later opnieuw of mail direct naar sander@blitzworx.nl.
              </p>
            )}
          </div>
        )}

        {/* Project confirmation (step 5 in project mode) */}
        {step === 5 && mode === 'project' && (
          <div key="step-5" className={`space-y-6 ${direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
            <div className="p-4 rounded-md border border-ebony bg-ink/50 space-y-3">
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Project:</span>{' '}
                {projectTypes.map((t) => t === 'other' ? `Anders: ${otherText.trim()}` : (PROJECT_TYPES.find((p) => p.id === t)?.label ?? t)).join(', ') || '-'}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Naam:</span> {formData.name}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Bedrijf:</span> {formData.company}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">E-mail:</span> {formData.email}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Telefoon:</span> {formData.phone}
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Bericht:</span>
                <br />
                <span className="text-cornsilk">{formData.message}</span>
              </p>
              <p className="text-small text-grey-olive">
                <span className="text-dry-sage">Gesprek:</span>{' '}
                {preferredDate && preferredTime
                  ? `${formatDisplayDate(preferredDate)} om ${preferredTime}`
                  : '-'}
              </p>
            </div>
            {status === 'error' && (
              <p className="text-body text-red-600" role="alert">
                Er ging iets mis. Probeer het later opnieuw of mail direct naar sander@blitzworx.nl.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-md border border-ebony text-dry-sage hover:border-grey-olive hover:text-cornsilk transition-colors"
            >
              Terug
            </button>
          ) : (
            <div />
          )}
          <div className="flex-1" />
          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (mode === 'project' && step === 1 && (projectTypes.length === 0 || (projectTypes.includes('other') && otherText.trim().length < 2))) ||
                (mode === 'diensten' && step === 1 && !selectedPackage)
              }
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Volgende
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'submitting' ? 'Verzenden...' : 'Verstuur'}
            </button>
          )}
        </div>
      </form>
      </div>
    </div>
  );
}

export function ContactOnboarding() {
  return (
    <Suspense fallback={null}>
      <ContactOnboardingInner />
    </Suspense>
  );
}
