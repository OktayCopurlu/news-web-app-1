import { aiApi } from "../../src/services/api";
import { setPreferredLang } from "../../src/utils/lang";

(async function run() {
  // Minimal localStorage + window
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
  };
  (globalThis as any).window = { location: { href: "http://localhost/" } };
  setPreferredLang("en");

  const originalFetch = globalThis.fetch;
  try {
    const captured: string[] = [];
    globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
      captured.push(String(url));
      return new Response(
        JSON.stringify({ messages: [{ content: "ELI5 summary here." }] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as unknown as typeof fetch;

    const resp = await aiApi.sendMessage("clu_1", "Explain like I'm 5", []);
    // Debug: show which endpoints were called
    console.log("eli5Chat captured:", captured);
    if (!Array.isArray(resp.messages) || !resp.messages[0]?.content) {
      throw new Error("Expected chat API to return messages with content");
    }
    if (!captured.some((u) => u.includes("/cluster/clu_1/chat"))) {
      throw new Error("Expected cluster chat endpoint to be used");
    }
    console.log("ELI5 chat smoke test passed");
  } finally {
    if (originalFetch) globalThis.fetch = originalFetch;
  }
})();
