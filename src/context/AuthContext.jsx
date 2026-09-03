import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContextInstance";
import { fetchMe } from "../utils/authApi";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));
  const [displayName, setDisplayName] = useState(() => localStorage.getItem("displayName"));
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((newToken, newUsername, newDisplayName) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    localStorage.setItem("displayName", newDisplayName);
    setToken(newToken);
    setUsername(newUsername);
    setDisplayName(newDisplayName);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("displayName");
    setToken(null);
    setUsername(null);
    setDisplayName(null);
    setIsAuthenticated(false);
  }, []);

  const checkSession = useCallback(async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setIsAuthenticated(false);
      setCheckingSession(false);
      return false;
    }

    try {
      const response = await fetchMe(storedToken);

      if (response.ok) {
        const data = await response.json();
        setDisplayName(data.displayName);
        localStorage.setItem("displayName", data.displayName);
        setIsAuthenticated(true);
        return true;
      }

      if (response.status === 401) {
        logout();
      }

      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setCheckingSession(false);
    }
  }, [logout]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkSession();
  }, [checkSession]);

  return (
    <AuthContext.Provider
      value={{ token, username, displayName, isAuthenticated, checkingSession, login, logout, checkSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}