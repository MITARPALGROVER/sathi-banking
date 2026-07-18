import { motion } from "framer-motion";
import { spring } from "@/lib/motion";

export function LanguageChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={
        "glass rounded-full px-6 py-3 text-base font-medium transition-colors " +
        (active
          ? "!bg-[color-mix(in_oklab,var(--emerald)_92%,transparent)] !border-emerald text-emerald-foreground shadow-[0_10px_28px_-14px_rgba(15,61,50,0.5)]"
          : "text-foreground hover:!bg-[color-mix(in_oklab,white_70%,transparent)]")
      }
    >
      {label}
    </motion.button>
  );
}
