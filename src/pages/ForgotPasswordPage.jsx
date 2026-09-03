import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../utils/api";
import { applyDarkThemeOnly } from "../utils/theme";
import "./LoginPage.css";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {

  applyDarkThemeOnly();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (trimmedEmail === "") {
      setStatus({ message: "Digite um email.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const { response } = await forgotPassword(trimmedEmail);

      if (response.ok) {
        setStatus({
          message: "Se o email existir, enviamos um link. Redirecionando...",
          type: "success",
        });
        setTimeout(() => navigate("/reset-password"), 2000);
      } else {
        setStatus({
          message:
            "Não foi possível processar sua solicitação. Tente novamente.",
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
        <div className="request-email">
          <input
            type="email"
            placeholder="Email"
            className="user-field"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <button
          className="forgot-submit-button active"
          type="submit"
          disabled={loading}
        >
          {loading ? "Enviando..." : "ENVIAR"}
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
    </main>
  );
}
