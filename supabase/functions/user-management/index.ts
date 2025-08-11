import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/user-management', '')

    // POST /register - Create user account
    if (method === 'POST' && path === '/register') {
      const { email, password, name, preferences } = await req.json()

      // Create auth user
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      // Create user profile
      const { data: user, error: userError } = await supabaseClient
        .from('users')
        .insert({
          id: authData.user?.id,
          email,
          name,
          preferences,
          onboarding_complete: true
        })
        .select()
        .single()

      if (userError) throw userError

      return new Response(JSON.stringify({ user, session: authData.session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST /login - Sign in user
    if (method === 'POST' && path === '/login') {
      const { email, password } = await req.json()

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user profile
      const { data: user } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', data.user?.id)
        .single()

      return new Response(JSON.stringify({ user, session: data.session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // PUT /preferences - Update user preferences
    if (method === 'PUT' && path === '/preferences') {
      const authHeader = req.headers.get('authorization')
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { data: { user: authUser } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      )

      if (!authUser) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { preferences } = await req.json()

      const { data: user, error } = await supabaseClient
        .from('users')
        .update({ preferences, updated_at: new Date().toISOString() })
        .eq('id', authUser.id)
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify(user), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET /profile - Get user profile
    if (method === 'GET' && path === '/profile') {
      const authHeader = req.headers.get('authorization')
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { data: { user: authUser } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      )

      if (!authUser) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { data: user, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) throw error

      return new Response(JSON.stringify(user), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST /interaction - Track user interaction
    if (method === 'POST' && path === '/interaction') {
      const authHeader = req.headers.get('authorization')
      const { articleId, interactionType, metadata = {} } = await req.json()

      let userId = null
      if (authHeader) {
        try {
          const { data: { user } } = await supabaseClient.auth.getUser(
            authHeader.replace('Bearer ', '')
          )
          userId = user?.id
        } catch (error) {
          console.warn('Failed to get user from auth header:', error)
        }
      }

      // Always allow interaction tracking, even for anonymous users
      try {
        if (userId) {
          await supabaseClient
            .from('user_interactions')
            .insert({
              user_id: userId,
              article_id: articleId,
              interaction_type: interactionType,
              metadata
            })
        }

        // Update article view count if it's a view interaction
        if (interactionType === 'view') {
          await supabaseClient
            .rpc('increment_view_count', { article_id: articleId })
        }
      } catch (error) {
        console.warn('Failed to track interaction:', error)
        // Don't throw error - interaction tracking should be non-blocking
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

        userId = user?.id
      }

      if (userId) {
        await supabaseClient
          .from('user_interactions')
          .insert({
            user_id: userId,
            article_id: articleId,
            interaction_type: interactionType,
            metadata
          })
      }

      // Update article view count if it's a view interaction
      if (interactionType === 'view') {
        await supabaseClient
          .from('articles')
          .update({ 
            view_count: supabaseClient.sql`view_count + 1`,
            updated_at: new Date().toISOString()
          })
          .eq('id', articleId)
      }

      return new Response(JSON.stringify({ success: true }), {
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