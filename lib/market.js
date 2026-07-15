// Market assembler — the single source of truth the frontend fetches.
// Takes the curated base dataset and overlays live commodity prices, FX and
// weather where available, plus curated corridor local prices. Every feed is
// cached (see cache.js) and degrades to the curated base if a provider fails,
// so /api/market ALWAYS returns a full, renderable payload.
const fs = require("fs");
const path = require("path");
const cache = require("./cache");
const { fetchCommodityPrices } = require("./providers/commodities");
const { fetchFxRates } = require("./providers/fx");
const { fetchWeatherFor } = require("./providers/weather");
const base = require("../data/dataset");

const clone = (o) => JSON.parse(JSON.stringify(o));
const num = (name, def) => {
  const v = parseInt(process.env[name], 10);
  return Number.isFinite(v) ? v : def;
};

// Sanity guard: reject any live price wildly off the curated benchmark. This is
// the safety net for a provider unit mismatch — better to show the curated
// number than a nonsense one. Bounds are deliberately generous.
function withinSanity(live, benchmark) {
  if (!benchmark || benchmark <= 0) return true;
  const ratio = live / benchmark;
  return ratio >= 0.25 && ratio <= 4;
}

function loadCorridors() {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "corridors.json"), "utf8"));
    return raw.corridors || {};
  } catch {
    return {};
  }
}

async function getCommodityPrices() {
  try {
    return await cache.remember("commodities", num("COMMODITY_TTL_MINUTES", 360), fetchCommodityPrices);
  } catch {
    return {};
  }
}
async function getFx() {
  try {
    return await cache.remember("fx", num("FX_TTL_MINUTES", 720), fetchFxRates);
  } catch {
    return null;
  }
}
async function getWeather(regions) {
  try {
    return await cache.remember(
      "weather",
      num("WEATHER_TTL_MINUTES", 180),
      () => fetchWeatherFor(regions)
    );
  } catch {
    return {};
  }
}

async function assembleMarket() {
  const products = clone(base.products);
  const exchangeRates = clone(base.exchangeRates);
  const meta = {
    updatedAt: new Date().toISOString(),
    provider: (process.env.COMMODITY_PROVIDER || "none").toLowerCase(),
    live: { commodities: false, fx: false, weather: false },
    liveCommodities: [],
    sampleCommodities: [],
    localCorridors: [],
    sources: [],
  };

  // 1) Live commodity prices (scale the whole commodity's country prices with it)
  const livePrices = await getCommodityPrices();
  for (const [key, product] of Object.entries(products)) {
    const live = livePrices[key];
    if (typeof live === "number" && withinSanity(live, product.pricePerKg)) {
      const ratio = live / product.pricePerKg;
      product.pricePerKg = round4(live);
      for (const c of Object.values(product.countries)) c.price = round4(c.price * ratio);
      product._live = true;
      meta.liveCommodities.push(key);
      meta.live.commodities = true;
    } else {
      product._live = false;
      meta.sampleCommodities.push(key);
    }
  }
  if (meta.live.commodities) meta.sources.push("Commodity prices: " + meta.provider);

  // 2) Curated corridor local prices (override country price, tag as local)
  const corridors = loadCorridors();
  for (const [key, byCountry] of Object.entries(corridors)) {
    const product = products[key];
    if (!product) continue;
    for (const [country, info] of Object.entries(byCountry)) {
      if (!product.countries[country]) {
        product.countries[country] = { price: 0, volume: 0, status: "Local", change: 0, yoy: 0 };
      }
      product.countries[country].price = round4(info.price);
      product.countries[country].local = true;
      product.countries[country].source = info.source;
      product.countries[country].asOf = info.asOf;
      meta.localCorridors.push(`${key}/${country}`);
    }
  }
  if (meta.localCorridors.length) meta.sources.push("Local corridors: curated (see data/corridors.json)");

  // 3) FX
  const fx = await getFx();
  if (fx) {
    Object.assign(exchangeRates, fx);
    meta.live.fx = true;
    meta.sources.push("FX: open.er-api.com");
  }

  // 4) Weather overlay
  const regions = [];
  for (const p of Object.values(products)) regions.push(...Object.keys(p.weather || {}));
  const weather = await getWeather(regions);
  if (weather && Object.keys(weather).length) {
    for (const p of Object.values(products)) {
      for (const region of Object.keys(p.weather || {})) {
        if (weather[region]) p.weather[region] = { ...p.weather[region], ...weather[region] };
      }
    }
    meta.live.weather = true;
    meta.sources.push("Weather: Open-Meteo");
  }

  meta.mode = meta.live.commodities ? "live" : "sample";
  return { products, exchangeRates, meta };
}

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

module.exports = { assembleMarket };
