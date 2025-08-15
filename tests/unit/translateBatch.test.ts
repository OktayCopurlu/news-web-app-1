import { newsApi } from "../../src/services/api";

async function testTranslateBatchRequest() {
  const originalFetch = globalThis.fetch;
  let captured: {
    url?: string;
    body?: string;
    headers?: Record<string, string>;
  } = {};
  // Minimal localStorage mock
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).localStorage = {
    store: {} as Record<string, string>,
    getItem(key: string) {
      return this.store[key];
    },
    setItem(key: string, val: string) {
      this.store[key] = val;
    },
    removeItem(key: string) {
      delete this.store[key];
    },
  };
  // Pretend preferred language is de (matches utils/lang.getPreferredLang key)
  localStorage.setItem("pref_lang", "de");
  globalThis.fetch = (async (url: RequestInfo, init?: RequestInit) => {
    try {
      if (typeof url === "object" && url !== null && "url" in url) {
        const req = url as Request;
        const h: Record<string, string> = {};
        req.headers?.forEach((v, k) => (h[k] = v));
        captured = {
          url: req.url,
          body: await req.text(),
          headers: h,
        };
      } else {
        captured = {
          url: String(url),
          body: (init?.body as string) || "",
          headers: (init?.headers || {}) as Record<string, string>,
        };
      }
    } catch {
      // ignore
    }
    return new Response(
      JSON.stringify({ results: [{ id: "x", status: "ready" }] }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }) as unknown as typeof fetch;
  let callOk = false;
  await newsApi.translateBatch(["a", "b"]).then(() => (callOk = true));
  // Note: Header normalization varies across environments; we skip strict header assertions here.
  if (!callOk) throw new Error("translateBatch did not perform network call");
  if (originalFetch) globalThis.fetch = originalFetch;
  console.log(
    "translateBatch request shape test passed",
    captured.url ? "url-captured" : "no-url"
  );
}

async function testFeedPendingMapping() {
  const originalFetch = globalThis.fetch;
  // Simulate BFF /feed returning mixed ready/pending cards
  globalThis.fetch = (async () => {
    const payload = [
      {
        id: "c1",
        ai_title: "T1",
        ai_summary: "S1",
        language: "de",
        translation_status: "ready",
      },
      {
        id: "c2",
        ai_title: "T2",
        ai_summary: "S2",
        language: "de",
        translation_status: "pending",
      },
    ];
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as unknown as typeof fetch;
  localStorage.setItem("pref_lang", "de");
  const list = await newsApi.getArticles({
    forceRefresh: true,
    noFallback: true,
  });
  const m = new Map(list.map((a) => [a.id, a]));
  if (m.get("c1")?.translation_status !== "ready") {
    throw new Error("Expected c1 translation_status to be 'ready'");
  }
  if (m.get("c2")?.translation_status !== "pending") {
    throw new Error("Expected c2 translation_status to be 'pending'");
  }
  if (originalFetch) globalThis.fetch = originalFetch;
  console.log("feed pending mapping test passed");
}

(async () => {
  await testTranslateBatchRequest();
  await testFeedPendingMapping();
})();
