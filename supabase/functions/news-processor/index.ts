import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

interface NewsArticle {
  title: string;
  summary: string;
  category: string;
  language: string;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  publishedAt: string;
  tags: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ 
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your Supabase project environment variables.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/news-processor', '')

    // GET /articles - Fetch all articles with analytics
    if (method === 'GET' && path === '/articles') {
      const { data: articles, error } = await supabaseClient
        .from('articles')
        .select(`
          *,
          article_analytics(*),
          quizzes(*),
          coverage_comparisons(*)
        `)
        .order('published_at', { ascending: false })

      if (error) throw error

      return new Response(JSON.stringify(articles), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST /articles/:id/explanation - Generate AI explanation for article
    if (method === 'POST' && path.includes('/explanation')) {
      const articleId = path.split('/')[2]
      
      // Get article
      const { data: article, error: articleError } = await supabaseClient
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single()

      if (articleError) throw articleError

      // Check if explanation already exists
      if (article.explanation_generated && article.ai_explanation) {
        return new Response(JSON.stringify({ explanation: article.ai_explanation }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Generate detailed AI explanation
      const explanationPrompt = `
        Create a comprehensive, detailed explanation of this news story. This should be an original analysis and explanation, not a copy of existing content.
        
        Article Title: ${article.title}
        Article Summary: ${article.summary}
        Category: ${article.category}
        Source: ${article.source}
        
        Provide a detailed explanation that includes:
        1. Background context and why this story matters
        2. Key facts and developments
        3. Implications and potential consequences
        4. Different perspectives on the issue
        5. What this means for the average person
        6. Future outlook and what to watch for
        
        Write this as an informative, educational explanation (800-1200 words) that helps readers fully understand the significance of this news story. Use clear, accessible language while being thorough and analytical.
      `

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: explanationPrompt }] }]
          })
        }
      )

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text()
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`)
      }

      const geminiData = await geminiResponse.json()
      
      if (!geminiData.candidates || !geminiData.candidates[0]?.content?.parts[0]?.text) {
        throw new Error('Invalid response from Gemini API')
      }
      
      const aiExplanation = geminiData.candidates[0]?.content?.parts[0]?.text || 
        "Unable to generate detailed explanation at this time. Please try again later."

      // Update article with AI explanation
      const { error: updateError } = await supabaseClient
        .from('articles')
        .update({
          ai_explanation: aiExplanation,
          explanation_generated: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', articleId)

      if (updateError) throw updateError

      return new Response(JSON.stringify({ explanation: aiExplanation }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST /articles - Create new article with AI analysis
    if (method === 'POST' && path === '/articles') {
      const articleData: NewsArticle = await req.json()

      // Generate AI-powered analysis using Gemini
      const analysisPrompt = `
        Analyze this news article and provide:
        1. Bias score (-1 to 1, where -1 is very negative bias, 0 is neutral, 1 is very positive bias)
        2. Sentiment analysis (score -1 to 1 and label: positive/neutral/negative)
        3. Brief bias explanation
        4. Credibility assessment (0 to 1)
        5. ELI5 summary for children
        6. 5 relevant tags

        Article Title: ${articleData.title}
        Article Content: ${articleData.content}

        Respond in JSON format:
        {
          "biasScore": number,
          "biasExplanation": "string",
          "sentimentScore": number,
          "sentimentLabel": "positive|neutral|negative",
          "credibilityScore": number,
          "eli5Summary": "string",
          "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
        }
      `

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: analysisPrompt }] }]
          })
        }
      )

      const geminiData = await geminiResponse.json()
      let analysis
      
      try {
        const responseText = geminiData.candidates[0].content.parts[0].text
        analysis = JSON.parse(responseText)
      } catch (e) {
        // Fallback analysis if AI parsing fails
        analysis = {
          biasScore: 0,
          biasExplanation: "Analysis unavailable",
          sentimentScore: 0,
          sentimentLabel: "neutral",
          credibilityScore: 0.8,
          eli5Summary: "This is a simplified explanation of the news story.",
          tags: [articleData.category.toLowerCase(), "news", "current-events"]
        }
      }

      // Insert article
      const { data: article, error: articleError } = await supabaseClient
        .from('articles')
        .insert({
          ...articleData,
          tags: analysis.tags,
          eli5_summary: analysis.eli5Summary,
          reading_time: Math.ceil(articleData.summary.split(' ').length / 50),
          explanation_generated: false
        })
        .select()
        .single()

      if (articleError) throw articleError

      // Insert analytics
      const { error: analyticsError } = await supabaseClient
        .from('article_analytics')
        .insert({
          article_id: article.id,
          bias_score: analysis.biasScore,
          bias_explanation: analysis.biasExplanation,
          bias_sources: ['AI Analysis', 'Content Review'],
          sentiment_score: analysis.sentimentScore,
          sentiment_label: analysis.sentimentLabel,
          credibility_score: analysis.credibilityScore
        })

      if (analyticsError) throw analyticsError

      return new Response(JSON.stringify(article), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET /articles/:id - Get specific article with all related data
    if (method === 'GET' && path.startsWith('/articles/')) {
      const articleId = path.split('/')[2]
      
      const { data: article, error } = await supabaseClient
        .from('articles')
        .select(`
          *,
          article_analytics(*),
          quizzes(*),
          coverage_comparisons(*)
        `)
        .eq('id', articleId)
        .single()

      if (error) throw error

      return new Response(JSON.stringify(article), {
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