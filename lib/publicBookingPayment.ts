import type { PublicBusiness } from '@/lib/types';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import {
  isPublicBookingPaymentRequired,
  isPublicBookingStripeReady,
  logPublicBookingPaymentDecision,
  logPublicBookingPaymentFields,
} from '@/lib/stripePayments';

const PAYMENT_SETTINGS_COLUMNS =
  'stripe_account_id, stripe_charges_enabled, deposits_enabled, deposit_percentage, require_card_on_booking';

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
  | 'deposits_enabled'
  | 'deposit_percentage'
  | 'require_card_on_booking'
> | null> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('businesses')
    .select(PAYMENT_SETTINGS_COLUMNS)
    .eq('id', businessId)
    .eq('public_booking_enabled', true)
    .single();

  if (error || !data) {
    console.warn('[SALO WEB] failed to load payment settings', error?.message);
    return null;
  }

  return data as Pick<
    PublicBusiness,
    | 'stripe_account_id'
    | 'stripe_charges_enabled'
    | 'deposits_enabled'
    | 'deposit_percentage'
    | 'require_card_on_booking'
  >;
}

export function mergePublicBookingPaymentSettings(
  business: PublicBusiness,
  paymentSettings: Pick<
    PublicBusiness,
    | 'stripe_account_id'
    | 'stripe_charges_enabled'
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
