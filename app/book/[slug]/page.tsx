import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BookingFlow from '@/components/BookingFlow';
import { fetchPublicBookingPage } from '@/lib/booking';

export const dynamic = 'force-dynamic';

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await fetchPublicBookingPage(slug);

  if (!data) {
    return {
      title: 'Booking unavailable | SALO',
    };
  }

  return {
    title: `Book ${data.business.business_name} | SALO`,
    description:
      data.business.description || `Book an appointment at ${data.business.business_name}.`,
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const { data, error } = await fetchPublicBookingPage(slug);

  if (!data) {
    notFound();
  }

  const { business, services } = data;

  return (
    <div className="min-h-full bg-[#0B0B0F] text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-10 sm:px-8 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">
          SALO
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {business.business_name}
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400">
          {business.description || 'Luxury salon booking experience'}
        </p>

        <BookingFlow business={business} services={services} servicesError={error} />

        <p className="mt-10 text-xs text-zinc-500">Booking link: /book/{business.slug}</p>
      </div>
    </div>
  );
}
