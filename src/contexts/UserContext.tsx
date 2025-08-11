import React, { createContext, useContext, useEffect } from 'react'
import { useAuth, type UserProfile } from '../hooks/useAuth'

interface UserContextType {
  user: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, name: string, preferences: any) => Promise<{ user: any; error: string | null }>
  signIn: (email: string, password: string) => Promise<{ user: any; error: string | null }>
  signOut: () => Promise<void>
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<{ error: string | null }>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: React.ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user: authUser, profile, loading, signUp, signIn, signOut, updatePreferences } = useAuth()

  return (
    <UserContext.Provider value={{
      user: profile,
      loading,
      signUp,
      signIn,
      signOut,
      updatePreferences
    }}>
      {children}
    </UserContext.Provider>
  )
}