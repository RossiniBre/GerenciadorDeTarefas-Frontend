import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import "./SuccessToast.css";
import { userRegister } from "../utils/api";
import { applyDarkThemeOnly } from "../utils/theme";

function RegisterPage() {

  applyDarkThemeOnly();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });

  const [isVisible, setIsVisible] = useState(false);

  const [submitError, setSubmitError] = useState("");
  const isUsernameError = submitError.toLowerCase().includes("usuário");
  const isEmailError = submitError.toLowerCase().includes("email");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "email" || name === "username") {
      setSubmitError("");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const fieldsFilled =
    formData.email.trim() !== "" &&
    formData.username.trim() !== "" &&
    formData.displayName.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.confirmPassword.trim() !== "";
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = fieldsFilled && passwordsMatch && isEmailValid;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      const { response, data } = await userRegister({
        username: formData.username.trim(),
        email: formData.email.trim(),
        displayName: formData.displayName.trim(),
        password: formData.password,
      });

      if (response.status === 201) {
        console.log("Cadastro bem-sucedido!", data);

      if (response.status === 201) {
            setShowSuccessToast(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
      }

      } else if (response.status === 409) {
        setSubmitError(data.error || "Esse usuário já existe.");
      } else {
        setSubmitError("Não foi possível criar a conta. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      setSubmitError("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <main className={`container ${isVisible ? "visible" : ""}`}>
      <header className="header-logo">
        <h1 className="title">TaskNexus</h1>
      </header>

      <form className="form-login" id="registerForm" onSubmit={handleSubmit}>
        <div className="login-fields">
          <div className="input-wrapper">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="email-field"
              value={formData.email}
              onChange={handleChange}
            />
            {formData.email.trim() !== "" && !isEmailValid && (
              <span
                className="warning-icon"
                data-tooltip="Por favor, digite um email válido (ex: nome@email.com)."
              >
                {"\u26A0\uFE0E"}
              </span>
            )}
            {isEmailError && (
              <span className="warning-icon" data-tooltip={submitError}>
                {"\u26A0\uFE0E"}
              </span>
            )}
          </div>

          <div className="password-row">
            <div className="input-wrapper">
                <input
                type="text"
                name="username"
                placeholder="Nome de usuário"
                className="user-field"
                value={formData.username}
                onChange={handleChange}
                />
                {isUsernameError && (
                <span className="warning-icon" data-tooltip={submitError}>
                    {"\u26A0\uFE0E"}
                </span>
                )}
            </div>

            <div className="input-wrapper">
                <input
                type="text"
                name="displayName"
                placeholder="Nome de exibição"
                className="display-name-field"
                value={formData.displayName}
                onChange={handleChange}
                />
            </div>
            </div>

          <div className="password-row">
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Senha"
                className="password-field"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <svg
                    className="icon-eye-open"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="icon-eye-closed"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar senha"
                className="confirm-password-field"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    className="icon-eye-open"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="icon-eye-closed"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
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
          </div>
        </div>

        <div className="register-recuperation">
          <div className="links-account">
            <Link to="/login" className="link-login">
              Já possuo uma conta
            </Link>
          </div>

          <button
            className={`login-button ${isFormValid ? "active" : ""}`}
            type="submit"
            disabled={!isFormValid}
          >
            CRIAR CONTA
          </button>
        </div>
      </form>
        {showSuccessToast && (
        <div className="success-overlay">
            <div className="success-modal">
            <div className="success-icon">✓</div>
            <h2>Conta criada com sucesso!</h2>
            <p>Redirecionando para o login...</p>
            </div>
        </div>
        )}
    </main>
  );
}

export default RegisterPage;