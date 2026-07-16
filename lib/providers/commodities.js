// Commodity price adapter.
//
// Supports three providers via COMMODITY_PROVIDER: "commodities-api",
// "twelvedata", "commoditypriceapi" (commoditypriceapi.com -- genuinely free,
// no card required, recommended for testing before committing to a paid plan).
//
// Goal: return { <agrofixKey>: pricePerKgUSD } for whatever the provider covers.
// Anything not covered is simply omitted, and the caller keeps the curated
// benchmark price for that commodity (and labels it "sample").
//
// UNITS — this is the part that silently produces wrong prices if guessed.
// Commodities-API does NOT quote everything the same way: corn and soybeans
// are cents-per-bushel (their native CBOT convention), coffee is cents-per-lb
// (ICE convention), wheat and cocoa are dollars-per-metric-ton, and rice is
// dollars-per-hundredweight (cwt). These were verified against curated
// benchmarks (back-solved from a live API sample), not assumed. The same
// exchange conventions (CBOT/ICE) apply regardless of which API resells the
// data, so the fallback table below is reused for commoditypriceapi too.
//
// The API's /latest response can also include a "unit" object naming the
// unit per symbol (e.g. "per cwt", "per metric ton", or CommodityPriceAPI's
// "metaData": { SYM: { unit, quote } } shape). When present, we prefer it
// over our hardcoded table below — it's authoritative. When absent, we fall
// back to the verified table.
//
// Either way, lib/market.js applies a final sanity guard that rejects any
// live price wildly off the curated benchmark — a safety net if a provider
// changes its convention or adds a symbol with a different unit than expected.
const { fetchJson } = require("../http");

// Map Agrofix commodity keys -> provider symbols.
const SYMBOLS = {
  "commodities-api": {
    maize: "MAIZE", wheat: "WHEAT", rice: "RICE", coffee: "COFFEE",
    soybean: "SOYBEANS", cocoa: "COCOA",
    // Palm oil: no confirmed plain spot symbol at time of writing — the
    // visible symbol list shows only dated futures (e.g. "KOF26"). Try "PALM
    // OIL" first; if your account shows a different/better symbol (check
    // https://www.commodities-api.com/symbols after signup), update this.
    palm: "PALM OIL",
    // cassava: no liquid global market — stays curated on every provider.
  },
  twelvedata: {
    // Confirmed via Twelve Data's /commodities endpoint docs.
    maize: "CORN", wheat: "WHEAT", coffee: "COFFEE", soybean: "SOYBN", cocoa: "CC1",
    // Rice and palm oil are not offered in Twelve Data's commodities coverage
    // (grains/softs list is corn, wheat, coffee, cocoa, livestock) — omitted
    // so they fall back to curated benchmarks instead of guessing a symbol.
  },
  commoditypriceapi: {
    // Confirmed via commoditypriceapi.com/symbols: CORN WHEAT SOYBEANS
    // COFFEE COCOA RICE all appear as plain top-level symbols.
    maize: "CORN", wheat: "WHEAT", rice: "RICE", coffee: "COFFEE",
    soybean: "SOYBEANS", cocoa: "COCOA",
    // Palm oil: not in their published symbol list — stays curated.
  },
};

// Physical weight per traded unit, used to normalize to $/kg.
const KG = {
  bushel_maize: 25.4,     // 1 bushel corn ~ 25.4 kg
  bushel_soy: 27.2,       // 1 bushel soybeans/wheat ~ 27.2 kg
  cwt: 45.359237,         // 1 hundredweight = 100 lb
  lb: 0.45359237,
  tonne: 1000,
};

// --- CONVENTIONS ---------------------------------------------------------
// Per-commodity: how to turn a raw Commodities-API rate into USD/kg when the
// response has NO "unit" field to read. Verified by back-solving against
// curated benchmarks — each matches how that market actually trades (e.g.
// corn genuinely trades in cents/bushel on CBOT).
//   toKgPrice(rawRate) -> USD per kg
const COMMODITIES_API_CONVENTIONS = {
  maize:   (raw) => (raw / 100) / KG.bushel_maize,  // cents/bushel
  soybean: (raw) => (raw / 100) / KG.bushel_soy,    // cents/bushel
  coffee:  (raw) => (raw / 100) / KG.lb,            // cents/lb
  wheat:   (raw) => raw / KG.tonne,                 // $/metric ton
  cocoa:   (raw) => raw / KG.tonne,                 // $/metric ton
  rice:    (raw) => raw / KG.cwt,                   // $/cwt
  palm:    (raw) => raw / KG.tonne,                 // $/metric ton (best guess -- verify)
};

// If the API DOES return a "unit" string for a symbol, map it to a kg factor.
// (raw value is assumed already in dollars, i.e. not cents, when a unit
// string is present -- Commodities-API's own docs example shows this.)
const UNIT_STRING_TO_KG = {
  "per cwt": KG.cwt,
  "per hundredweight": KG.cwt,
  "per lb": KG.lb,
  "per pound": KG.lb,
  "per metric ton": KG.tonne,
  "per tonne": KG.tonne,
  "per ton": KG.tonne,
  "per kg": 1,
  "per kilogram": 1,
};

