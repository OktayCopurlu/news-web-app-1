import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { newsApi } from "../../src/services/api";
import { setPreferredLang } from "../../src/utils/lang";

declare global {
  // eslint-disable-next-line no-var
  var __origFetch: typeof fetch | undefined;
}

describe("article cache per lang", () => {
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

  it("caches by lang and includes correct headers and query", async () => {
    let calls = 0;

    setPreferredLang("en");
    globalThis.fetch = (async (url: string | URL) => {
      const u = String(url);
      if (!u.includes("/cluster/")) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      calls++;
      const payload = {
        data: {
          id: "abc",
          ai_title: "Title EN",
          ai_summary: "Summary EN",
          ai_details: "Details EN",
          language: "en",
        },
      };
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;
    await newsApi.getArticle("abc");
    expect(calls).toBe(1);

    await newsApi.getArticle("abc");
    expect(calls).toBe(1);

    setPreferredLang("de");
    globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
      const u = String(url);
      if (!u.includes("/cluster/")) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      calls++;
      const hdrs = Object.fromEntries(
        Object.entries((init?.headers as Record<string, string>) || {}).map(
          ([k, v]) => [k.toString(), String(v)]
        )
      );
      if ((hdrs["Accept-Language"] || hdrs["accept-language"]) !== "de")
        throw new Error("Expected Accept-Language: de on de fetch");
      if (!u.includes("lang=de"))
        throw new Error("Expected lang=de in detail URL");
      const payload = {
        data: {
          id: "abc",
          ai_title: "Title DE",
          ai_summary: "Summary DE",
          ai_details: "Details DE",
          language: "de",
        },
      };
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;
    await newsApi.getArticle("abc");
    expect(calls).toBe(2);

    await newsApi.getArticle("abc");
    expect(calls).toBe(2);
  });
});
