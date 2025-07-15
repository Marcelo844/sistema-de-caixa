import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/movimentacoes.css';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import {
  buscarMovimentacoes,
  excluirMovimentacao,
  atualizarMovimentacao,
} from '../utils/movimentacoesService';
import { buscarCategorias } from '../utils/categoriasService';
import type { Movimentacao } from '../utils/movimentacoesService';

interface Categoria {
  id: string;
  nome: string;
}

const Movimentacoes: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [linhaEditada, setLinhaEditada] = useState<Partial<Movimentacao>>({});
  const navigate = useNavigate();

  useEffect(() => {
    carregarMovimentacoes();
    carregarCategorias();
  }, []);

  const carregarMovimentacoes = async () => {
    const dados = await buscarMovimentacoes();
    setMovimentacoes(dados);
  };

  const carregarCategorias = async () => {
    const entradas = await buscarCategorias('entrada');
    const saidas = await buscarCategorias('saida');
    const todas = [...entradas, ...saidas];
    setCategorias(todas);
  };

  const obterNomeCategoria = (idCategoria: string) => {
    const categoria = categorias.find(c => String(c.id) === String(idCategoria));
    return categoria ? categoria.nome : 'Categoria não encontrada';
  };

  const iniciarEdicao = (m: Movimentacao) => {
    setEditandoId(m.id!);
    setLinhaEditada({ ...m });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setLinhaEditada({});
  };

  const salvarEdicao = async () => {
    if (!editandoId) return;
    await atualizarMovimentacao(editandoId, linhaEditada);
    cancelarEdicao();
    await carregarMovimentacoes();
  };

  const handleExcluir = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Deseja realmente excluir esta movimentação?')) return;
    await excluirMovimentacao(id);
    await carregarMovimentacoes();
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="extrato-container">
      <div className="extrato-header">
        <span
          className="voltar"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/entrada-saida')}
        >
          ←
        </span>
        <h2>EXTRATO DO CAIXA</h2>
        <div className="icone-canto">🌀</div>
      </div>

      <div className="tabela-wrapper">
        <table className="tabela-extrato">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Meio</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((m) => (
              <tr key={m.id}>
                {editandoId === m.id ? (
                  <>
                    <td>
                      <input
                        type="date"
                        value={(linhaEditada.data || '').slice(0, 10)}
                        onChange={(e) =>
                          setLinhaEditada({
                            ...linhaEditada,
                            data: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={linhaEditada.tipo}
                        onChange={(e) =>
                          setLinhaEditada({
                            ...linhaEditada,
                            tipo: e.target.value,
                          })
                        }
                      >
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={linhaEditada.valor}
                        onChange={(e) =>
                          setLinhaEditada({
                            ...linhaEditada,
                            valor: parseFloat(e.target.value),
                          })
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={linhaEditada.forma_pagamento}
                        onChange={(e) =>
                          setLinhaEditada({
                            ...linhaEditada,
                            forma_pagamento: e.target.value,
                          })
                        }
                      >
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pix">Pix</option>
                        <option value="cartao">Cartão</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={linhaEditada.categoria}
                        onChange={(e) =>
                          setLinhaEditada({
                            ...linhaEditada,
                            categoria: e.target.value,
                          })
                        }
                      >
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nome}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={linhaEditada.descricao}
                        onChange={(e) =>
                          setLinhaEditada({
                            ...linhaEditada,
                            descricao: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <FaCheck
                        className="icone salvar"
                        onClick={salvarEdicao}
                        style={{ cursor: 'pointer', color: 'green' }}
                      />
                      <FaTimes
                        className="icone cancelar"
                        onClick={cancelarEdicao}
                        style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{formatarData(m.data)}</td>
                    <td>{m.tipo.toUpperCase()}</td>
                    <td>{formatarValor(m.valor)}</td>
                    <td>{m.forma_pagamento.toUpperCase()}</td>
                    <td>{obterNomeCategoria(m.categoria)}</td>
                    <td>{m.descricao}</td>
                    <td>
                      <FaEdit
                        className="icone editar"
                        onClick={() => iniciarEdicao(m)}
                        style={{ cursor: 'pointer' }}
                      />
                      <FaTrash
                        className="icone excluir"
                        onClick={() => handleExcluir(m.id)}
                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                      />
                    </td>
                  </>
                )}
              </tr>
            ))}
            {movimentacoes.length === 0 && (
              <tr>
                <td colSpan={7}>Nenhuma movimentação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Movimentacoes;
