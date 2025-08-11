import { supabase } from '../lib/supabase'

// Fallback data for when Supabase is not connected
const FALLBACK_ARTICLES = [
  {
    id: '1',
    title: "Major Breakthrough in Quantum Computing Achieved by International Research Team",
    summary: "Scientists from MIT, Google, and several international universities have announced a significant breakthrough in quantum computing that could revolutionize data processing and encryption. The team successfully demonstrated a new quantum algorithm that can solve complex optimization problems exponentially faster than classical computers.",
    ai_explanation: null,
    explanation_generated: false,
    category: "Technology",
    language: "English",
    source: "TechCrunch",
    source_url: "https://example.com/quantum-breakthrough",
    image_url: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reading_time: 5,
    tags: ["quantum computing", "technology", "breakthrough", "MIT", "Google"],
    eli5_summary: "Scientists made computers that use special quantum rules work much better. These new computers can solve really hard math problems super fast!",
    audio_summary_url: null,
    audio_duration: 0,
    view_count: 1250,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    article_analytics: [{
      bias_score: 0.1,
      bias_explanation: "Slightly positive coverage focusing on potential benefits",
      bias_sources: ["AI Analysis", "Source Verification"],
      sentiment_score: 0.7,
      sentiment_label: "positive",
      credibility_score: 0.9
    }],
    quizzes: [{
      id: 'quiz-1',
      questions: [
        {
          id: 'q1',
          question: "What is the main breakthrough described in the article?",
          options: [
            "A new quantum algorithm for optimization problems",
            "Room temperature superconductors",
            "Faster internet speeds",
            "Better smartphone batteries"
          ],
          correctAnswer: 0,
          explanation: "The article specifically mentions a new quantum algorithm that can solve complex optimization problems exponentially faster than classical computers."
        },
        {
          id: 'q2',
          question: "Which institutions were involved in this research?",
          options: [
            "Only MIT",
            "MIT, Google, and international universities",
            "Google and Apple",
            "NASA and SpaceX"
          ],
          correctAnswer: 1,
          explanation: "The article states that scientists from MIT, Google, and several international universities collaborated on this breakthrough."
        }
      ],
      difficulty: "intermediate"
    }],
    coverage_comparisons: [{
      comparisons: [
        {
          source: "Tech Tribune",
          perspective: "Focuses on the commercial implications and potential market disruption from quantum computing advances.",
          bias: 0.3
        },
        {
          source: "Science Daily",
          perspective: "Emphasizes the scientific methodology and peer review process, highlighting the technical achievements.",
          bias: 0.0
        }
      ]
    }]
  },
  {
    id: '2',
    title: "Global Climate Summit Reaches Historic Agreement on Carbon Reduction",
    summary: "World leaders at the International Climate Summit have reached a groundbreaking agreement to reduce global carbon emissions by 60% over the next decade. The accord includes specific targets for renewable energy adoption and a $500 billion fund for clean energy infrastructure.",
    ai_explanation: null,
    explanation_generated: false,
    category: "Environment",
    language: "English",
    source: "Reuters",
    source_url: "https://example.com/climate-agreement",
    image_url: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    reading_time: 6,
    tags: ["climate change", "environment", "global summit", "carbon emissions", "renewable energy"],
    eli5_summary: "Countries around the world promised to make much less pollution and use clean energy like solar and wind power to help save our planet!",
    audio_summary_url: null,
    audio_duration: 0,
    view_count: 2100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    article_analytics: [{
      bias_score: -0.1,
      bias_explanation: "Balanced reporting with slight emphasis on environmental benefits",
      bias_sources: ["AI Analysis", "Source Verification"],
      sentiment_score: 0.5,
      sentiment_label: "positive",
      credibility_score: 0.95
    }],
    quizzes: [{
      id: 'quiz-2',
      questions: [
        {
          id: 'q1',
          question: "What is the target for carbon emission reduction?",
          options: ["40%", "50%", "60%", "70%"],
          correctAnswer: 2,
          explanation: "The agreement aims to reduce global carbon emissions by 60% over the next decade."
        }
      ],
      difficulty: "intermediate"
    }],
    coverage_comparisons: [{
      comparisons: [
        {
          source: "Environmental Herald",
          perspective: "Celebrates the agreement as a historic victory for climate action and environmental protection.",
          bias: 0.4
        },
        {
          source: "Business Weekly",
          perspective: "Focuses on economic implications and potential challenges for industries adapting to new regulations.",
          bias: -0.2
        }
      ]
    }]
  }
]

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('Checking Supabase configuration...')
  console.log('URL exists:', !!url)
  console.log('Key exists:', !!key)
  
  if (!url || !key) {
    console.log('Supabase not configured: Missing environment variables')
    return false
  }
  if (url.includes('your-project-ref') || url.includes('placeholder')) {
    console.log('Supabase not configured: Placeholder URL detected')
    return false
  }
  if (key.includes('your-anon-key') || key.includes('placeholder')) {
    console.log('Supabase not configured: Placeholder key detected')
    return false
  }
  if (!url.includes('supabase.co')) {
    console.log('Supabase not configured: Invalid URL format')
    return false
  }
  if (key.length < 50) {
    console.log('Supabase not configured: Key too short')
    return false
  }
  
  console.log('Supabase configuration check passed')
  return true
}

