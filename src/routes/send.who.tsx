import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

import "@/i18n/config";
import { BackButton } from "@/components/sathi/BackButton";
import { ProgressDots } from "@/components/sathi/ProgressDots";
import { Avatar } from "@/components/sathi/Avatar";
import { PageTransition } from "@/components/sathi/PageTransition";
import { CONTACTS } from "@/lib/mock";

export const Route = createFileRoute("/send/who")({
  head: () => ({ meta: [{ title: "Send money — Who?" }] }),
  component: SendWho,
});

function SendWho() {
  const { t } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);
  const [phone, setPhone] = useState("");

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pb-16 pt-8 sm:px-8">
        <div className="flex items-center justify-between">
          <BackButton to="/home" />
          <ProgressDots step={1} />
          <span className="w-24" aria-hidden="true" />
        </div>

        <h1 className="mt-10 text-center font-display text-3xl font-bold tracking-tight">
          {t("send.step1")}
        </h1>

        <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {CONTACTS.map((c) => (
            <li key={c.id}>
              <Link
                to="/send/amount"
                search={{ to: c.id }}
                className="flex flex-col items-center gap-3 rounded-3xl p-3 hover:bg-secondary/60"
                aria-label={`Send to ${c.name}`}
              >
                <Avatar name={c.name} color={c.color} size={104} />
                <span className="font-display text-lg font-medium">{c.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setAddOpen((v) => !v)}
              className="flex w-full flex-col items-center gap-3 rounded-3xl p-3 hover:bg-secondary/60"
              aria-expanded={addOpen}
            >
              <span
                className="grid h-[104px] w-[104px] place-items-center rounded-full border-2 border-dashed border-emerald/50 text-emerald"
                aria-hidden="true"
              >
                <Plus className="h-10 w-10" strokeWidth={2.4} />
              </span>
              <span className="font-display text-lg font-medium">{t("send.addContact")}</span>
            </button>
          </li>
        </ul>

        {addOpen ? (
          <div className="mx-auto mt-8 w-full max-w-md rounded-3xl bg-panel border border-border p-5">
            <label htmlFor="new-phone" className="font-display text-base font-medium">
              {t("send.enterPhone")}
            </label>
            <input
              id="new-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-2xl border-2 border-border bg-background px-4 py-4 font-display text-2xl tracking-wider outline-none focus:border-emerald"
            />
            <Link
              to="/send/amount"
              search={{ to: `phone:${phone}` }}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-emerald px-6 py-4 font-display text-lg font-semibold text-emerald-foreground"
            >
              {t("send.save")}
            </Link>
          </div>
        ) : null}
      </main>
    </PageTransition>
  );
}
