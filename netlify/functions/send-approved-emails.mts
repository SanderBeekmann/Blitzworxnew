import type { Config } from "@netlify/functions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blitzworx.nl";
const CRON_SECRET = process.env.CRON_SECRET;

export default async function handler() {
  if (!CRON_SECRET) {
    return new Response("CRON_SECRET not configured", { status: 500 });
  }

  const res = await fetch(
    `${SITE_URL}/api/cron/send-approved-emails?secret=${CRON_SECRET}`
  );

  const data = await res.json();
  console.log("Send approved emails cron result:", data);

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

export const config: Config = {
  // Elk uur controleren of er goedgekeurde emails klaar staan
  schedule: "5 * * * *",
};
