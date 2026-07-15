# Agrofix — Live Market Intelligence

A deployable version of the Agrofix commodity terminal. A thin backend holds your
API keys, fetches and **caches** market data, and serves the frontend. It runs
today with **zero keys** (falling back to clearly-labelled sample data) and goes
live the moment you add a commodity API key.

## Architecture

```
Browser (public/index.html)
        │  fetch /api/market
        ▼
server.js (Express)  ──►  lib/market.js  ──►  providers: commodities / fx / weather
        │                       │                      (keys live here, never in browser)
        │                       └──►  data/corridors.json  (your curated local prices)
        └──►  cache.js  (TTL cache = the cost lever: ~4 fetches/day, not per visitor)
```

Why a backend at all: you cannot call a paid data API from the browser — the key
would be exposed and you'd blow your rate limit on every page view. The backend
holds the key, caches results, and serves everyone from cache.

## Run it locally

```bash
npm install
cp .env.example .env      # optional — it runs without editing
npm start                 # http://localhost:3000
```

With no `.env`, the terminal shows an amber "Sample data" banner. That's expected.

## Go live, one feed at a time

Only **commodity prices** cost money. FX and weather are free and need no key.

### 1. Commodity prices (the paid feed)

Pick a provider, put the key in `.env`:

```
COMMODITY_PROVIDER=commodities-api   # or: twelvedata
COMMODITY_API_KEY=your_key_here
COMMODITY_TTL_MINUTES=360            # 4x/day is plenty for soft commodities
```

Candidates (all have free/cheap tiers): Commodities-API, Twelve Data (~$29/mo),
API Ninjas, Commoditic. Coverage and **license terms** differ more than price —
see the caveat below.

> **⚠️ Units.** Providers quote per bushel / lb / tonne. `lib/providers/commodities.js`
> converts to $/kg with an explicit table, and `lib/market.js` rejects any live
> price wildly off the curated benchmark (a safety net against a unit mismatch).
> Verify the conversions against your provider's docs before trusting the numbers.

### 2. FX and weather (free, already on)

FX uses `open.er-api.com`, weather uses Open-Meteo — no keys. Adjust cache TTLs
in `.env` if you like. Set `WEATHER_LIVE=false` to use curated weather only.

### 3. Your local corridors (your real moat)

Global APIs don't carry African local/spot prices. Edit `data/corridors.json` to
add prices you have verified (AFEX, regional exchanges, national bureaus, your own
field data). Each entry overrides that country's price in the terminal and is
tagged as a local price with its source. The file ships with clearly-marked
**PLACEHOLDER** values — replace them before you rely on them.

## Payments (optional — only if you gate the terminal)

The app is free/open by default. To charge, use **Paystack or Flutterwave** (Stripe
does not pay out to Nigeria). Add to `.env`:

```
PAYSTACK_SECRET=sk_...
PAYSTACK_PUBLIC=pk_...
PAYSTACK_PLAN_AMOUNT=500000   # ₦5,000 in kobo
```

Endpoints `POST /api/pay/init` and `GET /api/pay/verify/:ref` activate automatically.
Recommendation: launch free to validate demand, add gating only once people ask to pay.

## Deploy

Any Node host works. The backend + static files deploy as one app.

- **Railway / Render / Fly.io / Hetzner ($5 VPS):** `npm start`, set env vars in the dashboard.
- **Vercel / Netlify:** serve `public/` statically and port `server.js` routes to
  serverless functions (one function per `/api/*` route), reusing the `lib/*` modules.
- Point a domain (`.com` / `.africa` / `.ng`) and enable HTTPS (automatic on all the above).

## Two things that can quietly bite you

1. **Data redistribution license.** Some cheap commodity-API tiers forbid showing
   their data to end users. If you display prices to subscribers, confirm your plan
   permits commercial redistribution before building on it.
2. **Local prices are curated, not fetched.** They're your differentiator and your
   manual work — keep `corridors.json` current and dated.

## Project layout

```
server.js              Express: static + /api + legal + payments
lib/market.js          Assembles base + live + corridors (source of truth)
lib/cache.js           TTL cache w/ file persistence (the cost lever)
lib/providers/*.js     commodities, fx, weather adapters (+ mock fallback)
data/dataset.js        Curated base/fallback dataset (8 commodities)
data/corridors.json    Your curated local prices  ← edit this
public/index.html      The terminal (fetches /api/market)
legal/*.html           Terms & Privacy (fill placeholders)
payments/paystack.js   Optional Paystack integration
```

See `LAUNCH-CHECKLIST.md` for the step-by-step path to launch.
