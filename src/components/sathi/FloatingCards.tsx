import { motion } from "framer-motion";
import { spring } from "@/lib/motion";

// Three tilted glass card mockups — a debit card and two UPI receipt cards.
export function FloatingCards() {
  return (
    <div className="relative h-[420px] w-full max-w-md" aria-hidden="true">
      {/* Debit card */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -14 }}
        animate={{ opacity: 1, y: 0, rotate: -8 }}
        transition={{ ...spring, delay: 0.2 }}
        className="absolute left-6 top-16 h-56 w-[22rem] rounded-3xl p-6 text-white shadow-2xl"
        style={{
          background: "linear-gradient(135deg, oklch(0.30 0.045 168), oklch(0.24 0.03 168))",
          transformOrigin: "center",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold tracking-tight">Sathi Bank</span>
          <span className="rounded-full bg-gold/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald">
            RuPay
          </span>
        </div>
        <p className="mt-10 font-mono text-lg tracking-[0.2em]">•••• •••• •••• 3021</p>
        <div className="mt-6 flex items-end justify-between text-xs uppercase tracking-widest opacity-80">
          <div>
            <p className="opacity-60">Holder</p>
            <p className="mt-1 text-sm">AARAV MEHTA</p>
          </div>
          <div className="text-right">
            <p className="opacity-60">Exp</p>
            <p className="mt-1 text-sm">08/29</p>
          </div>
        </div>
      </motion.div>

      {/* UPI receipt 1 */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 12 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ ...spring, delay: 0.35 }}
        className="absolute right-2 top-2 w-64 rounded-3xl border border-white/40 bg-white/70 p-5 shadow-xl backdrop-blur-xl"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/55">
          UPI · Sent
        </p>
        <p className="mt-3 font-display text-2xl font-semibold text-foreground">₹1,499</p>
        <p className="mt-1 text-sm text-foreground/70">Priya Sharma · priya@okhdfc</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-sage">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-sage/15">✓</span>
          Instant · Just now
        </div>
      </motion.div>

      {/* UPI receipt 2 */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ ...spring, delay: 0.5 }}
        className="absolute bottom-2 right-10 w-60 rounded-3xl border border-white/40 bg-white/70 p-5 shadow-xl backdrop-blur-xl"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/55">
          Balance
        </p>
        <p className="mt-3 font-display text-2xl font-semibold text-foreground">₹48,291.75</p>
        <div className="mt-3 flex gap-1">
          {[70, 30, 55, 40, 80].map((h, i) => (
            <span
              key={i}
              className="w-2 rounded-full bg-emerald/60"
              style={{ height: `${h * 0.28}px` }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
