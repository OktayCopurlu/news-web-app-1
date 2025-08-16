// Central domain model & API response types (frontend-side contracts)
// Adjust as backend data evolves.

export interface ArticleSummary {
  id: string;
  title: string;
  summary: string;
  ai_explanation: string | null;
  explanation_generated: boolean;
  category: string;
  language: string;
  source: string;
  source_url: string | null;
  image_url: string | null;
  published_at: string; // ISO string
  reading_time: number; // minutes
  tags: string[];
  eli5_summary?: string | null;
}

// Media types (from backend BFF)
export interface MediaVariant {
  width: number;
  url: string;
  bytes?: number;
}

export interface MediaAsset {
  id: string;
  origin: string; // 'publisher' | 'stock' | 'ai_generated' | 'og_card' | ...
  url: string;
  width?: number;
  height?: number;
  license?: string | null;
  attribution?: string | null;
  variants?: MediaVariant[];
}

export interface ArticleAnalytics {
  bias_score: number;
  bias_explanation: string | null;
  bias_sources: string[];
  sentiment_score: number;
  sentiment_label: string;
  credibility_score?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index in options
  explanation: string;
}

export interface Quiz {
  id: string;
  article_id?: string;
  questions: QuizQuestion[];
  difficulty: string;
}

export interface CoverageItem {
  source: string;
  perspective: string;
  bias: number; // -1..1 range expected
}
export interface CoverageComparison {
  comparisons: CoverageItem[];
}

export interface ArticleDetail extends ArticleSummary {
  audio_summary_url?: string | null;
  audio_duration?: number;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
  article_analytics?: ArticleAnalytics[];
  quizzes?: Quiz[];
  coverage_comparisons?: CoverageComparison[];
  // Optional rich media payload
  media?: MediaAsset | null;
  // Translation readiness hint from BFF (/feed non-strict)
  translation_status?: "ready" | "pending";
  // Detail-specific enrichments (from /cluster/:id)
  citations?: Array<{
    id: string;
    title?: string;
    url?: string;
    source_id?: string;
    source_name?: string;
  }>;
  timeline?: Array<{
    id: string;
    text?: string;
    language?: string;
    translated_from?: string | null;
    happened_at?: string; // ISO
    source_id?: string;
  }>;
}

export interface UserPreferences {
  topics: string[];
  languages: string[];
  readingLevel: "beginner" | "intermediate" | "advanced";
  audioPreferences: boolean;
  biasAnalysis: boolean;
  notifications: boolean;
}

export interface UserProfileModel {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  preferences: UserPreferences;
  onboarding_complete: boolean;
  created_at?: string;
  updated_at?: string;
}
