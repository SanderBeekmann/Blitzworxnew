import FirecrawlApp from '@mendable/firecrawl-js';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const MAX_HTML_BYTES = 2 * 1024 * 1024; // 2MB
const FETCH_TIMEOUT_MS = 15000;
const USER_AGENT = 'BlitzWorxBot/1.0 (+https://blitzworx.nl/website-score)';

export interface SiteFetchResult {
  html: string | null;
  markdown: string | null;
  headers: Headers | null;
  finalUrl: string;
  status: number;
  robotsTxt: string | null;
  sitemapFound: boolean;
  fetchError: string | null;
  metadata: FirecrawlMetadata | null;
}

export interface FirecrawlMetadata {
  title?: string;
  description?: string;
  language?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  statusCode?: number;
}

async function fetchWithTimeout(url: string, method: 'GET' | 'HEAD' = 'GET'): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*;q=0.8' },
      signal: controller.signal,
      redirect: 'follow',
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

async function readLimited(res: Response, maxBytes: number): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return await res.text();

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
      if (total >= maxBytes) {
        await reader.cancel();
        break;
      }
    }
  }
  const combined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8').decode(combined);
}

async function fetchHtmlDirect(url: string): Promise<Pick<SiteFetchResult, 'html' | 'headers' | 'finalUrl' | 'status' | 'fetchError'>> {
  try {
    const res = await fetchWithTimeout(url, 'GET');
    const html = await readLimited(res, MAX_HTML_BYTES);
    return {
      html,
      headers: res.headers,
      finalUrl: res.url || url,
      status: res.status,
      fetchError: null,
    };
  } catch (err: any) {
    return {
      html: null,
      headers: null,
      finalUrl: url,
      status: 0,
      fetchError: err?.name === 'AbortError' ? 'timeout' : (err?.message || 'fetch failed'),
    };
  }
}

async function fetchRobots(baseUrl: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(new URL('/robots.txt', baseUrl).toString(), 'GET');
    if (!res.ok) return null;
    const text = await res.text();
    return text.slice(0, 50000);
  } catch {
    return null;
  }
}

async function checkSitemap(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(new URL('/sitemap.xml', baseUrl).toString(), 'HEAD');
    return res.ok;
  } catch {
    return false;
  }
}

async function scrapeWithFirecrawl(url: string): Promise<{
  html: string | null;
  markdown: string | null;
  metadata: FirecrawlMetadata | null;
} | null> {
  if (!FIRECRAWL_API_KEY) return null;

  try {
    const firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });
    const result = await firecrawl.scrape(url, {
      formats: ['markdown', 'html'],
      waitFor: 3000,
      timeout: 30000,
    });

    return {
      html: result.html ?? null,
      markdown: result.markdown ?? null,
      metadata: (result.metadata as FirecrawlMetadata) ?? null,
    };
  } catch (err) {
    console.error('Firecrawl error:', err);
    return null;
  }
}

async function scrapeWithJina(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        Accept: 'text/markdown',
        'X-No-Cache': 'true',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const text = await res.text();
    return text.length > 100 ? text.slice(0, 500000) : null;
  } catch (err) {
    console.error('Jina Reader error:', err);
    return null;
  }
}

export async function fetchSite(url: string): Promise<SiteFetchResult> {
  // Run Firecrawl + robots/sitemap checks in parallel
  const [firecrawlResult, robotsTxt, sitemapFound] = await Promise.all([
    scrapeWithFirecrawl(url),
    fetchRobots(url),
    checkSitemap(url),
  ]);

  // Firecrawl succeeded - use its rich output
  if (firecrawlResult?.html || firecrawlResult?.markdown) {
    // Still fetch headers directly for security checks (Firecrawl doesn't expose them)
    let headers: Headers | null = null;
    try {
      const headRes = await fetchWithTimeout(url, 'HEAD');
      headers = headRes.headers;
    } catch { /* headers are optional, security checks will degrade gracefully */ }

    return {
      html: firecrawlResult.html,
      markdown: firecrawlResult.markdown,
      headers,
      finalUrl: url,
      status: firecrawlResult.metadata?.statusCode ?? 200,
      robotsTxt,
      sitemapFound,
      fetchError: null,
      metadata: firecrawlResult.metadata,
    };
  }

  // Fallback: direct HTML fetch + Jina Reader for markdown (in parallel)
  console.warn('Firecrawl unavailable, falling back to direct fetch + Jina Reader');
  const [main, jinaMarkdown] = await Promise.all([
    fetchHtmlDirect(url),
    scrapeWithJina(url),
  ]);

  return {
    ...main,
    markdown: jinaMarkdown,
    robotsTxt,
    sitemapFound,
    metadata: null,
  };
}
