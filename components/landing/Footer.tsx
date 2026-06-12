import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: 'mailto:hello@salo.app' },
    { label: 'Book demo', href: 'mailto:hello@salo.app?subject=SALO%20Demo' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#09090d] px-6 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/90">
              SALO
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
              The AI-powered salon management platform for modern teams. Bookings, clients, and
              growth — all in one place.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-white">{group}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-400 transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} SALO. All rights reserved.
          </p>
          <p className="text-xs text-zinc-500">
            Built for salons that want smarter operations.
          </p>
        </div>
      </div>
    </footer>
  );
}
