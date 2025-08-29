import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cashifyLogo from '../assets/Cashify_logo.png';
import '../styles/login.css';
import { supabase } from '../utils/supabaseClient';

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
      setError(error.message || 'Falha ao fazer login.');
      return;
    }

    const isVerified =
      !!data.user?.email_confirmed_at ||
      !!data.session?.user?.email_confirmed_at;

    if (!isVerified) {
      await supabase.auth.signOut();
      setError('Seu e-mail ainda não foi verificado. Verifique sua caixa de entrada e tente novamente.');
      return;
    }

    navigate('/entrada-saida');
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-content form-card">
          <img src={cashifyLogo} alt="Cashify Logo" className="login-logo" />
          <h2>Entrar no Cashify</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="form-field">
              <label className="form-label" htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="password">Senha:</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <button className="btn-primary" type="submit">Entrar</button>
          </form>

          <p className="register-text">
            Não possui conta? <Link to="/register">Registre-se</Link>
          </p>
        </div>
      </div>
      <div className="login-right">
        <p>A inteligência por trás do seu caixa.</p>
      </div>
    </div>
  );
};

export default Login;