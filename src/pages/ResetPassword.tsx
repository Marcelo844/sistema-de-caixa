import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "../styles/login.css";

function traduzErroSupabase(message: string): string {
  if (!message) return 'Ocorreu um erro. Tente novamente.';
  const secMatch = message.match(/only request this after (\d+) seconds?/i);
  if (secMatch) {
    const s = secMatch[1];
    return `Por segurança, você só pode solicitar isso novamente em ${s} segundo${Number(s) === 1 ? '' : 's'}.`;
  }
  const table: Array<[RegExp, string]> = [
    [/Reset token/i, 'Token de redefinição inválido ou expirado. Solicite um novo e-mail.'],
    [/rate limit/i, 'Muitas tentativas. Tente novamente mais tarde.'],
  ];
  for (const [re, pt] of table) if (re.test(message)) return pt;
  return message;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setReady(true);

      const { data: sub } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") setReady(true);
      });
      unsub = () => sub.subscription.unsubscribe();
    };
    init();
    return () => { if (unsub) unsub(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (!password || password.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(traduzErroSupabase(error.message));
      return;
    }

    setMessage("Senha redefinida com sucesso! Você já pode fazer login.");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="login-container">
      <div className="reset-card form-card">
        <h2 className="page-title">Redefinir senha</h2>

        {!ready && (
          <div className="helper-text">
            <p>Preparando sua recuperação de senha…</p>
            <p className="muted">
              Se não abriu pelo link do e-mail, volte ao <Link to="/login">login</Link> e clique em <em>Esqueceu a senha?</em>.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="password-wrapper">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPwd(v => !v)}
              aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
              title={showPwd ? "Ocultar senha" : "Mostrar senha"}
            >
              <i className={showPwd ? "bi bi-eye-slash" : "bi bi-eye"} />
            </button>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar nova senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="input"
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
              title={showConfirm ? "Ocultar senha" : "Mostrar senha"}
            >
              <i className={showConfirm ? "bi bi-eye-slash" : "bi bi-eye"} />
            </button>
          </div>

          <button type="submit" className="btn-primary" disabled={!ready}>
            {ready ? "Salvar nova senha" : "Aguardando sessão…"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success">{message}</p>}

        <p className="register-text">
          Lembrou a senha? <Link to="/login">Voltar ao login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
