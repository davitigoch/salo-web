import type { PublicBusiness } from '@/lib/types';
import {
  isPublicBookingPaymentRequired,
  isPublicBookingStripeReady,
  logPublicBookingPaymentDecision,
  logPublicBookingPaymentFields,
} from '@/lib/stripePayments';

export type VerifiedPublicBookingPaymentState =
  | {
      ok: true;
      business: PublicBusiness;
      isPaymentRequired: boolean;
      isStripeReady: boolean;
    }
  | {
      ok: false;
      error: string;
    };

export async function fetchPublicBookingPaymentSettings(
  businessId: string
): Promise<Pick<
  PublicBusiness,
  | 'stripe_account_id'
  | 'stripe_charges_enabled'
  | 'stripe_card_payments_enabled'
  | 'stripe_transfers_enabled'
  | 'deposits_enabled'
  | 'deposit_percentage'
  | 'require_card_on_booking'
> | null> {
  const response = await fetch(
    `/api/public-booking/payment-settings?businessId=${encodeURIComponent(businessId)}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );

  const data = (await response.json().catch(() => ({}))) as Pick<
    PublicBusiness,
    | 'stripe_account_id'
    | 'stripe_charges_enabled'
    | 'stripe_card_payments_enabled'
    | 'stripe_transfers_enabled'
    | 'deposits_enabled'
    | 'deposit_percentage'
    | 'require_card_on_booking'
  > & { error?: string };

  if (!response.ok) {
    console.warn('[SALO WEB] failed to load payment settings', data.error || response.status);
    return null;
  }

  return data;
}

export function mergePublicBookingPaymentSettings(
  business: PublicBusiness,
  paymentSettings: Pick<
    PublicBusiness,
    | 'stripe_account_id'
    | 'stripe_charges_enabled'
    | 'stripe_card_payments_enabled'
    | 'stripe_transfers_enabled'
    | 'deposits_enabled'
    | 'deposit_percentage'
    | 'require_card_on_booking'
  > | null
): PublicBusiness {
  if (!paymentSettings) {
    return business;
  }

  return {
    ...business,
    ...paymentSettings,
  };
}

export async function verifyPublicBookingPaymentState(
  business: PublicBusiness
): Promise<VerifiedPublicBookingPaymentState> {
  logPublicBookingPaymentFields(business, 'before refresh');

  const freshPaymentSettings = await fetchPublicBookingPaymentSettings(business.id);

  if (!freshPaymentSettings) {
    return {
      ok: false,
      error: 'Unable to verify payment settings. Please refresh and try again.',
    };
  }

  const mergedBusiness = mergePublicBookingPaymentSettings(business, freshPaymentSettings);
  logPublicBookingPaymentFields(mergedBusiness, 'after refresh');

  const isPaymentRequired = isPublicBookingPaymentRequired(mergedBusiness);
  const isStripeReady = isPublicBookingStripeReady(mergedBusiness);

  logPublicBookingPaymentDecision({ isPaymentRequired, isStripeReady });

  return {
    ok: true,
    business: mergedBusiness,
    isPaymentRequired,
    isStripeReady,
  };
}
