/*
# Initial Schema for Insight AI News Aggregator

1. New Tables
   - `users` - User accounts and preferences
   - `articles` - News articles with metadata
   - `article_analytics` - Bias, sentiment, and engagement data
   - `user_interactions` - Reading history, bookmarks, quiz scores
   - `ai_chats` - Chat conversations with AI
   - `quizzes` - Generated quizzes for articles
   - `coverage_comparisons` - Different source perspectives

2. Security
   - Enable RLS on all tables
   - Add policies for authenticated users to manage their own data
   - Public read access for articles

3. Features
   - Full-text search on articles
   - Indexing for performance
   - User preference tracking
   - AI interaction logging
*/

-- Users table with preferences
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  preferences jsonb DEFAULT '{
    "topics": [],
    "languages": ["English"],
    "readingLevel": "intermediate",
    "audioPreferences": false,
    "biasAnalysis": true,
    "notifications": true
  }'::jsonb,
  onboarding_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Articles table with comprehensive metadata
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  language text NOT NULL DEFAULT 'English',
  source text NOT NULL,
  source_url text NOT NULL,
  image_url text,
  published_at timestamptz NOT NULL,
  reading_time integer DEFAULT 5,
  tags text[] DEFAULT '{}',
  eli5_summary text,
  audio_summary_url text,
  audio_duration integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Article analytics for bias and sentiment
CREATE TABLE IF NOT EXISTS article_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  bias_score numeric DEFAULT 0,
  bias_explanation text,
  bias_sources text[] DEFAULT '{}',
  sentiment_score numeric DEFAULT 0,
  sentiment_label text DEFAULT 'neutral',
  credibility_score numeric DEFAULT 0.8,
  engagement_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User interactions tracking
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  interaction_type text NOT NULL, -- 'view', 'bookmark', 'share', 'quiz_complete'
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- AI chat conversations
CREATE TABLE IF NOT EXISTS ai_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quiz questions and answers
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  difficulty text DEFAULT 'intermediate',
  created_at timestamptz DEFAULT now()
);

-- Coverage comparisons from different sources
CREATE TABLE IF NOT EXISTS coverage_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  comparisons jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_language ON articles(language);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_article_id ON user_interactions(article_id);
CREATE INDEX IF NOT EXISTS idx_ai_chats_user_id ON ai_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chats_article_id ON ai_chats(article_id);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING GIN(to_tsvector('english', title || ' ' || summary || ' ' || content));

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverage_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for articles (public read, authenticated insert/update)
CREATE POLICY "Anyone can read articles"
  ON articles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for article analytics (public read)
CREATE POLICY "Anyone can read article analytics"
  ON article_analytics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert analytics"
  ON article_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for user interactions (users own data)
CREATE POLICY "Users can manage own interactions"
  ON user_interactions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for AI chats (users own data)
CREATE POLICY "Users can manage own chats"
  ON ai_chats FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for quizzes (public read)
CREATE POLICY "Anyone can read quizzes"
  ON quizzes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage quizzes"
  ON quizzes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for coverage comparisons (public read)
CREATE POLICY "Anyone can read coverage comparisons"
  ON coverage_comparisons FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert comparisons"
  ON coverage_comparisons FOR INSERT
  TO authenticated
  WITH CHECK (true);