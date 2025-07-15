import React, { useEffect, useState } from 'react';
import {
  buscarCategorias,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
} from '../utils/categoriasService';
import '../styles/categoriasModal.css';

interface Categoria {
  id: string;
  nome: string;
  tipo: 'entrada' | 'saida';
}

interface Props {
  onClose: (tipoAtualizado: 'entrada' | 'saida') => void;
}

const CategoriasModal: React.FC<Props> = ({ onClose }) => {
  const [categoriasEntrada, setCategoriasEntrada] = useState<Categoria[]>([]);
  const [categoriasSaida, setCategoriasSaida] = useState<Categoria[]>([]);

  const [categoriasEntradaEditaveis, setCategoriasEntradaEditaveis] = useState<Categoria[]>([]);
  const [categoriasSaidaEditaveis, setCategoriasSaidaEditaveis] = useState<Categoria[]>([]);

  const [novaCategoriaNome, setNovaCategoriaNome] = useState('');
  const [tipoNovaCategoria, setTipoNovaCategoria] = useState<'entrada' | 'saida'>('entrada');

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      const entradas = await buscarCategorias('entrada');
      const saidas = await buscarCategorias('saida');
      setCategoriasEntrada(entradas);
      setCategoriasSaida(saidas);

      setCategoriasEntradaEditaveis(entradas);
      setCategoriasSaidaEditaveis(saidas);
    } catch (error) {
      alert('Erro ao carregar categorias');
    }
  }

  async function handleCriarCategoria() {
    if (!novaCategoriaNome.trim()) return alert('Nome inválido');
    try {
      await criarCategoria(tipoNovaCategoria, novaCategoriaNome.trim());
      setNovaCategoriaNome('');
      carregarCategorias();
    } catch (error) {
      alert('Erro ao criar categoria');
    }
  }

  async function handleExcluirCategoria(id: string) {
    if (!window.confirm('Excluir esta categoria?')) return;
    try {
      await excluirCategoria(id);
      carregarCategorias();
    } catch (error) {
      alert('Erro ao excluir categoria');
    }
  }

  async function handleSalvarAlteracoes() {
    try {
      for (const catEdit of categoriasEntradaEditaveis) {
        const original = categoriasEntrada.find(c => c.id === catEdit.id);
        if (original && original.nome !== catEdit.nome) {
          await atualizarCategoria(catEdit.id, catEdit.nome);
        }
      }

      for (const catEdit of categoriasSaidaEditaveis) {
        const original = categoriasSaida.find(c => c.id === catEdit.id);
        if (original && original.nome !== catEdit.nome) {
          await atualizarCategoria(catEdit.id, catEdit.nome);
        }
      }

      alert('Categorias atualizadas com sucesso!');
      carregarCategorias();
    } catch (error) {
      alert('Erro ao salvar alterações');
    }
  }

  return (
    <div className="modal-fundo">
      <div className="modal-corpo">
        <h2>Gerenciar Categorias</h2>

        <div className="categorias-grid">
          <div>
            <h3>Entradas</h3>
            <ul>
              {categoriasEntradaEditaveis.map((cat, idx) => (
                <li key={cat.id}>
                  <input
                    type="text"
                    value={cat.nome}
                    onChange={(e) => {
                      const novoNome = e.target.value;
                      setCategoriasEntradaEditaveis((cats) => {
                        const novas = [...cats];
                        novas[idx] = { ...cat, nome: novoNome };
                        return novas;
                      });
                    }}
                  />
                  <button onClick={() => handleExcluirCategoria(cat.id)}>Excluir</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Saídas</h3>
            <ul>
              {categoriasSaidaEditaveis.map((cat, idx) => (
                <li key={cat.id}>
                  <input
                    type="text"
                    value={cat.nome}
                    onChange={(e) => {
                      const novoNome = e.target.value;
                      setCategoriasSaidaEditaveis((cats) => {
                        const novas = [...cats];
                        novas[idx] = { ...cat, nome: novoNome };
                        return novas;
                      });
                    }}
                  />
                  <button onClick={() => handleExcluirCategoria(cat.id)}>Excluir</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="adicionar-categoria">
          <select
            value={tipoNovaCategoria}
            onChange={(e) => setTipoNovaCategoria(e.target.value as 'entrada' | 'saida')}
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          <input
            type="text"
            placeholder="Nova categoria"
            value={novaCategoriaNome}
            onChange={(e) => setNovaCategoriaNome(e.target.value)}
          />
          <button onClick={handleCriarCategoria}>Adicionar</button>
        </div>

        <div className="botoes-modal">
          <button onClick={() => onClose(tipoNovaCategoria)} className="btn-fechar">Fechar</button>
          <button onClick={handleSalvarAlteracoes} className="btn-salvar">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

export default CategoriasModal;
