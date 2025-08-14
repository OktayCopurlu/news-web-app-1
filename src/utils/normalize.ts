import type {
  ArticleDetail,
  ArticleAnalytics,
  CoverageComparison,
  Quiz,
} from "../types/models";

interface RawArticle {
  id: string;
  title?: string;
  summary?: string;
  ai_explanation?: string | null;
  explanation_generated?: boolean;
  category?: string;
  language?: string;
  source?: string;
  source_name?: string;
  source_url?: string;
  url?: string;
  image_url?: string;
  imageUrl?: string;
  media?: {
    id: string;
    origin: string;
    url: string;
    width?: number;
    height?: number;
    license?: string | null;
    attribution?: string | null;
    variants?: Array<{ width: number; url: string; bytes?: number }>;
  } | null;
  published_at?: string;
  publishedAt?: string;
  reading_time?: number;
  tags?: string[];
  categories?: string[];
  eli5_summary?: string | null;
  audio_summary_url?: string | null;
  audioSummary?: string | null;
  audio_duration?: number;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
  article_analytics?: ArticleAnalytics[];
  quizzes?: Quiz[];
  coverage_comparisons?: CoverageComparison[];
}

// Normalize raw backend/BFF article into frontend ArticleDetail shape.
export function normalizeArticle(raw: RawArticle): ArticleDetail {
  if (!raw || typeof raw !== "object")
    throw new Error("Cannot normalize empty article");
  const summary = raw.summary ?? "";
  const readingTime =
    typeof raw.reading_time === "number"
      ? raw.reading_time
      : (() => {
          const words = summary.split(/\s+/).filter(Boolean).length || 40;
          return Math.max(1, Math.ceil(words / 200));
        })();
  return {
    id: raw.id,
    title: raw.title ?? "",
    summary,
    ai_explanation: raw.ai_explanation ?? null,
    explanation_generated: !!(raw.ai_explanation || raw.explanation_generated),
    category: raw.category ?? "general",
    language: raw.language ?? "en",
    source: raw.source ?? raw.source_name ?? "Unknown",
    source_url: raw.source_url ?? raw.url ?? null,
    image_url: raw.image_url ?? raw.imageUrl ?? raw.media?.url ?? null,
    published_at:
      raw.published_at ?? raw.publishedAt ?? new Date().toISOString(),
    reading_time: readingTime,
    tags: Array.isArray(raw.tags) ? raw.tags : raw.categories || [],
    eli5_summary: raw.eli5_summary ?? null,
    audio_summary_url: raw.audio_summary_url ?? raw.audioSummary ?? null,
    audio_duration: raw.audio_duration ?? 0,
    view_count: raw.view_count ?? 0,
    created_at: raw.created_at ?? raw.published_at ?? new Date().toISOString(),
    updated_at: raw.updated_at ?? raw.published_at ?? new Date().toISOString(),
    article_analytics: raw.article_analytics ?? [],
    quizzes: raw.quizzes ?? [],
    coverage_comparisons: raw.coverage_comparisons ?? [],
    media:
      raw.media ??
      (raw.image_url || raw.imageUrl
        ? {
            id: `${raw.id}-ext`,
            origin: "publisher",
            url: (raw.image_url || raw.imageUrl) as string,
          }
        : null),
  };
}
