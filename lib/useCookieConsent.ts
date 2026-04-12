'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'blitzworx-cookie-consent';

type ConsentState = boolean | null;

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setConsent(stored === 'true');
    }
    setLoaded(true);
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setConsent(true);
  }, []);

  const decline = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'false');
    setConsent(false);
  }, []);

  return { consent, loaded, accept, decline };
}
