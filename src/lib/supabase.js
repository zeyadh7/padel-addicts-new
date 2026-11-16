import { createClient } from '@supabase/supabase-js'

// The anon key is a public key by design (it already ships in your current index.html).
// What it can do is controlled by Row Level Security (RLS) policies in Supabase, not by hiding it.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://lkqdaxrbtvizfpafbhbp.supabase.co'
const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrcWRheHJidHZpemZwYWZiaGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjQ5MzAsImV4cCI6MjA5MjgwMDkzMH0.udvEaXyuWEgrSdKlkIijNkTZchnX3yOpklqAKZljz6k'

export const supabase = createClient(url, key)
