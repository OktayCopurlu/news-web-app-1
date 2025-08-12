import React from 'react'
import { useAuth, type UserProfile } from '../hooks/useAuth'

interface AuthResult { user: UserProfile | null; error: string | null }
interface PrefResult { error: string | null }
interface UserContextType {
  user: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, name: string, preferences: Partial<UserProfile['preferences']>) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<PrefResult>
}

export const UserContext = React.createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: React.ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user: profile, loading, signUp, signIn, signOut, updatePreferences } = useAuth()

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

// Hook moved to separate file (useUser.ts) to satisfy fast refresh constraints.