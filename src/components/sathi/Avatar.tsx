import { initialsOf } from "@/lib/mock";

export function Avatar({
  name,
  color,
  size = 96,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: color, width: size, height: size }}
      className="grid place-items-center rounded-full font-display text-2xl font-semibold text-[#23231F] shadow-[0_6px_16px_-12px_rgba(35,35,31,0.5)]"
    >
      {initialsOf(name)}
    </span>
  );
}
