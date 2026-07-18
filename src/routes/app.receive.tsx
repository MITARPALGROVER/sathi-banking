import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useBank } from "@/lib/bank-state";

export const Route = createFileRoute("/app/receive")({
  head: () => ({ meta: [{ title: "Receive — Sathi" }] }),
  component: Receive,
});

function Receive() {
  const { t } = useTranslation();
  const bank = useBank();
  const [qr, setQr] = useState<string>("");
  const payload = `upi://pay?pa=${encodeURIComponent(bank.upiId)}&pn=${encodeURIComponent(bank.accountHolder)}&cu=INR`;

  useEffect(() => {
    void QRCode.toDataURL(payload, {
      margin: 1,
      width: 320,
      color: { dark: "#16342B", light: "#F5F3EC" },
    }).then(setQr);
  }, [payload]);

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t("receive.title", "Receive money")}
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        {t("receive.subhead", "Show this QR — anyone with a UPI app can pay you.")}
      </p>

      <div className="mt-6 rounded-3xl bg-secondary p-5 sm:p-6 text-center">
        <div className="mx-auto grid aspect-square w-full max-w-[288px] place-items-center rounded-2xl bg-background p-4">
          {qr ? <img src={qr} alt="Your UPI QR code" className="h-full w-full" /> : null}
        </div>
        <p className="mt-5 font-display text-lg font-semibold">{bank.accountHolder}</p>
        <p className="mt-1 font-mono text-sm text-foreground/70">{bank.upiId}</p>

        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => void navigator.clipboard?.writeText(bank.upiId)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-medium text-emerald-foreground"
          >
            <Copy className="h-4 w-4" /> {t("receive.copyUpi", "Copy UPI")}
          </button>
          <button
            type="button"
            onClick={() =>
              void navigator
                .share?.({
                  title: t("receive.title", "Receive money"),
                  text: t("receive.shareText", "Pay me at {{upi}}").replace("{{upi}}", bank.upiId),
                })
                .catch(() => undefined)
            }
            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium text-foreground/80"
          >
            <Share2 className="h-4 w-4" /> {t("receive.share", "Share")}
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-foreground/10 p-4 text-xs text-foreground/60">
        <p>
          <span className="font-medium text-foreground">{t("receive.account", "Account")}:</span>{" "}
          {bank.accountNumber}
        </p>
        <p className="mt-1">
          <span className="font-medium text-foreground">{t("receive.ifsc", "IFSC")}:</span>{" "}
          {bank.ifsc}
        </p>
      </div>
    </main>
  );
}
