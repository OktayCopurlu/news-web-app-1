import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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
      throw new Error('Gemini API key not found')
    }

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/coverage-analyzer', '')

    // POST /analyze - Generate coverage comparison for article
    if (method === 'POST' && path === '/analyze') {
      const { articleId } = await req.json()

      // Get article content
      const { data: article, error: articleError } = await supabaseClient
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single()

      if (articleError) throw articleError

      // Check if comparison already exists
      const { data: existingComparison } = await supabaseClient
        .from('coverage_comparisons')
        .select('*')
        .eq('article_id', articleId)
        .single()

      if (existingComparison) {
        return new Response(JSON.stringify(existingComparison), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Generate coverage comparison using Gemini
      const comparisonPrompt = `
        Generate a coverage comparison for this news story showing how different types of news sources might cover it differently.
        
        Article Title: ${article.title}
        Article Summary: ${article.summary}
        Article Category: ${article.category}
        
        Create 4 different perspective analyses from these source types:
        1. Conservative-leaning outlet
        2. Liberal-leaning outlet  
        3. International/Foreign perspective
        4. Specialty/Trade publication perspective
        
        For each perspective, provide:
        - Source name (realistic but generic, e.g., "Conservative Tribune", "Progressive Herald")
        - How they would frame the story (150 words max)
        - Bias score (-0.8 to 0.8)
        
        Respond in JSON format:
        {
          "comparisons": [
            {
              "source": "Source Name",
              "perspective": "How this source would frame the story...",
              "bias": 0.2
            }
          ]
        }
      `

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: comparisonPrompt }] }]
          })
        }
      )

      const geminiData = await geminiResponse.json()
      let comparisonData

      try {
        const responseText = geminiData.candidates[0].content.parts[0].text
        comparisonData = JSON.parse(responseText.replace(/```json\n?/g, '').replace(/```/g, ''))
      } catch (e) {
        // Fallback comparison data
        comparisonData = {
          comparisons: [
            {
              source: "National Herald",
              perspective: "This outlet would focus on the immediate implications and policy aspects of the story.",
              bias: 0.1
            },
            {
              source: "Global Times",
              perspective: "An international perspective highlighting broader global context and implications.",
              bias: -0.1
            }
          ]
        }
      }

      // Save comparison to database
      const { data: comparison, error: comparisonError } = await supabaseClient
        .from('coverage_comparisons')
        .insert({
          article_id: articleId,
          comparisons: comparisonData.comparisons
        })
        .select()
        .single()

      if (comparisonError) throw comparisonError

      return new Response(JSON.stringify(comparison), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET /comparison/:articleId - Get coverage comparison
    if (method === 'GET' && path.startsWith('/comparison/')) {
      const articleId = path.split('/')[2]
      
      const { data: comparison, error } = await supabaseClient
        .from('coverage_comparisons')
        .select('*')
        .eq('article_id', articleId)
        .single()

      if (error) throw error

      return new Response(JSON.stringify(comparison), {
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