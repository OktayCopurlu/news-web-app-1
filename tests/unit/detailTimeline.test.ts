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

  setPreferredLang("en");
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = (async (url: string | URL) => {
      const u = String(url);
      if (u.includes("/cluster/")) {
        const payload = {
          data: {
            id: "cl1",
            ai_title: "Cluster Title",
            ai_summary: "Cluster Summary",
            ai_details: "Cluster Details",
            language: "en",
            citations: [
              {
                id: "c1",
                title: "Ref 1",
                url: "https://ref.example/1",
                source_name: "Src",
              },
            ],
            timeline: [
              {
                id: "t1",
                text: "Event 1",
                happened_at: "2025-08-15T12:00:00.000Z",
              },
              {
                id: "t2",
                text: "Event 2",
                happened_at: "2025-08-16T09:00:00.000Z",
              },
            ],
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

    const detail = await newsApi.getArticle("cl1");
    if (!detail.ai_explanation)
      throw new Error("Expected ai_explanation to be mapped from details");
    if (!detail.timeline || detail.timeline.length !== 2)
      throw new Error("Expected timeline with 2 items");
    if (!detail.citations || detail.citations.length !== 1)
      throw new Error("Expected citations with 1 item");
    console.log("detail timeline mapping test passed");
  } finally {
    if (originalFetch) globalThis.fetch = originalFetch;
  }
})();
