import type { HTMLAttributes, ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={
        "glass rounded-3xl shadow-[0_20px_60px_-24px_rgba(15,61,50,0.35)] " +
        className
      }
    >
      {children}
    </div>
  );
}
