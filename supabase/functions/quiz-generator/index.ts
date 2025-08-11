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
    const path = url.pathname.replace('/functions/v1/quiz-generator', '')

    // POST /generate - Generate quiz for article
    if (method === 'POST' && path === '/generate') {
      const { articleId, difficulty = 'intermediate' } = await req.json()

      // Get article content
      const { data: article, error: articleError } = await supabaseClient
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single()

      if (articleError) throw articleError

      // Check if quiz already exists
      const { data: existingQuiz } = await supabaseClient
        .from('quizzes')
        .select('*')
        .eq('article_id', articleId)
        .single()

      if (existingQuiz) {
        return new Response(JSON.stringify(existingQuiz), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Generate quiz using Gemini
      const quizPrompt = `
        Create a 5-question multiple choice quiz about this news article.
        Difficulty level: ${difficulty}
        
        Article Title: ${article.title}
        Article Content: ${article.content}
        
        Generate questions that test:
        1. Main facts and details
        2. Cause and effect relationships
        3. Implications and consequences
        4. Context and background
        5. Critical thinking about the topic
        
        For each question, provide:
        - A clear question
        - 4 multiple choice options (A, B, C, D)
        - The correct answer (0, 1, 2, or 3)
        - A brief explanation
        
        Respond in JSON format:
        {
          "questions": [
            {
              "question": "Question text?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": 0,
              "explanation": "Explanation text"
            }
          ]
        }
      `

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: quizPrompt }] }]
          })
        }
      )

      const geminiData = await geminiResponse.json()
      let quizData

      try {
        const responseText = geminiData.candidates[0].content.parts[0].text
        quizData = JSON.parse(responseText.replace(/```json\n?/g, '').replace(/```/g, ''))
      } catch (e) {
        // Fallback quiz if AI generation fails
        quizData = {
          questions: [
            {
              question: `What is the main topic of this article about ${article.title}?`,
              options: [
                "The article's main focus",
                "A secondary topic",
                "An unrelated topic",
                "Background information"
              ],
              correctAnswer: 0,
              explanation: "This question tests basic comprehension of the article's main theme."
            }
          ]
        }
      }

      // Add IDs to questions
      const questionsWithIds = quizData.questions.map((q: any, index: number) => ({
        ...q,
        id: `q${index + 1}`
      }))

      // Save quiz to database
      const { data: quiz, error: quizError } = await supabaseClient
        .from('quizzes')
        .insert({
          article_id: articleId,
          questions: questionsWithIds,
          difficulty
        })
        .select()
        .single()

      if (quizError) throw quizError

      return new Response(JSON.stringify(quiz), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET /quiz/:articleId - Get quiz for article
    if (method === 'GET' && path.startsWith('/quiz/')) {
      const articleId = path.split('/')[2]
      
      const { data: quiz, error } = await supabaseClient
        .from('quizzes')
        .select('*')
        .eq('article_id', articleId)
        .single()

      if (error) throw error

      return new Response(JSON.stringify(quiz), {
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