type StripeReturnPageProps = {
  searchParams: Promise<{ businessId?: string }>;
};

export default async function StripeReturnPage({ searchParams }: StripeReturnPageProps) {
  const query = await searchParams;
  const businessId = query.businessId?.trim();

  return (
    <div className="flex min-h-full items-center justify-center bg-[#0B0B0F] px-6 py-16 text-center text-white">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">
          SALO
        </p>
        <h1 className="mt-4 text-3xl font-bold">Stripe setup submitted</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          You can close this page and return to the SALO app. Open Payment Settings and pull to
          refresh to see your updated Stripe connection status.
        </p>
        {businessId ? (
          <p className="mt-4 text-xs text-zinc-500">Business ID: {businessId}</p>
        ) : null}
      </div>
    </div>
  );
}
