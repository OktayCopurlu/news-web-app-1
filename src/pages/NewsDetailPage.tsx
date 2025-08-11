import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Share2, Bookmark, MessageCircle, BarChart3, Eye, Brain, ArrowLeft, Loader } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useUser } from '../contexts/UserContext';
import { newsApi } from '../services/api';
import BiasIndicator from '../components/BiasIndicator';
import CoverageComparison from '../components/CoverageComparison';
import AIChat from '../components/AIChat';
import AudioPlayer from '../components/AudioPlayer';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById } = useNews();
  const { user } = useUser();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingExplanation, setGeneratingExplanation] = useState(false);
  const [showELI5, setShowELI5] = useState(false);
  const [showCoverage, setShowCoverage] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [generatingELI5, setGeneratingELI5] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [generatingCoverage, setGeneratingCoverage] = useState(false);
  const [autoGeneratingExplanation, setAutoGeneratingExplanation] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const foundArticle = await getArticleById(id);
        setArticle(foundArticle);
      } catch (err) {
        setError('Failed to load article');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Auto-generate explanation when article loads
  useEffect(() => {
    const autoGenerateExplanation = async () => {
      if (article && !article.ai_explanation && !article.explanation_generated) {
        try {
          setAutoGeneratingExplanation(true);
          const response = await newsApi.generateExplanation(article.id);
          setArticle(prev => ({
            ...prev,
            ai_explanation: response.explanation,
            explanation_generated: true
          }));
        } catch (err) {
          console.error('Failed to auto-generate explanation:', err);
        } finally {
          setAutoGeneratingExplanation(false);
        }
      }
    };

    if (article) {
      autoGenerateExplanation();
    }
  }, [article?.id]);
  const handleGenerateExplanation = async () => {
    if (!article || generatingExplanation) return;
    
    try {
      setGeneratingExplanation(true);
      const response = await newsApi.generateExplanation(article.id);
      setArticle(prev => ({
        ...prev,
        ai_explanation: response.explanation,
        explanation_generated: true
      }));
    } catch (err) {
      console.error('Failed to generate explanation:', err);
      setError('Failed to generate AI explanation. Please check if the AI service is properly configured.');
    } finally {
      setGeneratingExplanation(false);
    }
  };

  const handleELI5Click = async () => {
    if (!article) return;
    
    if (article.eli5_summary) {
      setShowELI5(!showELI5);
    } else {
      // Generate ELI5 summary using AI
      setGeneratingELI5(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/news-processor/articles/${article.id}/eli5`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setArticle(prev => ({
            ...prev,
            eli5_summary: data.eli5_summary
          }));
          setShowELI5(true);
        }
      } catch (err) {
        console.error('Failed to generate ELI5 summary:', err);
      } finally {
        setGeneratingELI5(false);
      }
    }
  };

  const handleQuizClick = async () => {
    if (!article) return;
    
    const quiz = article.quizzes?.[0];
    if (quiz) {
      // Navigate to existing quiz
      navigate(`/quiz/${article.id}`);
    } else {
      // Generate quiz using AI
      setGeneratingQuiz(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quiz-generator/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ articleId: article.id })
        });
        
        if (response.ok) {
          const quizData = await response.json();
          setArticle(prev => ({
            ...prev,
            quizzes: [quizData]
          }));
          navigate(`/quiz/${article.id}`);
        }
      } catch (err) {
        console.error('Failed to generate quiz:', err);
      } finally {
        setGeneratingQuiz(false);
      }
    }
  };

  const handleCoverageClick = async () => {
    if (!article) return;
    
    const coverage = article.coverage_comparisons?.[0]?.comparisons;
    if (coverage && coverage.length > 0) {
      setShowCoverage(!showCoverage);
    } else {
      // Generate coverage comparison using AI
      setGeneratingCoverage(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coverage-analyzer/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ articleId: article.id })
        });
        
        if (response.ok) {
          const coverageData = await response.json();
          setArticle(prev => ({
            ...prev,
            coverage_comparisons: [coverageData]
          }));
          setShowCoverage(true);
        }
      } catch (err) {
        console.error('Failed to generate coverage comparison:', err);
      } finally {
        setGeneratingCoverage(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Article Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The article you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get analytics data with fallback
  const analytics = article.article_analytics?.[0] || {
    bias_score: 0,
    bias_explanation: 'No bias analysis available',
    bias_sources: [],
    sentiment_score: 0,
    sentiment_label: 'neutral'
  };

  // Get quiz data with fallback
  const quiz = article.quizzes?.[0];

  // Get coverage comparison with fallback
  const coverageComparison = article.coverage_comparisons?.[0]?.comparisons || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News</span>
        </Link>

        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center space-x-2 text-white/80 text-sm mb-2">
                <span className="bg-blue-600 px-2 py-1 rounded text-xs font-medium">
                  {article.category}
                </span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {article.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.reading_time} min read</span>
                </span>
                <span>By {article.source}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Audio Player */}
                {article.audio_summary_url && (
                  <AudioPlayer audioUrl={article.audio_summary_url} duration={article.audio_duration} />
                )}
                
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                
                <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bias Analysis */}
            {user?.preferences.biasAnalysis && (
              <div className="mb-6">
                <BiasIndicator article={{
                  ...article,
                  bias: {
                    score: analytics.bias_score,
                    explanation: analytics.bias_explanation,
                    sources: analytics.bias_sources
                  },
                  sentiment: {
                    score: analytics.sentiment_score,
                    label: analytics.sentiment_label
                  }
                }} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <button
                onClick={handleELI5Click}
                disabled={generatingELI5}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                  showELI5
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 dark:hover:text-purple-400'
                } ${generatingELI5 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {generatingELI5 ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                <span>{generatingELI5 ? 'Generating...' : 'Explain Like I\'m 5'}</span>
              </button>
              
              <button
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                  showChat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask AI More</span>
              </button>
              
              <button
                onClick={handleQuizClick}
                disabled={generatingQuiz}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-600 dark:hover:text-green-400'
                } ${generatingQuiz ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {generatingQuiz ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{generatingQuiz ? 'Generating...' : 'Test Knowledge'}</span>
              </button>
            </div>

            {/* Coverage Comparison Button - Separate row */}
            <div className="mb-8">
              <button
                onClick={handleCoverageClick}
                disabled={generatingCoverage}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors font-medium w-full sm:w-auto ${
                  showCoverage
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-600 dark:hover:text-orange-400'
                } ${generatingCoverage ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {generatingCoverage ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                <span>{generatingCoverage ? 'Generating...' : 'Compare Coverage'}</span>
              </button>
            </div>

            {/* ELI5 Summary */}
            {showELI5 && (
              <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Explain Like I'm 5</span>
                </h3>
                <p className="text-purple-700 dark:text-purple-300">
                  {article.eli5_summary || 'Generating simple explanation...'}
                </p>
              </div>
            )}

            {/* Coverage Comparison */}
            {showCoverage && (
              <div className="mb-8">
                <CoverageComparison comparisons={coverageComparison} />
              </div>
            )}

            {/* AI Chat */}
            {showChat && (
              <div className="mb-8">
                <AIChat article={{
                  ...article,
                  bias: {
                    score: analytics.bias_score,
                    explanation: analytics.bias_explanation,
                    sources: analytics.bias_sources
                  },
                  sentiment: {
                    score: analytics.sentiment_score,
                    label: analytics.sentiment_label
                  },
                  coverageComparison: coverageComparison
                }} />
              </div>
            )}

            {/* Full Article Content */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Detailed AI Explanation
              </h2>
              
              {article.ai_explanation || autoGeneratingExplanation ? (
                generatingExplanation && !article.ai_explanation ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      AI is generating a detailed explanation...
                    </p>
                  </div>
                ) : (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    {article.ai_explanation}
                  </div>
                </div>
                )
              ) : (
                !generatingExplanation ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Get a detailed AI explanation of this news story
                    </p>
                    <button
                      onClick={handleGenerateExplanation}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Generate Detailed Explanation
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      AI is generating a detailed explanation...
                    </p>
                  </div>
                )
              )}
            </div>
              

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
                {article.tags && article.tags.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    +{article.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetailPage;