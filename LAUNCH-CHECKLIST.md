# Agrofix Launch Checklist

Work top to bottom. Everything above "Launch" gets you live and free; everything
below is optional monetisation. Estimated: a focused weekend.

## Phase 0 — Run it (5 min)
- [ ] `npm install`
- [ ] `npm start`, open http://localhost:3000, sign in with any email
- [ ] Confirm the amber "Sample data" banner shows (proves the loader works)

## Phase 1 — Real data
- [ ] Choose a commodity API and **check its redistribution license** (can you show data to users?)
- [ ] Add `COMMODITY_PROVIDER` + `COMMODITY_API_KEY` to `.env`, restart
- [ ] Confirm banner turns teal ("Live market data") and prices look sane
- [ ] Spot-check 2–3 commodities against a public source (units are the usual gotcha)
- [ ] Leave FX + weather on the free defaults (no action needed)

## Phase 2 — Your corridors (the differentiator)
- [ ] Edit `data/corridors.json` — replace PLACEHOLDER prices with 2–3 corridors you actually know
- [ ] Set an accurate `source` and `asOf` on each
- [ ] Confirm those countries show your local price in the terminal

## Phase 3 — Ship it
- [ ] Fill the placeholders in `legal/terms.html` and `legal/privacy.html`; get a quick legal review
- [ ] Pick a host (Railway / Render / Fly / Hetzner) and deploy
- [ ] Set all `.env` vars in the host dashboard (never commit `.env`)
- [ ] Register a domain (`.com` / `.africa` / `.ng`) and point it; confirm HTTPS
- [ ] Test the deployed URL end to end on mobile + desktop
- [ ] Set up uptime monitoring (UptimeRobot free) on `/api/health`

## 🚀 Launch (free / freemium) — validate demand

## Phase 4 — Monetise (only once people ask to pay)
- [ ] Create a Paystack (or Flutterwave) account; add `PAYSTACK_SECRET` / `PAYSTACK_PUBLIC`
- [ ] Decide what's free vs paid (e.g. free viewer, paid corridors/alerts/API)
- [ ] Wire the paywall to `/api/pay/init` + `/api/pay/verify`
- [ ] Add auth (Supabase Auth / Clerk free tier) to remember who paid
- [ ] Test a real ₦ transaction end to end

## Ongoing
- [ ] Keep `corridors.json` fresh and dated
- [ ] Watch API usage vs. your plan; raise cache TTLs if you approach limits
- [ ] Add analytics (Plausible / PostHog free) to see which commodities/corridors get used
