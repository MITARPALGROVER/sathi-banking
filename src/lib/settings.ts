import { useEffect, useState } from "react";

const FONT_KEY = "sathi.fontScale";

export function applySettings() {
  if (typeof window === "undefined") return;
  const scale = Number(window.localStorage.getItem(FONT_KEY) ?? "1");
  document.documentElement.style.fontSize = `${16 * scale}px`;
}

export function useFontScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const v = Number(window.localStorage.getItem(FONT_KEY) ?? "1");
    setScale(v);
  }, []);
  const update = (v: number) => {
    const clamped = Math.min(1.4, Math.max(0.85, v));
    setScale(clamped);
    window.localStorage.setItem(FONT_KEY, String(clamped));
    applySettings();
  };
  return [scale, update] as const;
}
