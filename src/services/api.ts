import { supabase } from '../lib/supabase'

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
  }
}

export const newsApi = {
  // Fetch all articles
  getArticles: async () => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/news-processor/articles`, { headers })
    if (!response.ok) throw new Error('Failed to fetch articles')
    return response.json()
  },

  // Get specific article
  getArticle: async (id: string) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/news-processor/articles/${id}`, { headers })
    if (!response.ok) throw new Error('Failed to fetch article')
    return response.json()
  },

  // Create new article
  createArticle: async (articleData: any) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/news-processor/articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(articleData)
    })
    if (!response.ok) throw new Error('Failed to create article')
    return response.json()
  },

  // Search articles
  searchArticles: async (query: string, filters: { category?: string; language?: string } = {}) => {
    const params = new URLSearchParams({ q: query, ...filters })
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/news-aggregator/search?${params}`, { headers })
    if (!response.ok) throw new Error('Failed to search articles')
    return response.json()
  },

  // Fetch and process new articles
  fetchNews: async () => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/news-aggregator/fetch-news`, {
      method: 'POST',
      headers
    })
    if (!response.ok) throw new Error('Failed to fetch news')
    return response.json()
  },

  // Get trending topics
  getTrending: async () => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/news-aggregator/trending`, { headers })
    if (!response.ok) throw new Error('Failed to fetch trending topics')
    return response.json()
  }
}

export const aiApi = {
  // Send chat message
  sendMessage: async (articleId: string, message: string, chatHistory: any[] = []) => {
    const headers = await getAuthHeaders()
    const { data: { user } } = await supabase.auth.getUser()
    
    const response = await fetch(`${API_BASE}/ai-chat/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        articleId,
        message,
        chatHistory,
        userId: user?.id
      })
    })
    if (!response.ok) throw new Error('Failed to send message')
    return response.json()
  },

  // Get chat history
  getChatHistory: async (articleId: string) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/ai-chat/chat/${articleId}`, { headers })
    if (!response.ok) throw new Error('Failed to get chat history')
    return response.json()
  }
}

export const quizApi = {
  // Generate quiz for article
  generateQuiz: async (articleId: string, difficulty: string = 'intermediate') => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/quiz-generator/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ articleId, difficulty })
    })
    if (!response.ok) throw new Error('Failed to generate quiz')
    return response.json()
  },

  // Get quiz for article
  getQuiz: async (articleId: string) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/quiz-generator/quiz/${articleId}`, { headers })
    if (!response.ok) throw new Error('Failed to get quiz')
    return response.json()
  }
}

export const coverageApi = {
  // Generate coverage comparison
  analyzeCoverage: async (articleId: string) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/coverage-analyzer/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ articleId })
    })
    if (!response.ok) throw new Error('Failed to analyze coverage')
    return response.json()
  },

  // Get coverage comparison
  getCoverage: async (articleId: string) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/coverage-analyzer/comparison/${articleId}`, { headers })
    if (!response.ok) throw new Error('Failed to get coverage comparison')
    return response.json()
  }
}

export const userApi = {
  // Register new user
  register: async (userData: { email: string; password: string; name: string; preferences: any }) => {
    const response = await fetch(`${API_BASE}/user-management/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error('Failed to register user')
    return response.json()
  },

  // Login user
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/user-management/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw new Error('Failed to login')
    return response.json()
  },

  // Update user preferences
  updatePreferences: async (preferences: any) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/user-management/preferences`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ preferences })
    })
    if (!response.ok) throw new Error('Failed to update preferences')
    return response.json()
  },

  // Get user profile
  getProfile: async () => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/user-management/profile`, { headers })
    if (!response.ok) throw new Error('Failed to get profile')
    return response.json()
  },

  // Track interaction
  trackInteraction: async (articleId: string, interactionType: string, metadata: any = {}) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/user-management/interaction`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ articleId, interactionType, metadata })
    })
    if (!response.ok) throw new Error('Failed to track interaction')
    return response.json()
  }
}