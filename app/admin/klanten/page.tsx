'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

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
  leads_count: number;
};

const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  prospect: 'Prospect',
  active: 'Actief',
  completed: 'Afgerond',
  archived: 'Gearchiveerd',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminKlantenPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/clients')
      .then((r) => {
        if (r.status === 401) {
          setAuthenticated(false);
          return [];
        }
        setAuthenticated(true);
        return r.json();
      })
      .then((data) => {
        setClients(Array.isArray(data) ? data : []);
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
      const clientsRes = await fetch('/api/admin/clients');
      const clientsData = await clientsRes.json();
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login mislukt');
    } finally {
      setLoginLoading(false);
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

  return (
    <div className="container-narrow py-16">
      <h1 className="text-3xl font-bold text-[#fefadc] mb-8">Klanten</h1>

      {clients.length === 0 ? (
        <p className="text-[#8b8174]">Nog geen klanten.</p>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/admin/klanten/${client.id}`}
              className="block p-6 rounded-lg border border-[#545c52] bg-[#040711]/50 hover:bg-[#545c52]/20 hover:border-[#cacaaa]/30 transition-colors"
            >
              <div className="flex flex-wrap gap-4 justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-[#fefadc]">
                    {client.name}
                  </h2>
                  {client.company_name && (
                    <p className="text-sm text-[#8b8174] mt-0.5">
                      {client.company_name}
                    </p>
                  )}
                  <p className="text-sm text-[#cacaaa] mt-2">
                    <a
                      href={`mailto:${client.email}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {client.email}
                    </a>
                  </p>
                  <p className="text-sm text-[#8b8174] mt-1">
                    <a
                      href={`tel:${client.phone.replace(/\D/g, '')}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {client.phone}
                    </a>
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <span className="inline-block px-3 py-1 rounded-md bg-[#cacaaa]/20 text-[#cacaaa] text-sm font-medium">
                    {CLIENT_STATUS_LABELS[client.status ?? 'prospect']}
                  </span>
                  <span className="block px-3 py-1 rounded-md bg-[#545c52]/50 text-[#8b8174] text-sm">
                    {client.leads_count} {client.leads_count === 1 ? 'project' : 'projecten'}
                  </span>
                  <p className="text-xs text-[#8b8174] mt-2">
                    Sinds {formatDate(client.created_at)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
