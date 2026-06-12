export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">
        SALO
      </p>
      <h1 className="mt-4 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
        Public booking website
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400">
        Open a salon booking page at{' '}
        <code className="rounded bg-zinc-900 px-2 py-1 text-violet-300">/book/[slug]</code>.
      </p>
      <p className="mt-6 text-xs text-zinc-500">
        Example: /book/your-salon-slug
      </p>
    </main>
  );
}
