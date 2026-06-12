# SALO Web

Customer-facing public booking website for SALO salons.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (same project as the SALO mobile app)

## Setup

1. Copy env vars from the mobile app project:

```bash
cp .env.example .env.local
```

2. Set the same Supabase values used by the Expo app:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. Run the dev server:

```bash
npm run dev
```

4. Open a booking page:

```text
http://localhost:3000/book/your-salon-slug
```

## Routes

| Route | Purpose |
|-------|---------|
| `/book/[slug]` | Public booking page for a salon |

## Deploy

Deploy to Vercel and add the same `NEXT_PUBLIC_*` environment variables in the project settings.
