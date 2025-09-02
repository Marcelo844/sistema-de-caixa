import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import EntradaSaida from './pages/EntradaSaida';
import Movimentacoes from './pages/Movimentacoes';
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './pages/ResetPassword';
import Relatorios from './pages/relatorios';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/entrada-saida" element={
          <PrivateRoute>
            <EntradaSaida />
          </PrivateRoute>
        }
      />
      <Route path="/movimentacoes" element={
          <PrivateRoute>
            <Movimentacoes />
          </PrivateRoute>
        }
      />
    <Route path="/relatorios" element={
      <PrivateRoute>
        <Relatorios />
      </PrivateRoute>
    } />
    </Routes>
  </Router>
);

export default App;