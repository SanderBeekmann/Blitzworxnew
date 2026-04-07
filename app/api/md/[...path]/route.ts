import { NextRequest } from 'next/server';
import {
  buildLlmsFullTxt,
  buildLlmsTxt,
  markdownHeaders,
  renderMarkdownForPath,
} from '@/lib/markdown-mirror';

export const revalidate = 3600;

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  const joined = (path ?? []).join('/');

  if (joined === '__llms') {
    const body = await buildLlmsTxt();
    return new Response(body, {
      headers: { ...markdownHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  if (joined === '__llms-full') {
    const body = await buildLlmsFullTxt();
    return new Response(body, {
      headers: { ...markdownHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const md = await renderMarkdownForPath(joined);
  if (!md) {
    return new Response(`# Not found\n\nNo markdown mirror exists for /${joined}\n`, {
      status: 404,
      headers: markdownHeaders,
    });
  }

  return new Response(md, { headers: markdownHeaders });
}
