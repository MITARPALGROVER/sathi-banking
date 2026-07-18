import type { Transition, Variants } from "framer-motion";

export const spring: Transition = {
  type: "spring",
  damping: 20,
  stiffness: 200,
  mass: 0.9,
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: spring },
  exit: { opacity: 0, y: -12, transition: { duration: 0.15 } },
};

export const tapScale = { scale: 0.97 };