// Helper function to get auth headers
const getAuthHeaders = async () => {
  if (!isSupabaseConfigured()) {
    return { 'Content-Type': 'application/json' }
  }
  
  // For public endpoints, don't require auth
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
  }
}

export const newsApi = {
  // Fetch all articles
  getArticles: async () => {
    if (!isSupabaseConfigured()) {
      console.log('Using fallback articles - Supabase not configured')
      return FALLBACK_ARTICLES
    }
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${API_BASE}/articles`, { headers })
      if (!response.ok) throw new Error('Failed to fetch articles')
      return response.json()
    } catch (error) {
      console.warn('Using fallback data:', error)
      return FALLBACK_ARTICLES
    }
  },

  // Get specific article
  getArticle: async (id: string) => {
    if (!isSupabaseConfigured()) {
      console.log('Using fallback article - Supabase not configured')
      return FALLBACK_ARTICLES.find(article => article.id === id) || null
    }
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${API_BASE}/articles/${id}`, { headers })
      if (!response.ok) throw new Error('Failed to fetch article')
      return response.json()
    } catch (error) {
      console.warn('Using fallback data:', error)
      return FALLBACK_ARTICLES.find(article => article.id === id) || null
    }
  },

  // Generate AI explanation for article
  generateExplanation: async (id: string) => {
    if (!isSupabaseConfigured()) {
      console.log('Using fallback explanation - Supabase not configured')
      const article = FALLBACK_ARTICLES.find(a => a.id === id)
      if (!article) throw new Error('Article not found')
      
      return {
        explanation: `**Comprehensive Analysis: "${article.title}"**
        
This story represents a significant development in the ${article.category.toLowerCase()} sector. Here's what you need to know:

**Background & Context:**
${article.summary}

**Key Implications:**
This development could have far-reaching consequences for the industry and society at large. The timing is particularly significant given current global trends and technological advances in ${article.category.toLowerCase()}.

**What This Means:**
For the average person, this news indicates important changes ahead. The implications extend beyond immediate effects to long-term societal and economic impacts, particularly in how we approach ${article.tags.slice(0, 2).join(' and ')}.

**Looking Forward:**
Experts will be watching closely to see how this develops over the coming months. This story is likely to have lasting significance in the ${article.category.toLowerCase()} field and could influence future policy and innovation.

**Related Developments:**
Keep an eye on related stories about ${article.tags.slice(2, 4).join(', ')} as they may provide additional context to this developing situation.

*Note: This is a demonstration explanation. Connect to Supabase and configure Gemini API for AI-generated content.*`
      }
    }
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${API_BASE}/articles/${id}/explanation`, {
        method: 'POST',
        headers
      })
      if (!response.ok) throw new Error('Failed to generate explanation')
      return response.json()
    } catch (error) {
      console.error('Failed to generate AI explanation:', error)
      // Fallback to demo explanation instead of throwing error
      const article = FALLBACK_ARTICLES.find(a => a.id === id)
      if (!article) throw new Error('Article not found')
      
      return {
        explanation: `**Demo Explanation: "${article.title}"**
        
This is a fallback explanation since the AI service is currently unavailable.

**Summary:**
${article.summary}

**Key Points:**
- This story falls under the ${article.category} category
- It involves topics like ${article.tags.slice(0, 3).join(', ')}
- The source is ${article.source}

*Note: AI explanation service is currently unavailable. Please check your Supabase and Gemini API configuration.*`
      }
    }
  },

  // Create new article
  createArticle: async (articleData: any) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }
    
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(articleData)
    })
    if (!response.ok) throw new Error('Failed to create article')
    return response.json()
  },

  // Search articles
  searchArticles: async (query: string, filters: { category?: string; language?: string } = {}) => {
    if (!isSupabaseConfigured()) {
      console.log('Using fallback search - Supabase not configured')
      const filtered = FALLBACK_ARTICLES.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase()) ||
        (filters.category && filters.category !== 'all' ? article.category.toLowerCase() === filters.category.toLowerCase() : true)
      )
      return filtered
    }
    
    try {
      const params = new URLSearchParams({ q: query, ...filters })
      const headers = await getAuthHeaders()
      const response = await fetch(`${API_BASE}/news-aggregator/search?${params}`, { headers })
      if (!response.ok) throw new Error('Failed to search articles')
      return response.json()
    } catch (error) {
      console.warn('Search failed, using fallback:', error)
      const filtered = FALLBACK_ARTICLES.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase()) ||
        (filters.category && filters.category !== 'all' ? article.category.toLowerCase() === filters.category.toLowerCase() : true)
      )
      return filtered
    }
  },

  // Fetch and process new articles
  fetchNews: async () => {
    if (!isSupabaseConfigured()) {
      console.log('Using fallback news fetch - Supabase not configured')
      return { processed: FALLBACK_ARTICLES.length, articles: FALLBACK_ARTICLES }
    }
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${API_BASE}/news-aggregator/fetch-news`, {
        method: 'POST',
        headers
      })
      if (!response.ok) throw new Error('Failed to fetch news')
      return response.json()
    } catch (error) {
      console.warn('News fetch failed, using fallback:', error)
      return { processed: FALLBACK_ARTICLES.length, articles: FALLBACK_ARTICLES }
    }
  },

  // Get trending topics
  getTrending: async () => {
    if (!isSupabaseConfigured()) {
      return []
    }
    
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/news-aggregator/trending`, { headers })
    if (!response.ok) throw new Error('Failed to fetch trending topics')
    return response.json()
  }
}

export const aiApi = {
  // Send chat message
  sendMessage: async (articleId: string, message: string, chatHistory: any[] = []) => {
    if (!isSupabaseConfigured()) {
      // Simple fallback responses
      const responses = [
        "That's an interesting question about this article. The key points suggest this is a significant development.",
        "Based on the article content, this appears to be an important story with broader implications.",
        "This is a complex topic. The article provides good context for understanding the situation.",
        "Great question! This development could have lasting effects on the industry."
      ]
      return { response: responses[Math.floor(Math.random() * responses.length)] }
    }
    
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
    if (!isSupabaseConfigured()) {
      return { messages: [] }
    }
    
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/ai-chat/chat/${articleId}`, { headers })
    if (!response.ok) throw new Error('Failed to get chat history')
    return response.json()
  }
}

