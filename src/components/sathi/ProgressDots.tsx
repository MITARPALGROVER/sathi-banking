export function ProgressDots({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div
      className="flex items-center justify-center gap-3"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label={`Step ${step} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const active = i + 1 === step;
        const done = i + 1 < step;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={
              "block rounded-full transition-all " +
              (active
                ? "h-3 w-8 bg-emerald"
                : done
                  ? "h-3 w-3 bg-emerald/60"
                  : "h-3 w-3 bg-emerald/20")
            }
          />
        );
      })}
    </div>
  );
}
