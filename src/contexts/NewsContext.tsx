import React, { createContext, useState } from 'react'
import { useArticles, type Article } from '../hooks/useArticles'
import { aiApi, quizApi, coverageApi, userApi } from '../services/api'
import type { QuizQuestion } from '../types/models'

export interface NewsQuiz {
  id: string
  articleId?: string
  questions: QuizQuestion[]
  difficulty: string
}

export interface CoverageComparison {
  source: string
  perspective: string
  bias: number
}

interface ArticleFilters { category?: string; language?: string }
interface ChatMessage { id?: string; type?: string; content: string; timestamp?: string }
interface InteractionMetadata { [key: string]: unknown }

interface NewsContextType {
  articles: Article[]
  loading: boolean
  error: string | null
  selectedArticle: Article | null
  setSelectedArticle: (article: Article | null) => void
  getArticleById: (id: string) => Promise<Article | null>
  searchArticles: (query: string, filters?: ArticleFilters) => Promise<void>
  sendChatMessage: (articleId: string, message: string, history: ChatMessage[]) => Promise<string>
  generateQuiz: (articleId: string) => Promise<NewsQuiz>
  getCoverageComparison: (articleId: string) => Promise<CoverageComparison[]>
  initializeData: () => Promise<void>
  trackInteraction: (articleId: string, type: string, metadata?: InteractionMetadata) => Promise<void>
}

export const NewsContext = createContext<NewsContextType | undefined>(undefined)

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

  const searchArticles = async (query: string, filters: ArticleFilters = {}) => {
    await searchArticlesApi(query, filters)
  }

  const sendChatMessage = async (articleId: string, message: string, history: ChatMessage[] = []): Promise<string> => {
    try {
      const response = await aiApi.sendMessage(articleId, message, history)
      // Adjust to new shape { messages: ChatMessage[] }
      const last = response.messages?.[response.messages.length - 1]
      return last?.content || ''
    } catch (error) {
      console.error('Failed to send chat message:', error)
      return "I'm sorry, I'm having trouble responding right now. Please try again later."
    }
  }

  const generateQuiz = async (articleId: string): Promise<NewsQuiz> => {
    try {
      const quiz = await quizApi.generateQuiz(articleId)
      return { ...quiz, articleId }
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

  const trackInteraction = async (articleId: string, type: string, metadata: InteractionMetadata = {}) => {
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