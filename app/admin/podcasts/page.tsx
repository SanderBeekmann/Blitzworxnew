'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { PodcastStatusBadge } from '@/components/podcast/PodcastStatusBadge';
import { formatDurationLong, STATUS_LABELS } from '@/lib/podcasts';
import type { Podcast, PodcastStatus } from '@/lib/podcasts';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminPodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<PodcastStatus | 'all'>('all');

  useEffect(() => {
    fetch('/api/admin/podcasts')
      .then((r) => {
        if (r.status === 401) {
          setAuthenticated(false);
          return [];
        }
        setAuthenticated(true);
        return r.json();
      })
      .then((data) => {
        setPodcasts(Array.isArray(data) ? data : []);
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
      const podcastsRes = await fetch('/api/admin/podcasts');
      const podcastsData = await podcastsRes.json();
      setPodcasts(Array.isArray(podcastsData) ? podcastsData : []);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login mislukt');
    } finally {
      setLoginLoading(false);
    }
  }

  const filteredPodcasts =
    filterStatus === 'all'
      ? podcasts
      : podcasts.filter((p) => p.status === filterStatus);

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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-hero font-bold text-cornsilk">Podcasts</h1>
          <Link
            href="/admin/podcasts/new"
            className="inline-flex items-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            Nieuwe podcast
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-dry-sage text-ink'
                : 'border border-ebony text-grey-olive hover:border-dry-sage hover:text-cornsilk'
            }`}
          >
            Alle ({podcasts.length})
          </button>
          {(Object.keys(STATUS_LABELS) as PodcastStatus[]).map((status) => {
            const count = podcasts.filter((p) => p.status === status).length;
            if (count === 0) return null;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-dry-sage text-ink'
                    : 'border border-ebony text-grey-olive hover:border-dry-sage hover:text-cornsilk'
                }`}
              >
                {STATUS_LABELS[status]} ({count})
              </button>
            );
          })}
        </div>

        {filteredPodcasts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-body text-dry-sage mb-4">
              {podcasts.length === 0
                ? 'Nog geen podcasts. Maak je eerste podcast aan!'
                : 'Geen podcasts met deze status.'}
            </p>
            {podcasts.length === 0 && (
              <Link
                href="/admin/podcasts/new"
                className="inline-flex items-center min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk transition-colors"
              >
                Eerste podcast aanmaken
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPodcasts.map((podcast) => (
              <Link
                key={podcast.id}
                href={`/admin/podcasts/${podcast.id}`}
                className="block p-6 rounded-md border border-ebony bg-ink/50 hover:border-dry-sage transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-h3 font-semibold text-cornsilk truncate">
                        {podcast.title}
                      </h2>
                      <PodcastStatusBadge status={podcast.status} />
                    </div>
                    <p className="text-small text-grey-olive mb-2">
                      {podcast.topic}
                    </p>
                    {podcast.description && (
                      <p className="text-small text-dry-sage line-clamp-2">
                        {podcast.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-small text-grey-olive shrink-0">
                    <p>{formatDate(podcast.created_at)}</p>
                    {podcast.audio_duration && (
                      <p className="mt-1">{formatDurationLong(podcast.audio_duration)}</p>
                    )}
                    {podcast.status === 'published' && (
                      <p className="mt-1">
                        {podcast.play_count} plays - {podcast.download_count} downloads
                      </p>
                    )}
                  </div>
                </div>
                {podcast.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {podcast.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded bg-[#545c52]/30 text-[#8b8174]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
