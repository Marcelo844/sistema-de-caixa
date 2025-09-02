import { supabase } from '../utils/supabaseClient';

export type TipoMovimento = 'entrada' | 'saida';

export interface Movimento {
  id: string;
  tipo: TipoMovimento;
  valor: number;
  data: string;
  user_id?: string | null;
}

/** Detecta a mensagem de “coluna não existe” */
function missingUserIdCol(err: { message?: string } | null): boolean {
  const msg = err?.message ?? '';
  return typeof msg === 'string' && msg.includes('movimentacoes.user_id') && msg.includes('does not exist');
}

/** Pega o user logado */
async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

/** Cache da existência da coluna user_id */
let HAS_USER_ID: boolean | null = null;

async function ensureHasUserIdColumn(): Promise<boolean> {
  if (HAS_USER_ID !== null) return HAS_USER_ID;

  const probe = await supabase
    .from('movimentacoes')
    .select('id, user_id')
    .limit(1);

  if ('error' in probe && probe.error && missingUserIdCol(probe.error)) {
    HAS_USER_ID = false;
  } else {
    HAS_USER_ID = true;
  }

  return HAS_USER_ID!;
}

/** Soma total de entradas e saídas no ano */
export async function getTotais(ano: number) {
  const withUser = await ensureHasUserIdColumn();
  const uid = withUser ? await getUserId() : null;
  if (withUser && !uid) throw new Error('Usuário não autenticado.');

  const baseQuery = supabase.from('movimentacoes').select('valor, tipo')
    .gte('data', `${ano}-01-01`)
    .lte('data', `${ano}-12-31`);

  if (withUser) baseQuery.eq('user_id', uid);

  const { data, error } = await baseQuery;
  if (error) {
    if (missingUserIdCol(error)) {
      HAS_USER_ID = false;
      return getTotais(ano);
    }
    throw new Error(error.message);
  }

  const totalEntradas = (data ?? []).filter(m => m.tipo === 'entrada')
    .reduce((acc, cur) => acc + Number(cur.valor), 0);
  const totalSaidas = (data ?? []).filter(m => m.tipo === 'saida')
    .reduce((acc, cur) => acc + Number(cur.valor), 0);

  return { totalEntradas, totalSaidas };
}

/** Retorna os valores de entradas e saídas mês a mês */
export async function getFluxoMensal(ano: number) {
  const withUser = await ensureHasUserIdColumn();
  const uid = withUser ? await getUserId() : null;
  if (withUser && !uid) throw new Error('Usuário não autenticado.');

  const baseQuery = supabase.from('movimentacoes').select('valor, tipo, data')
    .gte('data', `${ano}-01-01`)
    .lte('data', `${ano}-12-31`);

  if (withUser) baseQuery.eq('user_id', uid);

  const { data, error } = await baseQuery;
  if (error) {
    if (missingUserIdCol(error)) {
      HAS_USER_ID = false;
      return getFluxoMensal(ano);
    }
    throw new Error(error.message);
  }

  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const resumo = meses.map(m => ({ mes: m, entradas: 0, saidas: 0 }));

  (data ?? []).forEach(mov => {
    const date = new Date(mov.data);
    const mesIndex = date.getMonth();
    if (mov.tipo === 'entrada') resumo[mesIndex].entradas += Number(mov.valor);
    else resumo[mesIndex].saidas += Number(mov.valor);
  });

  return resumo;
}
