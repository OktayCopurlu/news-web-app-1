import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { apiFetch, HttpError } from "../../src/utils/fetcher";

declare global {
  // eslint-disable-next-line no-var
  var __origFetch: typeof fetch | undefined;
}

describe("apiFetch", () => {
  beforeEach(() => {
    // minimal localStorage mock
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
    global.__origFetch = globalThis.fetch;
  });
  afterEach(() => {
    if (global.__origFetch) globalThis.fetch = global.__origFetch;
  });

  it("retries and returns JSON on success", async () => {
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
    expect(res && typeof res === "object").toBe(true);
  });

  it("throws HttpError on 500", async () => {
    globalThis.fetch = (async () =>
      new Response("boom", { status: 500 })) as unknown as typeof fetch;
    await expect(apiFetch({ path: "/err" })).rejects.toSatisfy((e: unknown) => {
      const err = e as any;
      return (
        e instanceof HttpError ||
        (err && typeof err.status === "number" && err.status === 500)
      );
    });
  });
});
