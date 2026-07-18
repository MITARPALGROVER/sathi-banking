import { useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "sathi.theme";

export function applyTheme() {
  if (typeof window === "undefined") return;
  const stored = window.localStorage.getItem(KEY) as Theme | null;
  const theme: Theme = stored === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as Theme | null;
    setThemeState(stored === "dark" ? "dark" : "light");
  }, []);
  const setTheme = (t: Theme) => {
    setThemeState(t);
    window.localStorage.setItem(KEY, t);
    document.documentElement.setAttribute("data-theme", t);
  };
  return [theme, setTheme] as const;
}
