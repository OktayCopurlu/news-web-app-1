"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeArticle = normalizeArticle;
// Normalize raw backend/BFF article into frontend ArticleDetail shape.
function normalizeArticle(raw) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
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
        source: (_g = (_f = raw.source) !== null && _f !== void 0 ? _f : raw.source_name) !== null && _g !== void 0 ? _g : "Unknown",
        source_url: (_j = (_h = raw.source_url) !== null && _h !== void 0 ? _h : raw.url) !== null && _j !== void 0 ? _j : null,
        image_url: (_l = (_k = raw.image_url) !== null && _k !== void 0 ? _k : raw.imageUrl) !== null && _l !== void 0 ? _l : null,
        published_at: (_o = (_m = raw.published_at) !== null && _m !== void 0 ? _m : raw.publishedAt) !== null && _o !== void 0 ? _o : new Date().toISOString(),
        reading_time: readingTime,
        tags: Array.isArray(raw.tags) ? raw.tags : raw.categories || [],
        eli5_summary: (_p = raw.eli5_summary) !== null && _p !== void 0 ? _p : null,
        audio_summary_url: (_r = (_q = raw.audio_summary_url) !== null && _q !== void 0 ? _q : raw.audioSummary) !== null && _r !== void 0 ? _r : null,
        audio_duration: (_s = raw.audio_duration) !== null && _s !== void 0 ? _s : 0,
        view_count: (_t = raw.view_count) !== null && _t !== void 0 ? _t : 0,
        created_at: (_v = (_u = raw.created_at) !== null && _u !== void 0 ? _u : raw.published_at) !== null && _v !== void 0 ? _v : new Date().toISOString(),
        updated_at: (_x = (_w = raw.updated_at) !== null && _w !== void 0 ? _w : raw.published_at) !== null && _x !== void 0 ? _x : new Date().toISOString(),
        article_analytics: (_y = raw.article_analytics) !== null && _y !== void 0 ? _y : [],
        quizzes: (_z = raw.quizzes) !== null && _z !== void 0 ? _z : [],
        coverage_comparisons: (_0 = raw.coverage_comparisons) !== null && _0 !== void 0 ? _0 : [],
    };
}
