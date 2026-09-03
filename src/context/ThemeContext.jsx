import { useEffect, useState, useCallback } from "react";
import { ThemeContext } from "./useTheme";

const STORAGE_KEY = "lightMode";

function readCachedLightMode() {
  const cached = localStorage.getItem(STORAGE_KEY);
  return cached === "true";
}

function applyThemeToDocument(lightMode) {
  document.documentElement.dataset.theme = lightMode ? "light" : "dark";
}

export function ThemeProvider({ children }) {
  const [lightMode, setLightModeState] = useState(readCachedLightMode);

  useEffect(() => {
    applyThemeToDocument(lightMode);
  }, [lightMode]);

  const setLightMode = useCallback((value) => {
    setLightModeState(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  const toggleLightMode = useCallback(() => {
    setLightMode(!lightMode);
  }, [lightMode, setLightMode]);

  return (
    <ThemeContext.Provider value={{ lightMode, setLightMode, toggleLightMode }}>
      {children}
    </ThemeContext.Provider>
  );
}