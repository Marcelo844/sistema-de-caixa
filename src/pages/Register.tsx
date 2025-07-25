import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cashifyLogo from '../assets/Cashify_logo.png';
import '../styles/login.css';  // reutilizando estilos da tela de login
import axios from 'axios';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }
    try {
      // Ajuste a URL conforme seu endpoint de cadastro
      await axios.post('/api/register', { email, password });
      navigate('/login');
    } catch (err) {
      setError('Erro ao registrar usuário. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-content">
          <img src={cashifyLogo} alt="Cashify Logo" className="login-logo" />

          <h2>Registre-se no Cashify</h2>

          {error && <p className="error-message">{error}</p>}

          <form className="login-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Senha:</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-login">Registrar</button>
          </form>

          <p className="register-text">
            Já possui conta? <Link to="/login">Entrar</Link>
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

export default Register;