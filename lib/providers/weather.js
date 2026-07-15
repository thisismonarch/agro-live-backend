// Weather adapter — free, no key required (Open-Meteo).
// Produces { condition, yield, risk } for known growing regions, overlaid on
// the curated weather. Unknown region names keep their curated values.
const { fetchJson } = require("../http");

// Coordinates for the growing regions that appear in the dataset.
// Add rows here as you add regions/corridors.
const REGION_COORDS = {
  "USA Midwest": [41.9, -93.6],
  "Brazil": [-15.8, -47.9],
  "Argentina": [-34.6, -58.4],
  "Ukraine": [50.4, 30.5],
  "Russia": [55.7, 37.6],
  "China": [39.9, 116.4],
  "India": [28.6, 77.2],
  "Nigeria": [9.1, 7.5],
  "Ghana": [7.9, -1.0],
  "Ivory Coast": [7.5, -5.5],
  "Côte d'Ivoire": [7.5, -5.5],
  "Kenya": [-0.02, 37.9],
  "Ethiopia": [9.1, 40.5],
  "Vietnam": [16.0, 108.0],
  "Indonesia": [-2.5, 118.0],
  "Malaysia": [4.2, 101.9],
  "Thailand": [15.9, 100.9],
  "West Africa": [8.0, 0.0],
  "Colombia": [4.6, -74.1],
  "Egypt": [26.8, 30.8],
};

function classify(tempC, precipMm, code) {
  // Very rough agronomic read from current conditions.
  let condition = "Normal weather";
  let risk = "Low";
  let yieldPct = 90;
  if (code >= 95) { condition = "Storms"; risk = "High"; yieldPct = 75; }
  else if (precipMm >= 8) { condition = "Heavy rainfall"; risk = "Medium"; yieldPct = 84; }
  else if (precipMm >= 1) { condition = "Adequate rainfall"; risk = "Low"; yieldPct = 92; }
  else if (tempC >= 35) { condition = "Heat stress"; risk = "High"; yieldPct = 78; }
  else if (precipMm < 0.2 && tempC >= 28) { condition = "Dry conditions"; risk = "Medium"; yieldPct = 83; }
  return { condition, risk, yield: yieldPct };
}

async function fetchRegionWeather(region) {
  const coords = REGION_COORDS[region];
  if (!coords) return null;
  const [lat, lon] = coords;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code`;
  const data = await fetchJson(url, { timeoutMs: 6000 });
  const cur = data && data.current;
  if (!cur) return null;
  return classify(cur.temperature_2m ?? 20, cur.precipitation ?? 0, cur.weather_code ?? 0);
}

// Given the set of region names used across all products, fetch what we can.
// Returns a map { region: { condition, yield, risk } }.
async function fetchWeatherFor(regions) {
  if (process.env.WEATHER_LIVE === "false") return {};
  const unique = [...new Set(regions)].filter((r) => REGION_COORDS[r]);
  const out = {};
  const results = await Promise.allSettled(unique.map((r) => fetchRegionWeather(r)));
  results.forEach((res, i) => {
    if (res.status === "fulfilled" && res.value) out[unique[i]] = res.value;
  });
  return out;
}

module.exports = { fetchWeatherFor, REGION_COORDS };
