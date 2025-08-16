import { newsApi } from "../../src/services/api";
import { setPreferredLang } from "../../src/utils/lang";

function setupLocalStorageMock() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
}

(async function run() {
  setupLocalStorageMock();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).window = { location: { href: "http://localhost/" } };

  const originalFetch = globalThis.fetch;
  try {
    let calls: number = 0;

    // First: en fetch and cache
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
    if (calls !== 1)
      throw new Error("Expected one network call for first en fetch");

    // Second: same lang should hit cache (no new fetch)
    await newsApi.getArticle("abc");
    if (calls !== 1)
      throw new Error("Expected cached result for second en fetch");

    // Third: switch to de should cause a new fetch
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
      if ((hdrs["Accept-Language"] || hdrs["accept-language"]) !== "de") {
        throw new Error("Expected Accept-Language: de on de fetch");
      }
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
    if (Number(calls) !== 2)
      throw new Error("Expected second network call for de fetch");

    // Fourth: same de should be cached (no new fetch)
    await newsApi.getArticle("abc");
    if (Number(calls) !== 2)
      throw new Error("Expected cached result for second de fetch");

    console.log("article per-lang cache test passed");
  } finally {
    if (originalFetch) globalThis.fetch = originalFetch;
  }
})();
