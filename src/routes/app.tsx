import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, Send, QrCode, Receipt, CreditCard, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AssistantOverlay } from "@/components/sathi/AssistantOverlay";
import "@/i18n/config";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Sathi — Your money, calm" }] }),
  component: AppShell,
});

type Tab = { to: string; label: string; icon: LucideIcon };
const TABS: Tab[] = [
  { to: "/app", label: "Home", icon: Home },
  { to: "/app/send", label: "Send", icon: Send },
  { to: "/app/receive", label: "Receive", icon: QrCode },
  { to: "/app/history", label: "History", icon: Receipt },
  { to: "/app/cards", label: "Cards", icon: CreditCard },
  { to: "/app/profile", label: "Profile", icon: User },
];

function AppShell() {
  const loc = useLocation();
  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div className="pb-28">
        <Outlet />
      </div>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-foreground/10 bg-background/95 backdrop-blur-md"
      >
        <ul className="mx-auto flex max-w-2xl items-stretch justify-between px-2 py-2">
          {TABS.map((t) => {
            const active =
              t.to === "/app" ? loc.pathname === "/app" : loc.pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <li key={t.to} className="flex-1">
                <Link
                  to={t.to}
                  className={
                    "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors " +
                    (active ? "text-emerald" : "text-foreground/55 hover:text-foreground")
                  }
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  <span>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <AssistantOverlay />
    </div>
  );
}
