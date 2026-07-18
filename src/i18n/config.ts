import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import hinglish from "./locales/hinglish.json";

/** India-scoped: 5 real languages + Hinglish (script variant, voice → hi-IN). */
export const SUPPORTED_LOCALES = [
  "en",
  "hi",
  "hinglish",
  "pa",
  "bn",
  "ta",
] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  hinglish: "Hinglish",
  pa: "ਪੰਜਾਬੀ",
  bn: "বাংলা",
  ta: "தமிழ்",
};

/**
 * voiceLocaleMap — Web Speech API doesn't ship a Hinglish voice,
 * so Hinglish falls back to hi-IN under the hood.
 */
export const VOICE_LOCALE_MAP: Record<Locale, string> = {
  en: "en-IN",
  hi: "hi-IN",
  hinglish: "hi-IN",
  pa: "pa-IN",
  bn: "bn-IN",
  ta: "ta-IN",
};

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      hinglish: { translation: hinglish },
      // Regional locales fall back to English until translations land.
      pa: { translation: en },
      bn: { translation: en },
      ta: { translation: en },
    },
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES as unknown as string[],
    interpolation: { escapeValue: false },
    initImmediate: false,
    react: { useSuspense: false },
  } as Parameters<typeof i18n.init>[0]);
}

export function syncClientLocale() {
  if (typeof window === "undefined") return;
  const stored = window.localStorage.getItem("sathi.locale") as Locale | null;
  const browser = window.navigator.language.slice(0, 2) as Locale;
  const next =
    stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)
      ? stored
      : (SUPPORTED_LOCALES as readonly string[]).includes(browser)
        ? browser
        : DEFAULT_LOCALE;
  if (i18n.language !== next) void i18n.changeLanguage(next);
  document.documentElement.lang = next === "hinglish" ? "en" : next;
}

export function setLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("sathi.locale", locale);
    document.documentElement.lang = locale === "hinglish" ? "en" : locale;
  }
  void i18n.changeLanguage(locale);
}

export default i18n;
