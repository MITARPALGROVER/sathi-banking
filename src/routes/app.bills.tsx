import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Smartphone, Tv, Droplet, Flame, Check } from "lucide-react";

import { bank as bankApi, useBank, formatINR } from "@/lib/bank-state";
import { PinPad } from "@/components/sathi/PinPad";
import { spring } from "@/lib/motion";
import { speak } from "@/lib/speech";

export const Route = createFileRoute("/app/bills")({
  head: () => ({ meta: [{ title: "Pay bills — Sathi" }] }),
  component: Bills,
});

type Category = { id: string; label: string; icon: typeof Lightbulb; providers: string[] };
const CATS: Category[] = [
  {
    id: "electricity",
    label: "Electricity",
    icon: Lightbulb,
    providers: ["BSES Rajdhani", "Tata Power", "Adani Electricity"],
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    providers: ["Airtel Prepaid", "Jio Prepaid", "Vi Postpaid"],
  },
  { id: "dth", label: "DTH", icon: Tv, providers: ["Tata Sky", "Airtel DTH", "Dish TV"] },
  { id: "water", label: "Water", icon: Droplet, providers: ["Delhi Jal Board", "MCGM Water"] },
  { id: "gas", label: "Gas", icon: Flame, providers: ["IGL", "MGL", "Indraprastha Gas"] },
];

type Step = "cat" | "provider" | "amount" | "pin" | "done";

function Bills() {
  const bank = useBank();
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("cat");
  const [cat, setCat] = useState<Category | null>(null);
  const [provider, setProvider] = useState<string>("");
  const [amount, setAmount] = useState(0);
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const p = sessionStorage.getItem("sathi.prefill.bill");
      if (!p) return;
      sessionStorage.removeItem("sathi.prefill.bill");
      const m = CATS.find(
        (c) => c.id === p.toLowerCase() || c.label.toLowerCase() === p.toLowerCase(),
      );
      if (m) {
        setCat(m);
        setStep("provider");
      }
    } catch {
      /* no-op */
    }
  }, []);

  function handlePin(pin: string) {
    if (!bankApi.verifyPin(pin)) {
      setPinError("Wrong PIN. Try again.");
      return;
    }
    setPinError(null);
    if (!cat || !provider) return;
    bankApi.payBill({ provider, category: cat.label, amount });
    setStep("done");
    speak(`Paid ${amount} rupees to ${provider}`, "en");
  }

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8">
      <button
        type="button"
        onClick={() =>
          step === "cat"
            ? nav({ to: "/app" })
            : setStep(
                step === "provider"
                  ? "cat"
                  : step === "amount"
                    ? "provider"
                    : step === "pin"
                      ? "amount"
                      : "cat",
              )
        }
        className="text-sm text-foreground/60"
      >
        ← Back
      </button>

      {step === "cat" && (
        <>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Pay bills</h1>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {CATS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCat(c);
                  setStep("provider");
                }}
                className="flex min-h-[120px] flex-col items-start justify-between rounded-2xl bg-secondary p-4 text-left transition-colors hover:bg-secondary/70"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald text-emerald-foreground">
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-lg font-semibold">{c.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === "provider" && cat && (
        <>
          <h1 className="mt-6 font-display text-2xl font-semibold">{cat.label} providers</h1>
          <ul className="mt-4 divide-y divide-foreground/8 rounded-2xl bg-secondary/60">
            {cat.providers.map((p) => (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => {
                    setProvider(p);
                    setStep("amount");
                  }}
                  className="w-full px-4 py-4 text-left text-sm font-medium hover:bg-secondary"
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {step === "amount" && cat && (
        <>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
            {cat.label}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{provider}</h1>
          <div className="mt-8 flex items-baseline gap-2">
            <span className="font-display text-4xl text-foreground/60">₹</span>
            <input
              autoFocus
              inputMode="decimal"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value.replace(/[^\d.]/g, "")) || 0)}
              placeholder="0"
              className="w-full bg-transparent font-display text-6xl font-semibold focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setStep("pin")}
            disabled={amount <= 0 || amount > bank.balance}
            className="mt-8 w-full rounded-full bg-emerald py-4 text-sm font-medium text-emerald-foreground disabled:opacity-40"
          >
            Continue
          </button>
        </>
      )}

      {step === "pin" && cat && (
        <>
          <div className="mt-6 rounded-2xl bg-secondary p-5">
            <p className="text-xs text-foreground/55">Paying</p>
            <p className="mt-1 font-display text-3xl font-semibold">{formatINR(amount)}</p>
            <p className="mt-2 text-sm">
              to <span className="font-medium">{provider}</span> · {cat.label}
            </p>
          </div>
          <p className="mt-8 text-center text-sm text-foreground/70">Enter UPI PIN</p>
          <p className="text-center text-xs text-foreground/40">Demo PIN: 1234</p>
          <PinPad length={4} onComplete={handlePin} error={pinError} />
        </>
      )}

      {step === "done" && (
        <section className="mt-14 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={spring}
            className="grid h-24 w-24 place-items-center rounded-full bg-sage text-white confirm-ripple"
          >
            <Check className="h-12 w-12" strokeWidth={3} />
          </motion.div>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-sage">
            Bill paid
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">{formatINR(amount)}</h1>
          <p className="mt-1 text-sm text-foreground/70">{provider}</p>
          <button
            type="button"
            onClick={() => nav({ to: "/app" })}
            className="mt-10 w-full rounded-full bg-emerald py-4 text-sm font-medium text-emerald-foreground"
          >
            Done
          </button>
        </section>
      )}
    </main>
  );
}
