import { newsApi } from "../../src/services/api";
import { getPreferredLang, setPreferredLang } from "../../src/utils/lang";

function setupLocalStorageMock() {
  // minimal localStorage mock
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
  // minimal window mock for URL parsing in utils
  (globalThis as any).window = { location: { href: "http://localhost/" } };

  const originalFetch = globalThis.fetch;
  try {
    // Ensure no preferred language stored initially
    localStorage.removeItem("pref_lang");

    // Mock /config response with pivot_lang=tr and show_langs/pretranslate_langs
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

    // Call getConfig -> should set default language to pivot when none stored
    await newsApi.getConfig();
    const matched = seen.some(
      (u) => u.includes("/config") && /\bmarket=global\b/.test(u)
    );
    if (!matched)
      throw new Error(
        `Expected at least one /config?market=global call. Seen: ${seen.join(
          ", "
        )}`
      );
    if (getPreferredLang() !== "tr") {
      throw new Error(
        `Expected default preferred lang to switch to pivot 'tr', got '${getPreferredLang()}'`
      );
    }

    // If a language is already stored, getConfig should NOT override it
    setPreferredLang("de");
    await newsApi.getConfig();
    if (getPreferredLang() !== "de") {
      throw new Error("Expected stored preferred lang to be preserved");
    }

    console.log("config-driven language default selection test passed");
  } finally {
    if (originalFetch) globalThis.fetch = originalFetch;
  }
})();
