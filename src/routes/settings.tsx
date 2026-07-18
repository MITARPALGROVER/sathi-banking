import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import "@/i18n/config";
import { BackButton } from "@/components/sathi/BackButton";
import { ThemeToggle } from "@/components/sathi/ThemeToggle";
import { PageTransition } from "@/components/sathi/PageTransition";
import {
  SUPPORTED_LOCALES,
  LOCALE_LABELS,
  setLocale,
  getActiveLocale,
  type Locale,
} from "@/i18n/config";
import { useFontScale } from "@/lib/settings";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Sathi" }] }),
  component: Settings,
});

function Settings() {
  const { t, i18n } = useTranslation();
  const [scale, setScale] = useFontScale();
  const current = getActiveLocale(i18n.language);

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 pb-16 pt-8">
        <BackButton to="/app" />
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-foreground">
          {t("settings.title")}
        </h1>

        {/* Appearance */}
        <section className="mt-8 rounded-3xl border border-border bg-panel p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {t("settings.theme")}
          </h2>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </section>

        {/* Language */}
        <section className="mt-6 rounded-3xl border border-border bg-panel p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {t("settings.language")}
          </h2>
          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label={t("settings.language")}
          >
            {SUPPORTED_LOCALES.map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setLocale(lng)}
                aria-pressed={current === lng}
                className={
                  "rounded-2xl px-5 py-3 font-display text-base font-medium " +
                  (current === lng
                    ? "bg-emerald text-emerald-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/70")
                }
              >
                {LOCALE_LABELS[lng]}
              </button>
            ))}
          </div>
        </section>

        {/* Font size */}
        <section className="mt-6 rounded-3xl border border-border bg-panel p-5">
          <label
            htmlFor="font-scale"
            className="font-display text-lg font-semibold text-foreground"
          >
            {t("settings.fontSize")}
          </label>
          <div className="mt-4 flex items-center gap-4">
            <span className="font-display text-base text-foreground">{t("settings.smaller")}</span>
            <input
              id="font-scale"
              type="range"
              min={0.85}
              max={1.4}
              step={0.05}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="flex-1 accent-emerald"
            />
            <span className="font-display text-2xl text-foreground">{t("settings.larger")}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{Math.round(scale * 100)}%</p>
        </section>
      </main>
    </PageTransition>
  );
}
