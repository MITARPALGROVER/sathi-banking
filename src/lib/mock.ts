export const MOCK_USER = { name: "Maya" };

export type Contact = { id: string; name: string; color: string };

export const CONTACTS: Contact[] = [
  { id: "sofia", name: "Sofia", color: "oklch(0.78 0.10 65)" },
  { id: "liam", name: "Liam", color: "oklch(0.72 0.09 240)" },
  { id: "amara", name: "Amara", color: "oklch(0.72 0.11 20)" },
  { id: "diego", name: "Diego", color: "oklch(0.70 0.09 156)" },
  { id: "priya", name: "Priya", color: "oklch(0.74 0.11 300)" },
  { id: "kenji", name: "Kenji", color: "oklch(0.72 0.09 40)" },
];

export type Txn = {
  id: string;
  who: string;
  amount: number;
  kind: "credit" | "debit";
  date: string;
};

export const BALANCE = 2480.5;

export function formatMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const RECENT_TXNS: Txn[] = [
  { id: "t1", who: "Sofia", amount: 42, kind: "debit", date: "Today" },
  { id: "t2", who: "Payroll", amount: 1250, kind: "credit", date: "Yesterday" },
  { id: "t3", who: "Diego", amount: 18, kind: "debit", date: "2 days ago" },
  { id: "t4", who: "Refund", amount: 24, kind: "credit", date: "3 days ago" },
];

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
