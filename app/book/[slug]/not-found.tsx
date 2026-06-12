export default function BookNotFound() {
  return (
    <div className="flex min-h-full items-center justify-center bg-[#0B0B0F] px-6 py-16 text-center text-white">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">
          SALO
        </p>
        <h1 className="mt-4 text-3xl font-bold">Booking page unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          This salon booking page was not found, or public booking is disabled for this business.
        </p>
      </div>
    </div>
  );
}
