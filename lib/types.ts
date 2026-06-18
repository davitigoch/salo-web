export type PublicBusiness = {
  id: string;
  owner_user_id: string;
  business_name: string;
  slug: string;
  description: string | null;
  timezone: string;
  public_booking_enabled: boolean;
  stripe_account_id: string | null;
  stripe_charges_enabled: boolean;
  stripe_card_payments_enabled: boolean;
  stripe_transfers_enabled: boolean;
  deposits_enabled: boolean;
  deposit_percentage: number | null;
  require_card_on_booking: boolean;
};

export type PublicService = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  category: string | null;
  color: string;
  is_active: boolean;
};

export type PublicBookingPageData = {
  business: PublicBusiness;
  services: PublicService[];
};

export type PublicStaffMember = {
  id: string;
  name: string;
  role: string | null;
  color: string | null;
  is_active: boolean;
};

export type PublicStaffAvailability = {
  staff_member_id: string;
  weekday: number;
  is_closed: boolean;
  open_time: string;
  close_time: string;
};

export type PublicBusinessHour = {
  weekday: number;
  is_closed: boolean;
  open_time: string;
  close_time: string;
};

export type PublicBookedSlot = {
  id: string;
  booking_time: string;
  staff_member_id: string | null;
  duration_minutes: number;
};

export type BookingConfirmation = {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  staffName: string | null;
};
