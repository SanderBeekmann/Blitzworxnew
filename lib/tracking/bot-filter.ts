const BOT_PATTERN = /bot|crawler|spider|preview|monitor|headless|lighthouse|pingdom|uptimerobot|gtmetrix|chrome-lighthouse|googlebot|bingbot|yandex|baiduspider|duckduckbot|slackbot|whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|discordbot/i;

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_PATTERN.test(userAgent);
}
