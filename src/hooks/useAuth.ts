import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { userApi } from '../services/api'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
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
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile()
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile()
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async () => {
    try {
      const profileData = await userApi.getProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string, preferences: any) => {
    try {
      const { user: newUser, session } = await userApi.register({
        email,
        password,
        name,
        preferences
      })
      
      if (session) {
        await supabase.auth.setSession(session)
      }
      
      return { user: newUser, error: null }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Registration failed' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData, session } = await userApi.login(email, password)
      
      if (session) {
        await supabase.auth.setSession(session)
      }
      
      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Login failed' }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updatePreferences = async (newPreferences: Partial<UserProfile['preferences']>) => {
    try {
      const updatedProfile = await userApi.updatePreferences({
        ...profile?.preferences,
        ...newPreferences
      })
      setProfile(updatedProfile)
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to update preferences' }
    }
  }

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updatePreferences,
    fetchProfile
  }
}