import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { newsApi } from "../../src/services/api";
import { setPreferredLang } from "../../src/utils/lang";

declare global {
  // eslint-disable-next-line no-var
  var __origFetch: typeof fetch | undefined;
}

describe("detail Accept-Language and lang param", () => {
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
    (globalThis as any).window = { location: { href: "http://localhost/" } };
    global.__origFetch = globalThis.fetch;
  });
  afterEach(() => {
    if (global.__origFetch) globalThis.fetch = global.__origFetch;
  });

  it("sends correct headers and query", async () => {
    setPreferredLang("tr");
    let captured: { url?: string; headers?: Record<string, string> } = {};
    globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/cluster/")) {
        captured = {
          url: u,
          headers: Object.fromEntries(
            Object.entries((init?.headers as Record<string, string>) || {}).map(
              ([k, v]) => [k.toString(), String(v)]
            )
          ),
        };
        return new Response(
          JSON.stringify({
            data: {
              id: "abc",
              ai_title: "Başlık",
              ai_summary: "Özet",
              ai_details: "Detaylar",
              language: "tr",
              citations: [{ id: "c1", url: "https://example.com" }],
              timeline: [{ id: "t1", happened_at: new Date().toISOString() }],
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    await newsApi.getArticle("abc");
    expect(captured.url?.includes("lang=tr")).toBe(true);
    const h = captured.headers || {};
    expect(h["Accept-Language"] || h["accept-language"]).toBe("tr");
  });
});
