import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { runFullAnalysis } from "../../lib/website-score-analysis.js";

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
    // Run analysis directly (15 min timeout in background function)
    const result = await runFullAnalysis(url);

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
    console.error("Worker analysis failed:", err);

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
  path: "/.netlify/functions/website-score-worker-background",
};
