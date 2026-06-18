'use client';

import { useEffect, useMemo, useState } from 'react';

type CallbackState = 'loading' | 'success' | 'error';

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<CallbackState>('loading');
  const [message, setMessage] = useState('Completing Google Calendar connection...');
  const [accountEmail, setAccountEmail] = useState<string | null>(null);

  const appDeepLink = useMemo(() => 'salo://settings/calendar?connected=1', []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    const code = params.get('code');
    const state = params.get('state');

    if (oauthError) {
      setStatus('error');
      setMessage(`Google authorization was denied (${oauthError}).`);
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setMessage('Missing Google OAuth response parameters.');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/api/google/calendar/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        });

        const data = await response.json().catch(() => ({}));

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setStatus('error');
          setMessage(data?.error || 'Failed to connect Google Calendar.');
          return;
        }

        setAccountEmail(data?.status?.googleAccountEmail || null);
        setStatus('success');
        setMessage('Google Calendar is connected. Return to the SALO app to continue.');

        window.setTimeout(() => {
          window.location.href = appDeepLink;
        }, 1200);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to connect Google Calendar.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appDeepLink]);

  return (
    <div className="flex min-h-full items-center justify-center bg-[#0B0B0F] px-6 py-16 text-center text-white">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">
          SALO
        </p>
        <h1 className="mt-4 text-3xl font-bold">
          {status === 'success'
            ? 'Google Calendar connected'
            : status === 'error'
              ? 'Connection failed'
              : 'Connecting Google Calendar'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{message}</p>

        {accountEmail ? (
          <p className="mt-4 text-xs text-zinc-500">Connected account: {accountEmail}</p>
        ) : null}

        {status === 'success' ? (
          <a
            href={appDeepLink}
            className="mt-8 inline-flex rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Open SALO App
          </a>
        ) : null}
      </div>
    </div>
  );
}
