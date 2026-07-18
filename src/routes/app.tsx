import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, Send, QrCode, Receipt, CreditCard, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AssistantOverlay } from "@/components/sathi/AssistantOverlay";
import "@/i18n/config";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Sathi — Your money, calm" }] }),
  component: AppShell,
});

type Tab = { to: string; labelKey: string; fallback: string; icon: LucideIcon };

function AppShell() {
  const { t } = useTranslation();
  const loc = useLocation();

  const tabs: Tab[] = [
    { to: "/app", labelKey: "common.home", fallback: "Home", icon: Home },
    { to: "/app/send", labelKey: "common.send", fallback: "Send", icon: Send },
    { to: "/app/receive", labelKey: "common.receive", fallback: "Receive", icon: QrCode },
    { to: "/app/history", labelKey: "common.history", fallback: "History", icon: Receipt },
    { to: "/app/cards", labelKey: "common.cards", fallback: "Cards", icon: CreditCard },
    { to: "/app/profile", labelKey: "common.profile", fallback: "Profile", icon: User },
  ];

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div className="pb-28">
        <Outlet />
      </div>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-foreground/10 bg-background/95 backdrop-blur-md"
      >
        <ul className="mx-auto flex max-w-2xl items-stretch justify-between px-1.5 py-2">
          {tabs.map((tab) => {
            const active =
              tab.to === "/app" ? loc.pathname === "/app" : loc.pathname.startsWith(tab.to);
            const Icon = tab.icon;
            return (
              <li key={tab.to} className="flex-1">
                <Link
                  to={tab.to}
                  className={
                    "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl px-1 sm:px-2 py-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide sm:tracking-wider transition-colors " +
                    (active ? "text-emerald" : "text-foreground/55 hover:text-foreground")
                  }
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  <span className="hidden min-[400px]:inline">{t(tab.labelKey, tab.fallback)}</span>
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
