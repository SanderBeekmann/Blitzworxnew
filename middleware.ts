import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware that rewrites markdown-mirror URLs to the dispatcher route.
 * Handles:
 *   /llms.txt          -> /api/md/__llms
 *   /llms-full.txt     -> /api/md/__llms-full
 *   /any/path.md       -> /api/md/any/path
 *
 * Done in middleware (not next.config rewrites) because Next's rewrite source
 * patterns do not reliably match a `.md` suffix on multi-segment paths.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/llms.txt') {
    const url = req.nextUrl.clone();
    url.pathname = '/api/md/__llms';
    return NextResponse.rewrite(url);
  }

  if (pathname === '/llms-full.txt') {
    const url = req.nextUrl.clone();
    url.pathname = '/api/md/__llms-full';
    return NextResponse.rewrite(url);
  }

  if (pathname.endsWith('.md')) {
    const url = req.nextUrl.clone();
    url.pathname = '/api/md' + pathname.slice(0, -'.md'.length);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/llms.txt', '/llms-full.txt', '/:path*.md'],
};
