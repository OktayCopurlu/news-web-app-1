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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userApi = exports.coverageApi = exports.quizApi = exports.aiApi = exports.newsApi = void 0;
// Frontend requests go through the BFF only (no direct Supabase client).
// Transitional monolith API facade – can be split into domain-specific modules later.
var fetcher_1 = require("../utils/fetcher");
var normalize_1 = require("../utils/normalize");
var _cache = new Map();
var now = function () { return Date.now(); };
var cache = {
    get: function (key) {
        var e = _cache.get(key);
        if (!e)
            return undefined;
        if (e.expires < now()) {
            _cache.delete(key);
            return undefined;
        }
        return e.value;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: function (key, value, ttlMs) {
        _cache.set(key, { value: value, expires: now() + ttlMs });
    },
    clear: function (prefix) {
        if (!prefix)
            return _cache.clear();
        _cache.forEach(function (_, k) { if (k.startsWith(prefix))
            _cache.delete(k); });
    }
};
var FALLBACK_ARTICLES = [
    {
        id: "1",
        title: "Major Breakthrough in Quantum Computing Achieved by International Research Team",
        summary: "Scientists from MIT, Google, and several international universities have announced a significant breakthrough in quantum computing that could revolutionize data processing and encryption. The team successfully demonstrated a new quantum algorithm that can solve complex optimization problems exponentially faster than classical computers.",
        ai_explanation: null,
        explanation_generated: false,
        category: "Technology",
        language: "English",
        source: "TechCrunch",
        source_url: "https://example.com/quantum-breakthrough",
        image_url: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
        published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        reading_time: 5,
        tags: ["quantum computing", "technology", "breakthrough", "MIT", "Google"],
        // Fallback sample articles used if BFF returns no data (dev/demo purposes only).
        audio_summary_url: null,
        audio_duration: 0,
        view_count: 1250,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        article_analytics: [
            {
                bias_score: 0.1,
                bias_explanation: "Slightly positive coverage focusing on potential benefits",
                bias_sources: ["AI Analysis", "Source Verification"],
                sentiment_score: 0.7,
                sentiment_label: "positive",
                credibility_score: 0.9,
            },
        ],
        quizzes: [
            {
                id: "quiz-1",
                questions: [
                    {
                        id: "q1",
                        question: "What is the main breakthrough described in the article?",
                        options: [
                            "A new quantum algorithm for optimization problems",
                            "Room temperature superconductors",
                            "Faster internet speeds",
                            "Better smartphone batteries",
                        ],
                        correctAnswer: 0,
                        explanation: "The article specifically mentions a new quantum algorithm that can solve complex optimization problems exponentially faster than classical computers.",
                    },
                    {
                        id: "q2",
                        question: "Which institutions were involved in this research?",
                        options: [
                            "Only MIT",
                            "MIT, Google, and international universities",
                            "Google and Apple",
                            "NASA and SpaceX",
                        ],
                        correctAnswer: 1,
                        explanation: "The article states that scientists from MIT, Google, and several international universities collaborated on this breakthrough.",
                    },
                ],
                difficulty: "intermediate",
            },
        ],
        coverage_comparisons: [
            {
                comparisons: [
                    {
                        source: "Tech Tribune",
                        perspective: "Focuses on the commercial implications and potential market disruption from quantum computing advances.",
                        bias: 0.3,
                    },
                    {
                        source: "Science Daily",
                        perspective: "Emphasizes the scientific methodology and peer review process, highlighting the technical achievements.",
                        bias: 0.0,
                    },
                ],
            },
        ],
    },
    {
        id: "2",
        title: "Global Climate Summit Reaches Historic Agreement on Carbon Reduction",
        summary: "World leaders at the International Climate Summit have reached a groundbreaking agreement to reduce global carbon emissions by 60% over the next decade. The accord includes specific targets for renewable energy adoption and a $500 billion fund for clean energy infrastructure.",
        ai_explanation: null,
        explanation_generated: false,
        category: "Environment",
        language: "English",
        source: "Reuters",
        source_url: "https://example.com/climate-agreement",
        image_url: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
        published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        reading_time: 6,
        tags: [
            "climate change",
            "environment",
            "global summit",
            "carbon emissions",
            "renewable energy",
        ],
        eli5_summary: "Countries around the world promised to make much less pollution and use clean energy like solar and wind power to help save our planet!",
        audio_summary_url: null,
        audio_duration: 0,
        view_count: 2100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        article_analytics: [
            {
                bias_score: -0.1,
                bias_explanation: "Balanced reporting with slight emphasis on environmental benefits",
                bias_sources: ["AI Analysis", "Source Verification"],
                sentiment_score: 0.5,
                sentiment_label: "positive",
                credibility_score: 0.95,
            },
        ],
        quizzes: [
            {
                id: "quiz-2",
                questions: [
                    {
                        id: "q1",
                        question: "What is the target for carbon emission reduction?",
                        options: [
                            "40% over the next decade",
                            "50% over the next decade",
                            "60% over the next decade",
                            "70% over the next decade",
                        ],
                        correctAnswer: 2,
                        explanation: "The agreement aims to reduce global carbon emissions by 60% over the next decade.",
                    },
                    {
                        id: "q2",
                        question: "How much funding is allocated for clean energy infrastructure?",
                        options: [
                            "$300 billion",
                            "$400 billion",
                            "$500 billion",
                            "$600 billion",
                        ],
                        correctAnswer: 2,
                        explanation: "The accord includes a $500 billion fund for clean energy infrastructure development.",
                    },
                    {
                        id: "q3",
                        question: "What type of energy adoption does the agreement target?",
                        options: [
                            "Nuclear energy",
                            "Renewable energy",
                            "Natural gas",
                            "Coal with carbon capture",
                        ],
                        correctAnswer: 1,
                        explanation: "The agreement includes specific targets for renewable energy adoption like solar and wind power.",
                    },
                ],
                difficulty: "intermediate",
            },
        ],
        coverage_comparisons: [
            {
                comparisons: [
                    {
                        source: "Environmental Herald",
                        perspective: "Celebrates the agreement as a historic victory for climate action and environmental protection.",
                        bias: 0.4,
                    },
                    {
                        source: "Business Weekly",
                        perspective: "Focuses on economic implications and potential challenges for industries adapting to new regulations.",
                        bias: -0.2,
                    },
                ],
            },
        ],
    },
];
// BFF base resolved centrally (CONFIG in fetcher); inline constant removed.
// Inline normalizer & header helper removed (shared utilities now used).
exports.newsApi = {
    // Fetch all articles
    getArticles: function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, list, _a, list;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (cache.get('articles'))
                        return [2 /*return*/, cache.get('articles')];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, fetcher_1.apiFetch)({ path: "/articles" })];
                case 2:
                    data = _b.sent();
                    list = Array.isArray(data)
                        ? data.map(function (d) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            return (0, normalize_1.normalizeArticle)(d);
                        })
                        : [];
                    cache.set('articles', list, 60000);
                    return [2 /*return*/, list];
                case 3:
                    _a = _b.sent();
                    list = FALLBACK_ARTICLES.map(normalize_1.normalizeArticle);
                    cache.set('articles', list, 30000);
                    return [2 /*return*/, list];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Get specific article
    getArticle: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var a, data, art, _a, fallback, art;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    a = cache.get("article:".concat(id));
                    if (a)
                        return [2 /*return*/, a];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, fetcher_1.apiFetch)({ path: "/articles/".concat(id) })];
                case 2:
                    data = _b.sent();
                    art = (0, normalize_1.normalizeArticle)(data);
                    cache.set("article:".concat(id), art, 120000);
                    return [2 /*return*/, art];
                case 3:
                    _a = _b.sent();
                    fallback = FALLBACK_ARTICLES.find(function (a) { return a.id === id; });
                    if (!fallback)
                        throw new Error("Article not found");
                    art = (0, normalize_1.normalizeArticle)(fallback);
                    cache.set("article:".concat(id), art, 60000);
                    return [2 /*return*/, art];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Generate AI explanation for article
    generateExplanation: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Still relies on Edge Function (BFF route not implemented yet)
            return [2 /*return*/, (0, fetcher_1.apiFetch)({
                    path: "/articles/".concat(id, "/explanation"),
                    method: "POST",
                })];
        });
    }); },
    // Create new article
    createArticle: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("Article creation not supported in BFF demo");
        });
    }); },
    // Search articles
    searchArticles: function (query) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, FALLBACK_ARTICLES.filter(function (a) {
                    return a.title.toLowerCase().includes(query.toLowerCase());
                })];
        });
    }); },
    // Fetch and process new articles
    fetchNews: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, { status: "noop" }];
        });
    }); },
    // Get trending topics
    getTrending: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, []];
        });
    }); },
};
exports.aiApi = {
    // Send chat message
    sendMessage: function (articleId_1, message_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([articleId_1, message_1], args_1, true), void 0, function (articleId, message, chatHistory) {
            if (chatHistory === void 0) { chatHistory = []; }
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetcher_1.apiFetch)({
                        path: "/chat/".concat(articleId),
                        method: "POST",
                        body: { message: message, chatHistory: chatHistory },
                    })];
            });
        });
    },
    // Get chat history
    getChatHistory: function (articleId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, fetcher_1.apiFetch)({ path: "/chat/".concat(articleId) })];
        });
    }); },
};
exports.quizApi = {
    // Generate quiz for article
    generateQuiz: function (articleId_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([articleId_1], args_1, true), void 0, function (articleId, difficulty) {
            if (difficulty === void 0) { difficulty = "intermediate"; }
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetcher_1.apiFetch)({
                        path: "/articles/".concat(articleId, "/quiz"),
                        method: "POST",
                        body: { difficulty: difficulty },
                    })];
            });
        });
    },
    // Get quiz for article
    getQuiz: function (articleId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, fetcher_1.apiFetch)({ path: "/articles/".concat(articleId, "/quiz") })];
        });
    }); },
};
exports.coverageApi = {
    // Generate coverage comparison
    analyzeCoverage: function (articleId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, fetcher_1.apiFetch)({
                    path: "/articles/".concat(articleId, "/coverage"),
                    method: "POST",
                })];
        });
    }); },
    // Get coverage comparison
    getCoverage: function (articleId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, fetcher_1.apiFetch)({
                    path: "/articles/".concat(articleId, "/coverage"),
                })];
        });
    }); },
};
exports.userApi = {
    // Register new user
    register: function (userData) { return __awaiter(void 0, void 0, void 0, function () {
        var data, _a, token, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, fetcher_1.apiFetch)({
                        path: "/auth/register",
                        method: "POST",
                        body: userData,
                    })];
                case 1:
                    data = _b.sent();
                    _a = data, token = _a.token, user = __rest(_a, ["token"]);
                    if (token)
                        localStorage.setItem("auth_token", token);
                    return [2 /*return*/, { user: user, token: token }];
            }
        });
    }); },
    // Login user
    login: function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var data, _a, token, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, fetcher_1.apiFetch)({
                        path: "/auth/login",
                        method: "POST",
                        body: { email: email, password: password },
                    })];
                case 1:
                    data = _b.sent();
                    _a = data, token = _a.token, user = __rest(_a, ["token"]);
                    if (token)
                        localStorage.setItem("auth_token", token);
                    return [2 /*return*/, { user: user, token: token }];
            }
        });
    }); },
    // Update user preferences
    updatePreferences: function (preferences) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, fetcher_1.apiFetch)({
                    path: "/auth/preferences",
                    method: "PUT",
                    body: { preferences: preferences },
                })];
        });
    }); },
    // Get user profile
    getProfile: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, fetcher_1.apiFetch)({ path: "/auth/profile" })];
        });
    }); },
    // Track interaction
    trackInteraction: function (articleId_1, interactionType_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([articleId_1, interactionType_1], args_1, true), void 0, function (articleId, interactionType, metadata) {
            var _a;
            if (metadata === void 0) { metadata = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, fetcher_1.apiFetch)({
                                path: "/interaction",
                                method: "POST",
                                body: { articleId: articleId, interactionType: interactionType, metadata: metadata },
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, { success: false }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
};
