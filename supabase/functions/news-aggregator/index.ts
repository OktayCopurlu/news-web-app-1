import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Mock news sources and sample articles
const NEWS_SOURCES = [
  'Reuters', 'Associated Press', 'BBC News', 'CNN', 'The Guardian', 
  'The New York Times', 'Washington Post', 'Bloomberg', 'NPR',
  'Al Jazeera', 'Deutsche Welle', 'France24', 'TechCrunch', 'Wired'
]

const SAMPLE_ARTICLES = [
  {
    title: "Major Breakthrough in Quantum Computing Achieved by International Research Team",
    category: "Technology",
    summary: "Scientists from MIT, Google, and several international universities have announced a significant breakthrough in quantum computing that could revolutionize data processing and encryption. The team successfully demonstrated a new quantum algorithm that can solve complex optimization problems exponentially faster than classical computers.",
    imageUrl: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg"
  },
  {
    title: "Global Climate Summit Reaches Historic Agreement on Carbon Reduction",
    category: "Environment",
    summary: "World leaders at the International Climate Summit have reached a groundbreaking agreement to reduce global carbon emissions by 60% over the next decade. The accord includes specific targets for renewable energy adoption and a $500 billion fund for clean energy infrastructure.",
    imageUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg"
  },
  {
    title: "Revolutionary Gene Therapy Shows Promise in Treating Rare Diseases",
    category: "Health",
    summary: "A new gene therapy developed by researchers at Johns Hopkins University has shown remarkable success in treating patients with rare genetic disorders using CRISPR technology, with 80% improvement in symptoms for conditions like sickle cell disease.",
    imageUrl: "https://images.pexels.com/photos/3735680/pexels-photo-3735680.jpeg"
  },
  {
    title: "Central Bank Digital Currencies Pilot Programs Show Mixed Results",
    category: "Finance",
    summary: "Central banks in China, Sweden, and the Bahamas have released preliminary results from their digital currency pilot programs, revealing both opportunities and challenges for the future of money, with mixed adoption rates and technical hurdles.",
    imageUrl: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg"
  },
  {
    title: "SpaceX Announces Plans for First Commercial Moon Base by 2030",
    category: "Space",
    summary: "SpaceX has unveiled ambitious plans to establish the first commercial lunar base by 2030, called 'Luna Gateway,' which will serve as a hub for scientific research, mining operations, and eventually tourism, marking a new era in space commercialization.",
    imageUrl: "https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg"
  },
  {
    title: "Major Cybersecurity Breach Exposes Vulnerabilities in Critical Infrastructure",
    category: "Cybersecurity",
    summary: "A sophisticated cyberattack on multiple energy companies has exposed critical vulnerabilities in national infrastructure systems, temporarily disrupting power grids in three states and prompting urgent calls for enhanced cybersecurity measures.",
    imageUrl: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg"
  }
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return new Response(JSON.stringify({ 
        error: 'Gemini API key not configured in Supabase Edge Function secrets',
        configured: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/news-aggregator', '')

    // POST /fetch-news - Simulate fetching and processing news
    if (method === 'POST' && path === '/fetch-news') {
      const processedArticles = []

      for (const sampleArticle of SAMPLE_ARTICLES) {
        // Generate AI summary using Gemini
        const summaryPrompt = `
          Create a concise, informative summary (100-150 words) of this news article:
          
          Title: ${sampleArticle.title}
          Summary: ${sampleArticle.summary}
          
          The summary should capture the key facts, main implications, and significance of the story.
        `

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: summaryPrompt }] }]
            })
          }
        )

        const geminiData = await geminiResponse.json()
        const aiSummary = geminiData.candidates[0]?.content?.parts[0]?.text || 
          sampleArticle.content.substring(0, 300) + "..."

        // Generate bias and sentiment analysis
        const analysisPrompt = `
          Analyze this news article for bias and sentiment. Respond in JSON format:
          
          Title: ${sampleArticle.title}
          Summary: ${sampleArticle.summary}
          
          {
            "biasScore": number between -1 and 1,
            "biasExplanation": "brief explanation",
            "sentimentScore": number between -1 and 1,
            "sentimentLabel": "positive|neutral|negative",
            "credibilityScore": number between 0 and 1,
            "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
          }
        `

        const analysisResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: analysisPrompt }] }]
            })
          }
        )

        const analysisData = await analysisResponse.json()
        let analysis
        
        try {
          const responseText = analysisData.candidates[0].content.parts[0].text
          analysis = JSON.parse(responseText.replace(/```json\n?/g, '').replace(/```/g, ''))
        } catch (e) {
          analysis = {
            biasScore: Math.random() * 0.4 - 0.2,
            biasExplanation: "Automated analysis pending",
            sentimentScore: Math.random() * 0.6 - 0.3,
            sentimentLabel: "neutral",
            credibilityScore: 0.8,
            tags: [sampleArticle.category.toLowerCase(), "breaking", "news"]
          }
        }

        // Check if article already exists
        const { data: existing } = await supabaseClient
          .from('articles')
          .select('id')
          .eq('title', sampleArticle.title)
          .single()

        if (!existing) {
          // Insert article
          const { data: article, error: articleError } = await supabaseClient
            .from('articles')
            .insert({
              title: sampleArticle.title,
              summary: aiSummary,
              category: sampleArticle.category,
              language: 'English',
              source: NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)],
              source_url: `https://example.com/news/${Date.now()}`,
              image_url: sampleArticle.imageUrl,
              published_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              tags: analysis.tags,
              reading_time: Math.ceil(sampleArticle.summary.split(' ').length / 50),
              explanation_generated: false
            })
            .select()
            .single()

          if (articleError) throw articleError

          // Insert analytics
          await supabaseClient
            .from('article_analytics')
            .insert({
              article_id: article.id,
              bias_score: analysis.biasScore,
              bias_explanation: analysis.biasExplanation,
              bias_sources: ['AI Analysis', 'Source Verification'],
              sentiment_score: analysis.sentimentScore,
              sentiment_label: analysis.sentimentLabel,
              credibility_score: analysis.credibilityScore
            })

          processedArticles.push(article)
        }
      }

      return new Response(JSON.stringify({ 
        processed: processedArticles.length,
        articles: processedArticles 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET /trending - Get trending topics
    if (method === 'GET' && path === '/trending') {
      // Get most viewed articles by category
      const { data: trending, error } = await supabaseClient
        .from('articles')
        .select('category, COUNT(*) as count, SUM(view_count) as total_views')
        .group('category')
        .order('total_views', { ascending: false })
        .limit(10)

      if (error) throw error

      return new Response(JSON.stringify(trending), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET /search - Search articles
    if (method === 'GET' && path === '/search') {
      const query = url.searchParams.get('q')
      const category = url.searchParams.get('category')
      const language = url.searchParams.get('language')

      let searchQuery = supabaseClient
        .from('articles')
        .select(`
          *,
          article_analytics(*)
        `)

      if (query) {
        searchQuery = searchQuery.textSearch('title,summary', query)
      }

      if (category && category !== 'all') {
        searchQuery = searchQuery.eq('category', category)
      }

      if (language && language !== 'all') {
        searchQuery = searchQuery.eq('language', language)
      }

      const { data: articles, error } = await searchQuery
        .order('published_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return new Response(JSON.stringify(articles), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})