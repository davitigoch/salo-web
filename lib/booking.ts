import { createSupabaseClient } from '@/lib/supabase';
import type { PublicBookingPageData, PublicBusiness, PublicService } from '@/lib/types';

export async function fetchPublicBookingPage(
  slug: string
): Promise<{ data: PublicBookingPageData | null; error: string | null }> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return { data: null, error: 'Missing business link.' };
  }

  const supabase = createSupabaseClient();

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select(
      'id, owner_user_id, business_name, slug, description, timezone, public_booking_enabled'
    )
    .eq('slug', normalizedSlug)
    .eq('public_booking_enabled', true)
    .single();

  if (businessError || !business) {
    return {
      data: null,
      error: 'This booking page was not found or is unavailable.',
    };
  }

  const { data: servicesData, error: servicesError } = await supabase
    .from('services')
    .select('id, name, description, duration_minutes, price, category, color, is_active')
    .eq('business_id', business.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (servicesError) {
    return {
      data: {
        business: business as PublicBusiness,
        services: [],
      },
      error: 'Services are currently unavailable for this business.',
    };
  }

  return {
    data: {
      business: business as PublicBusiness,
      services: (servicesData || []) as PublicService[],
    },
    error: null,
  };
}
