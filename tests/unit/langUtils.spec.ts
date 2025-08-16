import { describe, it, expect, beforeEach } from "vitest";
import {
  normalizeLang,
  getPreferredLang,
  setPreferredLang,
  isRtlLang,
  dirFor,
} from "../../src/utils/lang";

describe("lang utils", () => {
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
      clear() {
        this.store = {};
      },
    };
  });

  it("normalizeLang normalizes input and defaults to en", () => {
    expect(normalizeLang("EN_us")).toBe("en-US");
    expect(normalizeLang("")).toBe("en");
  });

  it("set/getPreferredLang round-trips", () => {
    setPreferredLang("tr");
    expect(getPreferredLang()).toBe("tr");
  });

  it("rtl helpers", () => {
    expect(isRtlLang("ar")).toBe(true);
    expect(dirFor("ar")).toBe("rtl");
    expect(dirFor("en")).toBe("ltr");
  });
});
