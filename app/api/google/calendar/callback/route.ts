import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type CallbackRequestBody = {
  code?: string;
  state?: string;
};

type CallbackResponseBody = {
  connected?: boolean;
  status?: {
    connected?: boolean;
    googleAccountEmail?: string | null;
    calendarId?: string | null;
  };
  error?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CallbackRequestBody;
  const code = body.code?.trim();
  const state = body.state?.trim();

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing Google OAuth code or state.' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const callbackSecret = process.env.GOOGLE_OAUTH_CALLBACK_SECRET;

  if (!supabaseUrl || !supabaseAnonKey || !callbackSecret) {
    return NextResponse.json(
      { error: 'Missing Google OAuth server configuration.' },
      { status: 500 }
    );
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/google-calendar-oauth-callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'x-salo-google-callback-secret': callbackSecret,
    },
    body: JSON.stringify({ code, state }),
    cache: 'no-store',
  });

  const data = (await response.json().catch(() => ({}))) as CallbackResponseBody;

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error || 'Failed to complete Google Calendar connection.' },
      { status: response.status }
    );
  }

  return NextResponse.json(data);
}
