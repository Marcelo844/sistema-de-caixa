import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import EntradaSaida from './pages/EntradaSaida';
import Movimentacoes from './pages/Movimentacoes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/entrada-saida" element={<EntradaSaida />} />
        <Route path="/movimentacoes" element={<Movimentacoes />} />
      </Routes>
    </Router>
  );
};

export default App;