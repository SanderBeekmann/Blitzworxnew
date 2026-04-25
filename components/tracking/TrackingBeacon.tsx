"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const VISITOR_KEY = "bw_visitor_id";
const SESSION_KEY = "bw_session_id";
const SESSION_LAST_ACTIVITY_KEY = "bw_session_last_activity";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const fresh = generateId();
    localStorage.setItem(VISITOR_KEY, fresh);
    return fresh;
  } catch {
    return generateId();
  }
}

function getOrCreateSessionId(): { sessionId: string; isNew: boolean } {
  try {
    const lastActivity = Number(sessionStorage.getItem(SESSION_LAST_ACTIVITY_KEY) ?? 0);
    const existing = sessionStorage.getItem(SESSION_KEY);
    const stillFresh = existing && Date.now() - lastActivity < SESSION_TIMEOUT_MS;
    if (stillFresh && existing) {
      sessionStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(Date.now()));
      return { sessionId: existing, isNew: false };
    }
    const fresh = generateId();
    sessionStorage.setItem(SESSION_KEY, fresh);
    sessionStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(Date.now()));
    return { sessionId: fresh, isNew: true };
  } catch {
    return { sessionId: generateId(), isNew: true };
  }
}

interface TrackPayload {
  visitor_id: string;
  session_id: string;
  path: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  viewport_w: number | null;
  viewport_h: number | null;
  is_new_session: boolean;
}

function send(payload: TrackPayload): void {
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/track", blob);
      if (ok) return;
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // tracking failures are silent on purpose
  }
}

export function TrackingBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSentPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const fullKey = `${pathname}?${searchParams?.toString() ?? ""}`;
    if (lastSentPathRef.current === fullKey) return;
    lastSentPathRef.current = fullKey;

    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const visitorId = getOrCreateVisitorId();
    const { sessionId, isNew } = getOrCreateSessionId();

    send({
      visitor_id: visitorId,
      session_id: sessionId,
      path: pathname,
      referrer: document.referrer || null,
      utm_source: searchParams?.get("utm_source") ?? null,
      utm_medium: searchParams?.get("utm_medium") ?? null,
      utm_campaign: searchParams?.get("utm_campaign") ?? null,
      utm_term: searchParams?.get("utm_term") ?? null,
      utm_content: searchParams?.get("utm_content") ?? null,
      viewport_w: window.innerWidth,
      viewport_h: window.innerHeight,
      is_new_session: isNew,
    });
  }, [pathname, searchParams]);

  return null;
}
