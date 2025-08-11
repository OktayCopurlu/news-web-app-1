import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    topics: string[];
    languages: string[];
    readingLevel: 'beginner' | 'intermediate' | 'advanced';
    audioPreferences: boolean;
    biasAnalysis: boolean;
  };
  onboardingComplete: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      setUser({
        ...user,
        preferences: { ...user.preferences, ...preferences }
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
};