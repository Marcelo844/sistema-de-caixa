import { supabase } from '../utils/supabaseClient';

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

export async function buscarMovimentacoesFiltradas(filtros: {
  tipo?: string;
  forma_pagamento?: string;
  dataInicio?: string;
  dataFim?: string;
  categoria?: string;
}) {
  let query = supabase.from('movimentacoes').select('*');

  if (filtros.tipo && filtros.tipo !== 'todos') {
    query = query.eq('tipo', filtros.tipo);
  }

  if (filtros.forma_pagamento) {
    query = query.eq('forma_pagamento', filtros.forma_pagamento);
  }

  if (filtros.dataInicio) {
    query = query.gte('data', filtros.dataInicio);
  }

  if (filtros.dataFim) {
    query = query.lte('data', filtros.dataFim);
  }

  if (filtros.categoria) {
    query = query.eq('categoria', filtros.categoria);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar movimentações filtradas:', error.message);
    throw new Error('Erro ao buscar movimentações filtradas: ' + error.message);
  }

  return (data as Movimentacao[]).map(mov => ({
    ...mov,
    id: String(mov.id),
    categoria: String(mov.categoria),
  }));
}

