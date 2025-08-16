import { newsApi } from "../../src/services/api";
import { setPreferredLang } from "../../src/utils/lang";

function setupLocalStorageMock() {
  // minimal localStorage mock
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
  // ensure no ?lang in query from a prior test; minimal window mock
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).window = {
    location: { href: "http://localhost/" },
    dispatchEvent: () => {},
  };

  const originalFetch = globalThis.fetch;
  try {
    // First call with default EN
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
        const payload = [
          { id: "c1", ai_title: "T1", ai_summary: "S1", language: "en" },
        ];
        return new Response(JSON.stringify(payload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      // unrelated calls from other tests -> return benign OK
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    await newsApi.getArticles({ forceRefresh: true, noFallback: true });
    if (!captured1.url?.includes("lang=en")) {
      console.error("languageSwitch debug first URL:", captured1.url);
      throw new Error("Expected first call to include lang=en in query");
    }
    const h1 = captured1.headers || {};
    if ((h1["Accept-Language"] || h1["accept-language"]) !== "en") {
      throw new Error("Expected Accept-Language: en on first call");
    }

    // Switch to DE and verify fetch uses new lang
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
        const payload = [
          { id: "c2", ai_title: "T2", ai_summary: "S2", language: "de" },
        ];
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

    await newsApi.getArticles({ forceRefresh: true, noFallback: true });
    if (!captured2.url?.includes("lang=de")) {
      console.error("languageSwitch debug second URL:", captured2.url);
      throw new Error("Expected second call to include lang=de in query");
    }
    const h2 = captured2.headers || {};
    if ((h2["Accept-Language"] || h2["accept-language"]) !== "de") {
      throw new Error("Expected Accept-Language: de on second call");
    }

    console.log("language switch test passed");
  } finally {
    if (originalFetch) globalThis.fetch = originalFetch;
  }
})();
