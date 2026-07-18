import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Snowflake, Sun, Eye, EyeOff } from "lucide-react";

import { useBank, bank as bankApi, formatINR, maskCard } from "@/lib/bank-state";
import { spring } from "@/lib/motion";

export const Route = createFileRoute("/app/cards")({
  head: () => ({ meta: [{ title: "Cards — Sathi" }] }),
  component: Cards,
});

function Cards() {
  const bank = useBank();
  const [reveal, setReveal] = useState(false);
  const card = bank.card;

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Cards</h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={spring}
        className={"relative mt-6 aspect-[1.6/1] w-full max-w-md overflow-hidden rounded-3xl p-6 text-white shadow-2xl " + (card.frozen ? "grayscale" : "")}
        style={{ background: "linear-gradient(135deg, oklch(0.30 0.045 168), oklch(0.20 0.03 168))" }}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold">Sathi Bank</span>
          <span className="rounded-full bg-gold/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald">
            {card.brand}
          </span>
        </div>
        <p className="mt-10 font-mono text-xl tracking-[0.24em]">
          {reveal ? card.fullNumber : maskCard(card.fullNumber)}
        </p>
        <div className="mt-6 flex items-end justify-between text-xs uppercase tracking-widest opacity-90">
          <div>
            <p className="opacity-60">Holder</p>
            <p className="mt-1 text-sm">{card.holder}</p>
          </div>
          <div className="text-right">
            <p className="opacity-60">Expiry</p>
            <p className="mt-1 text-sm">{card.expiry}</p>
          </div>
        </div>
        {card.frozen ? (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
            Frozen
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
          {reveal ? "Hide number" : "Show number"}
        </button>
        <button
          type="button"
          onClick={() => bankApi.toggleFreeze()}
          className={"flex min-h-[68px] items-center justify-center gap-2 rounded-2xl text-sm font-medium " + (card.frozen ? "bg-sage text-white" : "bg-brick text-white")}
        >
          {card.frozen ? <Sun className="h-4 w-4" /> : <Snowflake className="h-4 w-4" />}
          {card.frozen ? "Unfreeze card" : "Freeze card"}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-foreground/10 p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">Daily limit</p>
        <p className="mt-2 font-display text-2xl font-semibold">{formatINR(card.dailyLimit)}</p>
        <p className="mt-1 text-xs text-foreground/55">Adjust in Profile → Card settings.</p>
      </div>
    </main>
  );
}
