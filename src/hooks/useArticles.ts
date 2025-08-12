import { useState, useEffect } from "react";
import { newsApi, userApi } from "../services/api";
import type { ArticleDetail } from "../types/models";

// Backward compatibility: export Article alias (previous local interface)
export type Article = ArticleDetail;

export const useArticles = () => {
  const [articles, setArticles] = useState<ArticleDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await newsApi.getArticles();
      setArticles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  const getArticle = async (id: string): Promise<ArticleDetail | null> => {
    try {
      const article = await newsApi.getArticle(id);
      // Track view interaction (don't let this fail the article fetch)
      try {
        await userApi.trackInteraction(id, "view");
      } catch (trackingError) {
        console.warn("Failed to track interaction:", trackingError);
      }
      return article;
    } catch (err) {
      console.error("Error in getArticle:", err);
      return null;
    }
  };

  const searchArticles = async (
    query: string,
    filters: { category?: string; language?: string } = {}
  ) => {
    try {
      setLoading(true);
      // Current backend search API ignores filters; append simple tokens to query for future compatibility
      const filterTokens = [
        filters.category && `category:${filters.category}`,
        filters.language && `lang:${filters.language}`,
      ]
        .filter(Boolean)
        .join(" ");
      const effectiveQuery = filterTokens ? `${query} ${filterTokens}` : query;
      const data = await newsApi.searchArticles(effectiveQuery);
      setArticles(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search articles"
      );
    } finally {
      setLoading(false);
    }
  };

  const initializeWithSampleData = async () => {
    try {
      await newsApi.fetchNews();
      await fetchArticles();
    } catch (err) {
      console.error("Failed to initialize sample data:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    fetchArticles,
    getArticle,
    searchArticles,
    initializeWithSampleData,
  };
};
