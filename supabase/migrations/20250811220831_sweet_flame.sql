/*
  # Add comprehensive sample data for testing

  1. New Articles
    - Add 8 more diverse articles across different categories
    - Include articles without ELI5, quizzes, or coverage data to test AI generation
  
  2. Analytics Data
    - Add bias and sentiment analysis for all articles
  
  3. Test Data Structure
    - Some articles have complete data
    - Some articles missing ELI5 summaries (to test AI generation)
    - Some articles missing quizzes (to test AI generation)
    - Some articles missing coverage comparisons (to test AI generation)
*/

-- Insert additional sample articles
INSERT INTO articles (
  title, summary, category, language, source, source_url, image_url, 
  published_at, reading_time, tags, eli5_summary, explanation_generated
) VALUES 
(
  'Breakthrough in Fusion Energy Achieves Net Energy Gain',
  'Scientists at the National Ignition Facility have achieved a historic milestone in fusion energy research by producing more energy from a fusion reaction than was directly input into the fuel. This breakthrough represents a major step toward clean, unlimited energy.',
  'Technology',
  'English',
  'Science Daily',
  'https://example.com/fusion-breakthrough',
  'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg',
  NOW() - INTERVAL '3 hours',
  7,
  ARRAY['fusion energy', 'clean energy', 'breakthrough', 'science'],
  'Scientists made a special kind of fire that gives us more energy than we put in! It''s like magic fire that could power our whole world without making pollution.',
  false
),
(
  'Global Food Crisis Worsens as Climate Change Impacts Agriculture',
  'A new UN report warns that climate change is severely impacting global food production, with crop yields declining in major agricultural regions. The report calls for immediate action to prevent widespread famine.',
  'Environment',
  'English',
  'Reuters',
  'https://example.com/food-crisis',
  'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg',
  NOW() - INTERVAL '5 hours',
  6,
  ARRAY['climate change', 'agriculture', 'food security', 'UN report'],
  NULL, -- No ELI5 to test AI generation
  false
),
(
  'New AI Model Surpasses Human Performance in Medical Diagnosis',
  'Researchers have developed an AI system that can diagnose rare diseases more accurately than human doctors. The system analyzed millions of medical cases and achieved 95% accuracy in identifying conditions that typically take months to diagnose.',
  'Health',
  'English',
  'Medical Journal Today',
  'https://example.com/ai-medical-diagnosis',
  'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg',
  NOW() - INTERVAL '8 hours',
  5,
  ARRAY['artificial intelligence', 'medical diagnosis', 'healthcare', 'machine learning'],
  'Smart computer doctors can now find out what''s wrong with sick people better than real doctors! They learned by looking at millions of sick people and remembering what made them better.',
  false
),
(
  'Cryptocurrency Market Crashes Following Regulatory Crackdown',
  'Major cryptocurrencies have lost over 40% of their value this week following announcements of stricter regulations from multiple governments. Bitcoin fell below $20,000 for the first time in two years.',
  'Finance',
  'English',
  'Financial Times',
  'https://example.com/crypto-crash',
  'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg',
  NOW() - INTERVAL '12 hours',
  4,
  ARRAY['cryptocurrency', 'bitcoin', 'regulation', 'market crash'],
  NULL, -- No ELI5 to test AI generation
  false
),
(
  'SpaceX Successfully Launches First Mars Colony Ship',
  'SpaceX has successfully launched its first Mars colony ship, carrying 100 passengers on a six-month journey to establish the first permanent human settlement on Mars. The mission represents a historic milestone in space exploration.',
  'Space',
  'English',
  'Space News',
  'https://example.com/mars-colony',
  'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg',
  NOW() - INTERVAL '1 day',
  8,
  ARRAY['SpaceX', 'Mars', 'space colonization', 'space exploration'],
  'People are going to live on Mars! A big rocket took 100 people on a long trip to the red planet to build the first space city there.',
  false
),
(
  'Major Cybersecurity Breach Affects Millions of Users Worldwide',
  'A sophisticated cyberattack has compromised the personal data of over 50 million users across multiple social media platforms. Security experts warn this could be the largest data breach in history.',
  'Cybersecurity',
  'English',
  'TechCrunch',
  'https://example.com/cyber-breach',
  'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg',
  NOW() - INTERVAL '18 hours',
  6,
  ARRAY['cybersecurity', 'data breach', 'privacy', 'hacking'],
  NULL, -- No ELI5 to test AI generation
  false
),
(
  'Revolutionary Battery Technology Promises 1000-Mile Electric Vehicle Range',
  'A startup company has announced a breakthrough in solid-state battery technology that could enable electric vehicles to travel over 1000 miles on a single charge. The technology could revolutionize the automotive industry.',
  'Transportation',
  'English',
  'Auto News',
  'https://example.com/battery-breakthrough',
  'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg',
  NOW() - INTERVAL '6 hours',
  5,
  ARRAY['electric vehicles', 'battery technology', 'automotive', 'innovation'],
  'Scientists made super batteries that let electric cars drive really, really far - like from your house to grandma''s house 10 times without stopping to charge!',
  false
),
(
  'Ancient Civilization Discovered in Amazon Rainforest',
  'Archaeologists using advanced satellite imaging have discovered the remains of a previously unknown ancient civilization deep in the Amazon rainforest. The discovery could rewrite our understanding of pre-Columbian South America.',
  'Science',
  'English',
  'National Geographic',
  'https://example.com/amazon-discovery',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
  NOW() - INTERVAL '2 days',
  7,
  ARRAY['archaeology', 'Amazon', 'ancient civilization', 'discovery'],
  NULL, -- No ELI5 to test AI generation
  false
);

