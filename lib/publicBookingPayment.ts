import type { PublicBusiness } from '@/lib/types';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const PAYMENT_SETTINGS_COLUMNS =
  'stripe_account_id, stripe_charges_enabled, deposits_enabled, deposit_percentage, require_card_on_booking';

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
    console.warn('[SALO] failed to refresh public booking payment settings', error?.message);
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
