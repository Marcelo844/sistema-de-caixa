// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Se estiver rodando no browser (Vite), use import.meta.env;
// caso contrário (Node.js), caia no fallback de process.env
const inBrowser = typeof window !== 'undefined';

const supabaseUrl = inBrowser
  ? import.meta.env.VITE_SUPABASE_URL
  : process.env.SUPABASE_URL!;

const supabaseKey = inBrowser
  ? import.meta.env.VITE_SUPABASE_KEY
  : process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
