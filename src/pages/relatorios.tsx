import React, { useEffect, useState } from 'react';
import '../styles/relatorios.css';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getTotais, getFluxoMensal } from '../utils/relatoriosServices';

const Relatorios: React.FC = () => {
  const navigate = useNavigate();
  const [ano, setAno] = useState(2025);
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalSaidas, setTotalSaidas] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { totalEntradas, totalSaidas } = await getTotais(ano);
        const fluxoMensal = await getFluxoMensal(ano);

        setTotalEntradas(totalEntradas);
        setTotalSaidas(totalSaidas);
        setData(fluxoMensal);
      } catch (err) {
        console.error('Erro ao carregar relatórios:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [ano]);

  if (loading) {
    return <p className="loading">Carregando relatórios...</p>;
  }

  return (
    <div className="relatorios-container">
      <header className="relatorios-header">
        <button
          className="btn-voltar"
          onClick={() => navigate('/movimentacoes')}
        >
          &#8592; Voltar
        </button>
        <h1>Fluxo de Caixa Mensal</h1>
      </header>

      <div className="totais-container">
        <div className="card total-entradas">
          <p>Total de Entradas:</p>
          <h2>R$ {totalEntradas.toLocaleString('pt-BR')}</h2>
        </div>
        <div className="card total-saidas">
          <p>Total de Saídas:</p>
          <h2>R$ {totalSaidas.toLocaleString('pt-BR')}</h2>
        </div>
      </div>

      <div className="grafico-container">
        <div className="grafico-header">
          <h3>Entradas e Saídas de {ano}</h3>
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
            <Legend />
            <Line type="monotone" dataKey="entradas" stroke="#28a745" name="Entradas" />
            <Line type="monotone" dataKey="saidas" stroke="#dc3545" name="Saídas" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Relatorios;
