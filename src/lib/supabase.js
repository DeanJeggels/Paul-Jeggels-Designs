import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dplbfhwqbmnzmrncxain.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbGJmaHdxYm1uem1ybmN4YWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjIxNjgsImV4cCI6MjA2MDgzODE2OH0.e1SJPplUC8izzANfVYT1VNNBAZT2Ki6kivDt6lYjxIY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
