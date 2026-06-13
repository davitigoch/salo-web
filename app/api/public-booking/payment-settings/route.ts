import { NextResponse } from 'next/server';

import { createSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');

  if (!businessId) {
    return NextResponse.json({ error: 'businessId is required.' }, { status: 400 });
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('businesses')
    .select(
      'id, stripe_account_id, stripe_charges_enabled, deposits_enabled, deposit_percentage, require_card_on_booking'
    )
    .eq('id', businessId)
    .eq('public_booking_enabled', true)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'Business payment settings not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
