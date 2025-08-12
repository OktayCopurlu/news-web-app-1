// Frontend requests go through the BFF only (no direct Supabase client).
// Transitional monolith API facade – can be split into domain-specific modules later.
import { apiFetch } from "../utils/fetcher";
import { normalizeArticle } from "../utils/normalize";
import type {
  Quiz,
  CoverageComparison,
  UserProfileModel,
} from "../types/models";

// Local fallback sample data (dev/demo only)
// Simple in-memory TTL cache (reset on reload)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CacheEntry {
  value: any;
  expires: number;
}
const _cache = new Map<string, CacheEntry>();
const now = () => Date.now();
const cache = {
  get<T>(key: string): T | undefined {
    const e = _cache.get(key);
    if (!e) return undefined;
    if (e.expires < now()) {
      _cache.delete(key);
      return undefined;
    }
    return e.value as T;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(key: string, value: any, ttlMs: number) {
    _cache.set(key, { value, expires: now() + ttlMs });
  },
  clear(prefix?: string) {
    if (!prefix) return _cache.clear();
    _cache.forEach((_, k) => {
      if (k.startsWith(prefix)) _cache.delete(k);
    });
  },
};
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
    // Fallback sample articles used if BFF returns no data (dev/demo purposes only).
    audio_summary_url: null,
    audio_duration: 0,
    view_count: 1250,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    article_analytics: [
      {
        bias_score: 0.1,
        bias_explanation:
          "Slightly positive coverage focusing on potential benefits",
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
            explanation:
              "The article specifically mentions a new quantum algorithm that can solve complex optimization problems exponentially faster than classical computers.",
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
            explanation:
              "The article states that scientists from MIT, Google, and several international universities collaborated on this breakthrough.",
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
            perspective:
              "Focuses on the commercial implications and potential market disruption from quantum computing advances.",
            bias: 0.3,
          },
          {
            source: "Science Daily",
            perspective:
              "Emphasizes the scientific methodology and peer review process, highlighting the technical achievements.",
            bias: 0.0,
          },
        ],
      },
    ],
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
    article_analytics: [
      {
        bias_score: -0.1,
        bias_explanation:
          "Balanced reporting with slight emphasis on environmental benefits",
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
            explanation:
              "The agreement aims to reduce global carbon emissions by 60% over the next decade.",
          },
          {
            id: "q2",
            question:
              "How much funding is allocated for clean energy infrastructure?",
            options: [
              "$300 billion",
              "$400 billion",
              "$500 billion",
              "$600 billion",
            ],
            correctAnswer: 2,
            explanation:
              "The accord includes a $500 billion fund for clean energy infrastructure development.",
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
            explanation:
              "The agreement includes specific targets for renewable energy adoption like solar and wind power.",
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
            perspective:
              "Celebrates the agreement as a historic victory for climate action and environmental protection.",
            bias: 0.4,
          },
          {
            source: "Business Weekly",
            perspective:
              "Focuses on economic implications and potential challenges for industries adapting to new regulations.",
            bias: -0.2,
          },
        ],
      },
    ],
  },
];

// BFF base resolved centrally (CONFIG in fetcher); inline constant removed.

// Inline normalizer & header helper removed (shared utilities now used).

let fallbackNotified = false;
function notifyFallback(reason: string) {
  if (!fallbackNotified && typeof window !== "undefined") {
    // Dispatch custom event for toast layer
    window.dispatchEvent(
      new CustomEvent("bff-fallback", { detail: { reason } })
    );
    console.warn("[BFF Fallback] Using local sample data:", reason);
    fallbackNotified = true;
  }
}

