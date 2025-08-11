import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles } = useNews();
  const [article, setArticle] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (id) {
      const foundArticle = articles.find(a => a.id === id);
      setArticle(foundArticle);
      if (foundArticle && foundArticle.quizzes && foundArticle.quizzes.length > 0) {
        setQuiz(foundArticle.quizzes[0]);
      }
    }
  }, [id, articles]);

  if (!article || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Not Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No quiz is available for this article.
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

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowResults(false);
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const currentQ = quiz.questions[currentQuestion];
  const score = calculateScore();
  const percentage = Math.round((score / quiz.questions.length) * 100);

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to={`/news/${article.id}`}
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Article</span>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              percentage >= 80 ? 'bg-green-100 dark:bg-green-900/20' :
              percentage >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
              'bg-red-100 dark:bg-red-900/20'
            }`}>
              <Award className={`w-10 h-10 ${
                percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quiz Complete!
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You scored {score} out of {quiz.questions.length} questions correctly
            </p>

            <div className={`text-4xl font-bold mb-6 ${
              percentage >= 80 ? 'text-green-600 dark:text-green-400' :
              percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {percentage}%
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={resetQuiz}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
              
              <Link
                to={`/news/${article.id}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Article
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/news/${article.id}`}
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Article</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-xl font-bold mb-2">Knowledge Quiz</h1>
            <p className="text-blue-100 mb-4">{article.title}</p>
            <div className="flex justify-between items-center text-sm">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-blue-500 rounded-full h-2 mt-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {currentQ.question}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    selectedAnswer === index
                      ? showExplanation
                        ? index === currentQ.correctAnswer
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300'
                      : showExplanation && index === currentQ.correctAnswer
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showExplanation && (
                      <div>
                        {index === currentQ.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Explanation
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {answers.length > 0 && `Score so far: ${calculateScore()}/${answers.length}`}
              </div>
              
              <div className="space-x-2">
                {selectedAnswer !== null && !showExplanation && (
                  <button
                    onClick={handleShowExplanation}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Show Answer
                  </button>
                )}
                
                {showExplanation && (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'View Results'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;