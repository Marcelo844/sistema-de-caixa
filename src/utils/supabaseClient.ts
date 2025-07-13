// /src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Acessar as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY não estão definidas.');
}

// Criar o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
