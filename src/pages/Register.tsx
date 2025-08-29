import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cashifyLogo from '../assets/Cashify_logo.png';
import '../styles/login.css';
import { supabase } from '../utils/supabaseClient';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'sent'>('form');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    const redirectUrl = `${import.meta.env.VITE_SITE_URL}/login`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl }
    });

    if (error) setError(error.message);
    else setStep('sent');
  };

  if (step === 'sent') {
    return (
      <div className="login-wrapper sent-wrapper">
        <div className="login-content sent-content">
          <img src={cashifyLogo} alt="Cashify Logo" className="login-logo" />
          <h2 className="sent-title">Confirmação Enviada!</h2>
          <p className="info-message">
            Tudo certo! Verifique seu e-mail <strong>{email}</strong> e clique no link de confirmação.
          </p>
          <Link to="/login" className="btn-secondary">Voltar para Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper register">
      <div className="login-left">
        <div className="login-content form-card">
          <img src={cashifyLogo} alt="Cashify Logo" className="login-logo" />
          <h2>Registre-se no Cashify</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleRegister}>
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

            <div className="form-field">
              <label className="form-label" htmlFor="confirmPassword">Confirmar Senha:</label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className="input"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowConfirm(s => !s)}
                  aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                  title={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                >
                  <i className={showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'} aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary">Registrar</button>
          </form>

          <p className="register-text">
            Já possui conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
      <div className="login-right">
        <p>A inteligência por trás do seu caixa.</p>
      </div>
    </div>
  );
};

export default Register;