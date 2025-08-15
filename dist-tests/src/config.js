"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
// Central runtime configuration (frozen)
// Works in Vite (import.meta.env) and plain Node (tests) fallback
// Resolve environment in both Vite and Node test contexts without direct import.meta reference
var env = (function () {
    var _a;
    try {
        // Use eval to avoid TS parse restriction under CommonJS module
        var viteEnv = (_a = eval("import.meta")) === null || _a === void 0 ? void 0 : _a.env;
        if (viteEnv)
            return viteEnv;
    }
    catch (_b) {
        // ignore
    }
    var pe = typeof process !== "undefined" ? process.env : undefined;
    return (pe ? pe : {});
})();
exports.CONFIG = Object.freeze({
    BFF_URL: env.VITE_BFF_URL || "http://localhost:4000",
    FETCH_TIMEOUT_MS: 8000,
});
