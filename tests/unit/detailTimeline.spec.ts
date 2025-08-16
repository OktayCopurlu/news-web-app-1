import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { newsApi } from "../../src/services/api";

declare global {
  // eslint-disable-next-line no-var
  var __origFetch: typeof fetch | undefined;
}

describe("detail timeline mapping", () => {
  beforeEach(() => {
    global.__origFetch = globalThis.fetch;
  });
  afterEach(() => {
    if (global.__origFetch) globalThis.fetch = global.__origFetch;
  });

  it("maps timeline and citations from envelope", async () => {
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
    expect(detail.ai_explanation).toBeTruthy();
    expect(detail.timeline?.length).toBe(2);
    expect(detail.citations?.length).toBe(1);
  });
});
