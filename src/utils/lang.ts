// Simple browser language helper for BCP-47-ish codes
// We keep it lightweight; the BFF also normalizes server-side.

export function normalizeLang(code: string | undefined | null): string {
  if (!code) return "en";
  try {
    const parts = code.replace("_", "-").split("-");
    const lang = parts[0]?.toLowerCase() || "en";
    const region = parts[1] ? parts[1].toUpperCase() : undefined;
    return region ? `${lang}-${region}` : lang;
  } catch {
    return "en";
  }
}

function getQueryLang(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const u = new URL(window.location.href);
    const q = u.searchParams.get("lang");
    return q ? normalizeLang(q) : null;
  } catch {
    return null;
  }
}

export function getPreferredLang(): string {
  // Priority: ?lang > localStorage > navigator.language
  const fromQuery = getQueryLang();
  if (fromQuery) return fromQuery;
  const stored = safeLocalStorageGet("pref_lang");
  if (stored) return normalizeLang(stored);
  // navigator.language may be undefined in SSR/tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav: any = typeof navigator !== "undefined" ? navigator : {};
  return normalizeLang(nav.language || nav.userLanguage || "en");
}

export function setPreferredLang(lang: string) {
  safeLocalStorageSet("pref_lang", normalizeLang(lang));
}

// Minimal RTL detection (align with common RTL locales)
export function isRtlLang(lang: string): boolean {
  const base = normalizeLang(lang).split("-")[0];
  return ["ar", "he", "fa", "ur"].includes(base);
}

export function dirFor(lang: string): "rtl" | "ltr" {
  return isRtlLang(lang) ? "rtl" : "ltr";
}

// Safe setter for <html lang> and dir, not wired automatically to avoid surprise UI changes
export function setDocumentLangDir(lang: string) {
  try {
    if (typeof document === "undefined") return;
    const norm = normalizeLang(lang);
    const dir = isRtlLang(norm) ? "rtl" : "ltr";
    const el = document.documentElement;
    if (el.getAttribute("lang") !== norm) el.setAttribute("lang", norm);
    if (el.getAttribute("dir") !== dir) el.setAttribute("dir", dir);
  } catch {
    /* ignore */
  }
}

function safeLocalStorageGet(key: string): string | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
