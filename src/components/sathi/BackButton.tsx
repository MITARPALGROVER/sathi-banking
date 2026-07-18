import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function BackButton({ to }: { to?: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={() => {
        if (to) router.navigate({ to });
        else router.history.back();
      }}
      className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/70"
      aria-label={t("back")}
    >
      <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      <span>{t("back")}</span>
    </button>
  );
}
