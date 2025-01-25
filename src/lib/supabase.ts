import { createClient } from '@supabase/supabase-js';

// Fallback to empty string if env vars are not set to prevent runtime errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client with error handling
export const supabase = createClient(supabaseUrl, supabaseKey);

// Add a simple check to verify connection
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials are missing. Some features may not work properly.');
}