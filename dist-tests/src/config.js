"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
// Central runtime configuration (frozen)
// Works in Vite (import.meta.env) and plain Node (process.env)
var viteEnv = undefined; // placeholder: Vite will inline import.meta.env in build
var env = viteEnv || (typeof process !== 'undefined' ? process.env : {});
exports.CONFIG = Object.freeze({
    BFF_URL: env.VITE_BFF_URL || "http://localhost:4000",
    FETCH_TIMEOUT_MS: 8000,
});
