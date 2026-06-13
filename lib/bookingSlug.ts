export function normalizePublicBookingSlug(raw: string): string {
  const decoded = decodeURIComponent(String(raw || '').trim());
  const withoutLeadingSlash = decoded.replace(/^\/+/, '');
  const withoutBookPrefix = withoutLeadingSlash.replace(/^book\/?/i, '');

  return withoutBookPrefix.replace(/^\/+|\/+$/g, '').toLowerCase();
}
