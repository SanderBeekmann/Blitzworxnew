'use client';

import { useState, useEffect, FormEvent } from 'react';

type Phase =
  | 'lead'
  | 'contact_opgenomen'
  | 'offerte_aangevraagd'
  | 'offerte_verzonden'
  | 'onderhandeling'
  | 'gewonnen'
  | 'verloren';

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  project_type: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: 'new' | 'contacted' | 'completed';
  phase: Phase | null;
  notes: string | null;
};

const PROJECT_LABELS: Record<string, string> = {
  website: 'Nieuwe website',
  redesign: 'Website redesign',
  branding: 'Branding / huisstijl',
  other: 'Anders',
};

const PHASE_LABELS: Record<Phase, string> = {
  lead: 'Nieuw',
  contact_opgenomen: 'Contact opgenomen',
  offerte_aangevraagd: 'Offerte aangevraagd',
  offerte_verzonden: 'Offerte verzonden',
  onderhandeling: 'Onderhandeling',
  gewonnen: 'Gewonnen',
  verloren: 'Verloren',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPhase(lead: Lead): Phase {
  if (lead.phase && lead.phase in PHASE_LABELS) return lead.phase as Phase;
  if (lead.status === 'new') return 'lead';
  if (lead.status === 'contacted') return 'contact_opgenomen';
  if (lead.status === 'completed') return 'gewonnen';
  return 'lead';
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [filterPhase, setFilterPhase] = useState<Phase | 'all'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function updatePhase(id: string, phase: Phase) {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase }),
    });
    if (!res.ok) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, phase } : l))
    );
  }

  async function updateNotes(id: string, notes: string) {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, notes } : l))
    );
  }

  async function deleteLead(id: string) {
    if (!confirm('Weet je zeker dat je deze lead wilt verwijderen?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) return;
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  const filteredLeads =
    filterPhase === 'all'
      ? leads
      : leads.filter((l) => getPhase(l) === filterPhase);

  if (loading || authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <p className="text-dry-sage">Laden...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-8">
          <h1 className="text-h2 font-bold text-cornsilk mb-6">Admin login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wachtwoord"
            className="w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
            autoFocus
          />
          {loginError && (
            <p className="mt-2 text-small text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            disabled={loginLoading}
            className="mt-4 w-full min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-70 transition-colors"
          >
            {loginLoading ? 'Inloggen...' : 'Inloggen'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cornsilk">
      <div className="container-narrow py-16">
        <h1 className="text-hero font-bold text-cornsilk mb-8">Leads</h1>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterPhase('all')}
            className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
              filterPhase === 'all'
                ? 'bg-dry-sage text-ink'
                : 'border border-ebony text-grey-olive hover:border-dry-sage hover:text-cornsilk'
            }`}
          >
            Alle ({leads.length})
          </button>
          {(Object.keys(PHASE_LABELS) as Phase[]).map((phase) => {
            const count = leads.filter((l) => getPhase(l) === phase).length;
            return (
              <button
                key={phase}
                onClick={() => setFilterPhase(phase)}
                className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
                  filterPhase === phase
                    ? 'bg-dry-sage text-ink'
                    : 'border border-ebony text-grey-olive hover:border-dry-sage hover:text-cornsilk'
                }`}
              >
                {PHASE_LABELS[phase]} ({count})
              </button>
            );
          })}
        </div>

        {filteredLeads.length === 0 ? (
          <p className="text-body text-dry-sage">
            {leads.length === 0 ? 'Nog geen leads.' : 'Geen leads in deze fase.'}
          </p>
        ) : (
          <div className="space-y-6">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="p-6 rounded-md border border-ebony bg-ink/50"
              >
                <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
                  <div>
                    <h2 className="text-h3 font-semibold text-cornsilk">
                      {lead.name}
                    </h2>
                    <p className="text-small text-grey-olive mt-1">
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={getPhase(lead)}
                      onChange={(e) =>
                        updatePhase(lead.id, e.target.value as Phase)
                      }
                      className="px-4 py-2 rounded-md border border-ebony bg-ink text-cornsilk text-small focus:border-dry-sage focus:outline-none"
                    >
                      {(Object.entries(PHASE_LABELS) as [Phase, string][]).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={() => deleteLead(lead.id)}
                      disabled={deletingId === lead.id}
                      className="px-3 py-2 rounded-md text-small text-red-400 border border-red-900/50 hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                    >
                      {deletingId === lead.id ? '…' : 'Verwijderen'}
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-small">
                  <p>
                    <span className="text-grey-olive">Project:</span>{' '}
                    {PROJECT_LABELS[lead.project_type] ?? lead.project_type}
                  </p>
                  <p>
                    <span className="text-grey-olive">E-mail:</span>{' '}
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-dry-sage hover:text-cornsilk hover:underline"
                    >
                      {lead.email}
                    </a>
                  </p>
                  <p>
                    <span className="text-grey-olive">Telefoon:</span>{' '}
                    <a
                      href={`tel:${lead.phone.replace(/\s/g, '')}`}
                      className="text-dry-sage hover:text-cornsilk hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </p>
                  {lead.preferred_date && lead.preferred_time && (
                    <p>
                      <span className="text-grey-olive">Gesprek:</span>{' '}
                      {lead.preferred_date} om {lead.preferred_time}
                    </p>
                  )}
                </div>

                <p className="mt-4 text-body text-dry-sage whitespace-pre-wrap">
                  {lead.message}
                </p>

                <div className="mt-4">
                  <label className="block text-small text-grey-olive mb-2">
                    Notities
                  </label>
                  <textarea
                    defaultValue={lead.notes ?? ''}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v !== (lead.notes ?? '')) updateNotes(lead.id, v);
                    }}
                    placeholder="Interne notities over deze lead..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive/60 focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none text-small resize-y"
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
