import { useState, useEffect } from "react";
import { getStoredTheme, applyTheme } from "../utils/theme";
import "./Header.css";

export default function Header({ userName = "Usuário", onCreateTask }) {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function handleToggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <header id="home-greeting">
      <h1>Bem-vindo de volta, <span id="user-name">{userName}</span>!</h1>

      <div className="header-actions">
        <button id="create-task" type="button" onClick={onCreateTask}>
          Criar Tarefa
        </button>

        <button
          id="theme-toggle"
          type="button"
          aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
          onClick={handleToggleTheme}
        >
          {theme === "light" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}