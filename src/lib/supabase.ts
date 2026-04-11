import { createClient } from '@supabase/supabase-js';

// Vercel environment variables can sometimes fail to inject if not configured perfectly.
// Since Supabase Anon keys are public by design, we can safely embed them here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qixwfsfgngpqkoiiejpv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeHdmc2ZnbmdwcWtvaWllanB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4OTM0NTksImV4cCI6MjA5MTQ2OTQ1OX0.ND1JbkD7rhakrb9VLhktlM-VDcIeJf_oY-PTI5Y8dG4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
