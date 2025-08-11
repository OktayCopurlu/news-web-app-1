/*
  # Add Sample Articles and Analytics Data

  1. Sample Data
    - Insert 6 sample articles covering different categories
    - Add corresponding analytics data for each article
    - Include bias scores, sentiment analysis, and credibility scores

  2. Data Coverage
    - Technology: Quantum computing breakthrough
    - Environment: Climate summit agreement  
    - Health: Gene therapy advances
    - Finance: Digital currency pilots
    - Space: SpaceX moon base plans
    - Cybersecurity: Infrastructure breach

  3. Analytics
    - Bias analysis with explanations
    - Sentiment scoring
    - Credibility assessments
    - Source verification data
*/

-- Insert sample articles
INSERT INTO articles (
  title, summary, content, category, language, source, source_url, 
  image_url, published_at, reading_time, tags, eli5_summary
) VALUES 
(
  'Major Breakthrough in Quantum Computing Achieved by International Research Team',
  'Scientists from MIT, Google, and several international universities have announced a significant breakthrough in quantum computing that could revolutionize data processing and encryption. The team successfully demonstrated a new quantum algorithm that can solve complex optimization problems exponentially faster than classical computers.',
  'Scientists from MIT, Google, and several international universities have announced a significant breakthrough in quantum computing that could revolutionize data processing and encryption. The team successfully demonstrated a new quantum algorithm that can solve complex optimization problems exponentially faster than classical computers. This advancement brings us closer to practical quantum computing applications in finance, drug discovery, and artificial intelligence. The research, published in Nature, shows how quantum entanglement can be maintained at room temperature for extended periods, addressing one of the biggest challenges in quantum computing. Industry experts believe this could lead to commercial quantum computers within the next decade, potentially transforming industries that rely on complex calculations and data analysis.',
  'Technology',
  'English',
  'TechCrunch',
  'https://example.com/quantum-breakthrough',
  'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg',
  NOW() - INTERVAL '2 hours',
  5,
  ARRAY['quantum computing', 'technology', 'breakthrough', 'MIT', 'Google'],
  'Scientists made computers that use special quantum rules work much better. These new computers can solve really hard math problems super fast!'
),
(
  'Global Climate Summit Reaches Historic Agreement on Carbon Reduction',
  'World leaders at the International Climate Summit have reached a groundbreaking agreement to reduce global carbon emissions by 60% over the next decade. The accord includes specific targets for renewable energy adoption and a $500 billion fund for clean energy infrastructure.',
  'World leaders at the International Climate Summit have reached a groundbreaking agreement to reduce global carbon emissions by 60% over the next decade. The accord, signed by 195 countries, includes specific targets for renewable energy adoption, carbon pricing mechanisms, and technology transfer to developing nations. Key provisions include a $500 billion fund for clean energy infrastructure, mandatory carbon reporting for large corporations, and accelerated phase-out of fossil fuel subsidies. Environmental groups have praised the agreement as the most ambitious climate action plan ever implemented, while some critics argue the targets may be too aggressive for certain economies.',
  'Environment',
  'English',
  'Reuters',
  'https://example.com/climate-agreement',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
  NOW() - INTERVAL '4 hours',
  6,
  ARRAY['climate change', 'environment', 'global summit', 'carbon emissions', 'renewable energy'],
  'Countries around the world promised to make much less pollution and use clean energy like solar and wind power to help save our planet!'
),
(
  'Revolutionary Gene Therapy Shows Promise in Treating Rare Diseases',
  'A new gene therapy developed by researchers at Johns Hopkins University has shown remarkable success in treating patients with rare genetic disorders. The treatment uses CRISPR technology to edit defective genes and has shown 80% improvement in symptoms.',
  'A new gene therapy developed by researchers at Johns Hopkins University has shown remarkable success in treating patients with rare genetic disorders. The treatment, which uses CRISPR technology to edit defective genes, has been tested on 50 patients with promising results. Early trials show a 80% improvement in symptoms for conditions like sickle cell disease and beta-thalassemia. The therapy works by extracting the patient''s stem cells, correcting the genetic defect in a laboratory, and then reintroducing the healthy cells back into the patient. While the treatment is still in clinical trials, researchers are optimistic about its potential to treat hundreds of rare genetic diseases that currently have no cure.',
  'Health',
  'English',
  'Medical News Today',
  'https://example.com/gene-therapy',
  'https://images.pexels.com/photos/3735680/pexels-photo-3735680.jpeg',
  NOW() - INTERVAL '6 hours',
  4,
  ARRAY['gene therapy', 'CRISPR', 'rare diseases', 'medical breakthrough', 'Johns Hopkins'],
  'Doctors found a way to fix broken parts in our body''s instruction book (DNA) to help sick people get better!'
),
(
  'Central Bank Digital Currencies Pilot Programs Show Mixed Results',
  'Central banks in China, Sweden, and the Bahamas have released preliminary results from their digital currency pilot programs, revealing both opportunities and challenges for the future of money. China''s digital yuan has processed over $13 billion in transactions.',
  'Central banks in China, Sweden, and the Bahamas have released preliminary results from their digital currency pilot programs, revealing both opportunities and challenges for the future of money. China''s digital yuan has processed over $13 billion in transactions, demonstrating the technical feasibility of large-scale CBDC implementation. However, adoption rates remain lower than expected, with many consumers preferring existing payment apps. Sweden''s e-krona pilot has faced technical hurdles and concerns about privacy and surveillance. The Bahamas'' Sand Dollar has successfully improved financial inclusion in remote areas but struggles with merchant adoption.',
  'Finance',
  'English',
  'Bloomberg',
  'https://example.com/digital-currency',
  'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
  NOW() - INTERVAL '8 hours',
  7,
  ARRAY['digital currency', 'CBDC', 'central banks', 'fintech', 'blockchain'],
  'Some countries are testing special computer money that works like digital coins instead of paper money!'
),
(
  'SpaceX Announces Plans for First Commercial Moon Base by 2030',
  'SpaceX has unveiled ambitious plans to establish the first commercial lunar base by 2030, marking a new era in space commercialization. The project, called Luna Gateway, will serve as a hub for scientific research, mining operations, and eventually tourism.',
  'SpaceX has unveiled ambitious plans to establish the first commercial lunar base by 2030, marking a new era in space commercialization. The project, called Luna Gateway, will serve as a hub for scientific research, mining operations, and eventually tourism. The base will be constructed using SpaceX''s Starship heavy-lift rocket and will initially house 12 astronauts and researchers. Key features include advanced life support systems, 3D printing facilities for equipment manufacturing, and solar arrays for power generation. The project has secured partnerships with NASA, the European Space Agency, and several private companies.',
  'Space',
  'English',
  'Space News',
  'https://example.com/spacex-moon-base',
  'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg',
  NOW() - INTERVAL '12 hours',
  6,
  ARRAY['SpaceX', 'moon base', 'space exploration', 'commercial space', 'lunar colony'],
  'SpaceX wants to build a house on the moon where astronauts can live and work, just like a space hotel!'
),
(
  'Major Cybersecurity Breach Exposes Vulnerabilities in Critical Infrastructure',
  'A sophisticated cyberattack on multiple energy companies has exposed critical vulnerabilities in national infrastructure systems, prompting urgent calls for enhanced cybersecurity measures. The attack temporarily disrupted power grids in three states.',
  'A sophisticated cyberattack on multiple energy companies has exposed critical vulnerabilities in national infrastructure systems, prompting urgent calls for enhanced cybersecurity measures. The attack, attributed to a state-sponsored group, temporarily disrupted power grids in three states and compromised sensitive operational data. Security experts report that the attackers used advanced persistent threat techniques, remaining undetected for several months while gathering intelligence. The breach highlights the urgent need for improved cybersecurity protocols in critical infrastructure sectors.',
  'Cybersecurity',
  'English',
  'CyberScoop',
  'https://example.com/cyber-breach',
  'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg',
  NOW() - INTERVAL '1 day',
  5,
  ARRAY['cybersecurity', 'infrastructure', 'data breach', 'energy sector', 'national security'],
  'Bad people used computers to break into important systems that control electricity, so now we need better computer locks!'
);

