import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cashifyLogo from '../assets/Cashify_logo.png';
import '../styles/login.css';
import { supabase } from '../utils/supabaseClient';
import { FaEye, FaEyeSlash, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('not confirmed')) setError('Você precisa confirmar seu e‑mail antes de entrar.');
      else setError('Email ou senha incorretos.');
    } else {
      navigate('/entrada-saida');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-content">
          <img src={cashifyLogo} alt="Cashify Logo" className="login-logo" />
          <h2>Entrar no Cashify</h2>
          {error && <p className="error-message">{error}</p>}

          <form className="login-form" onSubmit={handleLogin}>
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
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login">Entrar</button>
          </form>

          <p className="register-text">
            Não possui conta? <Link to="/register">Registre-se</Link>
          </p>

          <div className="social-icons">
            <p>Siga-nos nas redes sociais</p>
            <div className="icons">
              <i className="bi bi-instagram" />
              <i className="bi bi-linkedin" />
              <i className="bi bi-facebook" />
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