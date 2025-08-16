import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { newsApi } from "../../src/services/api";

declare global {
  // eslint-disable-next-line no-var
  var __origFetch: typeof fetch | undefined;
}

describe("translateBatch + feed pending mapping", () => {
  beforeEach(() => {
    global.__origFetch = globalThis.fetch;
  });
  afterEach(() => {
    if (global.__origFetch) globalThis.fetch = global.__origFetch;
  });

  it("calls translate batch endpoint and returns results", async () => {
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
    localStorage.setItem("pref_lang", "de");
    let capturedUrl = "";
    globalThis.fetch = (async (url: RequestInfo, init?: RequestInit) => {
      capturedUrl = typeof url === "string" ? url : (url as Request).url;
      return new Response(
        JSON.stringify({ results: [{ id: "x", status: "ready" }] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as unknown as typeof fetch;

    await newsApi.translateBatch(["a", "b"]);
    expect(capturedUrl.includes("/translate/batch")).toBe(true);
  });

  it("maps feed translation_status values", async () => {
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
    expect(m.get("c1")?.translation_status).toBe("ready");
    expect(m.get("c2")?.translation_status).toBe("pending");
  });
});
