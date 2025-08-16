// Frontend requests go through the BFF only (no direct Supabase client).
// Transitional monolith API facade – can be split into domain-specific modules later.
import { apiFetch } from "../utils/fetcher";
import {
  getPreferredLang,
  normalizeLang,
  setPreferredLang,
} from "../utils/lang";
import { getPreferredMarket, normalizeMarket } from "../utils/market";
import { normalizeArticle } from "../utils/normalize";
import type {
  Quiz,
  CoverageComparison,
  UserProfileModel,
} from "../types/models";
import type { ArticleDetail } from "../types/models";

// Local fallback sample data (dev/demo only)
// Keep minimal to avoid bloat; used only when BFF is unavailable
const FALLBACK_ARTICLES: Array<Parameters<typeof normalizeArticle>[0]> = [];

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
      show_langs?: string[] | string | null;
      pretranslate_langs?: string[] | string | null;
    }>;
    market?: {
      market_code: string;
      pivot_lang?: string;
      show_langs?: string[] | string | null;
      pretranslate_langs?: string[] | string | null;
    };
  }> => {
    const market = normalizeMarket(getPreferredMarket());
    const cfg = await apiFetch<{
      market?: {
        market_code: string;
        pivot_lang?: string;
        show_langs?: string[] | string | null;
        pretranslate_langs?: string[] | string | null;
      };
      markets?: Array<{
        market_code: string;
        pivot_lang?: string;
        show_langs?: string[] | string | null;
        pretranslate_langs?: string[] | string | null;
      }>;
    }>({ path: `/config?market=${encodeURIComponent(market)}`, headers: {} });
    try {
      // If there is NO stored pref_lang yet, set default from config (pivot_lang)
      // We intentionally ignore navigator.language here to make config authoritative.
      const hasStored = (() => {
        try {
          return (
            typeof localStorage !== "undefined" &&
            !!localStorage.getItem("pref_lang")
          );
        } catch {
          return false;
        }
      })();
      if (!hasStored) {
        const m = cfg.market || (cfg.markets && cfg.markets[0]) || undefined;
        const pivot = m?.pivot_lang ? normalizeLang(m.pivot_lang) : "en";
        setPreferredLang(pivot);
      }
    } catch {
      // ignore
    }
    return cfg;
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
      const art = normalizeArticle(base as RawInput2) as ArticleDetail;
      // Attach detail enrichments if present
      if (Array.isArray(raw.citations))
        (art as ArticleDetail).citations = raw.citations;
      if (Array.isArray(raw.timeline))
        (art as ArticleDetail).timeline = raw.timeline as NonNullable<
          ArticleDetail["timeline"]
        >;
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
      a.title?.toLowerCase?.().includes(query.toLowerCase())
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
  // Generate quiz for article (cluster-only)
  generateQuiz: async (
    articleId: string,
    difficulty: string = "intermediate"
  ) => {
    const lang = getPreferredLang();
    return apiFetch<Quiz>({
      path: `/cluster/${encodeURIComponent(
        articleId
      )}/quiz?lang=${encodeURIComponent(lang)}`,
      method: "POST",
      body: { difficulty },
      headers: { "Accept-Language": lang },
    });
  },

  // Get quiz for article (cluster-only)
  getQuiz: async (articleId: string) => {
    const lang = getPreferredLang();
    return apiFetch<Quiz>({
      path: `/cluster/${encodeURIComponent(
        articleId
      )}/quiz?lang=${encodeURIComponent(lang)}`,
      headers: { "Accept-Language": lang },
    });
  },
};

export const coverageApi = {
  // Generate coverage comparison (cluster-only)
  analyzeCoverage: async (articleId: string) => {
    const lang = getPreferredLang();
    const res = await apiFetch<
      CoverageComparison | { data?: CoverageComparison } | unknown
    >({
      path: `/cluster/${encodeURIComponent(
        articleId
      )}/coverage?lang=${encodeURIComponent(lang)}`,
      method: "POST",
      headers: { "Accept-Language": lang },
    });
    const obj =
      res &&
      typeof res === "object" &&
      "data" in (res as Record<string, unknown>)
        ? ((res as { data?: CoverageComparison }).data as CoverageComparison)
        : (res as CoverageComparison);
    return {
      comparisons: Array.isArray(obj?.comparisons) ? obj.comparisons : [],
    } as CoverageComparison;
  },

  // Get coverage comparison (cluster-only)
  getCoverage: async (articleId: string) => {
    const lang = getPreferredLang();
    const res = await apiFetch<
      CoverageComparison | { data?: CoverageComparison } | unknown
    >({
      path: `/cluster/${encodeURIComponent(
        articleId
      )}/coverage?lang=${encodeURIComponent(lang)}`,
      headers: { "Accept-Language": lang },
    });
    const obj =
      res &&
      typeof res === "object" &&
      "data" in (res as Record<string, unknown>)
        ? ((res as { data?: CoverageComparison }).data as CoverageComparison)
        : (res as CoverageComparison);
    return {
      comparisons: Array.isArray(obj?.comparisons) ? obj.comparisons : [],
    } as CoverageComparison;
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
