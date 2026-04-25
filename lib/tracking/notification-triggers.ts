import { supabase } from "@/lib/supabase";
import type { PageVisitRow, VisitorRow } from "./types";

const HIGH_INTENT_PATHS = ["/contact", "/website-score"];
const RETURN_VISIT_THRESHOLD_MS = 24 * 60 * 60 * 1000;

interface TriggerContext {
  visitor: VisitorRow;
  visit: PageVisitRow;
  isNewVisitor: boolean;
  isNewSession: boolean;
  previousLastSeen: string | null;
  sessionPageviewCount: number;
}

export async function evaluateNotificationTriggers(ctx: TriggerContext): Promise<void> {
  if (!supabase) return;

  const { visitor, visit, isNewVisitor, isNewSession, previousLastSeen, sessionPageviewCount } = ctx;

  const locationLabel = visitor.company_name
    ? visitor.company_name
    : [visitor.city, visitor.country].filter(Boolean).join(", ") || "onbekende locatie";

  const referrerLabel = visit.referrer ? new URL(visit.referrer).hostname : "direct";

  if (isNewVisitor) {
    await createVisitorNotification({
      type: "visitor_first_visit",
      severity: "info",
      title: `Nieuwe bezoeker uit ${locationLabel}`,
      body: `Landde op ${visit.path} via ${referrerLabel}`,
      visitor,
    });
  } else if (
    isNewSession &&
    previousLastSeen &&
    Date.now() - new Date(previousLastSeen).getTime() > RETURN_VISIT_THRESHOLD_MS
  ) {
    const alreadyToday = await visitorHadNotificationToday(visitor.visitor_id, "visitor_returning");
    if (!alreadyToday) {
      await createVisitorNotification({
        type: "visitor_returning",
        severity: "info",
        title: `${locationLabel} is terug op de site`,
        body: `Landde op ${visit.path} via ${referrerLabel}`,
        visitor,
      });
    }
  }

  const isHighIntentPath = HIGH_INTENT_PATHS.some((p) => visit.path.startsWith(p));
  const hasUtmCampaign = !!visit.utm_campaign;
  const hasManyPageviews = sessionPageviewCount >= 3;

  if (isHighIntentPath || hasUtmCampaign || hasManyPageviews) {
    const alreadyForSession = await sessionHadHighIntent(visit.session_id);
    if (!alreadyForSession) {
      const reason = isHighIntentPath
        ? `bezocht ${visit.path}`
        : hasUtmCampaign
          ? `kwam via campagne "${visit.utm_campaign}"`
          : `${sessionPageviewCount} paginas in deze sessie`;
      await createVisitorNotification({
        type: "visitor_high_intent",
        severity: "warning",
        title: `Warm signaal: ${locationLabel}`,
        body: `${reason} - laatst op ${visit.path}`,
        visitor,
        sessionId: visit.session_id,
      });
    }
  }
}

interface CreateNotifArgs {
  type: "visitor_first_visit" | "visitor_returning" | "visitor_high_intent";
  severity: "info" | "warning";
  title: string;
  body: string;
  visitor: VisitorRow;
  sessionId?: string;
}

async function createVisitorNotification(args: CreateNotifArgs): Promise<void> {
  if (!supabase) return;
  await supabase.from("notifications").insert({
    type: args.type,
    title: args.title,
    body: args.body,
    source: args.visitor.visitor_id,
    severity: args.severity,
    action_type: "navigate",
    action_payload: {
      visitorId: args.visitor.visitor_id,
      path: `/bezoekers/${args.visitor.visitor_id}`,
      sessionId: args.sessionId ?? null,
    },
  });
}

async function visitorHadNotificationToday(
  visitorId: string,
  type: string
): Promise<boolean> {
  if (!supabase) return false;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("source", visitorId)
    .eq("type", type)
    .gte("created_at", startOfDay.toISOString());
  return (count ?? 0) > 0;
}

async function sessionHadHighIntent(sessionId: string): Promise<boolean> {
  if (!supabase) return false;
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("type", "visitor_high_intent")
    .contains("action_payload", { sessionId });
  return (count ?? 0) > 0;
}
