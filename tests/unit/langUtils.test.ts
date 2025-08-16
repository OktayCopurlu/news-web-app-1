import { normalizeLang, getPreferredLang, setPreferredLang, isRtlLang, dirFor } from "../../src/utils/lang";

function setupLocalStorageMock() {
  // minimal localStorage mock
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).localStorage = {
    store: {} as Record<string, string>,
    getItem(key: string) { return this.store[key]; },
    setItem(key: string, val: string) { this.store[key] = String(val); },
    removeItem(key: string) { delete this.store[key]; },
  };
}

(function run() {
  setupLocalStorageMock();

  // normalizeLang
  if (normalizeLang("EN_us") !== "en-US") throw new Error("normalizeLang should normalize case and separator");
  if (normalizeLang("") !== "en") throw new Error("normalizeLang should default to en");

  // set/getPreferredLang via localStorage
  setPreferredLang("tr");
  if (getPreferredLang() !== "tr") throw new Error("getPreferredLang should read stored pref");

  // RTL helpers
  if (!isRtlLang("ar")) throw new Error("isRtlLang should detect ar");
  if (dirFor("ar") !== "rtl") throw new Error("dirFor should be rtl for ar");
  if (dirFor("en") !== "ltr") throw new Error("dirFor should be ltr for en");

  console.log("lang utils tests passed");
})();