-- Get the IDs of the newly inserted articles for adding analytics
DO $$
DECLARE
    article_record RECORD;
BEGIN
    -- Add analytics for all articles that don't have them yet
    FOR article_record IN 
        SELECT id, title FROM articles 
        WHERE id NOT IN (SELECT DISTINCT article_id FROM article_analytics)
    LOOP
        INSERT INTO article_analytics (
            article_id, bias_score, bias_explanation, bias_sources,
            sentiment_score, sentiment_label, credibility_score
        ) VALUES (
            article_record.id,
            (RANDOM() * 0.6 - 0.3), -- Random bias between -0.3 and 0.3
            'Automated analysis shows balanced reporting with minimal editorial bias.',
            ARRAY['AI Analysis', 'Source Verification', 'Cross-Reference Check'],
            (RANDOM() * 0.8 - 0.4), -- Random sentiment between -0.4 and 0.4
            CASE 
                WHEN RANDOM() < 0.33 THEN 'positive'
                WHEN RANDOM() < 0.66 THEN 'neutral'
                ELSE 'negative'
            END,
            0.8 + (RANDOM() * 0.2) -- Credibility between 0.8 and 1.0
        );
    END LOOP;
END $$;

-- Add some sample quizzes for testing (only for some articles)
INSERT INTO quizzes (article_id, questions, difficulty)
SELECT 
    id,
    JSON_BUILD_ARRAY(
        JSON_BUILD_OBJECT(
            'id', 'q1',
            'question', 'What is the main topic of this article?',
            'options', ARRAY['The primary subject matter', 'A secondary topic', 'Background information', 'Related news'],
            'correctAnswer', 0,
            'explanation', 'This question tests basic comprehension of the article''s main theme.'
        ),
        JSON_BUILD_OBJECT(
            'id', 'q2',
            'question', 'What category does this article belong to?',
            'options', ARRAY[category, 'Politics', 'Sports', 'Entertainment'],
            'correctAnswer', 0,
            'explanation', 'The article is categorized under ' || category || '.'
        )
    ),
    'intermediate'
FROM articles 
WHERE title LIKE '%Fusion Energy%' OR title LIKE '%Mars Colony%'
AND id NOT IN (SELECT DISTINCT article_id FROM quizzes WHERE article_id IS NOT NULL);

-- Add some sample coverage comparisons (only for some articles)
INSERT INTO coverage_comparisons (article_id, comparisons)
SELECT 
    id,
    JSON_BUILD_ARRAY(
        JSON_BUILD_OBJECT(
            'source', 'Conservative Tribune',
            'perspective', 'Focuses on economic implications and market impacts of the development.',
            'bias', 0.3
        ),
        JSON_BUILD_OBJECT(
            'source', 'Progressive Herald',
            'perspective', 'Emphasizes social benefits and environmental considerations.',
            'bias', -0.2
        ),
        JSON_BUILD_OBJECT(
            'source', 'International Times',
            'perspective', 'Provides global context and international reactions to the news.',
            'bias', 0.0
        )
    )
FROM articles 
WHERE title LIKE '%Cybersecurity%' OR title LIKE '%Battery Technology%'
AND id NOT IN (SELECT DISTINCT article_id FROM coverage_comparisons WHERE article_id IS NOT NULL);