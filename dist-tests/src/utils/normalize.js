"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeArticle = normalizeArticle;
// Normalize raw backend/BFF article into frontend ArticleDetail shape.
function normalizeArticle(raw) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    if (!raw || typeof raw !== "object")
        throw new Error("Cannot normalize empty article");
    var summary = (_a = raw.summary) !== null && _a !== void 0 ? _a : "";
    var readingTime = typeof raw.reading_time === "number"
        ? raw.reading_time
        : (function () {
            var words = summary.split(/\s+/).filter(Boolean).length || 40;
            return Math.max(1, Math.ceil(words / 200));
        })();
    return {
        id: raw.id,
        title: (_b = raw.title) !== null && _b !== void 0 ? _b : "",
        summary: summary,
        ai_explanation: (_c = raw.ai_explanation) !== null && _c !== void 0 ? _c : null,
        explanation_generated: !!(raw.ai_explanation || raw.explanation_generated),
        category: (_d = raw.category) !== null && _d !== void 0 ? _d : "general",
        language: (_e = raw.language) !== null && _e !== void 0 ? _e : "en",
        translation_status: raw.translation_status,
        source: (_g = (_f = raw.source) !== null && _f !== void 0 ? _f : raw.source_name) !== null && _g !== void 0 ? _g : "Unknown",
        source_url: (_j = (_h = raw.source_url) !== null && _h !== void 0 ? _h : raw.url) !== null && _j !== void 0 ? _j : null,
        image_url: (_o = (_l = (_k = raw.image_url) !== null && _k !== void 0 ? _k : raw.imageUrl) !== null && _l !== void 0 ? _l : (_m = raw.media) === null || _m === void 0 ? void 0 : _m.url) !== null && _o !== void 0 ? _o : null,
        published_at: (_q = (_p = raw.published_at) !== null && _p !== void 0 ? _p : raw.publishedAt) !== null && _q !== void 0 ? _q : new Date().toISOString(),
        reading_time: readingTime,
        tags: Array.isArray(raw.tags) ? raw.tags : raw.categories || [],
        eli5_summary: (_r = raw.eli5_summary) !== null && _r !== void 0 ? _r : null,
        audio_summary_url: (_t = (_s = raw.audio_summary_url) !== null && _s !== void 0 ? _s : raw.audioSummary) !== null && _t !== void 0 ? _t : null,
        audio_duration: (_u = raw.audio_duration) !== null && _u !== void 0 ? _u : 0,
        view_count: (_v = raw.view_count) !== null && _v !== void 0 ? _v : 0,
        created_at: (_x = (_w = raw.created_at) !== null && _w !== void 0 ? _w : raw.published_at) !== null && _x !== void 0 ? _x : new Date().toISOString(),
        updated_at: (_z = (_y = raw.updated_at) !== null && _y !== void 0 ? _y : raw.published_at) !== null && _z !== void 0 ? _z : new Date().toISOString(),
        article_analytics: (_0 = raw.article_analytics) !== null && _0 !== void 0 ? _0 : [],
        quizzes: (_1 = raw.quizzes) !== null && _1 !== void 0 ? _1 : [],
        coverage_comparisons: (_2 = raw.coverage_comparisons) !== null && _2 !== void 0 ? _2 : [],
        media: (_3 = raw.media) !== null && _3 !== void 0 ? _3 : (raw.image_url || raw.imageUrl
            ? {
                id: "".concat(raw.id, "-ext"),
                origin: "publisher",
                url: (raw.image_url || raw.imageUrl),
            }
            : null),
    };
}
