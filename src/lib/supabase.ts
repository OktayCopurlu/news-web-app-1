import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using placeholder values.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          preferences: {
            topics: string[]
            languages: string[]
            readingLevel: 'beginner' | 'intermediate' | 'advanced'
            audioPreferences: boolean
            biasAnalysis: boolean
            notifications: boolean
          }
          onboarding_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      articles: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
      }
      article_analytics: {
        Row: {
          id: string
          article_id: string
          bias_score: number
          bias_explanation: string | null
          bias_sources: string[]
          sentiment_score: number
          sentiment_label: string
          credibility_score: number
          engagement_score: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['article_analytics']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['article_analytics']['Insert']>
      }
      user_interactions: {
        Row: {
          id: string
          user_id: string
          article_id: string
          interaction_type: string
          metadata: Record<string, any>
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_interactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_interactions']['Insert']>
      }
      ai_chats: {
        Row: {
          id: string
          user_id: string | null
          article_id: string
          messages: Array<{
            id: string
            type: 'user' | 'ai'
            content: string
            timestamp: string
          }>
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_chats']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ai_chats']['Insert']>
      }
      quizzes: {
        Row: {
          id: string
          article_id: string
          questions: Array<{
            id: string
            question: string
            options: string[]
            correctAnswer: number
            explanation: string
          }>
          difficulty: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['quizzes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['quizzes']['Insert']>
      }
      coverage_comparisons: {
        Row: {
          id: string
          article_id: string
          comparisons: Array<{
            source: string
            perspective: string
            bias: number
          }>
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['coverage_comparisons']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['coverage_comparisons']['Insert']>
      }
    }
  }
}