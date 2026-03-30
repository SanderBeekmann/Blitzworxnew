'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PodcastGenerationProgress } from '@/components/podcast/PodcastGenerationProgress';
import type { PodcastSource } from '@/lib/podcasts';

const STEPS = [
  'Onderwerp',
  'Bronnen',
  'Selecteren',
  'Genereren',
  'Review',
  'Publiceren',
];

export default function NewPodcastPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 0: Topic
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState('');

  // Step 1-2: Sources
  const [sources, setSources] = useState<PodcastSource[]>([]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceType, setSourceType] = useState<PodcastSource['type']>('article');
  const [enabledSources, setEnabledSources] = useState<Set<number>>(new Set());

  // Created podcast
  const [podcastId, setPodcastId] = useState<string | null>(null);

  // Step 4: Review
  const [showNotes, setShowNotes] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Auth state
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Check auth on mount
  useState(() => {
    fetch('/api/admin/podcasts')
      .then((r) => {
        setAuthenticated(r.status !== 401);
      })
      .catch(() => setAuthenticated(false));
  });

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
    } catch {
      setLoginError('Onjuist wachtwoord');
    } finally {
      setLoginLoading(false);
    }
  }

  async function createPodcast() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/podcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          topic,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kon podcast niet aanmaken');
      }
      const podcast = await res.json();
      setPodcastId(podcast.id);
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  }

  function addSource() {
    if (!sourceUrl || !sourceTitle) return;
    const newSources = [...sources, { type: sourceType, url: sourceUrl, title: sourceTitle }];
    setSources(newSources);
    setEnabledSources((prev) => new Set([...Array.from(prev), newSources.length - 1]));
    setSourceUrl('');
    setSourceTitle('');
  }

  function toggleSource(index: number) {
    setEnabledSources((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  async function saveSources() {
    if (!podcastId) return;
    setLoading(true);
    setError('');
    try {
      const selectedSources = sources.filter((_, i) => enabledSources.has(i));
      const res = await fetch(`/api/admin/podcasts/${podcastId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: selectedSources }),
      });
      if (!res.ok) throw new Error('Kon bronnen niet opslaan');
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  }

  async function startGeneration() {
    if (!podcastId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/podcasts/${podcastId}/generate`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kon generatie niet starten');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
      setLoading(false);
    }
  }

  async function saveReview() {
    if (!podcastId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/podcasts/${podcastId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          show_notes: showNotes,
          seo_title: seoTitle,
          seo_description: seoDescription,
        }),
      });
      if (!res.ok) throw new Error('Kon wijzigingen niet opslaan');
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  }

  async function publishPodcast() {
    if (!podcastId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/podcasts/${podcastId}/publish`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kon podcast niet publiceren');
      }
      router.push('/admin/podcasts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  }

  if (authenticated === null) {
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

  return (
    <div className="min-h-screen bg-ink text-cornsilk">
      <div className="container-narrow py-16 max-w-2xl mx-auto">
        <h1 className="text-hero font-bold text-cornsilk mb-2">Nieuwe podcast</h1>

        {/* Step indicator */}
        <div className="flex gap-1 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= step ? 'bg-[#cacaaa]' : 'bg-[#545c52]/40'
                }`}
              />
              <p
                className={`text-xs mt-1 ${
                  i === step ? 'text-[#cacaaa]' : 'text-[#8b8174]'
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md border border-red-900/50 bg-red-900/10 text-red-400 text-small">
            {error}
          </div>
        )}

        {/* Step 0: Topic & Title */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-small text-grey-olive mb-2">Titel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Bijv. De toekomst van webdesign in 2026"
                className="w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-small text-grey-olive mb-2">Onderwerp</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Beschrijf het onderwerp dat je wilt behandelen..."
                rows={3}
                className="w-full px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-small text-grey-olive mb-2">
                Tags (kommagescheiden)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="webdesign, trends, 2026"
                className="w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none"
              />
            </div>
            <button
              onClick={createPodcast}
              disabled={!title || !topic || loading}
              className="min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-50 transition-colors"
            >
              {loading ? 'Aanmaken...' : 'Verder'}
            </button>
          </div>
        )}

        {/* Step 1: Add sources */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-body text-dry-sage">
              Voeg bronnen toe die als basis dienen voor de podcast. Dit kunnen YouTube
              {" video's"}, artikelen of andere bronnen zijn.
            </p>

            <div className="space-y-3 p-4 rounded-md border border-ebony">
              <div className="flex gap-2">
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as PodcastSource['type'])}
                  className="min-h-[44px] px-3 py-2 rounded-md border border-ebony bg-ink text-cornsilk text-small focus:border-dry-sage focus:outline-none"
                >
                  <option value="youtube">YouTube</option>
                  <option value="article">Artikel</option>
                  <option value="other">Anders</option>
                </select>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="URL"
                  className="flex-1 min-h-[44px] px-4 py-2 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:outline-none text-small"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  placeholder="Titel van de bron"
                  className="flex-1 min-h-[44px] px-4 py-2 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:outline-none text-small"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSource();
                    }
                  }}
                />
                <button
                  onClick={addSource}
                  disabled={!sourceUrl || !sourceTitle}
                  className="min-h-[44px] px-4 py-2 bg-[#545c52]/40 text-cornsilk rounded-md hover:bg-[#545c52]/60 disabled:opacity-50 transition-colors text-small"
                >
                  Toevoegen
                </button>
              </div>
            </div>

            {sources.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-small text-grey-olive">
                  {sources.length} bron{sources.length !== 1 ? 'nen' : ''} toegevoegd
                </h3>
                {sources.map((source, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-md border border-ebony text-small"
                  >
                    <span className="text-xs uppercase text-grey-olive w-16 shrink-0">
                      {source.type}
                    </span>
                    <span className="text-cornsilk truncate flex-1">{source.title}</span>
                    <button
                      onClick={() => setSources(sources.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-300 text-xs shrink-0"
                    >
                      Verwijder
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="min-h-[44px] px-6 py-3 border border-ebony text-grey-olive rounded-md hover:border-dry-sage hover:text-cornsilk transition-colors"
              >
                Terug
              </button>
              <button
                onClick={() => {
                  setEnabledSources(new Set(sources.map((_, i) => i)));
                  setStep(2);
                }}
                disabled={sources.length === 0}
                className="min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-50 transition-colors"
              >
                Verder
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select sources */}
        {step === 2 && (
          <div className="space-y-6">
            <p className="text-body text-dry-sage">
              Selecteer welke bronnen je wilt gebruiken voor de podcast.
            </p>

            <div className="space-y-2">
              {sources.map((source, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                    enabledSources.has(i)
                      ? 'border-[#cacaaa] bg-[#cacaaa]/5'
                      : 'border-ebony opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={enabledSources.has(i)}
                    onChange={() => toggleSource(i)}
                    className="w-4 h-4 rounded border-ebony bg-ink accent-[#cacaaa]"
                  />
                  <span className="text-xs uppercase text-grey-olive w-16 shrink-0">
                    {source.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-small text-cornsilk truncate">{source.title}</p>
                    <p className="text-xs text-grey-olive truncate">{source.url}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="min-h-[44px] px-6 py-3 border border-ebony text-grey-olive rounded-md hover:border-dry-sage hover:text-cornsilk transition-colors"
              >
                Terug
              </button>
              <button
                onClick={saveSources}
                disabled={enabledSources.size === 0 || loading}
                className="min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-50 transition-colors"
              >
                {loading ? 'Opslaan...' : 'Bronnen opslaan en genereren'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generate */}
        {step === 3 && (
          <div className="space-y-6">
            {!loading ? (
              <>
                <p className="text-body text-dry-sage">
                  Klaar om de podcast te genereren via NotebookLM. Dit duurt 2-10 minuten.
                </p>
                <button
                  onClick={startGeneration}
                  className="min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk transition-colors"
                >
                  Start generatie
                </button>
              </>
            ) : (
              podcastId && (
                <PodcastGenerationProgress
                  podcastId={podcastId}
                  onComplete={() => {
                    setLoading(false);
                    setStep(4);
                  }}
                  onError={(msg) => {
                    setLoading(false);
                    setError(msg);
                  }}
                />
              )
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-body text-dry-sage mb-4">
              De podcast is gegenereerd! Bewerk de show notes en SEO-instellingen.
            </p>

            <div>
              <label className="block text-small text-grey-olive mb-2">Show notes (markdown)</label>
              <textarea
                value={showNotes}
                onChange={(e) => setShowNotes(e.target.value)}
                rows={8}
                placeholder="Schrijf de show notes voor deze aflevering..."
                className="w-full px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none resize-y text-small font-mono"
              />
            </div>

            <div>
              <label className="block text-small text-grey-olive mb-2">SEO Titel</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title}
                className="w-full min-h-[44px] px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-small text-grey-olive mb-2">SEO Beschrijving</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                placeholder="Korte beschrijving voor zoekmachines..."
                className="w-full px-4 py-3 rounded-md border border-ebony bg-ink text-cornsilk placeholder:text-grey-olive focus:border-dry-sage focus:ring-2 focus:ring-dry-sage/30 focus:outline-none resize-y"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="min-h-[44px] px-6 py-3 border border-ebony text-grey-olive rounded-md hover:border-dry-sage hover:text-cornsilk transition-colors"
              >
                Terug
              </button>
              <button
                onClick={saveReview}
                disabled={loading}
                className="min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-50 transition-colors"
              >
                {loading ? 'Opslaan...' : 'Verder naar publicatie'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Publish */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="p-6 rounded-md border border-[#cacaaa]/30 bg-[#cacaaa]/5">
              <h2 className="text-h3 font-semibold text-cornsilk mb-2">{title}</h2>
              <p className="text-small text-grey-olive mb-4">{topic}</p>
              <p className="text-body text-dry-sage">
                Bij publicatie wordt deze podcast zichtbaar op de website en wordt automatisch
                een blogpost aangemaakt. De podcast verschijnt ook in de RSS feed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="min-h-[44px] px-6 py-3 border border-ebony text-grey-olive rounded-md hover:border-dry-sage hover:text-cornsilk transition-colors"
              >
                Terug
              </button>
              <button
                onClick={publishPodcast}
                disabled={loading}
                className="min-h-[44px] px-6 py-3 bg-dry-sage text-ink font-medium rounded-md hover:bg-cornsilk disabled:opacity-50 transition-colors"
              >
                {loading ? 'Publiceren...' : 'Publiceer podcast'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
