import type { PublicBusiness } from '@/lib/types';

function normalizeBoolean(value: unknown): boolean {
  return value === true || value === 'true' || value === 1;
}

export function isPublicBookingPaymentRequired(business: PublicBusiness | null | undefined) {
  return (
    normalizeBoolean(business?.require_card_on_booking) ||
    normalizeBoolean(business?.deposits_enabled)
  );
}

export function isPublicBookingStripeReady(business: PublicBusiness | null | undefined) {
  return Boolean(
    business?.stripe_account_id &&
      normalizeBoolean(business?.stripe_charges_enabled) &&
      normalizeBoolean(business?.stripe_card_payments_enabled)
  );
}

export function logPublicBookingPaymentFields(
  business: PublicBusiness | null | undefined,
  source = 'unknown'
) {
  console.log('[SALO WEB] business payment fields', {
    source,
    businessId: business?.id ?? null,
    stripe_account_id: business?.stripe_account_id ?? null,
    stripe_charges_enabled: normalizeBoolean(business?.stripe_charges_enabled),
    stripe_card_payments_enabled: normalizeBoolean(business?.stripe_card_payments_enabled),
    stripe_transfers_enabled: normalizeBoolean(business?.stripe_transfers_enabled),
    deposits_enabled: normalizeBoolean(business?.deposits_enabled),
    deposit_percentage: business?.deposit_percentage ?? null,
    require_card_on_booking: normalizeBoolean(business?.require_card_on_booking),
  });
}

export function logPublicBookingPaymentDecision({
  isPaymentRequired,
  isStripeReady,
}: {
  isPaymentRequired: boolean;
  isStripeReady: boolean;
}) {
  console.log('[SALO WEB] isPaymentRequired', isPaymentRequired);
  console.log('[SALO WEB] isStripeReady', isStripeReady);
}
