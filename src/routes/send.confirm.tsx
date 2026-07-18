import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";

import "@/i18n/config";
import { BackButton } from "@/components/sathi/BackButton";
import { ProgressDots } from "@/components/sathi/ProgressDots";
import { Avatar } from "@/components/sathi/Avatar";
import { PageTransition } from "@/components/sathi/PageTransition";
import { CONTACTS } from "@/lib/mock";
import { speak } from "@/lib/speech";
import type { Locale } from "@/i18n/config";

type Search = { to?: string; amount?: number };

export const Route = createFileRoute("/send/confirm")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    to: typeof s.to === "string" ? s.to : undefined,
    amount: typeof s.amount === "number" ? s.amount : Number(s.amount) || undefined,
  }),
  head: () => ({ meta: [{ title: "Send money — Confirm" }] }),
  component: SendConfirm,
});

function SendConfirm() {
  const { t, i18n } = useTranslation();
  const { to, amount } = Route.useSearch();
  const navigate = useNavigate();
  const contact = CONTACTS.find((c) => c.id === to);
  const name = contact?.name ?? (to?.startsWith("phone:") ? to.slice(6) : "");
  const locale = ((i18n.language?.slice(0, 2) as Locale) ?? "en") as Locale;

  useEffect(() => {
    if (!amount || !name) return;
    speak(t("send.speak", { amount, name }), locale);
    return () => window.speechSynthesis?.cancel();
  }, [amount, name, locale, t]);

  if (!amount || !name) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-muted-foreground">Missing details.</p>
        <Link
          to="/send/who"
          className="mt-4 rounded-2xl bg-emerald px-6 py-3 text-emerald-foreground"
        >
          Start over
        </Link>
      </main>
    );
  }

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-8">
        <div className="flex items-center justify-between">
          <BackButton to="/send/amount" />
          <ProgressDots step={3} />
          <span className="w-24" aria-hidden="true" />
        </div>

        <h1 className="mt-10 text-center font-display text-2xl font-semibold text-muted-foreground">
          {t("send.step3")}
        </h1>

        <section className="mt-8 flex flex-col items-center gap-4 rounded-3xl bg-panel border border-border p-8">
          <Avatar
            name={name}
            color={contact?.color ?? "oklch(0.75 0.10 65)"}
            size={112}
          />
          <p className="font-display text-2xl font-semibold text-foreground">{name}</p>
          <p className="font-display text-6xl font-bold text-emerald">
            ${amount}
          </p>
        </section>

        <p
          className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-sage/15 px-5 py-4 text-left font-display text-base font-medium text-foreground"
          role="note"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-sage" aria-hidden="true" />
          {t("send.trustStrip")}
        </p>

        <button
          type="button"
          onClick={() => navigate({ to: "/send/success", search: { to, amount } })}
          className="mt-6 rounded-2xl bg-gold px-6 py-5 font-display text-lg font-semibold text-gold-foreground hover:brightness-105"
        >
          {t("send.confirmSend")}
        </button>
        <Link
          to="/home"
          className="mt-3 text-center font-display text-base text-muted-foreground underline underline-offset-4"
        >
          {t("send.cancel")}
        </Link>
      </main>
    </PageTransition>
  );
}
