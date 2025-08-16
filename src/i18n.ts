// Minimal i18n helper for UI strings used in components.
// Keeps things lightweight and test-friendly.

type Dict = Record<string, string>;

const en: Dict = {
  loadingNews: "Loading latest news…",
  failedToLoadNews: "Failed to load news",
  retry: "Retry",
  noArticlesFound: "No articles found",
  noArticlesHint: "Try another category or clear filters.",
  illustrationLabel: "Illustration",
  translatingLabel: "Translated soon",
  biasLabel: "Bias",
  biasNeutral: "Neutral",
  biasPositive: "Positive",
  biasNegative: "Negative",
  sentimentLabel: "Sentiment",
  catAll: "All",
  catTechnology: "Technology",
  catHealth: "Health",
  catEnvironment: "Environment",
  catFinance: "Finance",
  catSports: "Sports",
  catEntertainment: "Entertainment",
  catScience: "Science",
  catPolitics: "Politics",
  browseArchive: "Browse archive",
  getStarted: "Get started",
  updatedJustNow: "just now",
  backToNews: "Back to news",
  loadingArticle: "Loading article…",
  generating: "Generating…",
  explainLikeIm5: "Explain like I'm 5",
  askAiMore: "Ask AI more",
  knowledgeQuizTitle: "Knowledge Quiz",
  compareCoverage: "Compare Coverage",
  searchPlaceholder: "Search news…",
  moreCoverage: "more",
};

// Simple translator
export function t(key: string, params?: Record<string, unknown>): string {
  if (key === "minutesRead") {
    const m =
      Number((params as Record<string, number> | undefined)?.minutes) || 0;
    return `${m} min`;
  }
  return en[key] || key;
}

export default t;
