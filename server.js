// Agrofix server — the thin backend.
// Serves the static terminal, holds the API keys, fetches + caches market data,
// and never exposes a provider key to the browser.
const path = require("path");
const express = require("express");
const { loadEnv } = require("./lib/env");
loadEnv();

const { assembleMarket } = require("./lib/market");
const paystack = require("./payments/paystack");

const app = express();
app.use(express.json());

// --- CORS ---------------------------------------------------------------
// Lets your GitHub Pages site (a different domain) call this API from the
// browser. The endpoints below are read-only market data / health, so open
// CORS is low-risk; tighten to your exact Pages origin if you prefer.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const PORT = process.env.PORT || 3000;

// --- API: the assembled market (live where keys exist, sample otherwise) -----
app.get("/api/market", async (req, res) => {
  try {
    const market = await assembleMarket();
    res.set("Cache-Control", "public, max-age=120");
    res.json(market);
  } catch (err) {
    console.error("market error:", err.message);
    res.status(500).json({ error: "Failed to assemble market" });
  }
});

// --- API: health / status ----------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    commodityProvider: (process.env.COMMODITY_PROVIDER || "none").toLowerCase(),
    payments: paystack.enabled() ? "paystack" : "disabled",
    time: new Date().toISOString(),
  });
});

// --- API: payments (only active when PAYSTACK_SECRET is set) ------------------
app.post("/api/pay/init", async (req, res) => {
  if (!paystack.enabled()) return res.status(404).json({ error: "Payments disabled" });
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "email required" });
    res.json(await paystack.initTransaction(email));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});
app.get("/api/pay/verify/:ref", async (req, res) => {
  if (!paystack.enabled()) return res.status(404).json({ error: "Payments disabled" });
  try {
    res.json(await paystack.verifyTransaction(req.params.ref));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// --- Legal pages -------------------------------------------------------------
app.use("/legal", express.static(path.join(__dirname, "legal")));

// --- Static frontend ---------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Agrofix running on http://localhost:${PORT}`);
  console.log(`  commodity provider: ${(process.env.COMMODITY_PROVIDER || "none").toLowerCase()}`);
  console.log(`  payments: ${paystack.enabled() ? "paystack" : "disabled"}`);
});
