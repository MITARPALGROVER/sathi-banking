import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Snowflake, Sun, Eye, EyeOff } from "lucide-react";

import { useBank, bank as bankApi, formatINR, maskCard } from "@/lib/bank-state";
import { spring } from "@/lib/motion";

export const Route = createFileRoute("/app/cards")({
  head: () => ({ meta: [{ title: "Cards — Sathi" }] }),
  component: Cards,
});

function Cards() {
  const { t } = useTranslation();
  const bank = useBank();
  const [reveal, setReveal] = useState(false);
  const card = bank.card;

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">{t("cards.title")}</h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={spring}
        className={
          "relative mt-6 aspect-[1.6/1] w-full max-w-md overflow-hidden rounded-3xl p-5 sm:p-6 text-white shadow-2xl " +
          (card.frozen ? "grayscale" : "")
        }
        style={{
          background: "linear-gradient(135deg, oklch(0.30 0.045 168), oklch(0.20 0.03 168))",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-base sm:text-lg font-semibold">Sathi Bank</span>
          <span className="rounded-full bg-gold/90 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald">
            {card.brand}
          </span>
        </div>
        <p className="mt-6 sm:mt-10 font-mono text-[14px] min-[360px]:text-[17px] min-[400px]:text-xl tracking-[0.10em] min-[360px]:tracking-[0.18em] min-[400px]:tracking-[0.24em] whitespace-nowrap">
          {reveal ? card.fullNumber : maskCard(card.fullNumber)}
        </p>
        <div className="mt-4 sm:mt-6 flex items-end justify-between text-[10px] sm:text-xs uppercase tracking-widest opacity-90">
          <div>
            <p className="opacity-60">{t("cards.holder")}</p>
            <p className="mt-1 text-sm">{card.holder}</p>
          </div>
          <div className="text-right">
            <p className="opacity-60">{t("cards.expiry")}</p>
            <p className="mt-1 text-sm">{card.expiry}</p>
          </div>
        </div>
        {card.frozen ? (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
            {t("cards.frozen")}
          </span>
        ) : null}
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setReveal((r) => !r)}
          className="flex min-h-[68px] items-center justify-center gap-2 rounded-2xl bg-secondary text-sm font-medium"
        >
          {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {reveal ? t("cards.hideNumber") : t("cards.showNumber")}
        </button>
        <button
          type="button"
          onClick={() => bankApi.toggleFreeze()}
          className={
            "flex min-h-[68px] items-center justify-center gap-2 rounded-2xl text-sm font-medium " +
            (card.frozen ? "bg-sage text-white" : "bg-brick text-white")
          }
        >
          {card.frozen ? <Sun className="h-4 w-4" /> : <Snowflake className="h-4 w-4" />}
          {card.frozen ? t("cards.unfreeze") : t("cards.freeze")}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-foreground/10 p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
          {t("cards.dailyLimit")}
        </p>
        <p className="mt-2 font-display text-2xl font-semibold">{formatINR(card.dailyLimit)}</p>
        <p className="mt-1 text-xs text-foreground/55">{t("cards.adjustLimit")}</p>
      </div>
    </main>
  );
}
