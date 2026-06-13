import { NextResponse } from 'next/server';

import { invokeSupabaseEdgeFunction } from '@/lib/supabase/edgeFunctionServer';

export const dynamic = 'force-dynamic';

type CheckoutRequestBody = {
  businessId?: string;
  serviceId?: string;
  clientName?: string;
  customerEmail?: string;
  paymentMode?: 'auto' | 'full';
  successUrl?: string;
  cancelUrl?: string;
};

type CheckoutResponseBody = {
  requiresPayment?: boolean;
  checkoutUrl?: string;
  reason?: string;
  error?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CheckoutRequestBody;

  if (
    !body.businessId ||
    !body.serviceId ||
    !body.clientName ||
    !body.successUrl ||
    !body.cancelUrl
  ) {
    return NextResponse.json(
      { error: 'Missing required checkout session fields.' },
      { status: 400 }
    );
  }

  const result = await invokeSupabaseEdgeFunction<CheckoutResponseBody>(
    'create-stripe-checkout-session',
    {
      businessId: body.businessId,
      serviceId: body.serviceId,
      clientName: body.clientName,
      customerEmail: body.customerEmail || '',
      paymentMode: body.paymentMode || 'auto',
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
    }
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.data.error || 'Failed to create checkout session.' },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data);
}
