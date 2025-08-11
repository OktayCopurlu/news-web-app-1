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
    const path = url.pathname.replace(/^\/functions\/v1\/ai-chat|^\/ai-chat/, '')

    // POST /chat - Send message to AI
    if (method === 'POST' && path === '/chat') {
      const { articleId, message, chatHistory, userId } = await req.json()

      // Get article context
      const { data: article, error: articleError } = await supabaseClient
        .from('articles')
        .select('*, article_analytics(*)')
        .eq('id', articleId)
        .single()

      if (articleError) throw articleError

      // Build context for AI
      const context = `
        You are an AI assistant helping users understand news articles. 
        
        Article Title: ${article.title}
        Article Summary: ${article.summary}
        Article Category: ${article.category}
        Article Source: ${article.source}
        Bias Score: ${article.article_analytics[0]?.bias_score || 0}
        Sentiment: ${article.article_analytics[0]?.sentiment_label || 'neutral'}
        ${article.ai_explanation ? `\nDetailed Explanation: ${article.ai_explanation}` : ''}
        
        Previous conversation:
        ${chatHistory.map((msg: any) => `${msg.type}: ${msg.content}`).join('\n')}
        
        User's question: ${message}
        
        Provide a helpful, accurate response about this article. Be conversational but informative.
        Keep responses concise (under 200 words) and cite specific information when relevant.
      `

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: context }] }]
          })
        }
      )

      const geminiData = await geminiResponse.json()
      const aiResponse = geminiData.candidates[0].content.parts[0].text

      // Save chat if user is logged in
      if (userId) {
        const updatedMessages = [
          ...chatHistory,
          { id: Date.now().toString(), type: 'user', content: message, timestamp: new Date() },
          { id: (Date.now() + 1).toString(), type: 'ai', content: aiResponse, timestamp: new Date() }
        ]

        await supabaseClient
          .from('ai_chats')
          .upsert({
            user_id: userId,
            article_id: articleId,
            messages: updatedMessages
          }, {
            onConflict: 'user_id,article_id'
          })
      }

      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET /chat/:articleId - Get chat history
    if (method === 'GET' && path.startsWith('/chat/')) {
      const articleId = path.split('/')[2]
      const authHeader = req.headers.get('authorization')
      
      if (!authHeader) {
        return new Response(JSON.stringify({ messages: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      )

      if (!user) {
        return new Response(JSON.stringify({ messages: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { data: chat } = await supabaseClient
        .from('ai_chats')
        .select('messages')
        .eq('user_id', user.id)
        .eq('article_id', articleId)
        .single()

      return new Response(JSON.stringify({ messages: chat?.messages || [] }), {
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