import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { NewsProvider } from './contexts/NewsContext';
import Header from './components/Header';
const HomePage = lazy(() => import('./pages/HomePage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const ArchivePage = lazy(() => import('./pages/ArchivePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
import { ErrorBoundary } from './components/ErrorBoundary';
import { ArticleSkeleton } from './components/Skeleton';
import { ToastProvider } from './contexts/useToast';
import { useToast } from './contexts/useToast';
import { getPreferredLang, setDocumentLangDir } from './utils/lang';

function FallbackWatcher(){
  const { push } = useToast();
  useEffect(()=>{
    function handler(e: Event){
      const detail = (e as CustomEvent).detail;
      push({ message: `Backend unreachable – showing sample data (${detail?.reason || 'unknown'})`, type: 'warning', timeoutMs: 6000 });
    }
    window.addEventListener('bff-fallback', handler as EventListener);
    return ()=> window.removeEventListener('bff-fallback', handler as EventListener);
  },[push]);
  return null;
}

function LangDirEffect(){
  useEffect(() => {
    const lang = getPreferredLang();
    setDocumentLangDir(lang);
  }, []);
  return null;
}

function App() {
  return (
  <ThemeProvider>
      <UserProvider>
        <NewsProvider>
          <ToastProvider>
            <FallbackWatcher />
            {/* Set <html lang> and dir based on preferred language */}
            <LangDirEffect />
          <Router>
            <ErrorBoundary>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                <Header />
                <Suspense fallback={<div className="p-6"><ArticleSkeleton count={4} /></div>}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/news/:id" element={<NewsDetailPage />} />
                    <Route path="/archive" element={<ArchivePage />} />
                    <Route path="/quiz/:id" element={<QuizPage />} />
                  </Routes>
                </Suspense>
              </div>
            </ErrorBoundary>
          </Router>
      </ToastProvider>
        </NewsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;