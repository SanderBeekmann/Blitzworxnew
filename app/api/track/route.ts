import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabase } from "@/lib/supabase";
import { isBot } from "@/lib/tracking/bot-filter";
import { parseUserAgent } from "@/lib/tracking/parse-ua";
import { enrichVisitorIfStale } from "@/lib/tracking/enrich";
import { evaluateNotificationTriggers } from "@/lib/tracking/notification-triggers";
import type { PageVisitRow, TrackPayload, VisitorRow } from "@/lib/tracking/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface NetlifyGeo {
  country?: { code?: string; name?: string };
  city?: string;
  subdivision?: { name?: string };
}

function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? null;
}

function getGeo(req: NextRequest): { country: string | null; city: string | null; region: string | null } {
  const raw = req.headers.get("x-nf-geo");
  if (!raw) return { country: null, city: null, region: null };
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    const geo = JSON.parse(decoded) as NetlifyGeo;
    return {
      country: geo.country?.code ?? geo.country?.name ?? null,
      city: geo.city ?? null,
      region: geo.subdivision?.name ?? null,
    };
  } catch {
    return { country: null, city: null, region: null };
  }
}

function hashIp(ip: string): string {
  const salt = process.env.IP_SALT ?? "";
  return createHash("sha256").update(ip + salt).digest("hex");
}

function isOwnerIp(ipHash: string): boolean {
  const list = (process.env.OWNER_IP_HASHES ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.includes(ipHash);
}

function validatePayload(body: unknown): TrackPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.visitor_id !== "string" || b.visitor_id.length < 8 || b.visitor_id.length > 100) return null;
  if (typeof b.session_id !== "string" || b.session_id.length < 8 || b.session_id.length > 100) return null;
  if (typeof b.path !== "string" || !b.path.startsWith("/") || b.path.length > 500) return null;

  return {
    visitor_id: b.visitor_id,
    session_id: b.session_id,
    path: b.path,
    referrer: typeof b.referrer === "string" && b.referrer.length < 1000 ? b.referrer : null,
    utm_source: typeof b.utm_source === "string" ? b.utm_source.slice(0, 100) : null,
    utm_medium: typeof b.utm_medium === "string" ? b.utm_medium.slice(0, 100) : null,
    utm_campaign: typeof b.utm_campaign === "string" ? b.utm_campaign.slice(0, 100) : null,
    utm_term: typeof b.utm_term === "string" ? b.utm_term.slice(0, 100) : null,
    utm_content: typeof b.utm_content === "string" ? b.utm_content.slice(0, 100) : null,
    viewport_w: typeof b.viewport_w === "number" ? b.viewport_w : null,
    viewport_h: typeof b.viewport_h === "number" ? b.viewport_h : null,
    is_new_session: b.is_new_session === true,
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!supabase) {
    return NextResponse.json({ ok: false, reason: "supabase not configured" }, { status: 503 });
  }

  let payload: TrackPayload | null;
  try {
    payload = validatePayload(await req.json());
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid json" }, { status: 400 });
  }
  if (!payload) {
    return NextResponse.json({ ok: false, reason: "invalid payload" }, { status: 400 });
  }

  if (payload.path.startsWith("/admin") || payload.path.startsWith("/api")) {
    return NextResponse.json({ ok: true, skipped: "internal" });
  }

  const userAgent = req.headers.get("user-agent");
  if (isBot(userAgent)) {
    return NextResponse.json({ ok: true, skipped: "bot" });
  }

  const ip = getClientIp(req);
  const ipHash = ip ? hashIp(ip) : null;
  if (ipHash && isOwnerIp(ipHash)) {
    return NextResponse.json({ ok: true, skipped: "owner" });
  }

  const geo = getGeo(req);
  const ua = parseUserAgent(userAgent);

  const { data: existing } = await supabase
    .from("visitors")
    .select("*")
    .eq("visitor_id", payload.visitor_id)
    .maybeSingle();

  const previous = existing as VisitorRow | null;
  const isNewVisitor = !previous;
  const previousLastSeen = previous?.last_seen_at ?? null;
  const now = new Date().toISOString();

  let visitor: VisitorRow;
  if (isNewVisitor) {
    const insertRow = {
      visitor_id: payload.visitor_id,
      first_seen_at: now,
      last_seen_at: now,
      total_visits: 1,
      total_pageviews: 1,
      ip_hash: ipHash,
      user_agent: userAgent,
      country: geo.country,
      city: geo.city,
      region: geo.region,
      first_referrer: payload.referrer,
      first_utm_source: payload.utm_source,
      first_utm_medium: payload.utm_medium,
      first_utm_campaign: payload.utm_campaign,
      first_landing_path: payload.path,
    };
    const { data: inserted, error } = await supabase
      .from("visitors")
      .insert(insertRow)
      .select("*")
      .single();
    if (error || !inserted) {
      return NextResponse.json({ ok: false, reason: "visitor insert failed" }, { status: 500 });
    }
    visitor = inserted as VisitorRow;
  } else {
    const updateRow = {
      last_seen_at: now,
      total_visits: previous!.total_visits + (payload.is_new_session ? 1 : 0),
      total_pageviews: previous!.total_pageviews + 1,
      ip_hash: ipHash ?? previous!.ip_hash,
      user_agent: userAgent ?? previous!.user_agent,
      country: previous!.country ?? geo.country,
      city: previous!.city ?? geo.city,
      region: previous!.region ?? geo.region,
    };
    const { data: updated, error } = await supabase
      .from("visitors")
      .update(updateRow)
      .eq("visitor_id", payload.visitor_id)
      .select("*")
      .single();
    if (error || !updated) {
      return NextResponse.json({ ok: false, reason: "visitor update failed" }, { status: 500 });
    }
    visitor = updated as VisitorRow;
  }

  const visitInsert = {
    visitor_id: payload.visitor_id,
    session_id: payload.session_id,
    path: payload.path,
    referrer: payload.referrer,
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign,
    utm_term: payload.utm_term,
    utm_content: payload.utm_content,
    device: ua.device,
    browser: ua.browser,
    os: ua.os,
    viewport_w: payload.viewport_w,
    viewport_h: payload.viewport_h,
    country: geo.country,
    city: geo.city,
  };
  const { data: visitData, error: visitError } = await supabase
    .from("page_visits")
    .insert(visitInsert)
    .select("*")
    .single();
  if (visitError || !visitData) {
    return NextResponse.json({ ok: false, reason: "page_visit insert failed" }, { status: 500 });
  }
  const visit = visitData as PageVisitRow;

  if (ip) {
    await enrichVisitorIfStale(visitor, ip);
  }

  const { count: sessionPageviewCount } = await supabase
    .from("page_visits")
    .select("id", { count: "exact", head: true })
    .eq("session_id", payload.session_id);

  await evaluateNotificationTriggers({
    visitor,
    visit,
    isNewVisitor,
    isNewSession: payload.is_new_session,
    previousLastSeen,
    sessionPageviewCount: sessionPageviewCount ?? 1,
  });

  return NextResponse.json({ ok: true });
}
