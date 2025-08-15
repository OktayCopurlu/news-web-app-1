import { apiFetch, HttpError } from "../../src/utils/fetcher";

async function run() {
  // minimal localStorage mock
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).localStorage = {
    store: {} as Record<string, string>,
    getItem(key: string) {
      return this.store[key];
    },
    setItem(key: string, val: string) {
      this.store[key] = val;
    },
    removeItem(key: string) {
      delete this.store[key];
    },
  };
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  globalThis.fetch = (async () => {
    callCount++;
    if (callCount < 2) throw new TypeError("Simulated network failure");
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as unknown as typeof fetch;
  const res = await apiFetch<{ ok?: boolean }>({ path: "/test", retries: 2 });
  if (!res || typeof res !== "object") throw new Error("Retry logic failed");
  globalThis.fetch = (async () =>
    new Response("boom", { status: 500 })) as unknown as typeof fetch;
  let caught = false;
  try {
    await apiFetch({ path: "/err" });
  } catch (e) {
    // Accept either instanceof or structural match
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err: any = e;
    if (
      e instanceof HttpError ||
      (err && typeof err.status === "number" && err.status === 500)
    )
      caught = true;
    if (!caught) console.error("Unexpected error object", e);
  }
  if (!caught)
    throw new Error("Expected HttpError or network error fallback on failure");
  if (originalFetch) globalThis.fetch = originalFetch;
  console.log("apiFetch retry + HTTP error test passed");
}
run();
