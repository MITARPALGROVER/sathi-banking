import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { spring } from "@/lib/motion";

type Variant = "primary" | "outline";

type Props = {
  to: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  variant?: Variant;
  ariaLabel?: string;
};

const MotionLink = motion(Link);

export function TaskTile({
  to,
  label,
  sublabel,
  icon: Icon,
  variant = "outline",
  ariaLabel,
}: Props) {
  const base =
    "group relative flex min-h-[140px] w-full flex-col items-start justify-between gap-4 rounded-3xl p-6 text-left";
  const styles =
    variant === "primary"
      ? "bg-emerald text-emerald-foreground shadow-[0_14px_40px_-18px_rgba(15,61,50,0.55)]"
      : "bg-panel text-foreground border border-border shadow-[0_6px_20px_-14px_rgba(35,35,31,0.25)]";

  return (
    <MotionLink
      to={to}
      aria-label={ariaLabel ?? label}
      whileTap={{ scale: 0.97 }}
      transition={spring}
      className={`${base} ${styles}`}
    >
      <span
        className={
          "grid h-14 w-14 place-items-center rounded-2xl " +
          (variant === "primary"
            ? "bg-gold text-gold-foreground"
            : "bg-emerald/10 text-emerald")
        }
        aria-hidden="true"
      >
        <Icon className="h-7 w-7" strokeWidth={2.2} />
      </span>
      <span className="flex flex-col">
        <span className="font-display text-xl font-semibold leading-tight tracking-tight">
          {label}
        </span>
        {sublabel ? (
          <span
            className={
              "mt-1 text-sm " +
              (variant === "primary"
                ? "text-emerald-foreground/80"
                : "text-muted-foreground")
            }
          >
            {sublabel}
          </span>
        ) : null}
      </span>
    </MotionLink>
  );
}
