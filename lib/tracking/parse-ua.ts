export interface ParsedUserAgent {
  device: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  const userAgent = ua ?? "";

  let device: ParsedUserAgent["device"] = "desktop";
  if (/iPad|Tablet|PlayBook/i.test(userAgent)) {
    device = "tablet";
  } else if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile/i.test(userAgent)) {
    device = "mobile";
  }

  let browser = "Unknown";
  if (/Edg\//i.test(userAgent)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(userAgent)) browser = "Opera";
  else if (/Chrome/i.test(userAgent) && !/Chromium/i.test(userAgent)) browser = "Chrome";
  else if (/Firefox/i.test(userAgent)) browser = "Firefox";
  else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = "Safari";

  let os = "Unknown";
  if (/Windows NT/i.test(userAgent)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(userAgent)) os = "macOS";
  else if (/iPhone|iPad|iOS/i.test(userAgent)) os = "iOS";
  else if (/Android/i.test(userAgent)) os = "Android";
  else if (/Linux/i.test(userAgent)) os = "Linux";

  return { device, browser, os };
}
