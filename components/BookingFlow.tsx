'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  formatDateValue,
  generateAvailableTimeSlots,
  type ExistingBookingSlot,
} from '@/lib/bookingSlots';
import { getEdgeFunctionErrorMessage } from '@/lib/edgeFunctions';
import {
  fetchPublicBookingPaymentSettings,
  mergePublicBookingPaymentSettings,
} from '@/lib/publicBookingPayment';
import {
  savePendingPublicBookingDraft,
  type PendingPublicBookingDraft,
} from '@/lib/publicBookingDraft';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import {
  isPublicBookingPaymentRequired,
  isPublicBookingStripeReady,
  logPublicBookingPaymentSettings,
} from '@/lib/stripePayments';
import type {
  BookingConfirmation,
  PublicBookedSlot,
  PublicBusiness,
  PublicBusinessHour,
  PublicService,
  PublicStaffAvailability,
  PublicStaffMember,
} from '@/lib/types';

type BookingFlowProps = {
  business: PublicBusiness;
  services: PublicService[];
  servicesError: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0));
}

function generateSecureBookingToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '');
  }

  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 14)}`;
}

function getTodayDateInputValue() {
  return formatDateValue(new Date());
}

export default function BookingFlow({ business, services, servicesError }: BookingFlowProps) {
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [selectedSlotTime, setSelectedSlotTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [staffMembers, setStaffMembers] = useState<PublicStaffMember[]>([]);
  const [staffAvailability, setStaffAvailability] = useState<PublicStaffAvailability[]>([]);
  const [businessHours, setBusinessHours] = useState<PublicBusinessHour[]>([]);
  const [bookedSlots, setBookedSlots] = useState<ExistingBookingSlot[]>([]);

  const [isLoadingSupportData, setIsLoadingSupportData] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [supportDataError, setSupportDataError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) || null,
    [services, selectedServiceId]
  );

  const selectedStaff = useMemo(
    () => staffMembers.find((member) => member.id === selectedStaffId) || null,
    [staffMembers, selectedStaffId]
  );

  useEffect(() => {
    logPublicBookingPaymentSettings(business);
  }, [business]);

  useEffect(() => {
    const today = getTodayDateInputValue();
    setTodayDate(today);
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    if (!services.length) {
      return;
    }

    if (!selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [services, selectedServiceId]);

  useEffect(() => {
    let isMounted = true;

    async function loadSupportData() {
      setIsLoadingSupportData(true);
      setSupportDataError('');

      const supabase = createBrowserSupabaseClient();

      const [staffResult, availabilityResult, hoursResult] = await Promise.all([
        supabase.rpc('get_public_staff_members', {
          target_business_id: business.id,
        }),
        supabase.rpc('get_public_staff_availability', {
          target_business_id: business.id,
        }),
        supabase
          .from('business_hours')
          .select('weekday, is_closed, open_time, close_time')
          .eq('business_id', business.id)
          .order('weekday', { ascending: true }),
      ]);

      if (!isMounted) {
        return;
      }

      if (staffResult.error) {
        setSupportDataError('Team availability is currently unavailable.');
        setStaffMembers([]);
      } else {
        setStaffMembers((staffResult.data || []) as PublicStaffMember[]);
      }

      if (availabilityResult.error) {
        setStaffAvailability([]);
      } else {
        setStaffAvailability((availabilityResult.data || []) as PublicStaffAvailability[]);
      }

      if (hoursResult.error) {
        setBusinessHours([]);
      } else {
        setBusinessHours((hoursResult.data || []) as PublicBusinessHour[]);
      }

      setIsLoadingSupportData(false);
    }

    loadSupportData();

    return () => {
      isMounted = false;
    };
  }, [business.id]);

  useEffect(() => {
    if (!business.id || !selectedDate) {
      setBookedSlots([]);
      return;
    }

    let isMounted = true;

    async function loadBookedSlots() {
      setIsLoadingSlots(true);

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.rpc('get_business_booked_slots', {
        target_business_id: business.id,
        target_date: selectedDate,
      });

      if (!isMounted) {
        return;
      }

      if (error) {
        setBookedSlots([]);
        setIsLoadingSlots(false);
        return;
      }

      setBookedSlots(
        ((data || []) as PublicBookedSlot[]).map((item) => ({
          id: item.id,
          time: item.booking_time,
          staff_member_id: item.staff_member_id,
          booking_metadata: {
            service_duration_minutes: item.duration_minutes,
          },
        }))
      );
      setIsLoadingSlots(false);
    }

    loadBookedSlots();

    return () => {
      isMounted = false;
    };
  }, [business.id, selectedDate]);

  const parsedDate = useMemo(() => {
    const date = new Date(`${selectedDate}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [selectedDate]);

  const slotsResult = useMemo(() => {
    if (!selectedService) {
      return { slots: [], reason: 'Select a service first.' };
    }

    return generateAvailableTimeSlots({
      businessHours,
      date: parsedDate,
      serviceDurationMinutes: selectedService.duration_minutes,
      existingBookings: bookedSlots,
      staffMembers,
      selectedStaffId,
      staffAvailability,
      stepMinutes: 15,
    });
  }, [
    bookedSlots,
    businessHours,
    parsedDate,
    selectedService,
    selectedStaffId,
    staffAvailability,
    staffMembers,
  ]);

  useEffect(() => {
    if (!slotsResult.slots.length) {
      setSelectedSlotTime('');
      return;
    }

    if (!slotsResult.slots.some((slot) => slot.value === selectedSlotTime)) {
      setSelectedSlotTime(slotsResult.slots[0].value);
    }
  }, [selectedSlotTime, slotsResult.slots]);

  const onConfirmBooking = async () => {
    if (!selectedService) {
      setSubmitError('Please choose a service.');
      return;
    }

    if (!clientName.trim() || !selectedDate || !selectedSlotTime) {
      setSubmitError('Please fill your name and choose a date and time slot.');
      return;
    }

    if (!slotsResult.slots.some((slot) => slot.value === selectedSlotTime)) {
      setSubmitError('Please choose one of the available time slots.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const bookingToken = generateSecureBookingToken();
    const payload = {
      client_name: clientName.trim(),
      service: selectedService.name,
      price: Number(selectedService.price || 0),
      date: selectedDate,
      time: selectedSlotTime,
      notes: notes.trim(),
      customer_email: email.trim(),
      customer_phone: phone.trim(),
      staff_member_id: selectedStaff?.id || null,
      user_id: business.owner_user_id,
      business_id: business.id,
      business_slug: business.slug,
      booking_token: bookingToken,
      booking_source: 'public',
      status: 'pending',
      booking_metadata: {
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_duration_minutes: selectedService.duration_minutes,
        service_category: selectedService.category,
        staff_member_id: selectedStaff?.id || null,
        staff_member_name: selectedStaff?.name || null,
        staff_member_role: selectedStaff?.role || null,
        staff_member_color: selectedStaff?.color || null,
        notification_hooks: {
          confirmed_sms: 'pending',
        },
      },
    };

    logPublicBookingPaymentSettings(business);

    const supabase = createBrowserSupabaseClient();
    const freshPaymentSettings = await fetchPublicBookingPaymentSettings(business.id);
    const businessForPayment = mergePublicBookingPaymentSettings(business, freshPaymentSettings);

    logPublicBookingPaymentSettings(businessForPayment);

    const isPaymentRequired = isPublicBookingPaymentRequired(businessForPayment);
    const isStripeReady = isPublicBookingStripeReady(businessForPayment);

    console.log('[SALO] payment required', isPaymentRequired);
    console.log('[SALO] stripe ready', isStripeReady);

    if (!isPaymentRequired) {
      const { error } = await supabase.from('bookings').insert(payload);

      setIsSubmitting(false);

      if (error) {
        setSubmitError(error.message || 'Booking failed. Please try again.');
        return;
      }

      setConfirmation({
        clientName: clientName.trim(),
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedSlotTime,
        staffName: selectedStaff?.name || null,
      });

      setBookedSlots((previous) => [
        ...previous,
        {
          id: `local-${Date.now()}`,
          time: selectedSlotTime,
          staff_member_id: selectedStaff?.id || null,
          booking_metadata: {
            service_duration_minutes: selectedService.duration_minutes,
          },
        },
      ]);
      return;
    }

    if (!isStripeReady) {
      setIsSubmitting(false);
      setSubmitError('This salon has not finished payment setup.');
      return;
    }

    const origin = window.location.origin;
    const successUrl = `${origin}/book/${business.slug}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/book/${business.slug}/payment?status=cancel`;

    console.log('[SALO] creating checkout session');

    const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
      'create-stripe-checkout-session',
      {
        body: {
          businessId: business.id,
          serviceId: selectedService.id,
          clientName: clientName.trim(),
          customerEmail: email.trim(),
          paymentMode: businessForPayment.deposits_enabled === true ? 'auto' : 'full',
          successUrl,
          cancelUrl,
        },
      }
    );

    if (checkoutError || checkoutData?.error) {
      setIsSubmitting(false);
      const message = await getEdgeFunctionErrorMessage({ error: checkoutError, data: checkoutData });
      setSubmitError(message);
      return;
    }

    if (!checkoutData?.requiresPayment || !checkoutData?.checkoutUrl) {
      setIsSubmitting(false);
      setSubmitError(
        checkoutData?.reason ||
          'Unable to start payment. Please try again or contact the salon.'
      );
      return;
    }

    const pendingDraft: PendingPublicBookingDraft = {
      client_name: clientName.trim(),
      date: selectedDate,
      time: selectedSlotTime,
      notes: notes.trim(),
      customer_email: email.trim(),
      customer_phone: phone.trim(),
      staff_member_id: selectedStaff?.id || null,
      business_id: business.id,
      business_slug: business.slug,
      service_id: selectedService.id,
      booking_token: bookingToken,
      service_name: selectedService.name,
      staff_name: selectedStaff?.name || null,
    };

    savePendingPublicBookingDraft(business.slug, pendingDraft);

    setIsSubmitting(false);
    window.location.href = checkoutData.checkoutUrl;
  };

  if (confirmation) {
    return (
      <section className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <h2 className="text-xl font-semibold text-emerald-100">Booking requested</h2>
        <p className="mt-2 text-sm leading-6 text-emerald-50/90">
          Your appointment is pending review. The salon will confirm it shortly.
        </p>

        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="text-zinc-400">Name</dt>
            <dd className="font-medium text-white">{confirmation.clientName}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">Service</dt>
            <dd className="font-medium text-white">{confirmation.serviceName}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">When</dt>
            <dd className="font-medium text-white">
              {confirmation.date} at {confirmation.time}
            </dd>
          </div>
          {confirmation.staffName ? (
            <div>
              <dt className="text-zinc-400">Staff</dt>
              <dd className="font-medium text-white">{confirmation.staffName}</dd>
            </div>
          ) : null}
        </dl>
      </section>
    );
  }

  return (
    <>
      {servicesError ? (
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {servicesError}
        </div>
      ) : null}

      {supportDataError ? (
        <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {supportDataError}
        </div>
      ) : null}

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Services</h2>
            <p className="mt-1 text-sm text-zinc-400">Choose a treatment to begin your booking.</p>
          </div>
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300">
            {services.length} available
          </span>
        </div>

        {services.length ? (
          <ul className="mt-6 grid gap-4">
            {services.map((service) => {
              const isSelected = service.id === selectedServiceId;

              return (
                <li key={service.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-900/20'
                        : 'border-zinc-800 bg-[#18181B] hover:border-zinc-700'
                    }`}
                    style={isSelected ? undefined : { borderColor: `${service.color}33` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                        {service.description ? (
                          <p className="mt-2 text-sm leading-6 text-zinc-400">
                            {service.description}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className="rounded-full border px-3 py-1 text-xs font-semibold"
                        style={{
                          borderColor: `${service.color}66`,
                          color: service.color,
                          backgroundColor: `${service.color}14`,
                        }}
                      >
                        {service.category || 'General'}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-zinc-300">
                      <span className="font-semibold text-violet-300">
                        {formatCurrency(service.price)}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span>{service.duration_minutes} min</span>
                      {isSelected ? (
                        <>
                          <span className="text-zinc-500">•</span>
                          <span className="font-semibold text-violet-200">Selected</span>
                        </>
                      ) : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-[#18181B] px-5 py-8 text-center">
            <p className="text-base font-medium text-white">No services available yet</p>
            <p className="mt-2 text-sm text-zinc-400">
              This salon has not published any active services.
            </p>
          </div>
        )}
      </section>

      {selectedService ? (
        <>
          <section className="mt-10 rounded-2xl border border-zinc-800 bg-[#18181B] p-5">
            <h2 className="text-lg font-semibold text-white">Selected service</h2>
            <p className="mt-2 text-white">{selectedService.name}</p>
            <p className="mt-1 text-sm text-zinc-400">
              {formatCurrency(selectedService.price)} • {selectedService.duration_minutes} min
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-white">Team member</h2>
            <p className="mt-1 text-sm text-zinc-400">Optional. Choose a stylist or any available staff.</p>

            {isLoadingSupportData ? (
              <p className="mt-4 text-sm text-zinc-400">Loading team...</p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaffId('')}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                    !selectedStaffId
                      ? 'border-violet-500 bg-violet-500/15 text-violet-100'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-300'
                  }`}
                >
                  Any available staff
                </button>

                {staffMembers.map((member) => {
                  const isSelected = selectedStaffId === member.id;

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedStaffId(member.id)}
                      className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                        isSelected
                          ? 'border-violet-500 bg-violet-500/15 text-violet-100'
                          : 'border-zinc-700 bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      {member.name}
                      {member.role ? (
                        <span className="ml-2 text-xs font-normal text-zinc-400">
                          {member.role}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mt-8">
            <label htmlFor="booking-date" className="text-lg font-semibold text-white">
              Date
            </label>
            <input
              id="booking-date"
              type="date"
              value={selectedDate}
              min={todayDate || undefined}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500"
            />
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-white">Available time</h2>
            {isLoadingSlots ? (
              <p className="mt-3 text-sm text-zinc-400">Loading available slots...</p>
            ) : null}

            {!isLoadingSlots && slotsResult.slots.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {slotsResult.slots.map((slot) => {
                  const isSelected = selectedSlotTime === slot.value;

                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setSelectedSlotTime(slot.value)}
                      className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                        isSelected
                          ? 'border-violet-500 bg-violet-500/15 text-violet-100'
                          : 'border-zinc-700 bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {!isLoadingSlots && !slotsResult.slots.length ? (
              <p className="mt-3 text-sm text-rose-300">
                {slotsResult.reason || 'No available slots for this date.'}
              </p>
            ) : null}
          </section>

          <section className="mt-8 rounded-2xl border border-zinc-800 bg-[#18181B] p-5">
            <h2 className="text-lg font-semibold text-white">Your details</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="client-name" className="text-sm text-zinc-400">
                  Full name
                </label>
                <input
                  id="client-name"
                  type="text"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label htmlFor="client-phone" className="text-sm text-zinc-400">
                  Phone
                </label>
                <input
                  id="client-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Phone number"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label htmlFor="client-email" className="text-sm text-zinc-400">
                  Email
                </label>
                <input
                  id="client-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label htmlFor="client-notes" className="text-sm text-zinc-400">
                  Notes (optional)
                </label>
                <textarea
                  id="client-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Anything else we should know?"
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </section>

          {submitError ? (
            <p className="mt-4 text-sm text-rose-300">{submitError}</p>
          ) : null}

          <button
            type="button"
            onClick={onConfirmBooking}
            disabled={isSubmitting || !services.length}
            className="mt-6 w-full rounded-2xl bg-violet-600 px-5 py-4 text-base font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Processing...'
              : isPublicBookingPaymentRequired(business)
                ? 'Continue to Payment'
                : 'Confirm Booking'}
          </button>
        </>
      ) : null}
    </>
  );
}
