'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

type Phase =
  | 'lead'
  | 'contact_opgenomen'
  | 'offerte_verzonden'
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
  phase: Phase | null;
  notes: string | null;
};

type ClientStatus = 'prospect' | 'active' | 'completed' | 'archived';

type Client = {
  id: string;
  email: string;
  name: string;
  phone: string;
  company_name: string | null;
  notes: string | null;
  status: ClientStatus | null;
  created_at: string;
  leads: Lead[];
};

const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  prospect: 'Prospect',
  active: 'Actief',
  completed: 'Afgerond',
  archived: 'Gearchiveerd',
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
  offerte_verzonden: 'Offerte verzonden',
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

export default function AdminKlantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const clientId = params.id;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ClientStatus>('prospect');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    fetch(`/api/admin/clients/${clientId}`)
      .then((r) => {
        if (r.status === 401) {
          setAuthenticated(false);
          return null;
        }
        if (r.status === 404) return null;
        setAuthenticated(true);
        return r.json();
      })
      .then((data) => {
        setClient(data);
        if (data) {
          setCompanyName(data.company_name ?? '');
          setNotes(data.notes ?? '');
          setStatus((data.status as ClientStatus) ?? 'prospect');
        }
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, [clientId]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName, notes, status }),
      });
      if (!res.ok) throw new Error('Opslaan mislukt');
      setClient((prev) =>
        prev ? { ...prev, company_name: companyName, notes, status } : null
      );
    } finally {
      setSaving(false);
    }
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
        <p className="text-[#8b8174]">Log in via de Leads of Agenda pagina.</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container-narrow py-16">
        <p className="text-[#8b8174]">Klant niet gevonden.</p>
        <Link href="/admin/klanten" className="mt-4 inline-block text-[#cacaaa] hover:underline">
          ← Terug naar klanten
        </Link>
      </div>
    );
  }

  return (
    <div className="container-narrow py-16">
      <Link
        href="/admin/klanten"
        className="inline-block text-sm text-[#8b8174] hover:text-[#cacaaa] mb-6"
      >
        ← Terug naar klanten
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="flex flex-wrap gap-3 items-center">
            <h1 className="text-3xl font-bold text-[#fefadc]">{client.name}</h1>
            <select
              value={status}
              onChange={(e) => {
                const v = e.target.value as ClientStatus;
                setStatus(v);
                fetch(`/api/admin/clients/${clientId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: v, company_name: companyName, notes }),
                }).then((r) => {
                  if (r.ok) setClient((prev) => (prev ? { ...prev, status: v } : null));
                });
              }}
              className="px-3 py-1.5 rounded-lg border border-[#545c52] bg-[#040711] text-[#fefadc] text-sm font-medium focus:border-[#cacaaa] focus:outline-none"
            >
              {(Object.entries(CLIENT_STATUS_LABELS) as [ClientStatus, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[#cacaaa] mt-2">
            <a href={`mailto:${client.email}`} className="hover:underline">
              {client.email}
            </a>
          </p>
          <p className="text-[#8b8174] mt-1">
            <a href={`tel:${client.phone.replace(/\D/g, '')}`} className="hover:underline">
              {client.phone}
            </a>
          </p>
          <p className="text-xs text-[#8b8174] mt-4">
            Klant sinds {formatDate(client.created_at)}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8b8174] mb-2">
              Bedrijfsnaam
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Optioneel"
              className="w-full px-4 py-3 rounded-lg border border-[#545c52] bg-[#040711] text-[#fefadc] placeholder:text-[#8b8174] focus:border-[#cacaaa] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8b8174] mb-2">
              Notities
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interne notities over deze klant..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-[#545c52] bg-[#040711] text-[#fefadc] placeholder:text-[#8b8174] focus:border-[#cacaaa] focus:outline-none resize-y"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-[#cacaaa] text-[#040711] font-medium hover:bg-[#fefadc] disabled:opacity-70 transition-colors"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold text-[#fefadc] mb-4">
        Projecten ({client.leads.length})
      </h2>

      {client.leads.length === 0 ? (
        <p className="text-[#8b8174]">Nog geen projecten.</p>
      ) : (
        <div className="space-y-4">
          {client.leads.map((lead) => (
            <Link
              key={lead.id}
              href="/admin/leads"
              className="block p-6 rounded-lg border border-[#545c52] bg-[#040711]/50 hover:bg-[#545c52]/20 transition-colors"
            >
              <div className="flex flex-wrap gap-4 justify-between items-start">
                <div>
                  <p className="font-medium text-[#fefadc]">
                    {PROJECT_LABELS[lead.project_type] ?? lead.project_type}
                  </p>
                  <p className="text-sm text-[#8b8174] mt-1">
                    {formatDate(lead.created_at)}
                  </p>
                  {lead.preferred_date && lead.preferred_time && (
                    <p className="text-sm text-[#cacaaa] mt-1">
                      Gesprek: {lead.preferred_date} om {lead.preferred_time}
                    </p>
                  )}
                </div>
                <span className="px-3 py-1 rounded-md bg-[#cacaaa]/20 text-[#cacaaa] text-sm">
                  {PHASE_LABELS[lead.phase ?? 'lead']}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#8b8174] line-clamp-2">
                {lead.message}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
