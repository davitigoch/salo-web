import type { PublicBusiness } from '@/lib/types';

export function isPublicBookingPaymentRequired(business: PublicBusiness | null | undefined) {
  return (
    business?.require_card_on_booking === true || business?.deposits_enabled === true
  );
}

export function isPublicBookingStripeReady(business: PublicBusiness | null | undefined) {
  return Boolean(business?.stripe_account_id && business?.stripe_charges_enabled === true);
}

export function logPublicBookingPaymentSettings(business: PublicBusiness | null | undefined) {
  console.log('[SALO] public booking payment settings', {
    stripe_account_id: business?.stripe_account_id ?? null,
    stripe_charges_enabled: business?.stripe_charges_enabled === true,
    deposits_enabled: business?.deposits_enabled === true,
    deposit_percentage: business?.deposit_percentage ?? null,
    require_card_on_booking: business?.require_card_on_booking === true,
  });
}
