// src/pages/Login.tsx
import React, { useState } from 'react';
import cashifyLogo from '../assets/Cashify_logo.png';
import '../styles/login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  // Simulação de login local, sem backend
  if (email === 'admin@cashify.com' && password === '123456') {
    // Simula um token
    localStorage.setItem('token', 'fake-token');
    navigate('/entrada-saida');
    return;
  }

  // Se quiser usar o backend real depois, deixa abaixo
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email,
      password,
    });

    localStorage.setItem('token', response.data.token);
    navigate('/entrada-saida');
  } catch (err: any) {
    setError('Email ou senha inválidos');
    console.error('Erro de login:', err);
  }
};

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-content">
          <img src={cashifyLogo} alt="Cashify Logo" className="login-logo" />

          <h2>Faça login no Cashify</h2>

          {error && <p className="error-message">{error}</p>}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-login">Entrar</button>
          </form>

          <p className="register-text">
            Não possui conta? <a href="#">Registre-se</a>
          </p>

          <div className="social-icons">
            <p>Siga-nos nas redes sociais</p>
            <div className="icons">
              <i className="bi bi-instagram"></i>
              <i className="bi bi-linkedin"></i>
              <i className="bi bi-facebook"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <p>A inteligência por trás do seu caixa.</p>
      </div>
    </div>
  );
};

export default Login;
