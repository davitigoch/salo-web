const steps = [
  {
    step: '01',
    title: 'Create your salon',
    description:
      'Set up your business profile, services, staff, and availability in minutes with guided onboarding.',
  },
  {
    step: '02',
    title: 'Share booking link',
    description:
      'Publish your unique SALO booking page on Instagram, Google, and your website — no code required.',
  },
  {
    step: '03',
    title: 'Get bookings automatically',
    description:
      'Clients book online, reminders go out automatically, and your dashboard stays up to date in real time.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/5 px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300/80">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Launch in three simple steps
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            Go from setup to your first online booking without complicated tools or integrations.
          </p>
        </div>

        <div className="relative mt-14 grid gap-8 lg:grid-cols-3">
          <div className="pointer-events-none absolute left-[16.666%] right-[16.666%] top-10 hidden h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent lg:block" />

          {steps.map((item) => (
            <article
              key={item.step}
              className="relative rounded-2xl border border-zinc-800 bg-[#121218] p-8"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-sm font-bold text-violet-200">
                {item.step}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
