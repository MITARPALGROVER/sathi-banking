import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useBank, formatINR } from "@/lib/bank-state";

export const Route = createFileRoute("/app/history")({
  head: () => ({ meta: [{ title: "History — Sathi" }] }),
  component: History,
});

type Filter = "all" | "credit" | "debit";

function History() {
  const { t } = useTranslation();
  const bank = useBank();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return bank.transactions
      .filter((t) => (filter === "all" ? true : t.kind === filter))
      .filter((t) =>
        q
          ? (t.party + " " + (t.note ?? "") + " " + (t.category ?? ""))
              .toLowerCase()
              .includes(q.toLowerCase())
          : true,
      );
  }, [bank.transactions, filter, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const t of filtered) {
      const key = new Date(t.ts).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t("history.title", "History")}
      </h1>

      <label className="mt-5 flex items-center gap-2 rounded-full bg-secondary px-4 py-3">
        <Search className="h-4 w-4 text-foreground/50" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("history.searchPlaceholder", "Search by name, category, note")}
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </label>

      <div className="mt-4 flex gap-2">
        {(["all", "credit", "debit"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              "rounded-full px-4 py-2 text-xs font-medium capitalize " +
              (filter === f
                ? "bg-emerald text-emerald-foreground"
                : "bg-secondary text-foreground/70")
            }
          >
            {t(`history.filter.${f}`, f)}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        {grouped.length === 0 && (
          <p className="text-sm text-foreground/60">
            {t("history.empty", "No matching transactions.")}
          </p>
        )}
        {grouped.map(([date, list]) => (
          <section key={date}>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
              {date}
            </p>
            <ul className="mt-2 divide-y divide-foreground/8 rounded-2xl bg-secondary/60">
              {list.map((t) => (
                <li key={t.id} className="flex items-center gap-4 px-4 py-3">
                  <span
                    className={
                      "grid h-10 w-10 place-items-center rounded-full " +
                      (t.kind === "credit" ? "bg-sage/15 text-sage" : "bg-brick/15 text-brick")
                    }
                  >
                    {t.kind === "credit" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.party}</p>
                    <p className="text-xs text-foreground/55">
                      {t.category ?? t.note ?? t.method.toUpperCase()}
                    </p>
                  </div>
                  <p
                    className={
                      "font-mono text-sm font-semibold " +
                      (t.kind === "credit" ? "text-sage" : "text-foreground")
                    }
                  >
                    {t.kind === "credit" ? "+" : "−"}
                    {formatINR(t.amount)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