-- Get the article IDs for analytics insertion
DO $$
DECLARE
    article_record RECORD;
BEGIN
    -- Insert analytics for each article
    FOR article_record IN 
        SELECT id, title FROM articles 
        WHERE title IN (
            'Major Breakthrough in Quantum Computing Achieved by International Research Team',
            'Global Climate Summit Reaches Historic Agreement on Carbon Reduction',
            'Revolutionary Gene Therapy Shows Promise in Treating Rare Diseases',
            'Central Bank Digital Currencies Pilot Programs Show Mixed Results',
            'SpaceX Announces Plans for First Commercial Moon Base by 2030',
            'Major Cybersecurity Breach Exposes Vulnerabilities in Critical Infrastructure'
        )
    LOOP
        INSERT INTO article_analytics (
            article_id, bias_score, bias_explanation, bias_sources, 
            sentiment_score, sentiment_label, credibility_score, engagement_score
        ) VALUES (
            article_record.id,
            CASE 
                WHEN article_record.title LIKE '%Breakthrough%' THEN 0.1
                WHEN article_record.title LIKE '%Climate%' THEN -0.1
                WHEN article_record.title LIKE '%Gene Therapy%' THEN 0.2
                WHEN article_record.title LIKE '%Digital Currencies%' THEN 0.0
                WHEN article_record.title LIKE '%SpaceX%' THEN 0.3
                WHEN article_record.title LIKE '%Cybersecurity%' THEN -0.2
                ELSE 0.0
            END,
            CASE 
                WHEN article_record.title LIKE '%Breakthrough%' THEN 'Slightly positive coverage focusing on potential benefits and scientific achievement'
                WHEN article_record.title LIKE '%Climate%' THEN 'Balanced reporting with slight emphasis on environmental urgency'
                WHEN article_record.title LIKE '%Gene Therapy%' THEN 'Optimistic coverage highlighting medical advances and patient benefits'
                WHEN article_record.title LIKE '%Digital Currencies%' THEN 'Neutral analysis presenting both opportunities and challenges'
                WHEN article_record.title LIKE '%SpaceX%' THEN 'Enthusiastic coverage of space exploration achievements'
                WHEN article_record.title LIKE '%Cybersecurity%' THEN 'Serious tone focusing on security implications and risks'
                ELSE 'Balanced reporting with neutral perspective'
            END,
            ARRAY['AI Analysis', 'Source Verification', 'Editorial Review'],
            CASE 
                WHEN article_record.title LIKE '%Breakthrough%' THEN 0.7
                WHEN article_record.title LIKE '%Climate%' THEN 0.5
                WHEN article_record.title LIKE '%Gene Therapy%' THEN 0.8
                WHEN article_record.title LIKE '%Digital Currencies%' THEN 0.0
                WHEN article_record.title LIKE '%SpaceX%' THEN 0.6
                WHEN article_record.title LIKE '%Cybersecurity%' THEN -0.4
                ELSE 0.0
            END,
            CASE 
                WHEN article_record.title LIKE '%Breakthrough%' THEN 'positive'
                WHEN article_record.title LIKE '%Climate%' THEN 'positive'
                WHEN article_record.title LIKE '%Gene Therapy%' THEN 'positive'
                WHEN article_record.title LIKE '%Digital Currencies%' THEN 'neutral'
                WHEN article_record.title LIKE '%SpaceX%' THEN 'positive'
                WHEN article_record.title LIKE '%Cybersecurity%' THEN 'negative'
                ELSE 'neutral'
            END,
            CASE 
                WHEN article_record.title LIKE '%Breakthrough%' THEN 0.9
                WHEN article_record.title LIKE '%Climate%' THEN 0.95
                WHEN article_record.title LIKE '%Gene Therapy%' THEN 0.85
                WHEN article_record.title LIKE '%Digital Currencies%' THEN 0.9
                WHEN article_record.title LIKE '%SpaceX%' THEN 0.8
                WHEN article_record.title LIKE '%Cybersecurity%' THEN 0.9
                ELSE 0.8
            END,
            RANDOM() * 100 + 50 -- Random engagement score between 50-150
        );
    END LOOP;
END $$;

-- Update view counts with realistic numbers
UPDATE articles SET view_count = 
    CASE 
        WHEN title LIKE '%Climate%' THEN 2100
        WHEN title LIKE '%Breakthrough%' THEN 1250
        WHEN title LIKE '%SpaceX%' THEN 1800
        WHEN title LIKE '%Gene Therapy%' THEN 950
        WHEN title LIKE '%Digital Currencies%' THEN 750
        WHEN title LIKE '%Cybersecurity%' THEN 1400
        ELSE 500
    END
WHERE title IN (
    'Major Breakthrough in Quantum Computing Achieved by International Research Team',
    'Global Climate Summit Reaches Historic Agreement on Carbon Reduction',
    'Revolutionary Gene Therapy Shows Promise in Treating Rare Diseases',
    'Central Bank Digital Currencies Pilot Programs Show Mixed Results',
    'SpaceX Announces Plans for First Commercial Moon Base by 2030',
    'Major Cybersecurity Breach Exposes Vulnerabilities in Critical Infrastructure'
);