import { NextResponse } from 'next/server';

import type { PendingPublicBookingDraft } from '@/lib/publicBookingDraft';
import { invokeSupabaseEdgeFunction } from '@/lib/supabase/edgeFunctionServer';

export const dynamic = 'force-dynamic';

type FinalizeRequestBody = {
  checkoutSessionId?: string;
  bookingDraft?: PendingPublicBookingDraft;
};

type FinalizeResponseBody = {
  bookingId?: string;
  bookingToken?: string;
  bookingStatus?: string;
  error?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as FinalizeRequestBody;

  if (!body.checkoutSessionId || !body.bookingDraft) {
    return NextResponse.json(
      { error: 'checkoutSessionId and bookingDraft are required.' },
      { status: 400 }
    );
  }

  const result = await invokeSupabaseEdgeFunction<FinalizeResponseBody>(
    'finalize-public-booking-payment',
    {
      checkoutSessionId: body.checkoutSessionId,
      bookingDraft: body.bookingDraft,
    }
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.data.error || 'Failed to finalize booking payment.' },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data);
}
