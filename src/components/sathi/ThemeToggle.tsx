import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useTheme();
  const dark = theme === "dark";

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setTheme(dark ? "light" : "dark")}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="grid h-12 w-12 place-items-center rounded-2xl bg-panel text-foreground shadow-sm hover:bg-secondary"
      >
        {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <div className="inline-flex rounded-2xl bg-secondary p-1" role="group" aria-label="Appearance">
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={!dark}
        className={
          "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium " +
          (!dark ? "bg-panel text-foreground shadow-sm" : "text-muted-foreground")
        }
      >
        <Sun className="h-4 w-4" /> Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={dark}
        className={
          "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium " +
          (dark ? "bg-panel text-foreground shadow-sm" : "text-muted-foreground")
        }
      >
        <Moon className="h-4 w-4" /> Dark
      </button>
    </div>
  );
}
