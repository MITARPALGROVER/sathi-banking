import type { Locale } from "@/i18n/config";
import { VOICE_LOCALE_MAP } from "@/i18n/config";

/** Re-exported so callers can keep the old import name. */
export const LOCALE_TO_BCP47: Record<Locale, string> = VOICE_LOCALE_MAP;

export function speak(text: string, locale: Locale) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LOCALE_TO_BCP47[locale] ?? "en-IN";
    u.rate = 0.98;
    synth.speak(u);
  } catch {
    /* no-op */
  }
}

export function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult:
    | ((e: {
        results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
      }) => void)
    | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
}

/** Intents across supported Indian locales → route path. */
export const INTENTS: Array<{ match: RegExp; to: string }> = [
  {
    match:
      /(send\s*money|paisa?\s*bhej|पैसे?\s*भेज|ਪੈਸੇ?\s*ਭੇਜ|பணம்\s*அனுப்ப|টাকা\s*পাঠা|पैसे?\s*पाठव|પૈસા\s*મોકલ)/i,
    to: "/send/who",
  },
  {
    match: /(balance|बैलेंस|ਬੈਲੇਂਸ|இருப்பு|ব্যালেন্স|બેલેન્સ)/i,
    to: "/balance",
  },
  {
    match: /(help|madad|मदद|ਮਦਦ|உதவி|সাহায্য|મદદ)/i,
    to: "/help",
  },
  {
    match: /(bill|बिल|ਬਿੱਲ|கட்டணம்|বিল|બિલ)/i,
    to: "/bills",
  },
];

export function matchIntent(transcript: string): string | null {
  for (const { match, to } of INTENTS) if (match.test(transcript)) return to;
  return null;
}
