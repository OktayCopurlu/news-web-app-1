import { supabase } from '../lib/supabase'

// Test Supabase database connection
export const testDatabaseConnection = async () => {
  try {
    console.log('Testing Supabase database connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('articles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection failed:', error.message)
      return { connected: false, error: error.message }
    }
    
    console.log('✅ Database connection successful')
    return { connected: true, error: null }
  } catch (error) {
    console.error('Database connection error:', error)
    return { connected: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Test Gemini API connection via Edge Function
export const testGeminiConnection = async () => {
  try {
    console.log('Testing Gemini API connection via news-processor Edge Function...')
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ test: true })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API test failed:', response.status, errorText)
      return { connected: false, error: `HTTP ${response.status}: ${errorText}` }
    }
    
    const result = await response.json()
    
    if (result.error) {
      console.error('Gemini API error:', result.error)
      return { connected: false, error: result.error }
    }
    
    console.log('✅ Gemini API connection successful')
    return { connected: true, error: null, result }
  } catch (error) {
    console.error('Gemini API connection error:', error)
    return { connected: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Test both connections
export const testAllConnections = async () => {
  console.log('🔍 Testing all connections...')
  
  const dbResult = await testDatabaseConnection()
  const geminiResult = await testGeminiConnection()
  
  console.log('\n📊 Connection Status:')
  console.log(`Database: ${dbResult.connected ? '✅ Connected' : '❌ Failed'}`)
  if (!dbResult.connected) console.log(`  Error: ${dbResult.error}`)
  
  console.log(`Gemini API: ${geminiResult.connected ? '✅ Connected' : '❌ Failed'}`)
  if (!geminiResult.connected) console.log(`  Error: ${geminiResult.error}`)
  
  return {
    database: dbResult,
    gemini: geminiResult,
    allConnected: dbResult.connected && geminiResult.connected
  }
}