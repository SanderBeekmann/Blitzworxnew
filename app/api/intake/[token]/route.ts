import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: fetch session for public questionnaire
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database niet beschikbaar' }, { status: 503 });
  }

  const { token } = await params;

  const { data, error } = await supabase
    .from('onboarding_sessions')
    .select('id, client_name, company_name, project_type, questions, status')
    .eq('token', token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Vragenlijst niet gevonden' }, { status: 404 });
  }

  if (data.status === 'expired') {
    return NextResponse.json({ error: 'Deze vragenlijst is verlopen' }, { status: 410 });
  }

  if (!['pending', 'questionnaire_sent'].includes(data.status)) {
    return NextResponse.json({ error: 'Deze vragenlijst is al ingevuld' }, { status: 409 });
  }

  return NextResponse.json({ session: data });
}

// POST: submit responses + terms acceptance
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database niet beschikbaar' }, { status: 503 });
  }

  const { token } = await params;

  const body = await request.json();
  const { responses, terms_accepted_name } = body;

  if (!responses || !Array.isArray(responses) || !terms_accepted_name) {
    return NextResponse.json({ error: 'Ongeldige data' }, { status: 400 });
  }

  // Verify session exists and is submittable
  const { data: session, error: fetchError } = await supabase
    .from('onboarding_sessions')
    .select('id, status')
    .eq('token', token)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: 'Vragenlijst niet gevonden' }, { status: 404 });
  }

  if (!['pending', 'questionnaire_sent'].includes(session.status)) {
    return NextResponse.json({ error: 'Deze vragenlijst is al ingevuld' }, { status: 409 });
  }

  // Get client IP
  const ip = request.headers.get('x-forwarded-for')
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  const { data, error } = await supabase
    .from('onboarding_sessions')
    .update({
      responses,
      status: 'terms_accepted',
      terms_accepted_at: new Date().toISOString(),
      terms_version: '2.0',
      terms_ip_address: ip,
      terms_user_agent: userAgent,
      terms_accepted_name: terms_accepted_name.trim(),
    })
    .eq('token', token)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Opslaan mislukt' }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}
