import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Settings, Globe, LogOut, RefreshCcw, HelpCircle } from "lucide-react";

import { useBank, bank as bankApi } from "@/lib/bank-state";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — Sathi" }] }),
  component: Profile,
});

function Profile() {
  const bank = useBank();
  return (
    <main className="mx-auto max-w-2xl px-5 pt-8">
      <header className="flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald text-emerald-foreground font-display text-2xl font-semibold">
          {bank.accountHolder[0]}
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold">{bank.accountHolder}</h1>
          <p className="text-sm text-foreground/60">{bank.upiId}</p>
        </div>
      </header>

      <ul className="mt-8 divide-y divide-foreground/8 rounded-2xl bg-secondary/60">
        <Row to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
        <Row to="/help" icon={<LifeBuoy className="h-5 w-5" />} label="Help & Support" />
        <Row to="/settings" icon={<Globe className="h-5 w-5" />} label="Language" />
        <Row to="/settings" icon={<HelpCircle className="h-5 w-5" />} label="About Sathi" />
      </ul>

      <button
        type="button"
        onClick={() => {
          bankApi.reset();
        }}
        className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-4 text-sm font-medium text-foreground/70"
      >
        <RefreshCcw className="h-5 w-5" /> Reset demo data
      </button>

      <Link
        to="/"
        className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-brick/10 px-4 py-4 text-sm font-medium text-brick"
      >
        <LogOut className="h-5 w-5" /> Sign out (demo)
      </Link>

      <p className="mt-6 text-center text-xs text-foreground/40">
        Sathi demo · No real money movement · v4
      </p>
    </main>
  );
}

function Row({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-3 px-4 py-4 text-sm font-medium hover:bg-secondary"
      >
        <span className="text-emerald">{icon}</span>
        {label}
      </Link>
    </li>
  );
}
