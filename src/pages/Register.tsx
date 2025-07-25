import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cashifyLogo from '../assets/Cashify_logo.png';
import '../styles/login.css';
import { supabase } from '../utils/supabaseClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
    const redirectUrl = `${window.location.origin}/entrada-saida`;
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
            Tudo certo! 🚀<br />
            Verifique seu e-mail <strong>{email}</strong> e clique no link de confirmação.<br />
            Você será levado automaticamente para a página de Entrada e Saída.
          </p>
          <Link to="/login" className="btn-secondary">Voltar para Login</Link>
        </div>
      </div>
    );
  }

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

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Senha:</label>
              <div className="password-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowConfirm(s => !s)}
                  aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login">Registrar</button>
          </form>

          <p className="register-text">
            Já possui conta? <Link to="/login">Entrar</Link>
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

export default Register;