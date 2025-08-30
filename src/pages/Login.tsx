import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cashifyLogo from '../assets/Cashify_logo.png';
import '../styles/login.css';
import { supabase } from '../utils/supabaseClient';

function traduzErroSupabase(message: string): string {
  if (!message) return 'Ocorreu um erro. Tente novamente.';

  // throttle / segurança
  const secMatch = message.match(/only request this after (\d+) seconds?/i);
  if (secMatch) {
    const s = secMatch[1];
    return `Por segurança, você só pode solicitar isso novamente em ${s} segundo${Number(s) === 1 ? '' : 's'}.`;
  }

  // alguns casos frequentes
  const table: Array<[RegExp, string]> = [
    [/Invalid login credentials/i, 'E-mail ou senha inválidos.'],
    [/Email not confirmed/i, 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.'],
    [/User already registered/i, 'Já existe uma conta cadastrada com este e-mail.'],
    [/rate limit/i, 'Muitas tentativas. Tente novamente mais tarde.'],
    [/Reset token/i, 'Token de redefinição inválido ou expirado. Solicite um novo e-mail.'],
    [/User not found/i, 'Usuário não encontrado. Verifique o e-mail informado.'],
  ];

  for (const [re, pt] of table) {
    if (re.test(message)) return pt;
  }
  return message; // fallback
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(traduzErroSupabase(error.message));
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

  const handlePasswordReset = async () => {
    setError('');
    setMessage('');

    if (!email) {
      setError('Digite seu e-mail para recuperar a senha.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) {
      setError(traduzErroSupabase(error.message));
    } else {
      setMessage('Enviamos um link de recuperação para seu e-mail!');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-content form-card">
          <img src={cashifyLogo} alt="Cashify Logo" className="login-logo" />
          <h2>Entrar no Cashify</h2>

          {/* Mensagens (apenas uma vez) */}
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success">{message}</p>}

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

            {/* Texto de recuperação de senha */}
            <p className="forgot-text">
              <span onClick={handlePasswordReset}>Esqueceu sua senha?</span>
            </p>

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