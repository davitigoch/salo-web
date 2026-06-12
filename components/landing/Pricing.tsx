const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'For solo stylists and small teams getting started with online booking.',
    features: [
      '1 location',
      'Online booking page',
      'Client profiles',
      'Email reminders',
      'Basic analytics',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'For growing salons that need AI tools, automation, and team coordination.',
    features: [
      'Up to 3 locations',
      'AI assistant',
      'SMS reminders',
      'Staff scheduling',
      'Advanced analytics',
      'Payments integration',
    ],
    cta: 'Start Free',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For salon groups and franchises with custom workflows and dedicated support.',
    features: [
      'Unlimited locations',
      'Custom AI workflows',
      'Priority support',
      'SSO & admin controls',
      'Dedicated onboarding',
      'SLA & compliance',
    ],
    cta: 'Book Demo',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/5 px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300/80">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Plans that scale with your salon
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            Start free, upgrade when you are ready. No hidden fees on online bookings.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? 'border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-[#121218] shadow-xl shadow-violet-950/30'
                  : 'border-zinc-800 bg-[#121218]'
              }`}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              ) : null}

              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight text-white">{plan.price}</span>
                {plan.period ? (
                  <span className="mb-1 text-sm text-zinc-400">{plan.period}</span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{plan.description}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="mt-0.5 text-violet-400">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.cta === 'Book Demo' ? 'mailto:hello@salo.app?subject=SALO%20Demo' : '#'}
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                  plan.highlighted
                    ? 'bg-violet-600 text-white hover:bg-violet-500'
                    : 'border border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500'
                }`}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
