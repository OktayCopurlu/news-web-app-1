// Central runtime configuration (frozen)
// Works in Vite (import.meta.env) and plain Node (tests) fallback
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env: Record<string, string | undefined> =
  (typeof import.meta !== "undefined" && (import.meta as any).env) ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (typeof process !== "undefined" ? (process.env as any) : {});

export const CONFIG = Object.freeze({
  BFF_URL: env.VITE_BFF_URL || "http://localhost:4000",
  FETCH_TIMEOUT_MS: 8000,
});
