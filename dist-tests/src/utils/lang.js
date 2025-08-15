"use strict";
// Simple browser language helper for BCP-47-ish codes
// We keep it lightweight; the BFF also normalizes server-side.
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLang = normalizeLang;
exports.getPreferredLang = getPreferredLang;
exports.setPreferredLang = setPreferredLang;
exports.isRtlLang = isRtlLang;
exports.dirFor = dirFor;
exports.setDocumentLangDir = setDocumentLangDir;
function normalizeLang(code) {
    var _a;
    if (!code)
        return "en";
    try {
        var parts = code.replace("_", "-").split("-");
        var lang = ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "en";
        var region = parts[1] ? parts[1].toUpperCase() : undefined;
        return region ? "".concat(lang, "-").concat(region) : lang;
    }
    catch (_b) {
        return "en";
    }
}
function getQueryLang() {
    try {
        if (typeof window === "undefined")
            return null;
        var u = new URL(window.location.href);
        var q = u.searchParams.get("lang");
        return q ? normalizeLang(q) : null;
    }
    catch (_a) {
        return null;
    }
}
function getPreferredLang() {
    // Priority: ?lang > localStorage > navigator.language
    var fromQuery = getQueryLang();
    if (fromQuery)
        return fromQuery;
    var stored = safeLocalStorageGet("pref_lang");
    if (stored)
        return normalizeLang(stored);
    // navigator.language may be undefined in SSR/tests
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var nav = typeof navigator !== "undefined" ? navigator : {};
    return normalizeLang(nav.language || nav.userLanguage || "en");
}
function setPreferredLang(lang) {
    safeLocalStorageSet("pref_lang", normalizeLang(lang));
}
// Minimal RTL detection (align with common RTL locales)
function isRtlLang(lang) {
    var base = normalizeLang(lang).split("-")[0];
    return ["ar", "he", "fa", "ur"].includes(base);
}
function dirFor(lang) {
    return isRtlLang(lang) ? "rtl" : "ltr";
}
// Safe setter for <html lang> and dir, not wired automatically to avoid surprise UI changes
function setDocumentLangDir(lang) {
    try {
        if (typeof document === "undefined")
            return;
        var norm = normalizeLang(lang);
        var dir = isRtlLang(norm) ? "rtl" : "ltr";
        var el = document.documentElement;
        if (el.getAttribute("lang") !== norm)
            el.setAttribute("lang", norm);
        if (el.getAttribute("dir") !== dir)
            el.setAttribute("dir", dir);
    }
    catch (_a) {
        /* ignore */
    }
}
function safeLocalStorageGet(key) {
    try {
        if (typeof localStorage === "undefined")
            return null;
        return localStorage.getItem(key);
    }
    catch (_a) {
        return null;
    }
}
function safeLocalStorageSet(key, value) {
    try {
        if (typeof localStorage === "undefined")
            return;
        localStorage.setItem(key, value);
    }
    catch (_a) {
        /* ignore */
    }
}
