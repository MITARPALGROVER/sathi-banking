import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Lightbulb, Droplet, Smartphone, Flame } from "lucide-react";

import "@/i18n/config";
import { BackButton } from "@/components/sathi/BackButton";
import { TaskTile } from "@/components/sathi/TaskTile";
import { MicButton } from "@/components/sathi/MicButton";
import { PageTransition } from "@/components/sathi/PageTransition";

export const Route = createFileRoute("/bills")({
  head: () => ({ meta: [{ title: "Pay bills — Sathi" }] }),
  component: Bills,
});

function Bills() {
  const { t } = useTranslation();
  return (
    <PageTransition>
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pb-40 pt-8">
        <BackButton to="/app" />
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-foreground">
          {t("bills.title")}
        </h1>

        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TaskTile
            to="/send/who"
            label={t("bills.electricity")}
            icon={Lightbulb}
            variant="primary"
          />
          <TaskTile to="/send/who" label={t("bills.water")} icon={Droplet} />
          <TaskTile to="/send/who" label={t("bills.mobile")} icon={Smartphone} />
          <TaskTile to="/send/who" label={t("bills.gas")} icon={Flame} />
        </section>

        <MicButton />
      </main>
    </PageTransition>
  );
}
