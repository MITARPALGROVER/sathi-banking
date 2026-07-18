import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Mic, Sparkles } from "lucide-react";

import "@/i18n/config";
import { SUPPORTED_LOCALES, LOCALE_LABELS, setLocale, type Locale } from "@/i18n/config";
import { AmbientOrb } from "@/components/sathi/AmbientOrb";
import { FloatingCards } from "@/components/sathi/FloatingCards";
import { AccentText } from "@/components/sathi/AccentText";
import { spring } from "@/lib/motion";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sathi — Banking that speaks your language" },
      {
        name: "description",
        content:
          "A calm, voice-first digital banking companion for India — in Hindi, Hinglish, Punjabi, Bengali, Tamil and English.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, i18n } = useTranslation();
  const current = (i18n.language as Locale) ?? "en";
  const [selected, setSelected] = useState<Locale>(
    (SUPPORTED_LOCALES as readonly string[]).includes(current) ? current : "en",
  );
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const watermarkY = useTransform(scrollY, [0, 800], [0, -200]);
  const watermarkOpacity = useTransform(scrollY, [0, 600], [0.09, 0.02]);

  const onStart = () => {
    setLocale(selected);
    void navigate({ to: "/app" });
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">
      <AmbientOrb />

      {/* Massive watermark word behind hero */}
      <motion.div
        style={{ y: watermarkY, opacity: watermarkOpacity }}
        aria-hidden="true"
        className="pointer-events-none absolute -left-[6vw] top-[14vh] z-0 select-none"
      >
        <span
          className="block font-display font-bold leading-[0.85] tracking-[-0.05em] text-emerald"
          style={{ fontSize: "clamp(180px, 32vw, 520px)" }}
        >
          सुरक्षित
        </span>
      </motion.div>

      {/* Nav */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-5 sm:px-10 sm:py-7">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-gold" />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            {t("app.name")}
          </span>
        </div>
        <nav className="flex items-center gap-3 sm:gap-6">
          <a
            href="#features"
            className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground sm:inline"
          >
            Features
          </a>
          <a
            href="#trust"
            className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground sm:inline"
          >
            Trust
          </a>
          <a
            href="#voice"
            className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground sm:inline"
          >
            Voice
          </a>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full border border-foreground/25 bg-background/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] backdrop-blur-sm transition-colors hover:border-foreground/60"
            aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-[12px] font-medium text-emerald-foreground shadow-sm hover:-translate-y-0.5 transition-transform"
          >
            Try Demo <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-[1400px] gap-12 px-6 pb-24 pt-6 sm:px-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-32">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.05 }}
            className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/60"
          >
            <span aria-hidden="true" className="text-gold">
              ◆
            </span>
            Sathi · A Digital Finance Companion
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <AccentText
              as="h1"
              text="Banking that speaks your language."
              accent="language"
              className="mt-8 max-w-[14ch] font-display text-[13vw] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground sm:text-[92px] lg:text-[104px]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            className="mt-8 max-w-md text-base leading-relaxed text-foreground/70 sm:text-[17px]"
          >
            Send money, pay bills, understand your balance — by tapping, or just by talking. In
            Hindi, Hinglish, Punjabi, Bengali, Tamil or English.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
            className="mt-10"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
              Choose your language
            </p>
            <div
              role="group"
              aria-label="Choose your language"
              className="mt-4 flex flex-wrap items-center gap-2.5"
            >
              {SUPPORTED_LOCALES.map((lng) => {
                const active = selected === lng;
                return (
                  <motion.button
                    key={lng}
                    type="button"
                    onClick={() => setSelected(lng)}
                    aria-pressed={active}
                    whileTap={{ scale: 0.96 }}
                    transition={spring}
                    className={
                      "min-h-11 rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors " +
                      (active
                        ? "bg-emerald text-emerald-foreground shadow-[0_10px_28px_-14px_rgba(22,52,43,0.55)]"
                        : "border border-foreground/15 bg-background/70 text-foreground/85 backdrop-blur-sm hover:border-foreground/40")
                    }
                  >
                    {LOCALE_LABELS[lng]}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.42 }}
            className="mt-10 flex items-center gap-5"
          >
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald px-8 py-3 text-[14px] font-medium text-emerald-foreground transition-transform hover:-translate-y-0.5"
            >
              Try the demo <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/app"
              className="text-[13px] font-medium uppercase tracking-[0.18em] text-foreground/60 hover:text-foreground"
            >
              Skip intro
            </Link>
          </motion.div>
        </div>

        <div className="relative hidden justify-self-center lg:block">
          <FloatingCards />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
          ◆ Everything you need
        </p>
        <AccentText
          as="h2"
          text="A full bank, made simple."
          accent="simple"
          className="mt-4 max-w-[18ch] font-display text-[7vw] leading-[1.05] tracking-[-0.025em] text-foreground sm:text-[56px] lg:text-[72px]"
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { t: "Send & receive", d: "UPI, phone, contacts, QR — the way you already know." },
            { t: "Pay bills", d: "Electricity, mobile, DTH, water, gas — one tap." },
            {
              t: "History & cards",
              d: "Search, filter, freeze your card, and know where your money went.",
            },
          ].map((f, i) => (
            <motion.article
              key={f.t}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...spring, delay: i * 0.08 }}
              className="rounded-3xl border border-foreground/10 bg-background/70 p-8 backdrop-blur-sm"
            >
              <h3 className="font-display text-2xl font-semibold">{f.t}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/70">{f.d}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Voice */}
      <section
        id="voice"
        className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10"
      >
        <div className="grid gap-12 md:grid-cols-12">
          <motion.p
            {...reveal}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55 md:col-span-3"
          >
            ◆ Voice-first
          </motion.p>
          <motion.div {...reveal} transition={{ ...spring, delay: 0.08 }} className="md:col-span-9">
            <AccentText
              as="h2"
              text='"Priya ko paanch sau bhej do."'
              accent='bhej do."'
              className="max-w-[22ch] font-display text-[6vw] leading-[1.06] tracking-[-0.025em] text-foreground sm:text-[48px] lg:text-[64px]"
            />
            <p className="mt-8 max-w-lg text-base leading-relaxed text-foreground/70 sm:text-[17px]">
              Talk to Sathi in Hindi, Hinglish, English — even mid-sentence code-switching. Powered
              by an on-device LLM, we understand intent, never single keywords. Every money-moving
              action is confirmed twice — voice never sends by itself.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-[13px] text-foreground/70">
              <Chip icon={<Mic className="h-3.5 w-3.5" />}>Speak naturally</Chip>
              <Chip icon={<Sparkles className="h-3.5 w-3.5" />}>LLM-powered intent</Chip>
              <Chip icon={<ShieldCheck className="h-3.5 w-3.5" />}>Always double-confirmed</Chip>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust */}
      <section
        id="trust"
        className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10"
      >
        <div className="grid gap-12 md:grid-cols-12">
          <motion.p
            {...reveal}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55 md:col-span-3"
          >
            ◆ Trust &amp; Safety
          </motion.p>
          <motion.div {...reveal} transition={{ ...spring, delay: 0.08 }} className="md:col-span-9">
            <AccentText
              as="h2"
              text="Aapka paisa, aapki bhasha, aapke terms."
              accent="terms."
              className="max-w-[22ch] font-display text-[6vw] leading-[1.06] tracking-[-0.025em] text-foreground sm:text-[48px] lg:text-[64px]"
            />
            <p className="mt-8 max-w-lg text-base leading-relaxed text-foreground/70 sm:text-[17px]">
              End-to-end encrypted. UPI PIN before every transfer. Freeze your card in one tap. No
              transaction ever happens on a single voice command — Sathi always asks you to confirm.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-32 sm:px-10">
        <motion.div {...reveal} className="flex flex-col items-center gap-6 text-center">
          <AccentText
            as="p"
            text="Ready jab aap ho."
            accent="Ready"
            className="max-w-[18ch] font-display text-4xl leading-tight tracking-tight text-foreground sm:text-6xl"
          />
          <button
            type="button"
            onClick={onStart}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald px-10 py-3 text-[14px] font-medium text-emerald-foreground transition-transform hover:-translate-y-0.5"
          >
            Try the demo <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>

      <footer className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-4 border-t border-foreground/10 px-6 py-8 text-[11px] uppercase tracking-[0.18em] text-foreground/50 sm:px-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span>© Sathi 2026</span>
          <span className="normal-case tracking-normal text-[10px] text-foreground/40">
            Made for Bharat · Demo, no real money
          </span>
        </div>
        <div className="flex flex-col gap-1 text-left sm:text-right">
          <span>build by team webdevz</span>
          <span className="normal-case tracking-normal text-[10px] text-foreground/45">
            Members: Mitarpal Grover and Nidhi
          </span>
          <span>problem statement code : Fin03</span>
        </div>
      </footer>
    </main>
  );
}

const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { ...spring, duration: 0.4 },
};

function Chip({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-background/60 px-3 py-1.5">
      {icon}
      {children}
    </span>
  );
}
