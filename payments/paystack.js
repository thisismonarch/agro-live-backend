// Optional Paystack integration for a paid "Pro" tier.
// Entirely inert unless PAYSTACK_SECRET is set — the app stays free/open by
// default. Paystack (or Flutterwave) is the right choice in Nigeria; Stripe
// does not pay out to NG accounts.
const { fetchJson } = require("../lib/http");

function enabled() {
  return !!process.env.PAYSTACK_SECRET;
}

async function api(pathname, method, body) {
  const res = await fetch("https://api.paystack.co" + pathname, {
    method,
    headers: {
      Authorization: "Bearer " + process.env.PAYSTACK_SECRET,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.status) throw new Error(data.message || "paystack error");
  return data.data;
}

// Start a subscription/one-off payment. Returns a checkout URL to redirect to.
async function initTransaction(email, amountKobo) {
  const amount = amountKobo || parseInt(process.env.PAYSTACK_PLAN_AMOUNT || "500000", 10);
  const data = await api("/transaction/initialize", "POST", { email, amount });
  return { authorizationUrl: data.authorization_url, reference: data.reference };
}

// Verify a completed payment by reference. Returns { paid, email, amount }.
async function verifyTransaction(reference) {
  const data = await api("/transaction/verify/" + encodeURIComponent(reference), "GET");
  return { paid: data.status === "success", email: data.customer && data.customer.email, amount: data.amount };
}

module.exports = { enabled, initTransaction, verifyTransaction };
