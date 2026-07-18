import { useEffect, useRef, useState } from "react";
import { Mic, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import type { Locale } from "@/i18n/config";
import {
  LOCALE_TO_BCP47,
  getSpeechRecognitionCtor,
  speak,
  type SpeechRecognitionLike,
} from "@/lib/speech";
import { spring } from "@/lib/motion";
import { askAssistant, type AssistantAction } from "@/lib/assistant.functions";

type State = "idle" | "listening" | "thinking" | "spoke";

export function AssistantOverlay() {
  const { i18n } = useTranslation();
  const locale = ((i18n.language?.slice(0, 2) as Locale) ?? "en") as Locale;
  const navigate = useNavigate();

  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupported(!!getSpeechRecognitionCtor());
    return () => recRef.current?.abort();
  }, []);

  async function runAction(action: AssistantAction) {
    setReply(action.kind === "clarify" ? action.question : action.spoken);
    speak(action.kind === "clarify" ? action.question : action.spoken, locale);
    setState("spoke");

    switch (action.kind) {
      case "checkBalance":
        void navigate({ to: "/app" });
        break;
      case "showTransactions":
        void navigate({ to: "/app/history" });
        break;
      case "navigate":
        try {
          void navigate({ to: action.to });
        } catch {
          /* invalid */
        }
        break;
      case "prefillSend":
        try {
          sessionStorage.setItem(
            "sathi.prefill.send",
            JSON.stringify({ recipient: action.recipient, amount: action.amount ?? null }),
          );
        } catch {
          /* no-op */
        }
        void navigate({ to: "/app/send" });
        break;
      case "prefillBill":
        try {
          sessionStorage.setItem("sathi.prefill.bill", action.category);
        } catch {
          /* no-op */
        }
        void navigate({ to: "/app/bills" });
        break;
      case "explain":
      case "clarify":
        // Stay open; the reply text/speech is enough.
        break;
    }
  }

  function start() {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = LOCALE_TO_BCP47[locale];
    rec.interimResults = true;
    rec.continuous = false;
    setTranscript("");
    setReply("");
    setOpen(true);
    setState("listening");

    let finalText = "";
    rec.onresult = (e) => {
      let text = "";
      let done = false;
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        text += r[0].transcript;
        if (r.isFinal) done = true;
      }
      setTranscript(text);
      if (done) finalText = text;
    };
    rec.onerror = () => setState("idle");
    rec.onend = async () => {
      if (!finalText.trim()) {
        setState("idle");
        return;
      }
      setState("thinking");
      try {
        const action = await askAssistant({ data: { transcript: finalText, locale } });
        await runAction(action);
      } catch (err) {
        console.error(err);
        setReply("Sorry, I had trouble understanding. Please try again.");
        setState("spoke");
      }
    };
    recRef.current = rec;
    try {
      rec.start();
    } catch {
      setState("idle");
    }
  }

  function stop() {
    recRef.current?.stop();
  }

  function close() {
    stop();
    setOpen(false);
    setState("idle");
  }

  if (!supported) return null;

  return (
    <>
      <motion.button
        type="button"
        onClick={state === "listening" ? stop : start}
        aria-label={state === "listening" ? "Stop listening" : "Ask Sathi"}
        aria-pressed={state === "listening"}
        whileTap={{ scale: 0.94 }}
        transition={spring}
        className={
          "fixed bottom-24 right-5 z-40 grid h-16 w-16 place-items-center rounded-full bg-gold text-gold-foreground shadow-xl focus-visible:outline-none " +
          (state === "listening" ? "mic-pulse" : "")
        }
      >
        <Mic className="h-7 w-7" strokeWidth={2.4} aria-hidden="true" />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/40 px-4 pb-6"
            onClick={close}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={spring}
              className="w-full max-w-md rounded-3xl bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-live="polite"
            >
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
                  {state === "listening"
                    ? "Listening…"
                    : state === "thinking"
                      ? "Thinking…"
                      : state === "spoke"
                        ? "Sathi"
                        : "Ready"}
                </p>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="rounded-full p-1 hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 min-h-[3rem] font-display text-xl leading-snug text-foreground">
                {transcript ||
                  (state === "listening" ? "Speak now — Hindi, English, Hinglish…" : "")}
              </p>
              {reply ? (
                <p className="mt-3 rounded-2xl bg-emerald/8 p-4 text-[15px] leading-relaxed text-emerald">
                  {reply}
                </p>
              ) : null}
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={state === "listening" ? stop : start}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald px-5 py-3 text-sm font-medium text-emerald-foreground"
                >
                  <Mic className="h-4 w-4" />
                  {state === "listening" ? "Stop" : "Speak again"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-foreground/15 px-5 py-3 text-sm font-medium text-foreground/70"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
