import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Globe, BookOpen, Volume2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topics: [] as string[],
    languages: ['English'],
    readingLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    audioPreferences: false,
    biasAnalysis: true
  });
  const { setUser } = useUser();
  const navigate = useNavigate();

  const steps = [
    { title: 'Welcome', subtitle: 'Let\'s personalize your news experience' },
    { title: 'Basic Info', subtitle: 'Tell us about yourself' },
    { title: 'Interests', subtitle: 'What topics interest you?' },
    { title: 'Preferences', subtitle: 'Customize your reading experience' },
    { title: 'Complete', subtitle: 'You\'re all set!' }
  ];

  const topics = [
    'Politics', 'Technology', 'Health', 'Environment', 'Finance',
    'Sports', 'Entertainment', 'Science', 'Business', 'World News',
    'Local News', 'Education', 'Travel', 'Food', 'Culture'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Arabic'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      preferences: {
        topics: formData.topics,
        languages: formData.languages,
        readingLevel: formData.readingLevel,
        audioPreferences: formData.audioPreferences,
        biasAnalysis: formData.biasAnalysis
      },
      onboardingComplete: true
    };
    
    setUser(newUser);
    navigate('/');
  };

  const toggleTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Welcome to Insight
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your AI-powered news aggregator that delivers personalized, unbiased news 
                    from trusted sources worldwide. Let's set up your perfect news experience.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Global Coverage</p>
                  </div>
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI Summaries</p>
                  </div>
                  <div className="text-center">
                    <Volume2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Audio Mode</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select the topics you're most interested in (choose at least 3):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.topics.includes(topic)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                      }`}
                    >
                      {topic}
                      {formData.topics.includes(topic) && (
                        <Check className="w-4 h-4 ml-2 inline" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Preferred Languages
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {languages.map((language) => (
                      <button
                        key={language}
                        onClick={() => toggleLanguage(language)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                          formData.languages.includes(language)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Reading Level
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'beginner', label: 'Beginner', description: 'Simple summaries and explanations' },
                      { value: 'intermediate', label: 'Intermediate', description: 'Balanced detail and accessibility' },
                      { value: 'advanced', label: 'Advanced', description: 'Full technical details and analysis' }
                    ].map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setFormData(prev => ({ ...prev, readingLevel: level.value as any }))}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          formData.readingLevel === level.value
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{level.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{level.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Audio Summaries</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Listen to AI-generated audio summaries</div>
                    </div>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, audioPreferences: !prev.audioPreferences }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        formData.audioPreferences ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                        formData.audioPreferences ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Bias Analysis</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Show bias indicators and source transparency</div>
                    </div>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, biasAnalysis: !prev.biasAnalysis }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        formData.biasAnalysis ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                        formData.biasAnalysis ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Perfect! You're all set up.
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    We've personalized your news feed based on your preferences. 
                    You can always adjust these settings later in your profile.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Your Setup:</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• {formData.topics.length} topics selected</li>
                    <li>• {formData.languages.length} languages</li>
                    <li>• {formData.readingLevel} reading level</li>
                    <li>• Audio summaries: {formData.audioPreferences ? 'Enabled' : 'Disabled'}</li>
                    <li>• Bias analysis: {formData.biasAnalysis ? 'Enabled' : 'Disabled'}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!formData.name || !formData.email)) ||
                  (currentStep === 2 && formData.topics.length < 3)
                }
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${
                  (currentStep === 1 && (!formData.name || !formData.email)) ||
                  (currentStep === 2 && formData.topics.length < 3)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                <span>Get Started</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;