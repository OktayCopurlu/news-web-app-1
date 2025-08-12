"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var normalize_1 = require("../../src/utils/normalize");
// Minimal raw object shape variants to ensure defaults applied
var baseRaw = {
    id: "x1",
    title: "Title",
    summary: "Short summary text for reading time calc",
    ai_explanation: null,
    explanation_generated: false,
    category: "general",
    language: "en",
    source: "Demo",
    source_url: "https://example.com",
    image_url: null,
    published_at: new Date().toISOString(),
    reading_time: 3,
    tags: ["a", "b"],
};
// crude tiny test harness (no jest) — run with: node --loader ts-node/esm tests/unit/normalizeArticle.test.ts (or ts-node)
function assert(cond, msg) {
    if (!cond)
        throw new Error("Assertion failed: " + msg);
}
(function run() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var article = (0, normalize_1.normalizeArticle)(baseRaw);
    assert(article.id === "x1", "id kept");
    assert(Array.isArray(article.tags), "tags array");
    assert(article.tags.length === 2, "tags length");
    assert(typeof article.reading_time === "number", "reading_time number");
    console.log("normalizeArticle basic test passed");
})();
