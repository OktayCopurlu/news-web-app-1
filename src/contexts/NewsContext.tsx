import React, { createContext, useContext, useState, useEffect } from 'react'
import { useArticles, type Article } from '../hooks/useArticles'
import { aiApi, quizApi, coverageApi, userApi } from '../services/api'

export interface NewsQuiz {
  id: string
  articleId: string
  questions: Array<{
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }>
  difficulty: string
}

export interface CoverageComparison {
  source: string
  perspective: string
  bias: number
}

interface NewsContextType {
  articles: Article[]
  loading: boolean
  error: string | null
  selectedArticle: Article | null
  setSelectedArticle: (article: Article | null) => void
  getArticleById: (id: string) => Promise<Article | null>
  searchArticles: (query: string, filters?: any) => Promise<void>
  sendChatMessage: (articleId: string, message: string, history: any[]) => Promise<string>
  generateQuiz: (articleId: string) => Promise<NewsQuiz>
  getCoverageComparison: (articleId: string) => Promise<CoverageComparison[]>
  initializeData: () => Promise<void>
  trackInteraction: (articleId: string, type: string, metadata?: any) => Promise<void>
}

const NewsContext = createContext<NewsContextType | undefined>(undefined)

export const useNews = () => {
  const context = useContext(NewsContext)
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider')
  }
  return context
}

interface NewsProviderProps {
  children: React.ReactNode
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const { articles, loading, error, getArticle, searchArticles: searchArticlesApi, initializeWithSampleData } = useArticles()
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const getArticleById = async (id: string): Promise<Article | null> => {
    try {
      const article = await getArticle(id)
      if (article) {
        setSelectedArticle(article)
      }
      return article
    } catch (error) {
      console.error('Failed to get article:', error)
      return null
    }
  }

  const searchArticles = async (query: string, filters: any = {}) => {
    await searchArticlesApi(query, filters)
  }

  const sendChatMessage = async (articleId: string, message: string, history: any[] = []): Promise<string> => {
    try {
      const response = await aiApi.sendMessage(articleId, message, history)
      return response.response
    } catch (error) {
      console.error('Failed to send chat message:', error)
      return "I'm sorry, I'm having trouble responding right now. Please try again later."
    }
  }

  const generateQuiz = async (articleId: string): Promise<NewsQuiz> => {
    try {
      return await quizApi.generateQuiz(articleId)
    } catch (error) {
      console.error('Failed to generate quiz:', error)
      throw error
    }
  }

  const getCoverageComparison = async (articleId: string): Promise<CoverageComparison[]> => {
    try {
      const response = await coverageApi.analyzeCoverage(articleId)
      return response.comparisons || []
    } catch (error) {
      console.error('Failed to get coverage comparison:', error)
      return []
    }
  }

  const initializeData = async () => {
    try {
      await initializeWithSampleData()
    } catch (error) {
      console.error('Failed to initialize data:', error)
    }
  }

  const trackInteraction = async (articleId: string, type: string, metadata: any = {}) => {
    try {
      await userApi.trackInteraction(articleId, type, metadata)
    } catch (error) {
      console.error('Failed to track interaction:', error)
    }
  }

  return (
    <NewsContext.Provider value={{
      articles,
      loading,
      error,
      selectedArticle,
      setSelectedArticle,
      getArticleById,
      searchArticles,
      sendChatMessage,
      generateQuiz,
      getCoverageComparison,
      initializeData,
      trackInteraction
    }}>
      {children}
    </NewsContext.Provider>
  )
}