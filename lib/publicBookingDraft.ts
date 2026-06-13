export type PendingPublicBookingDraft = {
  client_name: string;
  date: string;
  time: string;
  notes?: string;
  customer_email?: string;
  customer_phone?: string;
  staff_member_id?: string | null;
  business_id: string;
  business_slug: string;
  service_id: string;
  booking_token?: string;
  service_name?: string;
  staff_name?: string | null;
};

function getDraftStorageKey(businessSlug: string) {
  return `salo-public-booking-draft:${businessSlug}`;
}

export function savePendingPublicBookingDraft(
  businessSlug: string,
  draft: PendingPublicBookingDraft
) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(getDraftStorageKey(businessSlug), JSON.stringify(draft));
}

export function loadPendingPublicBookingDraft(
  businessSlug: string
): PendingPublicBookingDraft | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(getDraftStorageKey(businessSlug));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingPublicBookingDraft;
  } catch {
    return null;
  }
}

export function clearPendingPublicBookingDraft(businessSlug: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(getDraftStorageKey(businessSlug));
}
