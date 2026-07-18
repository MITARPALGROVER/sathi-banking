import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import "@/i18n/config";
import { BackButton } from "@/components/sathi/BackButton";
import { MicButton } from "@/components/sathi/MicButton";
import { PageTransition } from "@/components/sathi/PageTransition";
import { BALANCE, RECENT_TXNS, formatMoney } from "@/lib/mock";

export const Route = createFileRoute("/balance")({
  head: () => ({ meta: [{ title: "Balance — Sathi" }] }),
  component: Balance,
});

function Balance() {
  const { t } = useTranslation();
  return (
    <PageTransition>
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pb-40 pt-8">
        <BackButton to="/app" />

        <section className="mt-10 rounded-3xl bg-emerald p-8 text-emerald-foreground shadow-[0_20px_50px_-24px_rgba(15,61,50,0.5)]">
          <p className="font-display text-base opacity-80">{t("balance.label")}</p>
          <p className="mt-2 font-display text-5xl font-bold tracking-tight sm:text-6xl">
            {formatMoney(BALANCE)}
          </p>
        </section>

        <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
          {t("balance.recent")}
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {RECENT_TXNS.map((tx) => {
            const isCredit = tx.kind === "credit";
            return (
              <li
                key={tx.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-panel p-4"
              >
                <span
                  aria-hidden="true"
                  className={
                    "grid h-12 w-12 shrink-0 place-items-center rounded-2xl " +
                    (isCredit ? "bg-sage/20 text-sage" : "bg-brick/15 text-brick")
                  }
                >
                  {isCredit ? (
                    <ArrowDownLeft className="h-6 w-6" />
                  ) : (
                    <ArrowUpRight className="h-6 w-6" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-medium text-foreground">
                    {tx.who}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isCredit ? t("balance.credit") : t("balance.debit")} · {tx.date}
                  </p>
                </div>
                <p
                  className={
                    "shrink-0 font-display text-lg font-semibold " +
                    (isCredit ? "text-sage" : "text-brick")
                  }
                >
                  {isCredit ? "+" : "−"}${tx.amount}
                </p>
              </li>
            );
          })}
        </ul>

        <MicButton />
      </main>
    </PageTransition>
  );
}
