import { useEffect, useState } from "react";
import { Delete } from "lucide-react";
import { motion } from "framer-motion";

import { spring } from "@/lib/motion";

type Props = {
  length?: 4 | 6;
  onComplete: (pin: string) => void;
  error?: string | null;
};

export function PinPad({ length = 4, onComplete, error }: Props) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(0);

  useEffect(() => {
    if (pin.length === length) {
      onComplete(pin);
      setPin("");
    }
  }, [pin, length, onComplete]);

  useEffect(() => {
    if (error) setShake((s) => s + 1);
  }, [error]);

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"] as const;

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center">
      <motion.div
        key={shake}
        animate={{ x: [0, -8, 8, -6, 6, -2, 0] }}
        transition={{ duration: 0.35 }}
        className="mt-4 flex gap-3"
        aria-label={`PIN — ${pin.length} of ${length} entered`}
      >
        {Array.from({ length }).map((_, i) => {
          const filled = i < pin.length;
          return (
            <span
              key={i}
              className={
                "grid h-4 w-4 place-items-center rounded-full transition-colors " +
                (filled ? "bg-emerald" : "border border-foreground/25")
              }
            />
          );
        })}
      </motion.div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        {keys.map((k, i) => {
          if (k === "") return <span key={i} />;
          if (k === "back") {
            return (
              <motion.button
                key={i}
                type="button"
                whileTap={{ scale: 0.94 }}
                transition={spring}
                onClick={() => setPin((p) => p.slice(0, -1))}
                aria-label="Delete"
                className="grid h-16 place-items-center rounded-2xl text-foreground/70 hover:bg-secondary"
              >
                <Delete className="h-6 w-6" />
              </motion.button>
            );
          }
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.94 }}
              transition={spring}
              onClick={() => setPin((p) => (p.length < length ? p + k : p))}
              className="grid h-16 place-items-center rounded-2xl bg-secondary font-display text-2xl font-semibold hover:bg-secondary/80"
            >
              {k}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
