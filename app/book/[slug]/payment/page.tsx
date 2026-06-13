import PublicBookingPaymentReturn from '@/components/PublicBookingPaymentReturn';

type PaymentPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string; session_id?: string }>;
};

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  return (
    <div className="min-h-full bg-[#0B0B0F] text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-10 sm:px-8 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">
          SALO
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Payment</h1>
        <PublicBookingPaymentReturn
          slug={slug}
          status={query.status ?? null}
          sessionId={query.session_id ?? null}
        />
      </div>
    </div>
  );
}
