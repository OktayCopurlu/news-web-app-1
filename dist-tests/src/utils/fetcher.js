"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.HttpError = void 0;
exports.apiFetch = apiFetch;
exports.abortableFetch = abortableFetch;
var config_1 = require("../config");
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(url, status, message) {
        var _this = _super.call(this, message || "HTTP ".concat(status)) || this;
        _this.status = status;
        _this.url = url;
        return _this;
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
// Allow dynamic override of base URL (e.g. if dev server auto-shifted port)
var dynamicBaseUrl = null;
var configuredBase = config_1.CONFIG.BFF_URL; // track env changes during HMR
function tryFetch(fullUrl, fetchInit, expectJson) {
    return __awaiter(this, void 0, void 0, function () {
        var res, msg, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fetch(fullUrl, fetchInit)];
                case 1:
                    res = _c.sent();
                    if (!!res.ok) return [3 /*break*/, 6];
                    msg = "";
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.text()];
                case 3:
                    msg = _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = _c.sent();
                    return [3 /*break*/, 5];
                case 5: throw new HttpError(res.url, res.status, msg || res.statusText);
                case 6:
                    if (res.status === 204)
                        return [2 /*return*/, undefined];
                    if (!expectJson) return [3 /*break*/, 8];
                    return [4 /*yield*/, res.json()];
                case 7:
                    _b = (_c.sent());
                    return [3 /*break*/, 9];
                case 8:
                    _b = undefined;
                    _c.label = 9;
                case 9: return [2 /*return*/, _b];
            }
        });
    });
}
function apiFetch(options) {
    return __awaiter(this, void 0, void 0, function () {
        var path, _a, method, body, _b, headers, _c, timeoutMs, _d, retries, _e, retryDelayMs, _f, throwOnNetworkError, controller, timeout, token, finalHeaders, fetchInit, expectJson, lastErr, tried, baseToTry, initialBase, urlObj, port, p, attempt, networkFailed, _loop_1, state_1, lastMsg, networkMsg, im;
        var _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    path = options.path, _a = options.method, method = _a === void 0 ? "GET" : _a, body = options.body, _b = options.headers, headers = _b === void 0 ? {} : _b, _c = options.timeoutMs, timeoutMs = _c === void 0 ? config_1.CONFIG.FETCH_TIMEOUT_MS : _c, _d = options.retries, retries = _d === void 0 ? 0 : _d, _e = options.retryDelayMs, retryDelayMs = _e === void 0 ? 300 : _e, _f = options.throwOnNetworkError, throwOnNetworkError = _f === void 0 ? true : _f;
                    // Reset dynamic base if env changed (HMR / .env.local update)
                    if (config_1.CONFIG.BFF_URL !== configuredBase) {
                        dynamicBaseUrl = null;
                        configuredBase = config_1.CONFIG.BFF_URL;
                    }
                    controller = new AbortController();
                    timeout = setTimeout(function () { return controller.abort(); }, timeoutMs);
                    token = localStorage.getItem("auth_token");
                    finalHeaders = __assign({ "Content-Type": "application/json" }, headers);
                    if (token && !finalHeaders.Authorization)
                        finalHeaders.Authorization = "Bearer ".concat(token);
                    fetchInit = {
                        method: method,
                        headers: finalHeaders,
                        body: body !== undefined ? JSON.stringify(body) : undefined,
                        signal: controller.signal,
                    };
                    expectJson = true;
                    tried = [];
                    baseToTry = [];
                    initialBase = dynamicBaseUrl || config_1.CONFIG.BFF_URL;
                    baseToTry.push(initialBase);
                    // If localhost and port is 4000, add fallback sequential ports (dev convenience)
                    try {
                        urlObj = new URL(initialBase);
                        if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") {
                            port = parseInt(urlObj.port || "4000", 10);
                            if (port === 4000) {
                                for (p = 4001; p <= 4005; p++)
                                    baseToTry.push("".concat(urlObj.protocol, "//").concat(urlObj.hostname, ":").concat(p));
                            }
                        }
                    }
                    catch (_k) {
                        // ignore URL parse issues
                    }
                    attempt = 0;
                    networkFailed = false;
                    _loop_1 = function () {
                        var _i, baseToTry_1, base, fullUrl, im, result, err_1, delay_1;
                        return __generator(this, function (_m) {
                            switch (_m.label) {
                                case 0:
                                    _i = 0, baseToTry_1 = baseToTry;
                                    _m.label = 1;
                                case 1:
                                    if (!(_i < baseToTry_1.length)) return [3 /*break*/, 6];
                                    base = baseToTry_1[_i];
                                    fullUrl = "".concat(base).concat(path);
                                    tried.push(fullUrl);
                                    try {
                                        im = eval("import.meta");
                                        if (((_g = im === null || im === void 0 ? void 0 : im.env) === null || _g === void 0 ? void 0 : _g.DEV) && attempt === 0 && tried.length === 1) {
                                            console.debug("[apiFetch] attempt 0 ->", fullUrl);
                                        }
                                    }
                                    catch (_o) {
                                        // ignore when not available
                                    }
                                    _m.label = 2;
                                case 2:
                                    _m.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, tryFetch(fullUrl, fetchInit, expectJson)];
                                case 3:
                                    result = _m.sent();
                                    if (!dynamicBaseUrl && base !== initialBase)
                                        dynamicBaseUrl = base;
                                    clearTimeout(timeout);
                                    return [2 /*return*/, { value: result }];
                                case 4:
                                    err_1 = _m.sent();
                                    // Duck-type detection of HttpError (status number) to avoid cross-realm instanceof issues in tests
                                    if (err_1 &&
                                        typeof err_1 === "object" &&
                                        "status" in err_1 &&
                                        typeof err_1.status === "number") {
                                        clearTimeout(timeout);
                                        throw err_1; // HTTP status -> no retries beyond base switching
                                    }
                                    lastErr = err_1;
                                    networkFailed = true;
                                    return [3 /*break*/, 5];
                                case 5:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 6:
                                    if (!(networkFailed && attempt < retries)) return [3 /*break*/, 8];
                                    delay_1 = retryDelayMs * Math.pow(2, attempt);
                                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, delay_1); })];
                                case 7:
                                    _m.sent();
                                    _m.label = 8;
                                case 8:
                                    attempt++;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _j.label = 1;
                case 1:
                    if (!(attempt <= retries)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _j.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 1];
                case 3:
                    clearTimeout(timeout);
                    if (lastErr instanceof HttpError)
                        throw lastErr;
                    lastMsg = lastErr && typeof lastErr === "object" && "message" in lastErr
                        ? lastErr.message
                        : String(lastErr);
                    networkMsg = "Network fetch failed for ".concat(path, ". Tried: ").concat(tried.join(", "), ". Attempts=").concat(attempt, ". Last error: ").concat(lastMsg);
                    try {
                        im = eval("import.meta");
                        if ((_h = im === null || im === void 0 ? void 0 : im.env) === null || _h === void 0 ? void 0 : _h.DEV) {
                            console.warn("[apiFetch] network failure", {
                                path: path,
                                tried: tried,
                                attempts: attempt,
                                lastErr: lastErr,
                            });
                            if (typeof globalThis !== "undefined") {
                                globalThis.__lastApiFetchDebug = {
                                    path: path,
                                    tried: tried,
                                    attempts: attempt,
                                    lastErr: lastErr,
                                };
                            }
                        }
                    }
                    catch (_l) {
                        // ignore
                    }
                    if (throwOnNetworkError)
                        throw new TypeError(networkMsg);
                    return [2 /*return*/, { networkError: true, message: networkMsg }];
            }
        });
    });
}
// Convenience helper to create an abortable request without exposing controller outside
function abortableFetch(options) {
    var controller = new AbortController();
    var promise = apiFetch(__assign({}, options));
    return { promise: promise, abort: function () { return controller.abort(); } };
}
