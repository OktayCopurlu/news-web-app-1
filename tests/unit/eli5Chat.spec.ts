import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { aiApi } from "../../src/services/api";
import { setPreferredLang } from "../../src/utils/lang";

declare global {
  // eslint-disable-next-line no-var
  var __origFetch: typeof fetch | undefined;
}

describe("ELI5 chat", () => {
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
    };
    (globalThis as any).window = { location: { href: "http://localhost/" } };
    setPreferredLang("en");
    global.__origFetch = globalThis.fetch;
  });
  afterEach(() => {
    if (global.__origFetch) globalThis.fetch = global.__origFetch;
  });

  it("uses cluster chat endpoint and returns content", async () => {
    const captured: string[] = [];
    globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
      captured.push(String(url));
      return new Response(
        JSON.stringify({ messages: [{ content: "ELI5 summary here." }] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as unknown as typeof fetch;

    const resp = await aiApi.sendMessage("clu_1", "Explain like I'm 5", []);
    expect(Array.isArray(resp.messages)).toBe(true);
    expect(captured.some((u) => u.includes("/cluster/clu_1/chat"))).toBe(true);
  });
});
