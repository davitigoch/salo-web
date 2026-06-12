export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-[100px]" />
        <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            AI-native salon operations
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            AI-Powered Salon{' '}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
              Management Platform
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Bookings, clients, reminders, payments, and business insights in one place.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#pricing"
              className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500 sm:w-auto"
            >
              Start Free
            </a>
            <a
              href="#pricing"
              className="inline-flex w-full items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/60 px-8 py-3.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900 sm:w-auto"
            >
              Book Demo
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-[#121218]/80 p-1 shadow-2xl shadow-violet-950/30 backdrop-blur-sm">
            <div className="rounded-xl border border-white/5 bg-[#18181B] p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-3 text-xs text-zinc-500">SALO Dashboard</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-xs text-zinc-500">Today&apos;s bookings</p>
                  <p className="mt-1 text-2xl font-semibold text-white">24</p>
                  <p className="mt-2 text-xs text-emerald-400">+18% vs last week</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-xs text-zinc-500">AI reminders sent</p>
                  <p className="mt-1 text-2xl font-semibold text-white">156</p>
                  <p className="mt-2 text-xs text-violet-300">98% delivery rate</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-xs text-zinc-500">Revenue forecast</p>
                  <p className="mt-1 text-2xl font-semibold text-white">$12.4k</p>
                  <p className="mt-2 text-xs text-zinc-400">Next 30 days</p>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-200">Upcoming appointments</p>
                    <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold text-violet-200">
                      AI sorted
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {['Color & cut — 10:30 AM', 'Balayage — 1:00 PM', 'Blowout — 3:15 PM'].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-[#0B0B0F]/60 px-3 py-2 text-xs text-zinc-300"
                      >
                        <span>{item}</span>
                        <span className="text-zinc-500">Confirmed</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <p className="text-sm font-medium text-violet-100">AI Assistant</p>
                  <p className="mt-3 text-xs leading-5 text-violet-100/70">
                    &ldquo;3 clients haven&apos;t rebooked in 6 weeks. Send personalized win-back
                    offers?&rdquo;
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-lg bg-violet-600/30 px-2.5 py-1 text-[10px] font-semibold text-violet-100">
                      Send now
                    </span>
                    <span className="rounded-lg border border-violet-500/30 px-2.5 py-1 text-[10px] text-violet-200/80">
                      Review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
