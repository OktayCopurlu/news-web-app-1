import { describe, it, expect } from "vitest";
import { normalizeArticle } from "../../src/utils/normalize";

const baseRaw = {
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

describe("normalizeArticle", () => {
  it("applies defaults and preserves expected fields", () => {
    const article = normalizeArticle(baseRaw as any);
    expect(article.id).toBe("x1");
    expect(Array.isArray(article.tags)).toBe(true);
    expect(article.tags.length).toBe(2);
    expect(typeof article.reading_time).toBe("number");
  });
});
