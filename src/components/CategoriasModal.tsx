import React, { useEffect, useMemo, useState } from "react";
import {
  buscarCategorias,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
  type Categoria,
  type TipoCategoria,
} from "../utils/categoriasService";
import "../styles/categoriasModal.css";

interface Props {
  isOpen: boolean;
  onClose: (tipoQueEstavaAberto: TipoCategoria) => void;
  tipoInicial?: TipoCategoria;
}

type CatEdit = Pick<Categoria, "id" | "nome" | "tipo">;

const CategoriasModal: React.FC<Props> = ({ isOpen, onClose, tipoInicial = "entrada" }) => {
  const [tab, setTab] = useState<TipoCategoria>(tipoInicial); // só para devolver ao fechar
  const [entrada, setEntrada] = useState<CatEdit[]>([]);
  const [saida, setSaida] = useState<CatEdit[]>([]);
  const [entradaEdit, setEntradaEdit] = useState<CatEdit[]>([]);
  const [saidaEdit, setSaidaEdit] = useState<CatEdit[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState<TipoCategoria>("entrada");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const temMudancas = useMemo(() => {
    const changed = (o: CatEdit[], e: CatEdit[]) =>
      e.some((c) => {
        const orig = o.find((x) => x.id === c.id);
        return orig && orig.nome.trim() !== c.nome.trim();
      });
    return changed(entrada, entradaEdit) || changed(saida, saidaEdit);
  }, [entrada, entradaEdit, saida, saidaEdit]);

  useEffect(() => {
    if (!isOpen) return;
    setTab(tipoInicial);
    seed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tipoInicial]);

  async function seed() {
    setLoading(true);
    setErro(null);
    try {
      const [e, s] = await Promise.all([buscarCategorias("entrada"), buscarCategorias("saida")]);
      const toEdit = (arr: Categoria[]) => arr.map(({ id, nome, tipo }) => ({ id, nome, tipo }));
      setEntrada(toEdit(e));
      setSaida(toEdit(s));
      setEntradaEdit(toEdit(e));
      setSaidaEdit(toEdit(s));
    } catch (e: any) {
      setErro(e?.message ?? "Não foi possível carregar as categorias.");
    } finally {
      setLoading(false);
    }
  }

  async function onAdd() {
    const nome = novoNome.trim();
    if (!nome) return;
    setErro(null);
    try {
      const criada = await criarCategoria(nome, novoTipo);
      if (criada.tipo === "entrada") {
        setEntrada((p) => [...p, criada]);
        setEntradaEdit((p) => [...p, criada]);
        setTab("entrada");
      } else {
        setSaida((p) => [...p, criada]);
        setSaidaEdit((p) => [...p, criada]);
        setTab("saida");
      }
      setNovoNome("");
    } catch (e: any) {
      setErro(e?.message ?? "Não foi possível criar a categoria.");
    }
  }

  async function onSave() {
    if (!temMudancas) return;
    setSaving(true);
    setErro(null);
    try {
      const diff = (orig: CatEdit[], edit: CatEdit[]) =>
        edit.filter((c) => {
          const o = orig.find((x) => x.id === c.id);
          return o && o.nome.trim() !== c.nome.trim();
        });

      const mudE = diff(entrada, entradaEdit);
      const mudS = diff(saida, saidaEdit);

      await Promise.all([
        ...mudE.map((c) => atualizarCategoria(c.id, c.nome.trim())),
        ...mudS.map((c) => atualizarCategoria(c.id, c.nome.trim())),
      ]);

      setEntrada(entradaEdit);
      setSaida(saidaEdit);
    } catch (e: any) {
      setErro(e?.message ?? "Falha ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string, tipo: TipoCategoria) {
    setErro(null);
    try {
      await excluirCategoria(id);
      if (tipo === "entrada") {
        setEntrada((p) => p.filter((c) => c.id !== id));
        setEntradaEdit((p) => p.filter((c) => c.id !== id));
      } else {
        setSaida((p) => p.filter((c) => c.id !== id));
        setSaidaEdit((p) => p.filter((c) => c.id !== id));
      }
    } catch (e: any) {
      setErro(e?.message ?? "Não foi possível excluir.");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-fundo" role="dialog" aria-modal="true" aria-label="Gerenciar categorias">
      <div className="modal-corpo">
        <div className="cabecalho">
          <h2>Categorias</h2>
          <button className="btn-fantasma" onClick={() => onClose(tab)}>Fechar</button>
        </div>

        {/* Tabs apenas para lembrar última aba ao fechar, mas mostramos as duas colunas */}
        <div className="tabs">
          <button
            className={`tab ${tab === "entrada" ? "active" : ""}`}
            onClick={() => setTab("entrada")}
          >
            Entradas
          </button>
          <button
            className={`tab ${tab === "saida" ? "active" : ""}`}
            onClick={() => setTab("saida")}
          >
            Saídas
          </button>
        </div>

        {erro && <div className="alerta-erro">{erro}</div>}
        {loading ? (
          <div className="carregando">Carregando…</div>
        ) : (
          <>
            {/* DUAS COLUNAS: esquerda = Entradas, direita = Saídas */}
            <div className="categorias-grid">
              <section>
                <h3>Categorias de Entrada</h3>
                <ul>
                  {entradaEdit.map((c, idx) => (
                    <li key={c.id}>
                      <input
                        type="text"
                        value={c.nome}
                        onChange={(e) =>
                          setEntradaEdit((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, nome: e.target.value } : x))
                          )
                        }
                      />
                      <button onClick={() => onDelete(c.id, "entrada")}>Excluir</button>
                    </li>
                  ))}
                  {entradaEdit.length === 0 && <li className="vazio">Nenhuma categoria de entrada.</li>}
                </ul>
              </section>

              <section>
                <h3>Categorias de Saída</h3>
                <ul>
                  {saidaEdit.map((c, idx) => (
                    <li key={c.id}>
                      <input
                        type="text"
                        value={c.nome}
                        onChange={(e) =>
                          setSaidaEdit((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, nome: e.target.value } : x))
                          )
                        }
                      />
                      <button onClick={() => onDelete(c.id, "saida")}>Excluir</button>
                    </li>
                  ))}
                  {saidaEdit.length === 0 && <li className="vazio">Nenhuma categoria de saída.</li>}
                </ul>
              </section>
            </div>

            {/* Adicionar nova */}
            <div className="adicionar-categoria">
              <select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value as TipoCategoria)}>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
              <input
                type="text"
                placeholder="Nome da nova categoria"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
              <button className="btn-primario" onClick={onAdd}>Adicionar</button>
            </div>

            <div className="botoes-modal">
              <button
                className="btn-salvar"
                disabled={saving || !temMudancas}
                onClick={onSave}
                title={!temMudancas ? "Sem alterações" : "Salvar edição de nomes"}
              >
                {saving ? "Salvando…" : "Salvar Alterações"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriasModal;