import { supabase } from "@/lib/supabase";
import type { VisitorRow } from "./types";

interface IpinfoResponse {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  hostname?: string;
  asn?: { asn?: string; name?: string; domain?: string };
  company?: { name?: string; domain?: string; type?: string };
}

const ENRICH_TTL_MS = 24 * 60 * 60 * 1000;

function isStale(visitor: VisitorRow): boolean {
  if (!visitor.enriched_at) return true;
  const age = Date.now() - new Date(visitor.enriched_at).getTime();
  return age > ENRICH_TTL_MS;
}

export async function enrichVisitorIfStale(
  visitor: VisitorRow,
  ip: string | null
): Promise<void> {
  if (!supabase || !ip || !process.env.IPINFO_TOKEN) return;
  if (!isStale(visitor)) return;

  try {
    const res = await fetch(
      `https://ipinfo.io/${encodeURIComponent(ip)}?token=${process.env.IPINFO_TOKEN}`,
      { signal: AbortSignal.timeout(2500) }
    );
    if (!res.ok) return;
    const data = (await res.json()) as IpinfoResponse;

    const companyName =
      data.company?.name ??
      (data.asn?.name && data.company?.type !== "isp" ? data.asn.name : null) ??
      null;
    const companyDomain = data.company?.domain ?? data.asn?.domain ?? null;
    const asn = data.asn?.asn ?? null;

    await supabase
      .from("visitors")
      .update({
        country: data.country ?? visitor.country,
        city: data.city ?? visitor.city,
        region: data.region ?? visitor.region,
        company_name: companyName,
        company_domain: companyDomain,
        asn,
        enriched_at: new Date().toISOString(),
      })
      .eq("visitor_id", visitor.visitor_id);

    visitor.country = data.country ?? visitor.country;
    visitor.city = data.city ?? visitor.city;
    visitor.region = data.region ?? visitor.region;
    visitor.company_name = companyName;
    visitor.company_domain = companyDomain;
    visitor.asn = asn;
  } catch {
    // Enrichment is best-effort; failures should not block tracking.
  }
}
