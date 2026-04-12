import { NextResponse } from 'next/server';
import { runFullAnalysis } from '../run-analysis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body.url;

    if (!url?.trim()) {
      return NextResponse.json({ error: 'Vul een URL in.' }, { status: 400 });
    }

    const result = await runFullAnalysis(url);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Analyze API error:', err);
    return NextResponse.json({ error: err?.message || 'Er ging iets mis.' }, { status: 500 });
  }
}
