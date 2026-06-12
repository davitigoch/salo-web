# Deploy SALO Web to Vercel

This guide walks through deploying the public booking site (`salo-web`) to Vercel production.

**Repository:** https://github.com/davitigoch/salo-web  
**Production route to verify:** `/book/davitgochiashvili-d11351`

---

## Prerequisites

- GitHub account with access to `davitigoch/salo-web`
- [Vercel account](https://vercel.com/signup) (GitHub login works)
- Supabase project credentials from the SALO mobile app (same backend)

Copy the Supabase values from the Expo app `.env` file:

| Mobile app (Expo) | Vercel (salo-web) |
|-------------------|-------------------|
| `EXPO_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_ANON_KEY |

The values are identical — only the variable names differ.

---

## 1. Push salo-web to GitHub

If the repo is not on GitHub yet:

```bash
cd /path/to/salo-web
git remote add origin https://github.com/davitigoch/salo-web.git
git push -u origin main
```

Confirm the latest commit is on `main`:

```bash
git status
git log -1 --oneline
```

You should see `Your branch is up to date with 'origin/main'`.

---

## 2. Create a Vercel project

1. Open [vercel.com/new](https://vercel.com/new).
2. Under **Import Git Repository**, choose **GitHub** and authorize Vercel if prompted.
3. Select **`davitigoch/salo-web`**.
4. On the **Configure Project** screen, confirm:

   | Setting | Value |
   |---------|-------|
   | Framework Preset | Next.js (auto-detected) |
   | Root Directory | `./` (leave default) |
   | Build Command | `next build` (default) |
   | Output Directory | (default — leave empty) |
   | Install Command | `npm install` (default) |

5. **Do not deploy yet** — add environment variables first (steps 3–4).

---

## 3. Configure `NEXT_PUBLIC_SUPABASE_URL`

1. On the project setup page (or later: **Project → Settings → Environment Variables**), click **Add**.
2. Set:

   | Field | Value |
   |-------|-------|
   | Key | `NEXT_PUBLIC_SUPABASE_URL` |
   | Value | Your Supabase project URL, e.g. `https://YOUR-PROJECT-REF.supabase.co` |
   | Environments | Production, Preview, Development |

3. Save the variable.

Get the URL from [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings → API → Project URL**, or copy `EXPO_PUBLIC_SUPABASE_URL` from the mobile app `.env`.

---

## 4. Configure `NEXT_PUBLIC_SUPABASE_ANON_KEY`

1. Add another environment variable:

   | Field | Value |
   |-------|-------|
   | Key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
   | Value | Your Supabase anon/public key (`sb_publishable_...` or legacy JWT anon key) |
   | Environments | Production, Preview, Development |

2. Save the variable.

Get the key from Supabase **Settings → API → Project API keys → anon public**, or copy `EXPO_PUBLIC_SUPABASE_ANON_KEY` from the mobile app `.env`.

> **Security:** Use the **anon** key only. Never add the Supabase `service_role` key to Vercel or any client-facing env.

---

## 5. Deploy production build

1. Click **Deploy** on the Vercel setup page (or **Deployments → Redeploy** if the project already exists).
2. Wait for the build to finish. A successful deploy shows:
   - `✓ Compiled successfully`
   - `Route (app)` includes `ƒ /book/[slug]`
3. Note the production URL, e.g. `https://salo-web.vercel.app` or your custom domain.

**Optional — confirm build locally before deploying:**

```bash
npm run build
npm run start
```

---

## 6. Verify `/book/davitgochiashvili-d11351` on production

Open:

```text
https://YOUR-VERCEL-DOMAIN/book/davitgochiashvili-d11351
```

Replace `YOUR-VERCEL-DOMAIN` with the URL from step 5.

### Checklist

- [ ] Page loads with **Davitgochiashvili Salon** (no 404, no blank screen)
- [ ] At least one service is listed (e.g. **Shgs**)
- [ ] **Team member** section loads (staff buttons or “Any available staff”)
- [ ] **Date** picker shows today’s date after the page loads
- [ ] **Available time** slots appear for the selected date
- [ ] Fill in **Full name**, pick a time slot, click **Confirm Booking**
- [ ] Success state shows **Booking requested**

### If something fails

| Symptom | Likely cause |
|---------|----------------|
| Build fails on Vercel | Check build logs; run `npm run build` locally |
| Page 404 | Confirm slug exists and `public_booking_enabled` is true for the business in Supabase |
| “Team availability unavailable” | RPC permissions; confirm anon can call `get_public_staff_members` |
| Booking insert fails | RLS policy for public booking insert; confirm anon has INSERT on `bookings` |
| Env vars missing at runtime | Redeploy after adding variables; ensure both `NEXT_PUBLIC_*` vars are set for **Production** |

---

## Post-deploy

- **Custom domain:** Vercel → Project → **Settings → Domains**
- **Redeploy after env changes:** Deployments → ⋮ → **Redeploy**
- **Preview deployments:** Each PR gets a preview URL; use the same `NEXT_PUBLIC_*` vars for Preview if you want booking to work on previews

---

## Quick reference

```env
# Required Vercel environment variables
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

```text
# Production smoke test
https://YOUR-VERCEL-DOMAIN/book/davitgochiashvili-d11351
```
