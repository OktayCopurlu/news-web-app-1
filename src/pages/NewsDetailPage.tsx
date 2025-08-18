import React, { useState, useEffect, useRef } from 'react';
import type { ArticleDetail } from '../types/models';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Share2, Bookmark, MessageCircle, BarChart3, Eye, Brain, ArrowLeft, Loader } from 'lucide-react';
import { useNews } from '../contexts/useNews';
import { useUser } from '../contexts/useUser';
import { newsApi, quizApi, coverageApi, aiApi } from '../services/api';
import { t } from '../i18n';
import BiasIndicator from '../components/BiasIndicator';
import CoverageComparison from '../components/CoverageComparison';
import AIChat from '../components/AIChat';
import AudioPlayer from '../components/AudioPlayer';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById } = useNews();
  const { user } = useUser();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
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
  // Prevent infinite retry loops if the explanation endpoint keeps failing
  const explanationAttemptedRef = useRef(false);

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
  }, [id, getArticleById]);

  // Auto-generate explanation when article loads
  useEffect(() => {
    const autoGenerateExplanation = async () => {
      if (!article) return;
      if (explanationAttemptedRef.current) return; // already tried once
      if (article.ai_explanation || article.explanation_generated) return;
      explanationAttemptedRef.current = true; // mark attempt to avoid loops
      try {
        setAutoGeneratingExplanation(true);
        const response = await newsApi.generateExplanation(article.id);
        setArticle(prev => prev ? ({
          ...prev,
          ai_explanation: response.explanation,
          explanation_generated: true
        }) : prev);
      } catch (err) {
        console.error('Failed to auto-generate explanation:', err);
        // Mark as generated (false explanation) to prevent repeated attempts
        setArticle(prev => prev ? ({ ...prev, explanation_generated: true }) : prev);
      } finally {
        setAutoGeneratingExplanation(false);
      }
    };
    autoGenerateExplanation();
  }, [article]);
  const handleGenerateExplanation = async () => {
    if (!article || generatingExplanation) return;
    
    try {
      setGeneratingExplanation(true);
      const response = await newsApi.generateExplanation(article.id);
          setArticle(prev => prev ? ({
            ...prev,
            ai_explanation: response.explanation,
            explanation_generated: true
          }) : prev);
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
        const prompt =
          'Explain this news story like I\'m 5 (ELI5). Use 3-5 short sentences, simple words, and neutral tone.';
        const response = await aiApi.sendMessage(article.id, prompt, []);
        const last = response.messages?.[response.messages.length - 1];
        const summary = last?.content || '';
        if (summary) {
          setArticle((prev) =>
            prev ? { ...prev, eli5_summary: summary } : prev
          );
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
        const quizData = await quizApi.generateQuiz(article.id);
  setArticle(prev => prev ? ({ ...prev, quizzes: [quizData] }) : prev);
        navigate(`/quiz/${article.id}`);
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
        const coverageData = await coverageApi.analyzeCoverage(article.id);
  setArticle(prev => prev ? ({ ...prev, coverage_comparisons: [coverageData] }) : prev);
        setShowCoverage(true);
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
          <p className="text-gray-600 dark:text-gray-400">{t('loadingArticle')}</p>
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
  // const quiz = article.quizzes?.[0]; // unused

  // Get coverage comparison with fallback
  const coverageComparison = article.coverage_comparisons?.[0]?.comparisons || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToNews')}</span>
        </Link>

  {/* Article Header */}
  <article className="bg-white dark:bg-gray-800 shadow-lg">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80">
            {(() => {
              const m = article.media;
              if (m) {
                const variants = (m.variants || []).slice().sort((a,b)=>a.width-b.width);
                const srcSet = variants.length ? variants.map(v=>`${v.url} ${v.width}w`).join(', ') : undefined;
                const sizes = variants.length ? '(max-width: 768px) 100vw, 768px' : undefined;
                return (
                  <img
                    src={m.url || article.image_url || ''}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={article.title}
                    className="w-full h-full object-cover rounded-none"
                    loading="eager"
                  />
                );
              }
              return (
                <img
                  src={article.image_url || ''}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-none"
                />
              );
            })()}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {article.media && (article.media.origin === 'ai_generated' || article.media.origin === 'og_card') && (
              <div className="absolute top-4 left-4">
                <span className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">Illustration</span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center space-x-2 text-white/80 text-sm mb-2">
                <span className="bg-blue-600 px-2 py-1 rounded text-xs font-medium">
                  {article.category}
                </span>
                <span>{formatDate(article.published_at)}</span>
              </div>
              <h1 className="font-serif text-headline sm:text-display-2 font-black text-white leading-tight">
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
                  <AudioPlayer audioUrl={article.audio_summary_url} duration={article.audio_duration || 0} />
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
                    explanation: analytics.bias_explanation || '',
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
                  <span>{generatingELI5 ? t('generating') : t('explainLikeIm5')}</span>
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
                <span>{t('askAiMore')}</span>
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
                <span>{generatingQuiz ? t('generating') : t('knowledgeQuizTitle')}</span>
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
                <span>{generatingCoverage ? t('generating') : t('compareCoverage')}</span>
              </button>
            </div>

            {/* ELI5 Summary */}
            {showELI5 && (
              <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>{t('explainLikeIm5')}</span>
                </h3>
                <p className="text-purple-700 dark:text-purple-300">
                  {article.eli5_summary || t('generating')}
                </p>
              </div>
            )}

            {/* Coverage Comparison */}
            {showCoverage && (
              <div className="mb-8">
                <CoverageComparison comparisons={coverageComparison} />
              </div>
            )}

              {/* Timeline */}
              {Array.isArray(article.timeline) && article.timeline.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Timeline</h3>
                  <ol className="relative border-l border-gray-200 dark:border-gray-700">
                    {article.timeline
                      .slice()
                      .sort((a, b) => {
                        const ta = a.happened_at ? Date.parse(a.happened_at) : 0;
                        const tb = b.happened_at ? Date.parse(b.happened_at) : 0;
                        return ta - tb;
                      })
                      .map((t) => (
                        <li key={t.id} className="mb-6 ml-4">
                          <div className="absolute w-3 h-3 bg-blue-200 dark:bg-blue-700 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900" />
                          <time className="mb-1 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                            {t.happened_at ? formatDate(t.happened_at) : ''}
                          </time>
                          <p className="text-gray-700 dark:text-gray-300">{t.text || ''}</p>
                        </li>
                      ))}
                  </ol>
                </div>
              )}

            {/* AI Chat */}
            {showChat && (
              <div className="mb-8">
                <AIChat article={{ id: article.id, title: article.title }} />
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
                {article.tags?.map((tag: string) => (
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