// --- Commodities-API ------------------------------------------------------
async function fromCommoditiesApi(key) {
  const wanted = SYMBOLS["commodities-api"];
  const symbols = Object.values(wanted).join(",");
  const url = `https://commodities-api.com/api/latest?access_key=${encodeURIComponent(key)}&base=USD&symbols=${encodeURIComponent(symbols)}`;
  const data = await fetchJson(url);
  if (!data || data.success === false || !data.rates) {
    throw new Error("commodities-api: bad response");
  }
  const out = {};
  for (const [agroKey, sym] of Object.entries(wanted)) {
    const raw = data.rates[sym];
    if (typeof raw !== "number" || raw <= 0) continue; // symbol not returned -- skip, keep curated

    let pricePerKg;
    const unitStr = data.unit && data.unit[sym] && String(data.unit[sym]).toLowerCase();
    if (unitStr && UNIT_STRING_TO_KG[unitStr]) {
      // API told us the unit directly -- trust it over our guess table.
      pricePerKg = raw / UNIT_STRING_TO_KG[unitStr];
    } else {
      const convert = COMMODITIES_API_CONVENTIONS[agroKey];
      if (!convert) continue;
      pricePerKg = convert(raw);
    }
    if (Number.isFinite(pricePerKg) && pricePerKg > 0) out[agroKey] = pricePerKg;
  }
  return out;
}

// --- Twelve Data: /price returns { price } per symbol ---------------------
// Corn, wheat, and soybeans are quoted cents/bushel (CBOT convention);
// coffee is cents/lb (ICE); cocoa (CC1) is dollars/metric ton (ICE cocoa is
// quoted in outright $/tonne, not cents).
const TWELVEDATA_CONVENTIONS = {
  maize:   (raw) => (raw / 100) / KG.bushel_maize,
  wheat:   (raw) => (raw / 100) / KG.bushel_soy, // CBOT wheat bushel weight
  soybean: (raw) => (raw / 100) / KG.bushel_soy,
  coffee:  (raw) => (raw / 100) / KG.lb,
  cocoa:   (raw) => raw / KG.tonne,
};

async function fromTwelveData(key) {
  const wanted = SYMBOLS.twelvedata;
  const out = {};
  for (const [agroKey, sym] of Object.entries(wanted)) {
    try {
      const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(sym)}&apikey=${encodeURIComponent(key)}`;
      const data = await fetchJson(url);
      const raw = parseFloat(data && data.price);
      if (!raw || Number.isNaN(raw)) continue;
      const convert = TWELVEDATA_CONVENTIONS[agroKey];
      if (!convert) continue;
      const pricePerKg = convert(raw);
      if (Number.isFinite(pricePerKg) && pricePerKg > 0) out[agroKey] = pricePerKg;
    } catch {
      /* skip this symbol, keep curated */
    }
  }
  if (Object.keys(out).length === 0) throw new Error("twelvedata: no prices");
  return out;
}

// --- CommodityPriceAPI (commoditypriceapi.com) -----------------------------
// Free, no card required. Response shape (confirmed from their own docs):
//   { success, rates: { SYM: rawPrice }, metaData: { SYM: { unit, quote } } }
// Some of their own examples spell it "metadata" (lowercase d) — we check
// both. If "quote" for a symbol isn't USD, we skip it rather than guess a
// currency conversion (only relevant on paid tiers where quote is selectable;
// the free/Lite tier returns each commodity's default quote currency, which
// is USD for the grains/softs we use here).
async function fromCommodityPriceApi(key) {
  const wanted = SYMBOLS.commoditypriceapi;
  const symbols = Object.values(wanted).join(",");
  const url = `https://api.commoditypriceapi.com/v2/rates/latest?symbols=${encodeURIComponent(symbols)}&quote=USD`;
  const data = await fetchJson(url, { headers: { "x-api-key": key } });
  if (!data || data.success !== true || !data.rates) {
    throw new Error("commoditypriceapi: bad response");
  }
  const meta = data.metaData || data.metadata || {};
  const out = {};
  for (const [agroKey, sym] of Object.entries(wanted)) {
    const raw = data.rates[sym];
    if (typeof raw !== "number" || raw <= 0) continue; // symbol not returned -- skip, keep curated

    const symMeta = meta[sym] || {};
    if (symMeta.quote && symMeta.quote !== "USD") continue; // don't guess a currency conversion

    let pricePerKg;
    const unitStr = symMeta.unit && String(symMeta.unit).toLowerCase();
    if (unitStr && UNIT_STRING_TO_KG[unitStr]) {
      pricePerKg = raw / UNIT_STRING_TO_KG[unitStr];
    } else {
      // Same exchange (CBOT/ICE) conventions apply regardless of reseller.
      const convert = COMMODITIES_API_CONVENTIONS[agroKey];
      if (!convert) continue;
      pricePerKg = convert(raw);
    }
    if (Number.isFinite(pricePerKg) && pricePerKg > 0) out[agroKey] = pricePerKg;
  }
  return out;
}

// Returns { key: pricePerKgUSD } or {} when no provider configured.
async function fetchCommodityPrices() {
  const provider = (process.env.COMMODITY_PROVIDER || "none").toLowerCase();
  const key = process.env.COMMODITY_API_KEY || "";
  if (provider === "none" || !key) return {};
  if (provider === "commodities-api") return fromCommoditiesApi(key);
  if (provider === "twelvedata") return fromTwelveData(key);
  if (provider === "commoditypriceapi") return fromCommodityPriceApi(key);
  return {};
}

module.exports = { fetchCommodityPrices };
