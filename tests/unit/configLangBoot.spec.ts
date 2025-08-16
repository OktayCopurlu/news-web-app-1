import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { newsApi } from "../../src/services/api";
import { getPreferredLang, setPreferredLang } from "../../src/utils/lang";

declare global {
  // eslint-disable-next-line no-var
  var __origFetch: typeof fetch | undefined;
}

describe("config-driven language default selection", () => {
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

  it("sets pivot lang when none stored, preserves stored value afterwards", async () => {
    localStorage.removeItem("pref_lang");
    const seen: string[] = [];
    globalThis.fetch = (async (url: string | URL) => {
      const href = String(url);
      seen.push(href);
      if (href.includes("/config")) {
        const payload = {
          market: {
            market_code: "global",
            pivot_lang: "tr",
            show_langs: ["tr", "de"],
            pretranslate_langs: ["ar"],
          },
        };
        return new Response(JSON.stringify(payload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    await newsApi.getConfig();
    expect(
      seen.some((u) => u.includes("/config") && /\bmarket=global\b/.test(u))
    ).toBe(true);
    expect(getPreferredLang()).toBe("tr");

    setPreferredLang("de");
    await newsApi.getConfig();
    expect(getPreferredLang()).toBe("de");
  });
});
