import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Send,
  Wallet,
  Receipt,
  LifeBuoy,
  Settings as SettingsIcon,
} from "lucide-react";

import "@/i18n/config";
import { TaskTile } from "@/components/sathi/TaskTile";
import { MicButton } from "@/components/sathi/MicButton";
import { GlassCard } from "@/components/sathi/GlassCard";
import { PageTransition } from "@/components/sathi/PageTransition";
import { BALANCE, MOCK_USER, formatMoney } from "@/lib/mock";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Sathi — Home" },
      {
        name: "description",
        content: "Your balance and quick actions in Sathi.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useTranslation();

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background pb-40">
      <PageTransition>
        <div className="relative">
          {/* Emerald→gold gradient strip behind the glass card */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,var(--emerald)_0%,color-mix(in_oklab,var(--emerald)_60%,var(--gold))_55%,var(--gold)_100%)] opacity-90"
          />
          <div className="relative mx-auto max-w-2xl px-5 pt-8 sm:px-8">
            <div className="flex items-center justify-between">
              <p className="rounded-full glass px-4 py-1.5 text-sm font-medium text-foreground/90">
                {t("app.name")}
              </p>
              <Link
                to="/settings"
                aria-label={t("home.settings")}
                className="grid h-12 w-12 place-items-center rounded-2xl glass text-foreground"
              >
                <SettingsIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-8 text-sm font-medium uppercase tracking-[0.14em] text-white/80">
              {t("home.greeting", { name: MOCK_USER.name })}
            </p>

            {/* THE signature glass balance card */}
            <GlassCard className="mt-4 px-7 py-8">
              <p className="text-sm font-medium text-foreground/70">
                {t("home.balanceLabel")}
              </p>
              <p className="mt-2 font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                {formatMoney(BALANCE)}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-foreground/70">
                <span className="inline-block h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
                {t("send.trustStrip")}
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
            {t("home.quickActions")}
          </h2>

          <section
            className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2"
            aria-label={t("home.quickActions")}
          >
            <TaskTile
              to="/send/who"
              label={t("tiles.send")}
              sublabel={t("tiles.sendSub")}
              icon={Send}
              variant="primary"
            />
            <TaskTile
              to="/balance"
              label={t("tiles.balance")}
              sublabel={t("tiles.balanceSub")}
              icon={Wallet}
            />
            <TaskTile
              to="/bills"
              label={t("tiles.bill")}
              sublabel={t("tiles.billSub")}
              icon={Receipt}
            />
            <TaskTile
              to="/help"
              label={t("tiles.help")}
              sublabel={t("tiles.helpSub")}
              icon={LifeBuoy}
            />
          </section>
        </div>
      </PageTransition>

      <MicButton />
    </main>
  );
}
