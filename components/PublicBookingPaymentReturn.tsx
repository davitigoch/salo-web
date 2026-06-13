'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getEdgeFunctionErrorMessage } from '@/lib/edgeFunctions';
import {
  clearPendingPublicBookingDraft,
  loadPendingPublicBookingDraft,
} from '@/lib/publicBookingDraft';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type PublicBookingPaymentReturnProps = {
  slug: string;
  status: string | null;
  sessionId: string | null;
};

export default function PublicBookingPaymentReturn({
  slug,
  status,
  sessionId,
}: PublicBookingPaymentReturnProps) {
  const [message, setMessage] = useState('Finalizing your booking...');
  const [isError, setIsError] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    clientName: string;
    serviceName: string;
    date: string;
    time: string;
    staffName: string | null;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function finalizePayment() {
      if (status === 'cancel') {
        setMessage('Payment was canceled. You can return to booking and try again.');
        setIsError(true);
        return;
      }

      if (status !== 'success' || !sessionId) {
        setMessage('Invalid payment return link.');
        setIsError(true);
        return;
      }

      const pendingDraft = loadPendingPublicBookingDraft(slug);

      if (!pendingDraft) {
        setMessage('Unable to find your pending booking details. Please try booking again.');
        setIsError(true);
        return;
      }

      const supabase = createBrowserSupabaseClient();
      const { data, error: finalizeError } = await supabase.functions.invoke(
        'finalize-public-booking-payment',
        {
          body: {
            checkoutSessionId: sessionId,
            bookingDraft: pendingDraft,
          },
        }
      );

      if (!isMounted) {
        return;
      }

      if (finalizeError || data?.error) {
        const errorMessage = await getEdgeFunctionErrorMessage({ error: finalizeError, data });
        setMessage(errorMessage);
        setIsError(true);
        return;
      }

      clearPendingPublicBookingDraft(slug);

      const finalizedStatus = data?.bookingStatus || 'confirmed';
      setConfirmation({
        clientName: pendingDraft.client_name,
        serviceName: pendingDraft.service_name || 'Service',
        date: pendingDraft.date,
        time: pendingDraft.time,
        staffName: pendingDraft.staff_name || null,
      });
      setMessage(
        finalizedStatus === 'pending'
          ? 'Your appointment is pending review.'
          : 'Your appointment is confirmed.'
      );
      setIsError(false);
    }

    finalizePayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, slug, status]);

  if (confirmation) {
    return (
      <section className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <h2 className="text-xl font-semibold text-emerald-100">Booking confirmed</h2>
        <p className="mt-2 text-sm leading-6 text-emerald-50/90">{message}</p>

        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="text-zinc-400">Name</dt>
            <dd className="font-medium text-white">{confirmation.clientName}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">Service</dt>
            <dd className="font-medium text-white">{confirmation.serviceName}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">When</dt>
            <dd className="font-medium text-white">
              {confirmation.date} at {confirmation.time}
            </dd>
          </div>
          {confirmation.staffName ? (
            <div>
              <dt className="text-zinc-400">Staff</dt>
              <dd className="font-medium text-white">{confirmation.staffName}</dd>
            </div>
          ) : null}
        </dl>

        <Link
          href={`/book/${slug}`}
          className="mt-6 inline-block text-sm font-semibold text-violet-300 hover:text-violet-200"
        >
          Back to booking page
        </Link>
      </section>
    );
  }

  return (
    <section
      className={`mt-10 rounded-2xl border p-6 ${
        isError
          ? 'border-rose-500/30 bg-rose-500/10'
          : 'border-zinc-800 bg-[#18181B]'
      }`}
    >
      <h2 className="text-xl font-semibold text-white">
        {isError ? 'Payment issue' : 'Processing payment'}
      </h2>
      <p className={`mt-2 text-sm leading-6 ${isError ? 'text-rose-100' : 'text-zinc-400'}`}>
        {message}
      </p>

      {isError ? (
        <Link
          href={`/book/${slug}`}
          className="mt-6 inline-block rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Return to booking
        </Link>
      ) : null}
    </section>
  );
}
