// FX adapter — free, no key required (open.er-api.com).
// Returns { USD:1, NGN:n, GHS:g, KES:k } (units of currency per 1 USD).
// Falls back to the caller's curated rates if the fetch fails.
const { fetchJson } = require("../http");

const WANTED = ["NGN", "GHS", "KES"];

async function fetchFxRates() {
  const data = await fetchJson("https://open.er-api.com/v6/latest/USD");
  if (!data || data.result !== "success" || !data.rates) {
    throw new Error("fx: bad response");
  }
  const out = { USD: 1 };
  for (const c of WANTED) {
    if (typeof data.rates[c] === "number") out[c] = data.rates[c];
  }
  return out;
}

module.exports = { fetchFxRates };
