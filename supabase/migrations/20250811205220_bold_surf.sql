/*
  # Update articles schema for AI explanations

  1. Schema Changes
    - Remove `content` column from articles table (copyright concern)
    - Add `ai_explanation` column for detailed AI-generated explanations
    - Add `explanation_generated` boolean to track generation status
    - Update existing articles to mark explanations as not generated

  2. Security
    - Maintain existing RLS policies
    - No changes to user permissions

  3. Data Migration
    - Safely remove content column
    - Add new columns with appropriate defaults
*/

-- Add new columns for AI explanations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'ai_explanation'
  ) THEN
    ALTER TABLE articles ADD COLUMN ai_explanation text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'explanation_generated'
  ) THEN
    ALTER TABLE articles ADD COLUMN explanation_generated boolean DEFAULT false;
  END IF;
END $$;

-- Remove the content column to avoid copyright issues
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'content'
  ) THEN
    ALTER TABLE articles DROP COLUMN content;
  END IF;
END $$;

-- Update existing articles to mark explanations as not generated
UPDATE articles SET explanation_generated = false WHERE explanation_generated IS NULL;