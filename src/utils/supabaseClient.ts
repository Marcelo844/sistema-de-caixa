import { createClient } from '@supabase/supabase-js';


const inBrowser = typeof window !== 'undefined';

const supabaseUrl = inBrowser
  ? import.meta.env.VITE_SUPABASE_URL
  : process.env.SUPABASE_URL!;

const supabaseKey = inBrowser
  ? import.meta.env.VITE_SUPABASE_KEY
  : process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
