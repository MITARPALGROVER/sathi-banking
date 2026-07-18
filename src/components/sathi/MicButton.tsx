import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { getActiveLocale, type Locale } from "@/i18n/config";
import {
  LOCALE_TO_BCP47,
  getSpeechRecognitionCtor,
  matchIntent,
  type SpeechRecognitionLike,
} from "@/lib/speech";
import { spring } from "@/lib/motion";

export function MicButton() {
  const { t, i18n } = useTranslation();
  const locale = getActiveLocale(i18n.language);
  const navigate = useNavigate();

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupported(!!getSpeechRecognitionCtor());
    return () => recRef.current?.abort();
  }, []);

  if (!supported) return null;

  const start = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = LOCALE_TO_BCP47[locale];
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => {
      let text = "";
      let final = false;
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        text += r[0].transcript;
        if (r.isFinal) final = true;
      }
      setTranscript(text);
      if (final) {
        const to = matchIntent(text);
        if (to) navigate({ to });
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setTranscript("");
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const stop = () => recRef.current?.stop();

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-8">
        <motion.button
          type="button"
          onClick={listening ? stop : start}
          aria-pressed={listening}
          aria-label={listening ? t("home.listening") : t("home.tapToSpeak")}
          whileTap={{ scale: 0.94 }}
          transition={spring}
          className={
            "mic-pulse pointer-events-auto grid h-20 w-20 place-items-center rounded-full bg-gold text-gold-foreground focus-visible:outline-none"
          }
        >
          <Mic className="h-8 w-8" strokeWidth={2.4} aria-hidden="true" />
        </motion.button>
      </div>
      {listening ? (
        <div className="fixed inset-x-0 bottom-32 z-40 flex justify-center px-4" aria-live="polite">
          <div className="max-w-md rounded-2xl bg-foreground/90 px-5 py-3 text-center text-background shadow-lg">
            <p className="text-xs uppercase tracking-wide opacity-70">{t("home.listening")}</p>
            <p className="mt-1 font-display text-lg">{transcript || t("voice.hint")}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
