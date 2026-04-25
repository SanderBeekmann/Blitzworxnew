export interface VisitorRow {
  id: string;
  visitor_id: string;
  first_seen_at: string;
  last_seen_at: string;
  total_visits: number;
  total_pageviews: number;
  ip_hash: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  company_name: string | null;
  company_domain: string | null;
  asn: string | null;
  enriched_at: string | null;
  first_referrer: string | null;
  first_utm_source: string | null;
  first_utm_medium: string | null;
  first_utm_campaign: string | null;
  first_landing_path: string | null;
  lead_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface PageVisitRow {
  id: string;
  visitor_id: string;
  session_id: string;
  path: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  viewport_w: number | null;
  viewport_h: number | null;
  country: string | null;
  city: string | null;
  duration_ms: number | null;
  created_at: string;
}

export interface TrackPayload {
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
