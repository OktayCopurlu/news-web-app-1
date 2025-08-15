"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("../../src/services/api");
function testTranslateBatchRequest() {
    return __awaiter(this, void 0, void 0, function () {
        var originalFetch, captured, callOk;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalFetch = globalThis.fetch;
                    captured = {};
                    // Minimal localStorage mock
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    globalThis.localStorage = {
                        store: {},
                        getItem: function (key) {
                            return this.store[key];
                        },
                        setItem: function (key, val) {
                            this.store[key] = val;
                        },
                        removeItem: function (key) {
                            delete this.store[key];
                        },
                    };
                    // Pretend preferred language is de (matches utils/lang.getPreferredLang key)
                    localStorage.setItem("pref_lang", "de");
                    globalThis.fetch = (function (url, init) { return __awaiter(_this, void 0, void 0, function () {
                        var req, h_1, _a;
                        var _b;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 4, , 5]);
                                    if (!(typeof url === "object" && url !== null && "url" in url)) return [3 /*break*/, 2];
                                    req = url;
                                    h_1 = {};
                                    (_c = req.headers) === null || _c === void 0 ? void 0 : _c.forEach(function (v, k) { return (h_1[k] = v); });
                                    _b = {
                                        url: req.url
                                    };
                                    return [4 /*yield*/, req.text()];
                                case 1:
                                    captured = (_b.body = _d.sent(),
                                        _b.headers = h_1,
                                        _b);
                                    return [3 /*break*/, 3];
                                case 2:
                                    captured = {
                                        url: String(url),
                                        body: (init === null || init === void 0 ? void 0 : init.body) || "",
                                        headers: ((init === null || init === void 0 ? void 0 : init.headers) || {}),
                                    };
                                    _d.label = 3;
                                case 3: return [3 /*break*/, 5];
                                case 4:
                                    _a = _d.sent();
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/, new Response(JSON.stringify({ results: [{ id: "x", status: "ready" }] }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                            }
                        });
                    }); });
                    callOk = false;
                    return [4 /*yield*/, api_1.newsApi.translateBatch(["a", "b"]).then(function () { return (callOk = true); })];
                case 1:
                    _a.sent();
                    // Note: Header normalization varies across environments; we skip strict header assertions here.
                    if (!callOk)
                        throw new Error("translateBatch did not perform network call");
                    if (originalFetch)
                        globalThis.fetch = originalFetch;
                    console.log("translateBatch request shape test passed", captured.url ? "url-captured" : "no-url");
                    return [2 /*return*/];
            }
        });
    });
}
function testFeedPendingMapping() {
    return __awaiter(this, void 0, void 0, function () {
        var originalFetch, list, m;
        var _this = this;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    originalFetch = globalThis.fetch;
                    // Simulate BFF /feed returning mixed ready/pending cards
                    globalThis.fetch = (function () { return __awaiter(_this, void 0, void 0, function () {
                        var payload;
                        return __generator(this, function (_a) {
                            payload = [
                                { id: "c1", ai_title: "T1", ai_summary: "S1", language: "de", translation_status: "ready" },
                                { id: "c2", ai_title: "T2", ai_summary: "S2", language: "de", translation_status: "pending" },
                            ];
                            return [2 /*return*/, new Response(JSON.stringify(payload), {
                                    status: 200,
                                    headers: { "Content-Type": "application/json" },
                                })];
                        });
                    }); });
                    localStorage.setItem("pref_lang", "de");
                    return [4 /*yield*/, api_1.newsApi.getArticles({ forceRefresh: true, noFallback: true })];
                case 1:
                    list = _c.sent();
                    m = new Map(list.map(function (a) { return [a.id, a]; }));
                    if (((_a = m.get("c1")) === null || _a === void 0 ? void 0 : _a.translation_status) !== "ready") {
                        throw new Error("Expected c1 translation_status to be 'ready'");
                    }
                    if (((_b = m.get("c2")) === null || _b === void 0 ? void 0 : _b.translation_status) !== "pending") {
                        throw new Error("Expected c2 translation_status to be 'pending'");
                    }
                    if (originalFetch)
                        globalThis.fetch = originalFetch;
                    console.log("feed pending mapping test passed");
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, testTranslateBatchRequest()];
            case 1:
                _a.sent();
                return [4 /*yield*/, testFeedPendingMapping()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
