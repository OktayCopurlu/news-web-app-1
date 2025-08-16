import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { newsApi } from "../../src/services/api";
import { setPreferredLang } from "../../src/utils/lang";

declare global {
  // eslint-disable-next-line no-var
  var __origFetch: typeof fetch | undefined;
}

describe("language switch fetch headers and query", () => {
  beforeEach(() => {
    (globalThis as any).localStorage = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key];
      },
      setItem(key: string, val: string) {
        this.store[key] = String(val);
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };
    (globalThis as any).window = {
      location: { href: "http://localhost/" },
      dispatchEvent: () => {},
    };
    global.__origFetch = globalThis.fetch;
  });
  afterEach(() => {
    if (global.__origFetch) globalThis.fetch = global.__origFetch;
  });

  it("adds lang and Accept-Language and updates after switching", async () => {
    const originalFetch = globalThis.fetch;
    setPreferredLang("en");
    let captured1: { url?: string; headers?: Record<string, string> } = {};
    globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/feed")) {
        captured1 = {
          url: u,
          headers: Object.fromEntries(
            Object.entries((init?.headers as Record<string, string>) || {}).map(
              ([k, v]) => [k.toString(), String(v)]
            )
          ),
        };
        return new Response(
          JSON.stringify([
            { id: "c1", ai_title: "T1", ai_summary: "S1", language: "en" },
          ]),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;
    await newsApi.getArticles({ forceRefresh: true, noFallback: true });
    expect(captured1.url?.includes("lang=en")).toBe(true);
    const h1 = captured1.headers || {};
    expect(h1["Accept-Language"] || h1["accept-language"]).toBe("en");

    setPreferredLang("de");
    let captured2: { url?: string; headers?: Record<string, string> } = {};
    globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/feed")) {
        captured2 = {
          url: u,
          headers: Object.fromEntries(
            Object.entries((init?.headers as Record<string, string>) || {}).map(
              ([k, v]) => [k.toString(), String(v)]
            )
          ),
        };
        return new Response(
          JSON.stringify([
            { id: "c2", ai_title: "T2", ai_summary: "S2", language: "de" },
          ]),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;
    await newsApi.getArticles({ forceRefresh: true, noFallback: true });
    expect(captured2.url?.includes("lang=de")).toBe(true);
    const h2 = captured2.headers || {};
    expect(h2["Accept-Language"] || h2["accept-language"]).toBe("de");

    if (originalFetch) globalThis.fetch = originalFetch;
  });
});
