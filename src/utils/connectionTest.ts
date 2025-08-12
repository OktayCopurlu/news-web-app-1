// DEPRECATED: All direct Supabase / Edge Function connection tests removed.
// Frontend should only communicate with the BFF layer. These helpers are kept
// as no-ops to avoid breaking stale imports; remove usages instead.

export const testDatabaseConnection = async () => ({
  connected: false,
  error: "Supabase removed",
});
export const testGeminiConnection = async () => ({
  connected: false,
  error: "Supabase removed",
});
export const testAllConnections = async () => ({
  database: await testDatabaseConnection(),
  gemini: await testGeminiConnection(),
  allConnected: false,
});
