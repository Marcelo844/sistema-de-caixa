import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/movimentacoes.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { buscarMovimentacoes } from '../utils/movimentacoesService';
import type { Movimentacao } from '../utils/movimentacoesService';

const Movimentacoes: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarMovimentacoes();
  }, []);

  const carregarMovimentacoes = async () => {
    try {
      const dados = await buscarMovimentacoes();
      setMovimentacoes(dados);
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
    }
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
          title="Voltar"
        >
          ←
        </span>
        <h2>EXTRATO DO CAIXA</h2>
        <div className="icone-canto">🌀</div>
      </div>

      <div className="filtros">
        <span>Pesquisa por filtros ▼</span>
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
            {movimentacoes.map((m, idx) => (
              <tr key={idx}>
                <td>{formatarData(m.data)}</td>
                <td className={m.tipo.toLowerCase()}>{m.tipo.toUpperCase()}</td>
                <td>{formatarValor(m.valor)}</td>
                <td>{m.forma_pagamento.toUpperCase()}</td>
                <td>{m.categoria}</td>
                <td>{m.descricao}</td>
                <td className="acoes">
                  <FaEdit className="icone editar" title="Editar" />
                  <FaTrash className="icone excluir" title="Excluir" />
                </td>
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
