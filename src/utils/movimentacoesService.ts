// src/services/movimentacoesService.ts
import supabase from '../utils/supabaseClient';

export interface Movimentacao {
  tipo: string;
  valor: number;
  data: string; // ou Date
  forma_pagamento: string;
  categoria: string;
  descricao: string;
}

export async function salvarMovimentacao(mov: Movimentacao) {
  const { data, error } = await supabase
    .from('movimentacoes')
    .insert([{
      tipo: mov.tipo,
      valor: mov.valor,
      data: mov.data,
      forma_pagamento: mov.forma_pagamento,
      categoria: mov.categoria,
      descricao: mov.descricao,
    }]);

  if (error) {
    console.error('Erro ao salvar movimentação:', error.message);
    throw new Error(error.message);
  }

  return data;
}

// Buscar todas as movimentações
export async function buscarMovimentacoes() {
  const { data, error } = await supabase.from('movimentacoes').select('*');

  if (error) {
    throw error;
  }

  return data;
}
