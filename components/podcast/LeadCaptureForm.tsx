'use client';

import { useState, FormEvent } from 'react';

interface LeadCaptureFormProps {
  slug: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export function LeadCaptureForm({ slug, onSuccess, compact }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/podcasts/${slug}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Er ging iets mis');
      }

      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  }

  if (submitted && !compact) {
    return (
      <div className="p-4 rounded-md border border-[#cacaaa]/30 bg-[#cacaaa]/5 text-center">
        <p className="text-sm text-[#cacaaa] font-medium">Bedankt!</p>
        <p className="text-xs text-[#8b8174] mt-1">Je hebt nu volledige toegang.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-2' : 'space-y-3'}>
      {!compact && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Naam (optioneel)"
          className="w-full min-h-[44px] px-4 py-2.5 rounded-md border border-[#545c52] bg-[#040711] text-[#fefadc] placeholder:text-[#8b8174] focus:border-[#cacaaa] focus:ring-2 focus:ring-[#cacaaa]/30 focus:outline-none text-sm"
        />
      )}
      <div className={compact ? 'flex gap-2' : ''}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mailadres"
          required
          className={`${compact ? 'flex-1' : 'w-full'} min-h-[44px] px-4 py-2.5 rounded-md border border-[#545c52] bg-[#040711] text-[#fefadc] placeholder:text-[#8b8174] focus:border-[#cacaaa] focus:ring-2 focus:ring-[#cacaaa]/30 focus:outline-none text-sm`}
          autoFocus={compact}
        />
        <button
          type="submit"
          disabled={!email || loading}
          className={`min-h-[44px] px-5 py-2.5 bg-[#cacaaa] text-[#040711] font-medium rounded-md hover:bg-[#fefadc] disabled:opacity-50 transition-colors text-sm ${compact ? '' : 'w-full mt-2'}`}
        >
          {loading ? '...' : compact ? 'Ontgrendel' : 'Ontgrendel volledige podcast'}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}
