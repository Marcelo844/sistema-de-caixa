import supabase from '../utils/supabaseClient';

export interface Movimentacao {
  id?: string;
  tipo: string;
  valor: number;
  data: string;
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
    }])
    .select();

  if (error) {
    console.error('Erro ao salvar movimentação:', error.message);
    throw new Error('Erro ao salvar movimentação: ' + error.message);
  }

  return data;
}

export async function buscarMovimentacoes() {
  const { data, error } = await supabase
    .from('movimentacoes')
    .select('*');

  if (error) {
    console.error('Erro ao buscar movimentações:', error.message);
    throw new Error('Erro ao buscar movimentações: ' + error.message);
  }

  return (data as Movimentacao[]).map(mov => ({
    ...mov,
    id: String(mov.id),
    categoria: String(mov.categoria),
  }));
}

export async function excluirMovimentacao(id: string) {
  const { error } = await supabase
    .from('movimentacoes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir movimentação:', error.message);
    throw new Error('Erro ao excluir movimentação: ' + error.message);
  }
}

export async function atualizarMovimentacao(id: string, mov: Partial<Movimentacao>) {
  const { error } = await supabase
    .from('movimentacoes')
    .update(mov)
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar movimentação:', error.message);
    throw new Error('Erro ao atualizar movimentação: ' + error.message);
  }
}
