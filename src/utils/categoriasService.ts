import supabase from '../utils/supabaseClient';

export interface Categoria {
  id: string;
  nome: string;
  tipo: 'entrada' | 'saida';
}

export async function buscarCategorias(tipo: 'entrada' | 'saida'): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('tipo', tipo);

  if (error) {
    console.error('Erro ao buscar categorias:', error.message);
    throw new Error(error.message);
  }

  return (data as Categoria[]).map(cat => ({
    ...cat,
    id: String(cat.id),
  }));
}

export async function criarCategoria(tipo: 'entrada' | 'saida', nome: string): Promise<void> {
  const { error } = await supabase
    .from('categorias')
    .insert([{ tipo, nome }]);

  if (error) {
    console.error('Erro ao criar categoria:', error.message);
    throw new Error(error.message);
  }
}

export async function atualizarCategoria(id: string, nome: string): Promise<void> {
  const { error } = await supabase
    .from('categorias')
    .update({ nome })
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar categoria:', error.message);
    throw new Error(error.message);
  }
}

export async function excluirCategoria(id: string): Promise<void> {
  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir categoria:', error.message);
    throw new Error(error.message);
  }
}
