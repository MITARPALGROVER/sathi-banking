import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import "@/i18n/config";
import { CONTACTS } from "@/lib/mock";
import { speak } from "@/lib/speech";
import { spring } from "@/lib/motion";
import type { Locale } from "@/i18n/config";

type Search = { to?: string; amount?: number };

export const Route = createFileRoute("/send/success")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    to: typeof s.to === "string" ? s.to : undefined,
    amount: typeof s.amount === "number" ? s.amount : Number(s.amount) || undefined,
  }),
  head: () => ({ meta: [{ title: "Sent!" }] }),
  component: Success,
});

function Success() {
  const { t, i18n } = useTranslation();
  const { to, amount } = Route.useSearch();
  const contact = CONTACTS.find((c) => c.id === to);
  const name = contact?.name ?? (to?.startsWith("phone:") ? to.slice(6) : "");
  const locale = ((i18n.language?.slice(0, 2) as Locale) ?? "en") as Locale;
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!amount || !name) return;
    speak(t("success.speak", { amount, name }), locale);
    return () => window.speechSynthesis?.cancel();
  }, [amount, name, locale, t]);

  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.span
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring}
        className="confirm-ripple relative grid h-32 w-32 place-items-center rounded-full bg-sage text-white"
        aria-hidden="true"
      >
        <Check className="h-16 w-16" strokeWidth={3} />
      </motion.span>
      <h1 className="mt-8 max-w-md font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t("success.title", { amount, name })}
      </h1>
      <Link
        to="/home"
        className="mt-10 rounded-2xl bg-emerald px-8 py-5 font-display text-lg font-semibold text-emerald-foreground"
      >
        {t("success.backHome")}
      </Link>
    </main>
  );
}
