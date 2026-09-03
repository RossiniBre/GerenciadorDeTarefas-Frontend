import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { applyDarkThemeOnly } from "../utils/theme";
import { login as loginRequest } from "../utils/authApi";
import "./LoginPage.css";

export default function LoginPage() {

  applyDarkThemeOnly();
  
  const navigate = useNavigate();
  const { login, checkingSession, isAuthenticated } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  const fieldsFilled = identifier.trim() !== "" && password.trim() !== "";

  useEffect(() => {
    if (!checkingSession && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [checkingSession, isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!fieldsFilled) return;

    const { response, data } = await loginRequest(identifier.trim(), password);

    if (response.ok) {
      login(data.token, data.username);
      setTransitioning(true);
      setTimeout(() => navigate("/"), 300);
    } else {
      setError("Usuário ou senha inválidos");
    }
  }

  function handleFieldChange(setter) {
    return (event) => {
      setter(event.target.value);
      setError("");
    };
  }

  return (
    <main className={`container visible ${transitioning ? "page-transition" : ""}`}>
      <header className="header-logo">
        <h1 className="title">TaskNexus</h1>
      </header>

      {checkingSession ? (
        <div className="loading-container">
          <p className="loading-message">Carregando</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : (
        <form className="form-login" onSubmit={handleSubmit}>
          <div className="login-fields">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Nome de usuário ou email"
                className="user-field"
                value={identifier}
                onChange={handleFieldChange(setIdentifier)}
              />
              {error && (
                <span className="warning-icon" data-tooltip={error}>
                  {"\u26A0\uFE0E"}
                </span>
              )}
            </div>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="password-field"
                value={password}
                onChange={handleFieldChange(setPassword)}
              />
              <button
                type="button"
                className="toggle-password"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A11 11 0 0 1 12 5c7 0 11 8 11 8a18.5 18.5 0 0 1-2.34 3.5" />
                    <path d="M6.61 6.61A18.5 18.5 0 0 0 1 13s4 8 11 8a10.6 10.6 0 0 0 5.39-1.61" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              {error && (
                <span className="warning-icon" data-tooltip={error}>
                  {"\u26A0\uFE0E"}
                </span>
              )}
            </div>
          </div>

          <div className="register-recuperation">
            <div className="links-account">
              <a href="/forgot-password" className="recover-password" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}>
                Esqueci minha senha
              </a>
              <a href="/register" className="link-register" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>
                Criar conta
              </a>
            </div>

            <button className={`login-button ${fieldsFilled ? "active" : ""}`} type="submit" disabled={!fieldsFilled}>
              ENTRAR
            </button>
          </div>
        </form>
      )}
    </main>
  );
}