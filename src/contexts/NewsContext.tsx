import React, { createContext, useContext, useState } from 'react';
import { mockNewsData } from '../data/mockNews';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  language: string;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  publishedAt: string;
  readingTime: number;
  bias: {
    score: number;
    explanation: string;
    sources: string[];
  };
  sentiment: {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
  };
  coverageComparison?: {
    source: string;
    perspective: string;
    bias: number;
  }[];
  eli5Summary?: string;
  audioSummary?: {
    url: string;
    duration: number;
  };
  relatedArticles: string[];
  tags: string[];
}

export interface NewsQuiz {
  id: string;
  articleId: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

interface NewsContextType {
  articles: NewsArticle[];
  quizzes: NewsQuiz[];
  selectedArticle: NewsArticle | null;
  setSelectedArticle: (article: NewsArticle | null) => void;
  getArticleById: (id: string) => NewsArticle | undefined;
  getArticlesByCategory: (category: string) => NewsArticle[];
  searchArticles: (query: string) => NewsArticle[];
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

interface NewsProviderProps {
  children: React.ReactNode;
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [articles] = useState<NewsArticle[]>(mockNewsData.articles);
  const [quizzes] = useState<NewsQuiz[]>(mockNewsData.quizzes);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const getArticleById = (id: string) => {
    return articles.find(article => article.id === id);
  };

  const getArticlesByCategory = (category: string) => {
    return articles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  };

  const searchArticles = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return (
    <NewsContext.Provider value={{
      articles,
      quizzes,
      selectedArticle,
      setSelectedArticle,
      getArticleById,
      getArticlesByCategory,
      searchArticles
    }}>
      {children}
    </NewsContext.Provider>
  );
};