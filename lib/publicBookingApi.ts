import type { PendingPublicBookingDraft } from '@/lib/publicBookingDraft';

type CheckoutSessionRequest = {
  businessId: string;
  serviceId: string;
  clientName: string;
  customerEmail: string;
  paymentMode: 'auto' | 'full';
  successUrl: string;
  cancelUrl: string;
};

type CheckoutSessionResponse = {
  requiresPayment?: boolean;
  checkoutUrl?: string;
  reason?: string;
  error?: string;
};

type FinalizePaymentRequest = {
  checkoutSessionId: string;
  bookingDraft: PendingPublicBookingDraft;
};

type FinalizePaymentResponse = {
  bookingId?: string;
  bookingToken?: string;
  bookingStatus?: string;
  error?: string;
};

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = (await response.json().catch(() => ({}))) as TResponse & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }

  return data;
}

export async function createPublicBookingCheckoutSession(body: CheckoutSessionRequest) {
  console.log('[SALO WEB] creating checkout session');

  return postJson<CheckoutSessionResponse>('/api/public-booking/checkout', body);
}

export async function finalizePublicBookingPayment(body: FinalizePaymentRequest) {
  return postJson<FinalizePaymentResponse>('/api/public-booking/finalize', body);
}
