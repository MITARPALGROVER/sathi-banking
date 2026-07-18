export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={
        "animate-pulse rounded-2xl bg-warm-text/10 " + className
      }
    />
  );
}
