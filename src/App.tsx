import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { NewsProvider } from './contexts/NewsContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ArchivePage from './pages/ArchivePage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NewsProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/quiz/:id" element={<QuizPage />} />
              </Routes>
            </div>
          </Router>
        </NewsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;