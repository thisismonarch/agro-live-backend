// Commodity price adapter.
//
// Goal: return { <agrofixKey>: pricePerKgUSD } for whatever the provider covers.
// Anything not covered is simply omitted, and the caller keeps the curated
// benchmark price for that commodity (and labels it "sample").
//
// IMPORTANT — units: providers quote different units (bushel, lb, tonne).
// Converting to $/kg differs per commodity, so we keep an explicit conversion
// table below and a SANITY GUARD in market.js that rejects any live value wildly
// off the curated benchmark (protects against a unit mismatch putting, say,
// $17/kg maize on screen). Verify the conversions against your provider's docs
// before trusting the numbers in production.
const { fetchJson } = require("../http");

// Map Agrofix commodity keys -> provider symbols.
const SYMBOLS = {
  "commodities-api": {
    maize: "CORN", wheat: "WHEAT", rice: "RICE", coffee: "COFFEE",
    soybean: "SOYBEAN", palm: "PALM_OIL", cocoa: "COCOA",
    // cassava: no liquid global market — stays curated.
  },
  twelvedata: {
    maize: "CORN", wheat: "WHEAT", coffee: "COFFEE", soybean: "SOYBN",
    // twelvedata commodity coverage varies by plan; unmapped stay curated.
  },
};

// Approx kg per quoted unit, per commodity. Used to normalise provider prices
// to $/kg. Grains are quoted per bushel (weight differs by grain).
const KG_PER_UNIT = {
  maize: 25.4,   // corn: 1 bushel ≈ 25.4 kg
  wheat: 27.2,   // wheat/soy: 1 bushel ≈ 27.2 kg
  soybean: 27.2,
  rice: 1,       // often quoted per cwt/tonne; guard will catch mismatches
  coffee: 0.4536,// quoted per lb
  palm: 1000,    // crude palm oil often per tonne
  cocoa: 1000,   // cocoa often per tonne
};

// --- Commodities-API: returns rates as commodity-per-1-USD (price = 1/rate) ---
async function fromCommoditiesApi(key) {
  const wanted = SYMBOLS["commodities-api"];
  const symbols = Object.values(wanted).join(",");
  const url = `https://commodities-api.com/api/latest?access_key=${encodeURIComponent(key)}&base=USD&symbols=${symbols}`;
  const data = await fetchJson(url);
  if (!data || data.success === false || !data.rates) {
    throw new Error("commodities-api: bad response");
  }
  const out = {};
  for (const [agroKey, sym] of Object.entries(wanted)) {
    const rate = data.rates[sym];
    if (!rate || rate <= 0) continue;
    const pricePerUnit = 1 / rate;              // USD per provider unit
    const kg = KG_PER_UNIT[agroKey] || 1;
    out[agroKey] = pricePerUnit / kg;           // USD per kg
  }
  return out;
}

// --- Twelve Data: /price returns { price } per symbol (USD per contract unit) -
async function fromTwelveData(key) {
  const wanted = SYMBOLS.twelvedata;
  const out = {};
  for (const [agroKey, sym] of Object.entries(wanted)) {
    try {
      const url = `https://api.twelvedata.com/price?symbol=${sym}&apikey=${encodeURIComponent(key)}`;
      const data = await fetchJson(url);
      const price = parseFloat(data && data.price);
      if (!price || Number.isNaN(price)) continue;
      const kg = KG_PER_UNIT[agroKey] || 1;
      out[agroKey] = price / kg;
    } catch {
      /* skip this symbol, keep curated */
    }
  }
  if (Object.keys(out).length === 0) throw new Error("twelvedata: no prices");
  return out;
}

// Returns { key: pricePerKgUSD } or {} when no provider configured.
async function fetchCommodityPrices() {
  const provider = (process.env.COMMODITY_PROVIDER || "none").toLowerCase();
  const key = process.env.COMMODITY_API_KEY || "";
  if (provider === "none" || !key) return {};
  if (provider === "commodities-api") return fromCommoditiesApi(key);
  if (provider === "twelvedata") return fromTwelveData(key);
  return {};
}

module.exports = { fetchCommodityPrices };
