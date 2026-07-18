// Warm amber-to-cream radial orb — pure CSS, cheap, respects reduced motion.
export function AmbientOrb() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -right-[15%] -top-[20%] h-[80vh] w-[80vh] rounded-full opacity-90 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.86 0.11 78 / 0.85), oklch(0.90 0.06 82 / 0.35) 55%, transparent 75%)",
        }}
      />
      <div
        className="absolute -left-[15%] top-[35%] h-[60vh] w-[60vh] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.72 0.06 168 / 0.35), transparent 70%)",
        }}
      />
    </div>
  );
}
