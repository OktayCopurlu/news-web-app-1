// Frontend requests go through the BFF only (no direct Supabase client).
// Transitional monolith API facade – can be split into domain-specific modules later.
import { apiFetch } from "../utils/fetcher";
import { getPreferredLang, normalizeLang } from "../utils/lang";
import { normalizeArticle } from "../utils/normalize";
import type {
  Quiz,
  CoverageComparison,
  UserProfileModel,
} from "../types/models";
import type { ArticleDetail } from "../types/models";

// Local fallback sample data (dev/demo only)
// Simple in-memory TTL cache (reset on reload)

interface CacheEntry<T = unknown> {
  value: T | unknown;
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
  set(key: string, value: unknown, ttlMs: number) {
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

export type GetArticlesOptions = {
  strict?: boolean; // add strict=1 to block until translations are ready
  noFallback?: boolean; // do not return local mock data on failure
  timeoutMs?: number; // per-attempt timeout
  waitMs?: number; // overall wait budget with retries while keeping loading state
  forceRefresh?: boolean; // ignore cache for this call
};

export const newsApi = {
  // Fetch app markets config
  getConfig: async (): Promise<{
    markets?: Array<{
      market_code: string;
      enabled?: boolean;
      pivot_lang?: string;
      pretranslate_langs?: string[] | string | null;
    }>;
    market?: {
      market_code: string;
      pivot_lang?: string;
      pretranslate_langs?: string[] | string | null;
    };
  }> => {
    return apiFetch({ path: `/config`, headers: {} });
  },
  // Fetch all articles
  getArticles: async (
    options: GetArticlesOptions = {}
  ): Promise<ArticleDetail[]> => {
    const {
      strict = false,
      noFallback = false,
      timeoutMs,
      waitMs = 0,
      forceRefresh = false,
    } = options;
    const langKey = getPreferredLang();
    if (!forceRefresh) {
      const cached = cache.get<ArticleDetail[]>(`articles:${langKey}`);
      if (cached) return cached as ArticleDetail[];
    }
    // Prefer BFF for article list; fallback to local sample if it fails (unless noFallback)
    const deadline = waitMs > 0 ? Date.now() + waitMs : 0;
    const baseAttemptTimeout = timeoutMs || (strict ? 20_000 : undefined);
    // Inner fetch function
    const fetchOnce = async () => {
      const lang = getPreferredLang();
      const path = `/feed?lang=${encodeURIComponent(lang)}${
        strict ? "&strict=1" : ""
      }`;
      const remaining = deadline ? Math.max(0, deadline - Date.now()) : 0;
      const effectiveTimeout = remaining
        ? Math.max(1_000, Math.min(baseAttemptTimeout ?? remaining, remaining))
        : baseAttemptTimeout;
      const data = await apiFetch<unknown>({
        path,
        headers: { "Accept-Language": lang },
        timeoutMs: effectiveTimeout,
        retries: 0,
      });
      // BFF returns an envelope { data: ClusterSummary[] }
      // Map to Article cards using ai_title/ai_summary as title/summary
      type ClusterCard = {
        id: string;
        ai_title?: string;
        title?: string;
        ai_summary?: string;
        summary?: string;
        short_summary?: string;
        summary_text?: string;
        desc?: string;
        category?: string;
        lang?: string;
        language?: string;
        top_source?: string;
        source?: string;
        source_url?: string | null;
        image_url?: string | null;
        representative_published_at?: string;
        updated_at?: string;
        reading_time?: number;
        tags?: string[];
        media?: { url?: string } | null;
        // BFF non-strict can return a readiness hint
        translation_status?: "ready" | "pending";
      };
      type RawInput = Parameters<typeof normalizeArticle>[0] & {
        translation_status?: "ready" | "pending";
      };
      const payload: unknown = data;
      let arr: ClusterCard[] = [];
      if (Array.isArray(payload)) {
        arr = payload as ClusterCard[];
      } else if (
        payload &&
        typeof payload === "object" &&
        "data" in (payload as Record<string, unknown>)
      ) {
        const d = (payload as { data: unknown }).data;
        if (Array.isArray(d)) arr = d as ClusterCard[];
        else if (d && typeof d === "object") {
          const maybeItems = (d as Record<string, unknown>).items;
          const maybeClusters = (d as Record<string, unknown>).clusters;
          if (Array.isArray(maybeItems)) arr = maybeItems as ClusterCard[];
          else if (Array.isArray(maybeClusters))
            arr = maybeClusters as ClusterCard[];
        }
      } else if (payload && typeof payload === "object") {
        const maybeItems = (payload as Record<string, unknown>).items;
        const maybeClusters = (payload as Record<string, unknown>).clusters;
        if (Array.isArray(maybeItems)) arr = maybeItems as ClusterCard[];
        else if (Array.isArray(maybeClusters))
          arr = maybeClusters as ClusterCard[];
      }
      const list = arr.map((c) => {
        const base: Partial<RawInput> & { id: string } = {
          id: c.id,
          title: c.ai_title || c.title,
          // Try multiple potential fields for summary to handle backend variance
          summary:
            c.ai_summary ||
            c.summary ||
            c.short_summary ||
            c.summary_text ||
            c.desc ||
            "",
          category: c.category || "general",
          language: normalizeLang(c.lang || c.language || lang),
          source: c.top_source || c.source || "Various",
          published_at:
            c.representative_published_at ||
            c.updated_at ||
            new Date().toISOString(),
          // Only include reading_time if backend provides a positive value; otherwise let normalizer compute
          reading_time:
            typeof c.reading_time === "number" && c.reading_time > 0
              ? c.reading_time
              : undefined,
          tags: c.tags || [],
        };
        // Preserve translation readiness if provided
        base.translation_status = c.translation_status;
        if (c.source_url || typeof c.source_url === "string")
          base.source_url = c.source_url || undefined;
        if (c.image_url || typeof c.image_url === "string")
          base.image_url = c.image_url || undefined;
        const mediaUrl = c.media?.url || c.image_url;
        if (mediaUrl) {
          base.media = {
            id: `${c.id}-img`,
            origin: "publisher",
            url: mediaUrl,
          } as RawInput["media"];
        }
        return normalizeArticle(base as RawInput);
      });
      // If we got an unexpectedly tiny list, avoid long caching so we can recover quickly after backend restarts.
      const ttl = list.length < 5 ? 5_000 : 60_000;
      cache.set(`articles:${langKey}`, list as ArticleDetail[], ttl);
      return list as ArticleDetail[];
    };
    while (true) {
      try {
        return await fetchOnce();
      } catch (err) {
        if (deadline && Date.now() < deadline) {
          // brief backoff before retrying
          await new Promise((r) => setTimeout(r, 600));
          continue;
        }
        if (noFallback) throw err;
        // Fall back to local sample data
        notifyFallback("articles fetch failed");
        const list = FALLBACK_ARTICLES.map(
          (a) =>
            ({
              ...normalizeArticle(a),
              __origin: "fallback",
            } as unknown as ReturnType<typeof normalizeArticle>)
        );
        cache.set(`articles:${langKey}`, list as ArticleDetail[], 30_000);
        return list as ArticleDetail[];
      }
    }
  },

  // Request batch translation for a set of cluster IDs (progressive fill)
  translateBatch: async (
    clusterIds: string[]
  ): Promise<{
    results: Array<{
      id: string;
      status: "ready" | "failed";
      ai_title?: string;
      ai_summary?: string;
    }>;
    failed?: string[];
  }> => {
    const lang = getPreferredLang();
    return apiFetch({
      path: `/translate/batch?lang=${encodeURIComponent(lang)}`,
      method: "POST",
      body: { ids: clusterIds, clusterIds },
      headers: { "Accept-Language": lang },
    });
  },

  // Get specific article
  getArticle: async (id: string): Promise<ArticleDetail> => {
    const langKey = getPreferredLang();
    const a = cache.get<ArticleDetail>(`article:${id}:${langKey}`);
    if (a) return a as ArticleDetail;
    try {
      const lang = getPreferredLang();
      const data = await apiFetch<unknown>({
        path: `/cluster/${encodeURIComponent(id)}?lang=${encodeURIComponent(
          lang
        )}`,
        headers: { "Accept-Language": lang },
      });
      // BFF returns envelope { data: { cluster, ai_title, ai_summary, ai_details, dir, citations, media } }
      // Map to ArticleDetail for the detail page
      type ClusterDetail = {
        id?: string;
        ai_title?: string;
        title?: string;
        ai_summary?: string;
        summary?: string;
        short_summary?: string;
        summary_text?: string;
        desc?: string;
        // Some responses may include a rich detail field
        ai_details?: string;
        details?: string;
        ai_explanation?: string;
        category?: string;
        cluster?: { category?: string };
        lang?: string;
        language?: string;
        top_source?: string;
        source?: string;
        source_url?: string | null;
        image_url?: string | null;
        media?: { url?: string } | null;
        representative_published_at?: string;
        updated_at?: string;
        reading_time?: number;
        tags?: string[];
        dir?: string;
        coverage_count?: number;
        timeline?: Array<{
          id: string;
          text?: string;
          language?: string;
          translated_from?: string | null;
          happened_at?: string; // ISO
          source_id?: string;
        }>;
        citations?: Array<{
          id: string;
          title?: string;
          url?: string;
          source_id?: string;
          source_name?: string;
        }>;
      };
      const payload2: unknown = data;
      let raw: ClusterDetail = {};
      if (
        payload2 &&
        typeof payload2 === "object" &&
        "data" in (payload2 as Record<string, unknown>)
      ) {
        raw = ((payload2 as { data: unknown }).data || {}) as ClusterDetail;
      } else {
        raw = (payload2 || {}) as ClusterDetail;
      }
      type RawInput2 = Parameters<typeof normalizeArticle>[0];
      const firstCitation = raw.citations && raw.citations[0];
      const firstTimeline = raw.timeline && raw.timeline[0];
      const base: Partial<RawInput2> & { id: string } = {
        id: raw.id || id,
        title: raw.ai_title || raw.title,
        // Broader summary fallback options in case backend uses different naming
        summary:
          raw.ai_summary ||
          raw.summary ||
          raw.short_summary ||
          raw.summary_text ||
          raw.desc ||
          "",
        // Map rich explanation field if available so detail page shows content
        ai_explanation:
          raw.ai_details || raw.details || raw.ai_explanation || null,
        category: raw.category || raw.cluster?.category || "general",
        language: normalizeLang(raw.lang || raw.language || lang),
        // Prefer citation source if present
        source:
          firstCitation?.source_name ||
          raw.top_source ||
          raw.source ||
          "Various",
        published_at:
          firstTimeline?.happened_at ||
          raw.representative_published_at ||
          raw.updated_at ||
          new Date().toISOString(),
        // Only include reading_time if backend provides a positive value; otherwise let normalizer compute
        reading_time:
          typeof raw.reading_time === "number" && raw.reading_time > 0
            ? raw.reading_time
            : undefined,
        tags: raw.tags || [],
      };
      // Prefer citation URL as source_url if available
      if (
        firstCitation?.url ||
        raw.source_url ||
        typeof raw.source_url === "string"
      )
        base.source_url = firstCitation?.url || raw.source_url || undefined;
      const mediaUrl2 = raw.image_url || raw.media?.url;
      if (mediaUrl2)
        base.media = {
          id: `${id}-img`,
          origin: "publisher",
          url: mediaUrl2,
        } as RawInput2["media"];
      const art = normalizeArticle(base as RawInput2);
      cache.set(`article:${id}:${langKey}`, art as ArticleDetail, 120_000);
      return art as ArticleDetail;
    } catch {
      const fallback = FALLBACK_ARTICLES.find((a) => a.id === id);
      if (!fallback) throw new Error("Article not found");
      notifyFallback("article fetch failed");
      const art = {
        ...normalizeArticle(fallback),
        __origin: "fallback",
      } as unknown as ReturnType<typeof normalizeArticle>;
      cache.set(`article:${id}:${langKey}`, art as ArticleDetail, 60_000);
      return art as ArticleDetail;
    }
  },

  // Generate AI explanation for article
  generateExplanation: async (id: string) => {
    // Use BFF chat endpoint to synthesize a detailed explanation on-demand
    const lang = getPreferredLang();
    const prompt =
      "Provide a detailed, neutral, well-structured explanation of this news story for a general audience. Include background, key points, and implications in 3-6 short paragraphs.";
    const resp = await apiFetch<{
      messages: {
        id?: string;
        type?: string;
        content: string;
        timestamp?: string;
      }[];
    }>({
      path: `/cluster/${encodeURIComponent(id)}/chat?lang=${encodeURIComponent(
        lang
      )}`,
      method: "POST",
      body: { message: prompt, chatHistory: [] },
      headers: { "Accept-Language": lang },
    });
    const last = resp.messages?.[resp.messages.length - 1];
    return { explanation: last?.content || "" };
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
    const lang = getPreferredLang();
    return apiFetch<{
      messages: {
        id?: string;
        type?: string;
        content: string;
        timestamp?: string;
      }[];
    }>({
      path: `/cluster/${encodeURIComponent(
        articleId
      )}/chat?lang=${encodeURIComponent(lang)}`,
      method: "POST",
      body: { message, chatHistory },
      headers: { "Accept-Language": lang },
    });
  },

  // Get chat history
  getChatHistory: async (articleId: string) => {
    const lang = getPreferredLang();
    return apiFetch<{
      messages: {
        id?: string;
        type?: string;
        content: string;
        timestamp?: string;
      }[];
    }>({
      path: `/cluster/${encodeURIComponent(
        articleId
      )}/chat?lang=${encodeURIComponent(lang)}`,
      headers: { "Accept-Language": lang },
    });
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
