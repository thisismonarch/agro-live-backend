// Simple TTL cache with optional file persistence.
//
// This is the cost lever for the whole app: every value fetched from a paid
// or rate-limited API is cached here so we hit the provider a handful of times
// a day instead of once per page view. Cached values survive a restart because
// they're mirrored to data/.cache.json.
const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "..", "data", ".cache.json");
let store = {}; // key -> { value, expires }

// Load persisted cache on boot (best-effort).
try {
  if (fs.existsSync(CACHE_FILE)) {
    store = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) || {};
  }
} catch {
  store = {};
}

let flushTimer = null;
function persist() {
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(store));
    } catch {
      /* non-fatal: cache is best-effort */
    }
  }, 250);
}

function get(key) {
  const hit = store[key];
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    delete store[key];
    return null;
  }
  return hit.value;
}

// Return a stale value even if expired — used as a fallback when a live
// refresh fails, so the app degrades gracefully instead of going blank.
function getStale(key) {
  const hit = store[key];
  return hit ? hit.value : null;
}

function set(key, value, ttlMinutes) {
  store[key] = { value, expires: Date.now() + ttlMinutes * 60 * 1000 };
  persist();
  return value;
}

// Fetch-through helper: return cached value or run loader() and cache it.
// If loader throws, fall back to any stale cached value, else rethrow.
async function remember(key, ttlMinutes, loader) {
  const fresh = get(key);
  if (fresh !== null) return fresh;
  try {
    const value = await loader();
    return set(key, value, ttlMinutes);
  } catch (err) {
    const stale = getStale(key);
    if (stale !== null) return stale;
    throw err;
  }
}

module.exports = { get, getStale, set, remember };
