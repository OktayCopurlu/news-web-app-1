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

(function run() {
  setupLocalStorageMock();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).window = { location: { href: "http://localhost/" } };

  setPreferredLang("tr");
  const originalFetch = globalThis.fetch;
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
      const payload = {
        data: {
          id: "abc",
          ai_title: "Başlık",
          ai_summary: "Özet",
          ai_details: "Detaylar",
          language: "tr",
          citations: [{ id: "c1", url: "https://example.com" }],
          timeline: [{ id: "t1", happened_at: new Date().toISOString() }],
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

  newsApi
    .getArticle("abc")
    .then(() => {
      if (!captured.url?.includes("lang=tr")) {
        throw new Error("Expected detail request to include lang=tr in query");
      }
      const h = captured.headers || {};
      if ((h["Accept-Language"] || h["accept-language"]) !== "tr") {
        throw new Error("Expected Accept-Language: tr on detail request");
      }
      console.log("detail Accept-Language test passed");
    })
    .finally(() => {
      if (originalFetch) globalThis.fetch = originalFetch;
    });
})();
