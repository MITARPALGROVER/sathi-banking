import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Delete } from "lucide-react";
import { motion } from "framer-motion";

import "@/i18n/config";
import { BackButton } from "@/components/sathi/BackButton";
import { ProgressDots } from "@/components/sathi/ProgressDots";
import { PageTransition } from "@/components/sathi/PageTransition";
import { CONTACTS } from "@/lib/mock";
import { spring } from "@/lib/motion";

type Search = { to?: string };

export const Route = createFileRoute("/send/amount")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    to: typeof s.to === "string" ? s.to : undefined,
  }),
  head: () => ({ meta: [{ title: "Send money — Amount" }] }),
  component: SendAmount,
});

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"] as const;
const QUICK = [20, 50, 100];

function SendAmount() {
  const { t } = useTranslation();
  const { to } = Route.useSearch();
  const contact = CONTACTS.find((c) => c.id === to);
  const label = contact?.name ?? (to?.startsWith("phone:") ? to.slice(6) : "");

  const [amount, setAmount] = useState("");

  const press = (k: (typeof KEYS)[number]) => {
    setAmount((prev) => {
      if (k === "back") return prev.slice(0, -1);
      if (k === "." && prev.includes(".")) return prev;
      if (prev.length >= 7) return prev;
      if (prev === "0" && k !== ".") return k;
      return prev + k;
    });
  };

  const num = Number(amount || "0");
  const canProceed = num > 0;

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-8">
        <div className="flex items-center justify-between">
          <BackButton to="/send/who" />
          <ProgressDots step={2} />
          <span className="w-24" aria-hidden="true" />
        </div>

        <p className="mt-8 text-center text-base text-muted-foreground">
          {t("send.step2")} <span className="font-semibold text-foreground">{label}</span>
        </p>

        <div
          className="mt-4 text-center font-display font-bold tracking-tight"
          aria-live="polite"
          aria-label={`${t("send.amountLabel")} ${num}`}
        >
          <span className="text-4xl text-emerald">$</span>
          <span className="ml-1 text-6xl sm:text-7xl text-foreground">{amount || "0"}</span>
        </div>

        <div
          className="mt-6 flex justify-center gap-3"
          role="group"
          aria-label={t("send.quickAmount")}
        >
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount(String(q))}
              className="rounded-2xl border-2 border-border bg-panel px-5 py-3 font-display text-lg font-medium text-foreground hover:border-emerald"
            >
              ${q}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {KEYS.map((k) => (
            <motion.button
              key={k}
              type="button"
              onClick={() => press(k)}
              aria-label={k === "back" ? "Delete" : k}
              whileTap={{ scale: 0.94 }}
              transition={spring}
              className="grid h-16 min-h-16 place-items-center rounded-2xl bg-secondary font-display text-2xl font-semibold text-foreground hover:bg-secondary/70"
            >
              {k === "back" ? <Delete className="h-6 w-6" aria-hidden="true" /> : k}
            </motion.button>
          ))}
        </div>

        <Link
          to="/send/confirm"
          search={{ to, amount: canProceed ? num : undefined }}
          aria-disabled={!canProceed}
          className={
            "mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-5 font-display text-lg font-semibold transition-colors " +
            (canProceed
              ? "bg-gold text-gold-foreground"
              : "pointer-events-none bg-secondary text-muted-foreground/60")
          }
        >
          {t("send.confirmSend")}
        </Link>
      </main>
    </PageTransition>
  );
}
