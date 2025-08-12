import { apiFetch } from "../../utils/fetcher";
import { normalizeArticle } from "../../utils/normalize";

// Fallback data for when BFF not reachable (dev/demo only)
const FALLBACK_ARTICLES = [
  {
    id: "1",
    title:
      "Major Breakthrough in Quantum Computing Achieved by International Research Team",
    summary:
      "Scientists from MIT, Google, and several international universities have announced a significant breakthrough in quantum computing that could revolutionize data processing and encryption. The team successfully demonstrated a new quantum algorithm that can solve complex optimization problems exponentially faster than classical computers.",
    ai_explanation: null,
    explanation_generated: false,
    category: "Technology",
    language: "English",
    source: "TechCrunch",
    source_url: "https://example.com/quantum-breakthrough",
    image_url:
      "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reading_time: 5,
    tags: ["quantum computing", "technology", "breakthrough", "MIT", "Google"],
    audio_summary_url: null,
    audio_duration: 0,
    view_count: 1250,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    article_analytics: [],
    quizzes: [],
    coverage_comparisons: [],
  },
  {
    id: "2",
    title:
      "Global Climate Summit Reaches Historic Agreement on Carbon Reduction",
    summary:
      "World leaders at the International Climate Summit have reached a groundbreaking agreement to reduce global carbon emissions by 60% over the next decade. The accord includes specific targets for renewable energy adoption and a $500 billion fund for clean energy infrastructure.",
    ai_explanation: null,
    explanation_generated: false,
    category: "Environment",
    language: "English",
    source: "Reuters",
    source_url: "https://example.com/climate-agreement",
    image_url:
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    reading_time: 6,
    tags: [
      "climate change",
      "environment",
      "global summit",
      "carbon emissions",
      "renewable energy",
    ],
    eli5_summary:
      "Countries around the world promised to make much less pollution and use clean energy like solar and wind power to help save our planet!",
    audio_summary_url: null,
    audio_duration: 0,
    view_count: 2100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    article_analytics: [],
    quizzes: [],
    coverage_comparisons: [],
  },
];

export const articlesApi = {
  getArticles: async () => {
    try {
      const data = await apiFetch<unknown[]>({ path: "/articles" });
      return Array.isArray(data) ? data.map(normalizeArticle) : [];
    } catch {
      return FALLBACK_ARTICLES.map(normalizeArticle);
    }
  },
  getArticle: async (id: string) => {
    try {
      const data = await apiFetch<unknown>({ path: `/articles/${id}` });
      return normalizeArticle(data);
    } catch {
      const fallback = FALLBACK_ARTICLES.find((a) => a.id === id);
      if (!fallback) throw new Error("Article not found");
      return normalizeArticle(fallback);
    }
  },
  generateExplanation: async (id: string) => {
    return apiFetch<{ explanation: string }>({
      path: `/articles/${id}/explanation`,
      method: "POST",
    });
  },
  searchArticles: async (
    query: string,
    filters: { category?: string; language?: string } = {}
  ) => {
    const q = query.toLowerCase();
    return FALLBACK_ARTICLES.filter((a) => a.title.toLowerCase().includes(q))
      .filter((a) => !filters.category || a.category === filters.category)
      .filter((a) => !filters.language || a.language === filters.language)
      .map(normalizeArticle);
  },
  fetchNews: async () => ({ status: "noop" as const }),
  getTrending: async () => [] as string[],
};
