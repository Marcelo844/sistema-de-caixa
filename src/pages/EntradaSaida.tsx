import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/entradaSaida.css';
import { salvarMovimentacao, buscarMovimentacoes } from '../utils/movimentacoesService';
import CategoriasModal from '../components/CategoriasModal';
import { buscarCategorias } from '../utils/categoriasService';

const EntradaSaida: React.FC = () => {
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [categoria, setCategoria] = useState(''); // id da categoria
  const [descricao, setDescricao] = useState('');
  const [categoriaEditavel, setCategoriaEditavel] = useState(true);
  const [saldos, setSaldos] = useState({ total: 0, dinheiro: 0, pix: 0, cartao: 0 });

  const [modalAberto, setModalAberto] = useState(false);
  const [categorias, setCategorias] = useState<{ id: string; nome: string }[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    carregarSaldos();
  }, []);

  useEffect(() => {
    carregarCategorias(tipo);
    setCategoria('');
  }, [tipo]);

  const carregarSaldos = async () => {
    try {
      const movimentacoes = await buscarMovimentacoes();

      let total = 0;
      let dinheiro = 0;
      let pix = 0;
      let cartao = 0;

      movimentacoes.forEach((m) => {
        const v = typeof m.valor === 'string' ? parseFloat(m.valor) : m.valor;
        const sinal = m.tipo === 'entrada' ? 1 : -1;
        const vf = v * sinal;
        total += vf;

        if (m.forma_pagamento === 'dinheiro') dinheiro += vf;
        if (m.forma_pagamento === 'pix') pix += vf;
        if (m.forma_pagamento === 'cartao') cartao += vf;
      });

      setSaldos({ total, dinheiro, pix, cartao });
    } catch (error) {
      console.error('Erro ao carregar saldos:', error);
    }
  };

  const carregarCategorias = async (tipoCategoria: 'entrada' | 'saida') => {
    try {
      const lista = await buscarCategorias(tipoCategoria);
      setCategorias(lista);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const formatarParaReal = (val: string) => {
    const n = parseFloat(val.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(n)) {
      return n.toLocaleString('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return '';
  };

  const parseValorParaNumero = (val: string) =>
    parseFloat(val.replace(/\./g, '').replace(',', '.'));

  const formatarMoeda = (n: number) =>
    n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoria) {
      alert('Selecione uma categoria válida');
      return;
    }

    const valorNumero = parseValorParaNumero(valor);
    if (isNaN(valorNumero) || valorNumero <= 0) {
      alert('Informe um valor válido.');
      return;
    }

    try {
      await salvarMovimentacao({
        tipo,
        valor: valorNumero,
        data,
        forma_pagamento: formaPagamento,
        categoria, // ID da categoria
        descricao,
      });

      // Atualização OTIMISTA do saldo (imediata)
      const delta = tipo === 'entrada' ? valorNumero : -valorNumero;
      setSaldos(prev => {
        const novo = { ...prev, total: prev.total + delta };
        if (formaPagamento === 'dinheiro') novo.dinheiro = prev.dinheiro + delta;
        if (formaPagamento === 'pix') novo.pix = prev.pix + delta;
        if (formaPagamento === 'cartao') novo.cartao = prev.cartao + delta;
        return novo;
      });

      // Reset do formulário
      handleCancelar();

      // Sincroniza com o banco (caso outro cliente altere etc.)
      await carregarSaldos();

      alert('Movimentação salva com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar movimentação.');
    }
  };

  const handleCancelar = () => {
    setValor('');
    setData('');
    setFormaPagamento('');
    setCategoria('');
    setDescricao('');
    setCategoriaEditavel(true);
  };

  const abrirModal = () => {
    setCategoriaEditavel(true);
    setModalAberto(true);
  };

  const fecharModal = async (tipoAtualizado: 'entrada' | 'saida') => {
    setModalAberto(false);
    await carregarCategorias(tipoAtualizado);
    setCategoria('');
    setTipo(tipoAtualizado);
  };

  return (
    <div className="container-movimentacao">
      <form className="form-movimentacao" onSubmit={handleSalvar}>
        <h3>Registrar nova movimentação</h3>

        <div className="tipo">
          <label>Tipo:</label>
          <label>
            <input
              type="radio"
              name="tipo"
              value="entrada"
              checked={tipo === 'entrada'}
              onChange={() => setTipo('entrada')}
            /> Entrada
          </label>
          <label>
            <input
              type="radio"
              name="tipo"
              value="saida"
              checked={tipo === 'saida'}
              onChange={() => setTipo('saida')}
            /> Saída
          </label>
        </div>

        <div className="grid-2">
          <div>
            <label>Valor:</label>
            <input
              type="text"
              value={valor}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^\d,]/g, '');
                setValor(cleaned);
              }}
              onBlur={() => setValor(formatarParaReal(valor))}
              required
            />
          </div>
          <div>
            <label>Data:</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </div>
        </div>

        <label>Forma de pagamento:</label>
        <select
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="pix">Pix</option>
          <option value="cartao">Cartão</option>
        </select>

        <div className="grid-categoria" style={{ position: 'relative' }}>
          <div className="categoria">
            <label>Categoria:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              disabled={!categoriaEditavel}
              required
            >
              <option value="">Selecione</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn-editar"
            onClick={abrirModal}
          >
            Editar
          </button>
        </div>

        <label>Descrição:</label>
        <textarea
          rows={5}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>

        <div className="botoes">
          <button type="submit" className="btn-salvar">Salvar</button>
          <button type="button" onClick={handleCancelar}>Cancelar</button>
        </div>
      </form>

      {/* Modal como overlay */}
      {modalAberto && (
        <CategoriasModal
          isOpen={modalAberto}
          onClose={fecharModal}
          tipoInicial={tipo}
        />
      )}

      <div className="card-saldo">
        <h4>Saldo Total:</h4>
        <p className="valor-total">{formatarMoeda(saldos.total)}</p>
        <p className="variacao">+0,00% Comparado ao mês anterior</p>

        <div className="btn-historico-wrapper">
          <button
            className="btn-editar"
            onClick={() => navigate('/movimentacoes')}
          >
            Ver Histórico
          </button>
        </div>

        <h5>Saldos por meio:</h5>
        <div className="saldo-meio">
          <p>Dinheiro: <strong>{formatarMoeda(saldos.dinheiro)}</strong></p>
          <p>Pix: <strong>{formatarMoeda(saldos.pix)}</strong></p>
          <p>Cartão: <strong>{formatarMoeda(saldos.cartao)}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default EntradaSaida;