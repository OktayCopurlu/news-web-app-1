// Central runtime configuration (frozen)
// Works in Vite (import.meta.env) and plain Node (tests) fallback
// Resolve environment in both Vite and Node test contexts without direct import.meta reference
const env: Record<string, string | undefined> = (() => {
  try {
    // Use eval to avoid TS parse restriction under CommonJS module
    const viteEnv = eval("import.meta")?.env as
      | Record<string, string>
      | undefined;
    if (viteEnv) return viteEnv;
  } catch {
    // ignore
  }
  const pe = typeof process !== "undefined" ? process.env : undefined;
  return (
    pe ? (pe as unknown as Record<string, string | undefined>) : {}
  ) as Record<string, string | undefined>;
})();

export const CONFIG = Object.freeze({
  BFF_URL: env.VITE_BFF_URL || "http://localhost:4000",
  FETCH_TIMEOUT_MS: 8000,
});
