'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PodcastStatusBadge } from '@/components/podcast/PodcastStatusBadge';
import { formatDurationLong, STATUS_LABELS } from '@/lib/podcasts';
import type { Podcast, PodcastStatus } from '@/lib/podcasts';

type Tab = 'overzicht' | 'content' | 'seo' | 'bronnen' | 'acties';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PodcastDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState<Tab>('overzicht');
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/podcasts/${id}`)
      .then((r) => {
        if (r.status === 401) {
          setAuthenticated(false);
          return null;
        }
        setAuthenticated(true);
        return r.json();
      })
      .then((data) => {
        if (data && !data.error) setPodcast(data);
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error('Login mislukt');
      setAuthenticated(true);
      const podcastRes = await fetch(`/api/admin/podcasts/${id}`);
      const data = await podcastRes.json();
      if (!data.error) setPodcast(data);
    } catch {
      setLoginError('Onjuist wachtwoord');
    } finally {
      setLoginLoading(false);
    }
  }

  async function savePodcast(updates: Partial<Podcast>) {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/podcasts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Kon niet opslaan');
      const data = await res.json();
      setPodcast(data);
      setSuccess('Opgeslagen');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setSaving(false);
    }
  }

  async function publishPodcast() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/podcasts/${id}/publish`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kon niet publiceren');
      }
      const data = await res.json();
      setPodcast(data.podcast);
      setSuccess('Gepubliceerd!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setSaving(false);
    }
  }

  async function deletePodcast() {
    if (!confirm('Weet je zeker dat je deze podcast wilt verwijderen?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/podcasts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Kon niet verwijderen');
      router.push('/admin/podcasts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
      setSaving(false);
    }
  }

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
          {loginError && <p className="mt-2 text-small text-red-600">{loginError}</p>}
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

  if (!podcast) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <p className="text-dry-sage">Podcast niet gevonden</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overzicht', label: 'Overzicht' },
    { key: 'content', label: 'Content' },
    { key: 'seo', label: 'SEO' },
    { key: 'bronnen', label: 'Bronnen' },
    { key: 'acties', label: 'Acties' },
  ];

  return (
    <div className="min-h-screen bg-ink text-cornsilk">
      <div className="container-narrow py-16">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-h2 font-bold text-cornsilk">{podcast.title}</h1>
              <PodcastStatusBadge status={podcast.status} />
            </div>
            <p className="text-small text-grey-olive">{podcast.topic}</p>
          </div>
          <button
            onClick={() => router.push('/admin/podcasts')}
            className="min-h-[44px] px-4 py-2 border border-ebony text-grey-olive rounded-md hover:border-dry-sage hover:text-cornsilk transition-colors text-small"
          >
            Terug naar lijst
          </button>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-md border border-red-900/50 bg-red-900/10 text-red-400 text-small">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-md border border-[#cacaaa]/50 bg-[#cacaaa]/10 text-[#cacaaa] text-small">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-ebony">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-small font-medium transition-colors border-b-2 -mb-[1px] ${
                tab === t.key
                  ? 'border-[#cacaaa] text-[#cacaaa]'
                  : 'border-transparent text-[#8b8174] hover:text-cornsilk'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Overzicht */}
        {tab === 'overzicht' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-md border border-ebony">
                <p className="text-xs text-grey-olive mb-1">Status</p>
                <p className="text-body text-cornsilk">{STATUS_LABELS[podcast.status]}</p>
              </div>
              <div className="p-4 rounded-md border border-ebony">
                <p className="text-xs text-grey-olive mb-1">Aangemaakt</p>
                <p className="text-body text-cornsilk">{formatDate(podcast.created_at)}</p>
              </div>
              {podcast.published_at && (
                <div className="p-4 rounded-md border border-ebony">
                  <p className="text-xs text-grey-olive mb-1">Gepubliceerd</p>
                  <p className="text-body text-cornsilk">{formatDate(podcast.published_at)}</p>
                </div>
              )}
              {podcast.audio_duration && (
                <div className="p-4 rounded-md border border-ebony">
                  <p className="text-xs text-grey-olive mb-1">Duur</p>
                  <p className="text-body text-cornsilk">
                    {formatDurationLong(podcast.audio_duration)}
                  </p>
                </div>
              )}
              <div className="p-4 rounded-md border border-ebony">
                <p className="text-xs text-grey-olive mb-1">Afgespeeld</p>
                <p className="text-body text-cornsilk">{podcast.play_count}x</p>
              </div>
              <div className="p-4 rounded-md border border-ebony">
                <p className="text-xs text-grey-olive mb-1">Downloads</p>
                <p className="text-body text-cornsilk">{podcast.download_count}x</p>
              </div>
            </div>
            {podcast.tags.length > 0 && (
              <div>
                <p className="text-xs text-grey-olive mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {podcast.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded bg-[#545c52]/30 text-[#8b8174]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Content */}
        {tab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="block text-small text-grey-olive mb-2">Titel</label>
              <input
                type="text"
                defaultValue={podcast.title}
                onBlur={(e) => {
                  if (e.target.value !== podcast.title)
                    savePodcast({ title: e.target.value } as Partial<Podcast>);
                }}
                className="w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk focus:border-dry-sage focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-small text-grey-olive mb-2">Beschrijving</label>
              <textarea
                defaultValue={podcast.description || ''}
                onBlur={(e) => {
                  if (e.target.value !== (podcast.description || ''))
                    savePodcast({ description: e.target.value } as Partial<Podcast>);
                }}
                rows={3}
                className="w-full px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk focus:border-dry-sage focus:outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-small text-grey-olive mb-2">Show notes (markdown)</label>
              <textarea
                defaultValue={podcast.show_notes || ''}
                onBlur={(e) => {
                  if (e.target.value !== (podcast.show_notes || ''))
                    savePodcast({ show_notes: e.target.value } as Partial<Podcast>);
                }}
                rows={10}
                className="w-full px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk focus:border-dry-sage focus:outline-none resize-y font-mono text-small"
              />
            </div>
            <div>
              <label className="block text-small text-grey-olive mb-2">Transcript</label>
              <textarea
                defaultValue={podcast.transcript || ''}
                onBlur={(e) => {
                  if (e.target.value !== (podcast.transcript || ''))
                    savePodcast({ transcript: e.target.value } as Partial<Podcast>);
                }}
                rows={10}
                className="w-full px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk focus:border-dry-sage focus:outline-none resize-y font-mono text-small"
              />
            </div>
            {saving && <p className="text-xs text-grey-olive">Opslaan...</p>}
          </div>
        )}

        {/* Tab: SEO */}
        {tab === 'seo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-small text-grey-olive mb-2">SEO Titel</label>
              <input
                type="text"
                defaultValue={podcast.seo_title || ''}
                onBlur={(e) => {
                  if (e.target.value !== (podcast.seo_title || ''))
                    savePodcast({ seo_title: e.target.value } as Partial<Podcast>);
                }}
                placeholder={podcast.title}
                className="w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:outline-none"
              />
              <p className="mt-1 text-xs text-grey-olive">
                {(podcast.seo_title || podcast.title).length}/60 tekens
              </p>
            </div>
            <div>
              <label className="block text-small text-grey-olive mb-2">SEO Beschrijving</label>
              <textarea
                defaultValue={podcast.seo_description || ''}
                onBlur={(e) => {
                  if (e.target.value !== (podcast.seo_description || ''))
                    savePodcast({ seo_description: e.target.value } as Partial<Podcast>);
                }}
                rows={3}
                className="w-full px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk focus:border-dry-sage focus:outline-none resize-y"
              />
              <p className="mt-1 text-xs text-grey-olive">
                {(podcast.seo_description || '').length}/160 tekens
              </p>
            </div>
            <div>
              <label className="block text-small text-grey-olive mb-2">
                Tags (kommagescheiden)
              </label>
              <input
                type="text"
                defaultValue={podcast.tags.join(', ')}
                onBlur={(e) => {
                  const newTags = e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
                  savePodcast({ tags: newTags } as Partial<Podcast>);
                }}
                className="w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk focus:border-dry-sage focus:outline-none"
              />
            </div>
            {saving && <p className="text-xs text-grey-olive">Opslaan...</p>}
          </div>
        )}

        {/* Tab: Bronnen */}
        {tab === 'bronnen' && (
          <div className="space-y-4">
            {podcast.sources.length === 0 ? (
              <p className="text-body text-dry-sage">Nog geen bronnen toegevoegd.</p>
            ) : (
              podcast.sources.map((source, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-md border border-ebony"
                >
                  <span className="text-xs uppercase text-grey-olive w-16 shrink-0">
                    {source.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-small text-cornsilk">{source.title}</p>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-dry-sage hover:text-cornsilk hover:underline truncate block"
                    >
                      {source.url}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Acties */}
        {tab === 'acties' && (
          <div className="space-y-6">
            {podcast.status === 'review' && (
              <div className="p-4 rounded-md border border-[#cacaaa]/30">
                <h3 className="text-small font-medium text-cornsilk mb-2">Publiceren</h3>
                <p className="text-xs text-grey-olive mb-3">
                  Maak de podcast zichtbaar op de website en in de RSS feed.
                </p>
                <button
                  onClick={publishPodcast}
                  disabled={saving}
                  className="min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Publiceren...' : 'Publiceer podcast'}
                </button>
              </div>
            )}

            {podcast.status === 'published' && (
              <div className="p-4 rounded-md border border-ebony">
                <h3 className="text-small font-medium text-cornsilk mb-2">Archiveren</h3>
                <p className="text-xs text-grey-olive mb-3">
                  Verwijder de podcast van de website maar bewaar de data.
                </p>
                <button
                  onClick={() => savePodcast({ status: 'archived' as PodcastStatus } as Partial<Podcast>)}
                  disabled={saving}
                  className="min-h-[44px] px-4 py-2 border border-ebony text-grey-olive rounded-md hover:border-dry-sage hover:text-cornsilk transition-colors text-small"
                >
                  Archiveren
                </button>
              </div>
            )}

            <div className="p-4 rounded-md border border-red-900/30">
              <h3 className="text-small font-medium text-red-400 mb-2">Verwijderen</h3>
              <p className="text-xs text-grey-olive mb-3">
                Dit verwijdert de podcast permanent inclusief alle leads.
              </p>
              <button
                onClick={deletePodcast}
                disabled={saving}
                className="min-h-[44px] px-4 py-2 border border-red-900/50 text-red-400 rounded-md hover:bg-red-900/20 disabled:opacity-50 transition-colors text-small"
              >
                Podcast verwijderen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