export const newsApi = {
  // Fetch all articles
  getArticles: async () => {
    if (cache.get("articles")) return cache.get("articles");
    // Prefer BFF for article list; fallback to Edge Function if it fails
    try {
      const data = await apiFetch<unknown[]>({ path: "/articles" });
      const list = Array.isArray(data)
        ? data.map((d) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return normalizeArticle(d as any);
          })
        : [];
      cache.set("articles", list, 60_000);
      return list;
    } catch {
      notifyFallback("articles fetch failed");
      const list = FALLBACK_ARTICLES.map(
        (a) =>
          ({
            ...normalizeArticle(a),
            __origin: "fallback",
          } as unknown as ReturnType<typeof normalizeArticle>)
      );
      cache.set("articles", list, 30_000);
      return list;
    }
  },

  // Get specific article
  getArticle: async (id: string) => {
    const a = cache.get(`article:${id}`);
    if (a) return a;
    try {
      const data = await apiFetch<unknown>({ path: `/articles/${id}` });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const art = normalizeArticle(data as any);
      cache.set(`article:${id}`, art, 120_000);
      return art;
    } catch {
      const fallback = FALLBACK_ARTICLES.find((a) => a.id === id);
      if (!fallback) throw new Error("Article not found");
      notifyFallback("article fetch failed");
      const art = {
        ...normalizeArticle(fallback),
        __origin: "fallback",
      } as unknown as ReturnType<typeof normalizeArticle>;
      cache.set(`article:${id}`, art, 60_000);
      return art;
    }
  },

  // Generate AI explanation for article
  generateExplanation: async (id: string) => {
    // Still relies on Edge Function (BFF route not implemented yet)
    return apiFetch<{ explanation: string }>({
      path: `/articles/${id}/explanation`,
      method: "POST",
    });
  },

  // Create new article
  createArticle: async () => {
    throw new Error("Article creation not supported in BFF demo");
  },

  // Search articles
  searchArticles: async (query: string) => {
    return FALLBACK_ARTICLES.filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Fetch and process new articles
  fetchNews: async () => {
    return { status: "noop" };
  },

  // Get trending topics
  getTrending: async () => {
    return [];
  },
};

export const aiApi = {
  // Send chat message
  sendMessage: async (
    articleId: string,
    message: string,
    chatHistory: Array<{
      id?: string;
      type?: string;
      content: string;
      timestamp?: string;
    }> = []
  ) => {
    return apiFetch<{
      messages: {
        id?: string;
        type?: string;
        content: string;
        timestamp?: string;
      }[];
    }>({
      path: `/chat/${articleId}`,
      method: "POST",
      body: { message, chatHistory },
    });
  },

  // Get chat history
  getChatHistory: async (articleId: string) => {
    return apiFetch<{
      messages: {
        id?: string;
        type?: string;
        content: string;
        timestamp?: string;
      }[];
    }>({ path: `/chat/${articleId}` });
  },
};

export const quizApi = {
  // Generate quiz for article
  generateQuiz: async (
    articleId: string,
    difficulty: string = "intermediate"
  ) => {
    return apiFetch<Quiz>({
      path: `/articles/${articleId}/quiz`,
      method: "POST",
      body: { difficulty },
    });
  },

  // Get quiz for article
  getQuiz: async (articleId: string) => {
    return apiFetch<Quiz>({ path: `/articles/${articleId}/quiz` });
  },
};

export const coverageApi = {
  // Generate coverage comparison
  analyzeCoverage: async (articleId: string) => {
    return apiFetch<CoverageComparison>({
      path: `/articles/${articleId}/coverage`,
      method: "POST",
    });
  },

  // Get coverage comparison
  getCoverage: async (articleId: string) => {
    return apiFetch<CoverageComparison>({
      path: `/articles/${articleId}/coverage`,
    });
  },
};

export const userApi = {
  // Register new user
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    preferences: Record<string, unknown>;
  }) => {
    const data = await apiFetch<UserProfileModel & { token?: string }>({
      path: "/auth/register",
      method: "POST",
      body: userData,
    });
    const { token, ...user } = data as unknown as UserProfileModel & {
      token?: string;
    };
    if (token) localStorage.setItem("auth_token", token);
    return { user, token };
  },

  // Login user
  login: async (email: string, password: string) => {
    const data = await apiFetch<UserProfileModel & { token?: string }>({
      path: "/auth/login",
      method: "POST",
      body: { email, password },
    });
    const { token, ...user } = data as unknown as UserProfileModel & {
      token?: string;
    };
    if (token) localStorage.setItem("auth_token", token);
    return { user, token };
  },

  // Update user preferences
  updatePreferences: async (preferences: Record<string, unknown>) => {
    return apiFetch<UserProfileModel>({
      path: "/auth/preferences",
      method: "PUT",
      body: { preferences },
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiFetch<UserProfileModel>({ path: "/auth/profile" });
  },

  // Track interaction
  trackInteraction: async (
    articleId: string,
    interactionType: string,
    metadata: Record<string, unknown> = {}
  ) => {
    try {
      return await apiFetch<{ success: boolean }>({
        path: "/interaction",
        method: "POST",
        body: { articleId, interactionType, metadata },
      });
    } catch {
      return { success: false };
    }
  },
};
