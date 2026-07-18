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
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useBank, formatINR, maskAccount } from "@/lib/bank-state";
import { spring } from "@/lib/motion";
import { speak } from "@/lib/speech";
import { getActiveLocale } from "@/i18n/config";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Sathi — Home" }] }),
  component: AppHome,
});

function AppHome() {
  const { t, i18n } = useTranslation();
  const locale = getActiveLocale(i18n.language);
  const bank = useBank();
  const [revealAcct, setRevealAcct] = useState(false);
  const recent = bank.transactions.slice(0, 4);

  // Guided Tour State
  const [tourStep, setTourStep] = useState<number | null>(null);

  const tourSteps = [
    {
      title: t("guide.step0.title", "Welcome to Sathi"),
      text: t(
        "guide.step0.text",
        "Hi! I am your voice banking companion Sathi. Let me show you how to use this app!",
      ),
      speakText: t(
        "guide.step0.speak",
        "Hi! I am your voice banking companion Sathi. Let me show you how to use this app!",
      ),
      targetId: "", // center overlay
    },
    {
      title: t("guide.step1.title", "Your Account Balance"),
      text: t(
        "guide.step1.text",
        "This is your balance card. Tap the eye icon to view or hide your balance and account details safely.",
      ),
      speakText: t(
        "guide.step1.speak",
        "This is your balance card. Tap the eye icon to view or hide your balance and account details safely.",
      ),
      targetId: "balance-card",
    },
    {
      title: t("guide.step2.title", "Talk to Sathi"),
      text: t(
        "guide.step2.text",
        "This is the Sathi mic button. Tap it and speak in your language to send money, check balance, or pay bills.",
      ),
      speakText: t(
        "guide.step2.speak",
        "This is the Sathi mic button. Tap it and speak in your language to send money, check balance, or pay bills.",
      ),
      targetId: "sathi-mic-button",
    },
    {
      title: t("guide.step3.title", "Quick Actions"),
      text: t(
        "guide.step3.text",
        "From here, you can quickly send money, show your QR code, pay bills, or view your transaction history.",
      ),
      speakText: t(
        "guide.step3.speak",
        "From here, you can quickly send money, show your QR code, pay bills, or view your transaction history.",
      ),
      targetId: "quick-actions",
    },
  ];

  const startTour = () => {
    setTourStep(0);
  };

  const nextStep = () => {
    if (tourStep === null) return;
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (tourStep === null) return;
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const endTour = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
    setTourStep(null);
    localStorage.setItem("sathi.tour.seen", "true");
  };

  const speakCurrentStep = (stepIdx: number) => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
      const text = tourSteps[stepIdx].speakText;
      speak(text, locale);
    }
  };

  useEffect(() => {
    if (tourStep !== null) {
      const timer = setTimeout(() => {
        speakCurrentStep(tourStep);
      }, 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourStep]);

  useEffect(() => {
    if (tourStep === null) return;
    const step = tourSteps[tourStep];
    if (!step.targetId) return;
    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourStep]);

  useEffect(() => {
    const tourSeen = localStorage.getItem("sathi.tour.seen");
    if (!tourSeen) {
      const timer = setTimeout(() => {
        setTourStep(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (tourStep !== null) {
        document.documentElement.setAttribute("data-tour-step", tourStep.toString());
      } else {
        document.documentElement.removeAttribute("data-tour-step");
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.removeAttribute("data-tour-step");
      }
    };
  }, [tourStep]);

  const getOverlayAlignmentClass = (step: number) => {
    switch (step) {
      case 0:
        return "justify-center";
      case 1:
        return "justify-end pb-28";
      case 2:
        return "justify-start pt-24";
      case 3:
        return "justify-start pt-24";
      default:
        return "justify-center";
    }
  };

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={startTour}
            className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-foreground/70 hover:text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Start app tour"
            title="Start Guide"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald/10 text-emerald font-display font-semibold">
            {bank.accountHolder[0]}
          </div>
        </div>
      </header>

      {/* Signature glass balance card over an emerald gradient */}
      <div
        id="balance-card"
        className="relative mt-6 overflow-hidden rounded-[28px] p-[1.5px] shadow-[0_12px_30px_-10px_rgba(22,52,43,0.3)]"
      >
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
      <section id="quick-actions" className="mt-8">
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

      {/* Guided Tour Spotlight & Modal Overlay */}
      {tourStep !== null && (
        <div
          className={
            "fixed inset-0 z-[100] flex flex-col items-center px-4 transition-all duration-300 bg-charcoal/65 backdrop-blur-sm " +
            getOverlayAlignmentClass(tourStep)
          }
        >
          {/* Sathi Guide Bubble */}
          <div className="relative z-[110] w-full max-w-md rounded-3xl bg-background p-6 shadow-2xl border border-foreground/10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              {/* Sathi Animated Avatar */}
              <div className="relative grid h-12 w-12 place-items-center rounded-full bg-emerald text-emerald-foreground font-display text-lg font-semibold">
                S
                <span className="absolute inset-0 rounded-full border border-gold/40 animate-ping opacity-75" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold leading-none text-foreground">
                  {tourSteps[tourStep].title}
                </h3>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-emerald/80 flex items-center gap-1.5">
                  <span className="inline-flex gap-0.5 items-center">
                    <span
                      className="h-1.5 w-1 rounded-full bg-emerald animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2.5 w-1 rounded-full bg-emerald animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-1.5 w-1 rounded-full bg-emerald animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                  {locale === "en" ? "Sathi speaking..." : "साथी बोल रही है..."}
                </p>
              </div>
              {/* Repeat voice button */}
              <button
                type="button"
                onClick={() => speakCurrentStep(tourStep)}
                className="ml-auto rounded-full p-2 bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                aria-label="Repeat instructions"
                title="Repeat voice"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-volume-2 h-4 w-4 text-emerald"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </button>
            </div>

            <p className="text-[15px] leading-relaxed text-foreground/90">
              {tourSteps[tourStep].text}
            </p>

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={endTour}
                className="text-xs font-semibold text-foreground/50 hover:text-foreground"
              >
                {t("guide.skip", "Skip")}
              </button>
              <div className="flex gap-2">
                {tourStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="rounded-full border border-foreground/15 px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    {t("guide.back", "Back")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-full bg-emerald px-5 py-2 text-xs font-semibold text-emerald-foreground shadow-sm hover:opacity-90 transition-opacity"
                >
                  {tourStep === tourSteps.length - 1
                    ? t("guide.finish", "Finish")
                    : t("guide.next", "Next")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
