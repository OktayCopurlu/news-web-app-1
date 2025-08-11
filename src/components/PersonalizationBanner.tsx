import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const PersonalizationBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Personalize Your News Experience</h3>
              <p className="text-blue-100 text-sm">
                Get AI-curated news tailored to your interests and reading preferences
              </p>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationBanner;