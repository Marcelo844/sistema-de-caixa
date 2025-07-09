// /src/utils/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Acessar as variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

// Criar o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
