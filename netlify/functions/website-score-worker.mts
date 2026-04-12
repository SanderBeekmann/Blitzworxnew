import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blitzworx.nl";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return new Response("Supabase not configured", { status: 500 });
  }

  let jobId: string;
  let url: string;

  try {
    const body = await req.json();
    jobId = body.jobId;
    url = body.url;
  } catch {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!jobId || !url) {
    return new Response("Missing jobId or url", { status: 400 });
  }

  // Mark job as processing
  await supabase
    .from("website_score_jobs")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", jobId);

  try {
    // Call the internal analysis endpoint (no timeout pressure here)
    const res = await fetch(`${SITE_URL}/api/tools/website-score/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: "Unknown error" }));
      await supabase
        .from("website_score_jobs")
        .update({
          status: "failed",
          error: errData.error || `HTTP ${res.status}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);
      return new Response("Analysis failed", { status: 200 });
    }

    const result = await res.json();

    // Store completed result
    await supabase
      .from("website_score_jobs")
      .update({
        status: "completed",
        result,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    return new Response("OK", { status: 200 });
  } catch (err: any) {
    await supabase
      .from("website_score_jobs")
      .update({
        status: "failed",
        error: err?.message || "Worker error",
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    return new Response("Worker error", { status: 200 });
  }
}

export const config: Config = {
  path: "/.netlify/functions/website-score-worker",
};
