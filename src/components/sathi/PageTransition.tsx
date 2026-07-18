import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { pageVariants, spring } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <>{children}</>;
  }
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      transition={spring}
      className="contents"
    >
      {children}
    </motion.div>
  );
}
