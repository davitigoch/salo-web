import {
  BellIcon,
  BuildingIcon,
  CalendarIcon,
  ChartIcon,
  SparklesIcon,
  UsersIcon,
} from '@/components/landing/icons';

const features = [
  {
    title: 'Online Booking',
    description:
      'Share a branded booking link and let clients schedule services 24/7 from any device.',
    icon: CalendarIcon,
  },
  {
    title: 'AI Assistant',
    description:
      'Get smart suggestions for follow-ups, scheduling gaps, and client retention opportunities.',
    icon: SparklesIcon,
  },
  {
    title: 'Client Management',
    description:
      'Keep visit history, preferences, and notes in one profile your team can access instantly.',
    icon: UsersIcon,
  },
  {
    title: 'Automated Reminders',
    description:
      'Reduce no-shows with SMS and email reminders triggered automatically before each visit.',
    icon: BellIcon,
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Track revenue, booking trends, and staff performance with clear, actionable insights.',
    icon: ChartIcon,
  },
  {
    title: 'Multi-location Support',
    description:
      'Manage multiple salon locations, teams, and schedules from a single SALO workspace.',
    icon: BuildingIcon,
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-white/5 px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300/80">
            Features
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your salon needs to grow
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            From first booking to repeat visits, SALO automates the busywork so you can focus on
            clients.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-zinc-800 bg-[#121218] p-6 transition hover:border-violet-500/40 hover:bg-[#16161c]"
              >
                <div className="inline-flex rounded-xl border border-violet-500/20 bg-violet-500/10 p-3 text-violet-300 transition group-hover:border-violet-500/40 group-hover:bg-violet-500/15">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
