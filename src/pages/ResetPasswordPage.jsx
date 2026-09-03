import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../utils/api";
import { applyDarkThemeOnly } from "../utils/theme";
import "./LoginPage.css";
import "./ResetPasswordPage.css";
import "./SuccessToast.css";

function EyeOpenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="20"
      height="20"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="20"
      height="20"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A11 11 0 0 1 12 5c7 0 11 8 11 8a18.5 18.5 0 0 1-2.34 3.5" />
      <path d="M6.61 6.61A18.5 18.5 0 0 0 1 13s4 8 11 8a10.6 10.6 0 0 0 5.39-1.61" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

export default function ResetPasswordPage() {

  applyDarkThemeOnly();
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const fieldsFilled =
    newPassword.trim() !== "" && confirmPassword.trim() !== "";
  const passwordsMatch = newPassword === confirmPassword;

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedToken = token.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedToken === "") {
      setStatus({
        message: "Cole o código de recuperação recebido por email.",
        type: "error",
      });
      return;
    }

    if (trimmedNewPassword === "" || trimmedConfirmPassword === "") {
      setStatus({
        message: "Preencha a nova senha e a confirmação.",
        type: "error",
      });
      return;
    }

    if (trimmedNewPassword !== trimmedConfirmPassword) {
      setStatus({ message: "As senhas não coincidem.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const { response } = await resetPassword(
        trimmedToken,
        trimmedNewPassword,
      );

      if (response.ok) {
        setShowSuccessToast(true);
        setTimeout(() => navigate("/login"), 3000);
      } else if (response.status === 400) {
        setStatus({
          message:
            "Código inválido, expirado ou já utilizado. Solicite um novo link de recuperação.",
          type: "error",
        });
      } else {
        setStatus({
          message: "Não foi possível redefinir sua senha. Tente novamente.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setStatus({
        message:
          "Erro de conexão com o servidor. Verifique sua internet e tente novamente.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`container page-transition ${visible ? "visible" : ""}`}>
      <header className="header-logo">
        <h1 className="title">TaskNexus</h1>
      </header>

      <form className="form-login" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Código de recuperação"
            className="user-field"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
        </div>

        <div className="password-wrapper">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Nova senha"
            className="password-field"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            aria-label={showNewPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShowNewPassword((prev) => !prev)}
          >
            {showNewPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>
        </div>

        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme a nova senha"
            className="password-field"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>
          {fieldsFilled && !passwordsMatch && (
            <span
              className="warning-icon"
              data-tooltip="As senhas não coincidem."
            >
              {"\u26A0\uFE0E"}
            </span>
          )}
        </div>

        <button
          className="login-button active"
          type="submit"
          disabled={loading}
        >
          {loading ? "Redefinindo..." : "REDEFINIR SENHA"}
        </button>

        {status.message && (
          <div
            id="status-message"
            className={
              status.type === "error" ? "status-error" : "status-success"
            }
          >
            {status.message}
          </div>
        )}

        <Link to="/login" className="back-to-login">
          Voltar
        </Link>
      </form>

      {showSuccessToast && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>
            <h2>Senha redefinida com sucesso!</h2>
            <p>Redirecionando para o login...</p>
          </div>
        </div>
      )}
    </main>
  );
}
