import { supabase } from '../utils/supabaseClient';

/** Domínio */
export type TipoCategoria = 'entrada' | 'saida';
export interface Categoria {
  id: string;
  nome: string;
  tipo: TipoCategoria;
  user_id?: string | null;
}

/** Tipos auxiliares para não depender dos tipos do Supabase gerado */
type SBError = { message: string } | null;
type SBResp<T> = { data: T | null; error: SBError };

interface CategoriaRowNoUser {
  id: string | number;
  nome: string;
  tipo: TipoCategoria;
}
interface CategoriaRowWithUser extends CategoriaRowNoUser {
  user_id: string;
}

/** Detecta a mensagem de “coluna não existe” */
function missingUserIdCol(err: SBError): boolean {
  const msg = (err as any)?.message ?? '';
  return typeof msg === 'string'
    && msg.includes('categorias.user_id')
    && msg.includes('does not exist');
}

/** Lê o user id logado (ou null) */
async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

/** Cache da existência da coluna user_id */
let HAS_USER_ID: boolean | null = null;

async function ensureHasUserIdColumn(): Promise<boolean> {
  if (HAS_USER_ID !== null) return HAS_USER_ID;

  // Tentativa leve: selecionar o campo 'user_id'; se a coluna não existir, o Supabase retorna erro 400 com a mensagem
  const probe = await (supabase
    .from('categorias')
    .select('id, user_id')
    .limit(1)) as unknown as SBResp<CategoriaRowWithUser[]>;

  if (probe.error && missingUserIdCol(probe.error)) {
    HAS_USER_ID = false;
  } else if (probe.error) {
    // Outro erro qualquer – seguimos sem user_id para não travar
    console.warn('Sondagem user_id falhou:', probe.error.message);
    HAS_USER_ID = false;
  } else {
    HAS_USER_ID = true;
  }
  return HAS_USER_ID!;
}

/** Mapeia uma linha do banco para o domínio */
function mapRow(row: CategoriaRowNoUser | CategoriaRowWithUser): Categoria {
  return {
    id: String(row.id),
    nome: String(row.nome),
    tipo: row.tipo,
    user_id: (row as CategoriaRowWithUser).user_id ?? null,
  };
}

/** Lista categorias por tipo */
export async function buscarCategorias(tipo: TipoCategoria): Promise<Categoria[]> {
  const withUser = await ensureHasUserIdColumn();

  let query = supabase.from('categorias')
    .select(withUser ? 'id, nome, tipo, user_id' : 'id, nome, tipo')
    .eq('tipo', tipo)
    .order('nome', { ascending: true });

  if (withUser) {
    const uid = await getUserId();
    if (!uid) throw new Error('Usuário não autenticado.');
    query = query.eq('user_id', uid);
  }

  const { data, error } = await (query as unknown as Promise<SBResp<(CategoriaRowNoUser | CategoriaRowWithUser)[]>>);
  if (error) {
    // Fallback se detectarmos a ausência da coluna
    if (missingUserIdCol(error)) {
      HAS_USER_ID = false;
      return buscarCategorias(tipo);
    }
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRow);
}

/** Cria categoria */
export async function criarCategoria(nome: string, tipo: TipoCategoria): Promise<Categoria> {
  const withUser = await ensureHasUserIdColumn();

  const payload: any = { nome, tipo };
  if (withUser) {
    const uid = await getUserId();
    if (!uid) throw new Error('Usuário não autenticado.');
    payload.user_id = uid;
  }

  const insert = (await supabase
    .from('categorias')
    .insert([payload])
    .select(withUser ? 'id, nome, tipo, user_id' : 'id, nome, tipo')
    .single()) as unknown as SBResp<CategoriaRowNoUser | CategoriaRowWithUser>;

  if (insert.error) {
    if (missingUserIdCol(insert.error)) {
      HAS_USER_ID = false;
      // Reenvia sem user_id
      const retry = (await supabase
        .from('categorias')
        .insert([{ nome, tipo }])
        .select('id, nome, tipo')
        .single()) as unknown as SBResp<CategoriaRowNoUser>;
      if (retry.error) throw new Error(retry.error.message);
      return mapRow(retry.data!);
    }
    throw new Error(insert.error.message);
  }

  return mapRow(insert.data!);
}

/** Atualiza nome da categoria */
export async function atualizarCategoria(id: string, nome: string): Promise<void> {
  const withUser = await ensureHasUserIdColumn();

  let update = supabase.from('categorias').update({ nome }).eq('id', id);
  if (withUser) {
    const uid = await getUserId();
    if (!uid) throw new Error('Usuário não autenticado.');
    update = update.eq('user_id', uid);
  }

  const { error } = await (update as unknown as Promise<SBResp<null>>);
  if (error) {
    if (missingUserIdCol(error)) {
      HAS_USER_ID = false;
      const retry = await (supabase.from('categorias').update({ nome }).eq('id', id) as unknown as Promise<SBResp<null>>);
      if (retry.error) throw new Error(retry.error.message);
      return;
    }
    throw new Error(error.message);
  }
}

/** Exclui categoria */
export async function excluirCategoria(id: string): Promise<void> {
  const withUser = await ensureHasUserIdColumn();

  let del = supabase.from('categorias').delete().eq('id', id);
  if (withUser) {
    const uid = await getUserId();
    if (!uid) throw new Error('Usuário não autenticado.');
    del = del.eq('user_id', uid);
  }

  const { error } = await (del as unknown as Promise<SBResp<null>>);
  if (error) {
    if (missingUserIdCol(error)) {
      HAS_USER_ID = false;
      const retry = await (supabase.from('categorias').delete().eq('id', id) as unknown as Promise<SBResp<null>>);
      if (retry.error) throw new Error(retry.error.message);
      return;
    }
    throw new Error(error.message);
  }
}