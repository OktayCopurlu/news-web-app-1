import { useState, useEffect } from "react";
import { userApi } from "../services/api";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  preferences: {
    topics: string[];
    languages: string[];
    readingLevel: "beginner" | "intermediate" | "advanced";
    audioPreferences: boolean;
    biasAnalysis: boolean;
    notifications: boolean;
  };
  onboarding_complete: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount attempt profile fetch if token present
    if (localStorage.getItem("auth_token")) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await userApi.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    preferences: Partial<UserProfile["preferences"]>
  ) => {
    try {
      const { user: newUser, token } = await userApi.register({
        email,
        password,
        name,
        preferences,
      });
      if (token) setUser(newUser);
      return { user: newUser, error: null };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData } = await userApi.login(email, password);
      if (userData) setUser(userData);
      return { user: userData, error: null };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setProfile(null);
  };

  const updatePreferences = async (
    newPreferences: Partial<UserProfile["preferences"]>
  ) => {
    try {
      const updatedProfile = await userApi.updatePreferences({
        ...profile?.preferences,
        ...newPreferences,
      });
      setProfile(updatedProfile);
      return { error: null };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update preferences",
      };
    }
  };

  return {
    user: profile || user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updatePreferences,
    fetchProfile,
  };
};
