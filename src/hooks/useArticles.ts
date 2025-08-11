import { useState, useEffect } from 'react'
import { newsApi, userApi } from '../services/api'

export interface Article {
  id: string
  title: string
  summary: string
  content: string
  category: string
  language: string
  source: string
  source_url: string
  image_url: string | null
  published_at: string
  reading_time: number
  tags: string[]
  eli5_summary: string | null
  audio_summary_url: string | null
  audio_duration: number
  view_count: number
  article_analytics: Array<{
    bias_score: number
    bias_explanation: string | null
    bias_sources: string[]
    sentiment_score: number
    sentiment_label: string
    credibility_score: number
  }>
  quizzes: Array<{
    id: string
    questions: Array<{
      id: string
      question: string
      options: string[]
      correctAnswer: number
      explanation: string
    }>
    difficulty: string
  }>
  coverage_comparisons: Array<{
    comparisons: Array<{
      source: string
      perspective: string
      bias: number
    }>
  }>
}

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const data = await newsApi.getArticles()
      setArticles(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles')
    } finally {
      setLoading(false)
    }
  }

  const getArticle = async (id: string): Promise<Article | null> => {
    try {
      const article = await newsApi.getArticle(id)
      // Track view interaction (don't let this fail the article fetch)
      try {
        await userApi.trackInteraction(id, 'view')
      } catch (trackingError) {
        console.warn('Failed to track interaction:', trackingError)
      }
      return article
    } catch (err) {
      console.error('Error in getArticle:', err)
      return null
    }
  }

  const searchArticles = async (query: string, filters: { category?: string; language?: string } = {}) => {
    try {
      setLoading(true)
      const data = await newsApi.searchArticles(query, filters)
      setArticles(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search articles')
    } finally {
      setLoading(false)
    }
  }

  const initializeWithSampleData = async () => {
    try {
      await newsApi.fetchNews()
      await fetchArticles()
    } catch (err) {
      console.error('Failed to initialize sample data:', err)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  return {
    articles,
    loading,
    error,
    fetchArticles,
    getArticle,
    searchArticles,
    initializeWithSampleData
  }
}