export const quizApi = {
  // Generate quiz for article
  generateQuiz: async (articleId: string, difficulty: string = 'intermediate') => {
    if (!isSupabaseConfigured()) {
      const article = FALLBACK_ARTICLES.find(a => a.id === articleId)
      return article?.quizzes[0] || null
    }
    
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
    if (!isSupabaseConfigured()) {
      const article = FALLBACK_ARTICLES.find(a => a.id === articleId)
      return article?.quizzes[0] || null
    }
    
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/quiz-generator/quiz/${articleId}`, { headers })
    if (!response.ok) throw new Error('Failed to get quiz')
    return response.json()
  }
}

export const coverageApi = {
  // Generate coverage comparison
  analyzeCoverage: async (articleId: string) => {
    if (!isSupabaseConfigured()) {
      const article = FALLBACK_ARTICLES.find(a => a.id === articleId)
      return article?.coverage_comparisons[0] || { comparisons: [] }
    }
    
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
    if (!isSupabaseConfigured()) {
      const article = FALLBACK_ARTICLES.find(a => a.id === articleId)
      return article?.coverage_comparisons[0] || { comparisons: [] }
    }
    
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/coverage-analyzer/comparison/${articleId}`, { headers })
    if (!response.ok) throw new Error('Failed to get coverage comparison')
    return response.json()
  }
}

export const userApi = {
  // Register new user
  register: async (userData: { email: string; password: string; name: string; preferences: any }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }
    
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
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }
    
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
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }
    
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
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }
    
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/user-management/profile`, { headers })
    if (!response.ok) throw new Error('Failed to get profile')
    return response.json()
  },

  // Track interaction
  trackInteraction: async (articleId: string, interactionType: string, metadata: any = {}) => {
    if (!isSupabaseConfigured()) {
      // Silent fail for tracking when not configured
      console.log('Tracking interaction (demo mode):', { articleId, interactionType, metadata })
      return { success: true }
    }
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${API_BASE}/user-management/interaction`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ articleId, interactionType, metadata })
      })
      if (!response.ok) throw new Error('Failed to track interaction')
      return response.json()
    } catch (error) {
      console.warn('Failed to track interaction:', error)
      return { success: false }
    }
  }
}