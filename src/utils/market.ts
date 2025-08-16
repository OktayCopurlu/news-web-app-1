// Market helpers: one source of truth for selecting the active market on FE

export function normalizeMarket(input?: string | null): string {
  if (!input || typeof input !== "string") return "global";
  const s = input.trim().toLowerCase();
  if (!s) return "global";
  // allow letters, numbers, dash and underscore
  const clean = s.replace(/[^a-z0-9_-]/g, "");
  return clean || "global";
}

function getQueryMarket(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const u = new URL(window.location.href);
    const q = u.searchParams.get("market");
    return q ? normalizeMarket(q) : null;
  } catch {
    return null;
  }
}

export function getPreferredMarket(): string {
  const fromQuery = getQueryMarket();
  if (fromQuery) return fromQuery;
  try {
    if (typeof localStorage !== "undefined") {
      const v = localStorage.getItem("pref_market");
      if (v) return normalizeMarket(v);
    }
  } catch {
    // ignore storage unavailability
  }
  return "global";
}

export function setPreferredMarket(market: string) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("pref_market", normalizeMarket(market));
    }
  } catch {
    // ignore storage unavailability
  }
}
