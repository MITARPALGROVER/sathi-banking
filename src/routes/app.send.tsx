import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AtSign, Phone, ScanLine, Users, ChevronRight, Check } from "lucide-react";

import { useBank, formatINR, initialsOf, bank as bankApi } from "@/lib/bank-state";
import { PinPad } from "@/components/sathi/PinPad";
import { speak } from "@/lib/speech";
import { spring } from "@/lib/motion";

export const Route = createFileRoute("/app/send")({
  head: () => ({ meta: [{ title: "Send money — Sathi" }] }),
  component: SendMoney,
});

type Step = "who" | "amount" | "pin" | "done";

function SendMoney() {
  const bank = useBank();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("who");
  const [mode, setMode] = useState<"upi" | "phone" | "contact" | "qr">("contact");
  const [recipient, setRecipient] = useState<{ name: string; handle: string } | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [txnId, setTxnId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sathi.prefill.send");
      if (!raw) return;
      const p = JSON.parse(raw) as { recipient?: string; amount?: number | null };
      sessionStorage.removeItem("sathi.prefill.send");
      if (p.recipient) {
        const match = bank.contacts.find((c) => c.name.toLowerCase().includes(p.recipient!.toLowerCase()));
        if (match) {
          setRecipient({ name: match.name, handle: match.upi });
          setStep("amount");
          if (p.amount && p.amount > 0) setAmount(p.amount);
        }
      }
    } catch { /* no-op */ }
  }, [bank.contacts]);

  function pickContact(id: string) {
    const c = bank.contacts.find((x) => x.id === id);
    if (!c) return;
    setRecipient({ name: c.name, handle: c.upi });
    setStep("amount");
  }

  function submitAmount() {
    if (amount <= 0 || amount > bank.balance) return;
    setStep("pin");
  }

  function handlePin(pin: string) {
    if (!bankApi.verifyPin(pin)) {
      setPinError("Wrong PIN. Try again.");
      return;
    }
    setPinError(null);
    if (!recipient) return;
    const tx = bankApi.sendMoney({ recipientName: recipient.name, upiOrPhone: recipient.handle, amount, note, method: "upi" });
    setTxnId(tx.id);
    setStep("done");
    speak(`Sent ${amount} rupees to ${recipient.name}`, "en");
  }

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8">
      <button
        type="button"
        onClick={() => (step === "who" ? navigate({ to: "/app" }) : setStep(step === "amount" ? "who" : step === "pin" ? "amount" : "who"))}
        className="text-sm text-foreground/60 hover:text-foreground"
      >
        ← Back
      </button>

      {step === "who" && (
        <section className="mt-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Send money</h1>
          <p className="mt-2 text-sm text-foreground/60">Choose how you want to pay.</p>

          <div className="mt-6 grid grid-cols-4 gap-2">
            {[
              { k: "contact", label: "Contact", Icon: Users },
              { k: "upi",     label: "UPI ID",  Icon: AtSign },
              { k: "phone",   label: "Phone",   Icon: Phone },
              { k: "qr",      label: "QR",      Icon: ScanLine },
            ].map(({ k, label, Icon }) => (
              <button
                key={k}
                type="button"
                onClick={() => setMode(k as typeof mode)}
                className={
                  "flex min-h-[80px] flex-col items-center justify-center gap-1.5 rounded-2xl border p-2 text-xs font-medium transition-colors " +
                  (mode === k ? "border-emerald bg-emerald text-emerald-foreground" : "border-foreground/10 bg-secondary text-foreground/80")
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          {mode === "contact" && (
            <ul className="mt-6 divide-y divide-foreground/8 rounded-2xl bg-secondary/60">
              {bank.contacts.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => pickContact(c.id)}
                    className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary"
                  >
                    <span
                      className="grid h-11 w-11 place-items-center rounded-full font-display text-sm font-semibold text-white"
                      style={{ background: c.color }}
                    >
                      {initialsOf(c.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-foreground/55">{c.upi}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-foreground/40" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {(mode === "upi" || mode === "phone") && (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const v = new FormData(e.currentTarget).get("handle")?.toString().trim();
                if (!v) return;
                setRecipient({ name: v, handle: v });
                setStep("amount");
              }}
            >
              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
                  {mode === "upi" ? "UPI ID" : "Phone number"}
                </span>
                <input
                  name="handle"
                  autoFocus
                  inputMode={mode === "phone" ? "numeric" : "text"}
                  placeholder={mode === "upi" ? "name@bank" : "10-digit phone"}
                  className="mt-2 w-full rounded-2xl bg-secondary px-4 py-4 font-display text-lg focus:outline-none"
                />
              </label>
              <button type="submit" className="w-full rounded-full bg-emerald py-4 text-sm font-medium text-emerald-foreground">
                Continue
              </button>
            </form>
          )}

          {mode === "qr" && (
            <div className="mt-6 grid place-items-center rounded-3xl bg-secondary p-10 text-center">
              <ScanLine className="h-14 w-14 text-emerald" />
              <p className="mt-4 text-sm font-medium">Point camera at a UPI QR</p>
              <p className="mt-1 text-xs text-foreground/55">Mock scanner — for demo</p>
              <button
                type="button"
                onClick={() => pickContact(bank.contacts[0].id)}
                className="mt-6 rounded-full bg-emerald px-5 py-2.5 text-xs font-medium text-emerald-foreground"
              >
                Simulate scan
              </button>
            </div>
          )}
        </section>
      )}

      {step === "amount" && recipient && (
        <section className="mt-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">Paying</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{recipient.name}</h1>
          <p className="text-xs text-foreground/55">{recipient.handle}</p>

          <div className="mt-8">
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">Amount</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl text-foreground/60">₹</span>
                <input
                  autoFocus
                  inputMode="decimal"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value.replace(/[^\d.]/g, "")) || 0)}
                  placeholder="0"
                  className="w-full bg-transparent font-display text-6xl font-semibold tracking-tight focus:outline-none"
                />
              </div>
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              {[100, 500, 1000, 5000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className="rounded-full bg-secondary px-4 py-2 text-xs font-medium text-foreground/80"
                >
                  ₹{v.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <label className="mt-6 block">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">Note (optional)</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. rent, chai"
                className="mt-2 w-full rounded-2xl bg-secondary px-4 py-3 text-sm focus:outline-none"
              />
            </label>

            <button
              type="button"
              onClick={submitAmount}
              disabled={amount <= 0 || amount > bank.balance}
              className="mt-8 w-full rounded-full bg-emerald py-4 text-sm font-medium text-emerald-foreground disabled:opacity-40"
            >
              Continue to confirm
            </button>
            <p className="mt-3 text-center text-xs text-foreground/50">
              Balance: {formatINR(bank.balance)}
            </p>
          </div>
        </section>
      )}

      {step === "pin" && recipient && (
        <section className="mt-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">Confirm payment</p>
          <div className="mt-2 rounded-2xl bg-secondary p-5">
            <p className="text-xs text-foreground/55">Sending</p>
            <p className="mt-1 font-display text-3xl font-semibold">{formatINR(amount)}</p>
            <p className="mt-2 text-sm">to <span className="font-medium">{recipient.name}</span></p>
            <p className="text-xs text-foreground/55">{recipient.handle}</p>
          </div>
          <p className="mt-8 text-center text-sm text-foreground/70">Enter UPI PIN</p>
          <p className="text-center text-xs text-foreground/40">Demo PIN: 1234</p>
          <PinPad length={4} onComplete={handlePin} error={pinError} />
        </section>
      )}

      {step === "done" && recipient && (
        <section className="mt-14 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={spring}
            className="grid h-24 w-24 place-items-center rounded-full bg-sage text-white confirm-ripple"
          >
            <Check className="h-12 w-12" strokeWidth={3} />
          </motion.div>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-sage">Payment successful</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">{formatINR(amount)}</h1>
          <p className="mt-1 text-sm text-foreground/70">to {recipient.name}</p>
          {txnId ? <p className="mt-3 font-mono text-[10px] text-foreground/40">TXN {txnId}</p> : null}
          <div className="mt-10 flex w-full gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/app" })}
              className="flex-1 rounded-full bg-emerald py-4 text-sm font-medium text-emerald-foreground"
            >
              Done
            </button>
            <button
              type="button"
              onClick={() => { setStep("who"); setRecipient(null); setAmount(0); setNote(""); }}
              className="flex-1 rounded-full border border-foreground/15 py-4 text-sm font-medium text-foreground/70"
            >
              Send again
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
