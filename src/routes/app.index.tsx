import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  QrCode,
  Receipt,
  Lightbulb,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useBank, formatINR, maskAccount } from "@/lib/bank-state";
import { spring } from "@/lib/motion";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Sathi — Home" }] }),
  component: AppHome,
});

function AppHome() {
  const { t } = useTranslation();
  const bank = useBank();
  const [revealAcct, setRevealAcct] = useState(false);
  const recent = bank.transactions.slice(0, 4);

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
            {t("home.greeting", { name: "" }).replace(/,\s*$/, "")}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            {bank.accountHolder.split(" ")[0]}
          </h1>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald/10 text-emerald font-display font-semibold">
          {bank.accountHolder[0]}
        </div>
      </header>

      {/* Signature glass balance card over an emerald gradient */}
      <div className="relative mt-6 overflow-hidden rounded-[28px] p-[1.5px] shadow-[0_12px_30px_-10px_rgba(22,52,43,0.3)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.42 0.14 165), oklch(0.26 0.09 175) 60%, oklch(0.50 0.16 155))",
          }}
        />
        <div className="relative rounded-[24px] bg-white/12 border border-white/20 p-6 text-white backdrop-blur-xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
            {t("home.balanceLabel")}
          </p>
          <motion.p
            key={bank.balance}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="mt-2 font-display text-4xl font-semibold tracking-tight"
          >
            {formatINR(bank.balance)}
          </motion.p>
          <div className="mt-6 flex flex-col items-start gap-2.5 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between text-xs text-white/80">
            <button
              type="button"
              onClick={() => setRevealAcct((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5"
              aria-label="Toggle account number"
            >
              {revealAcct ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span className="font-mono tracking-widest">
                {revealAcct ? bank.accountNumber : maskAccount(bank.accountNumber)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => void navigator.clipboard?.writeText(bank.upiId)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"
              aria-label="Copy UPI ID"
            >
              <Copy className="h-3.5 w-3.5" />
              {bank.upiId}
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <section className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
          {t("home.quickActions")}
        </p>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { to: "/app/send", label: t("common.send"), Icon: Send },
            { to: "/app/receive", label: t("common.receive"), Icon: QrCode },
            { to: "/app/bills", label: t("common.bills"), Icon: Lightbulb },
            { to: "/app/history", label: t("common.history"), Icon: Receipt },
          ].map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex min-h-[84px] sm:min-h-[92px] flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-2xl bg-secondary p-1.5 sm:p-3 text-center transition-colors hover:bg-secondary/70"
            >
              <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-emerald text-emerald-foreground">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.2} />
              </span>
              <span className="text-[11px] sm:text-[13px] font-medium text-foreground">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
            {t("balance.recent")}
          </p>
          <Link
            to="/app/history"
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald"
          >
            {t("common.seeAll")} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-foreground/8 rounded-2xl bg-secondary/60">
          {recent.map((t) => (
            <li key={t.id} className="flex items-center gap-4 px-4 py-3">
              <span
                className={
                  "grid h-10 w-10 place-items-center rounded-full " +
                  (t.kind === "credit" ? "bg-sage/15 text-sage" : "bg-brick/15 text-brick")
                }
              >
                {t.kind === "credit" ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.party}</p>
                <p className="text-xs text-foreground/55">
                  {new Date(t.ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                  {t.method.toUpperCase()}
                </p>
              </div>
              <p
                className={
                  "font-mono text-sm font-semibold " +
                  (t.kind === "credit" ? "text-sage" : "text-foreground")
                }
              >
                {t.kind === "credit" ? "+" : "−"}
                {formatINR(t.amount).replace("₹", "₹")}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
