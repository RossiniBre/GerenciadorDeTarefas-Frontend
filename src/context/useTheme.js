import { createContext, useContext } from "react";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "lightMode";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return ctx;
}

export function clearCachedTheme() {
  localStorage.removeItem(STORAGE_KEY);
}