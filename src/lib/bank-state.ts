// Mock banking state — persisted to localStorage. No real money movement.
import { useEffect, useState } from "react";

export type Txn = {
  id: string;
  kind: "credit" | "debit";
  amount: number;
  party: string;
  note?: string;
  method: "upi" | "bank" | "bill" | "card";
  category?: string;
  ts: number; // epoch ms
};

export type Contact = {
  id: string;
  name: string;
  upi: string;
  phone: string;
  color: string;
};

export type Card = {
  id: string;
  brand: "RuPay" | "Visa";
  last4: string;
  fullNumber: string; // masked reveal
  holder: string;
  expiry: string;
  frozen: boolean;
  dailyLimit: number;
};

export type BankState = {
  accountHolder: string;
  accountNumber: string; // full, mask in UI
  ifsc: string;
  upiId: string;
  balance: number;
  contacts: Contact[];
  transactions: Txn[];
  card: Card;
  pin: string; // mock PIN
};

const STORAGE_KEY = "sathi.bank.v1";

const DEFAULT_CONTACTS: Contact[] = [
  { id: "c1", name: "Priya Sharma", upi: "priya@okhdfc", phone: "9876500001", color: "oklch(0.78 0.10 65)" },
  { id: "c2", name: "Arjun Verma", upi: "arjun.v@oksbi", phone: "9876500002", color: "oklch(0.72 0.09 240)" },
  { id: "c3", name: "Meera Iyer", upi: "meera@okicici", phone: "9876500003", color: "oklch(0.72 0.11 20)" },
  { id: "c4", name: "Rohan Das", upi: "rohan.das@okaxis", phone: "9876500004", color: "oklch(0.70 0.09 156)" },
  { id: "c5", name: "Neha Kapoor", upi: "neha@okpaytm", phone: "9876500005", color: "oklch(0.74 0.11 300)" },
];

const DEFAULT_TRANSACTIONS: Txn[] = [
  { id: "t1", kind: "credit", amount: 42500, party: "Payroll — Acme Pvt Ltd", method: "bank", category: "Salary", ts: Date.now() - 86400000 * 2 },
  { id: "t2", kind: "debit",  amount: 320,   party: "Priya Sharma", method: "upi", note: "Chai", ts: Date.now() - 86400000 * 1 },
  { id: "t3", kind: "debit",  amount: 1499,  party: "Airtel Prepaid", method: "bill", category: "Mobile", ts: Date.now() - 86400000 * 3 },
  { id: "t4", kind: "credit", amount: 500,   party: "Rohan Das", method: "upi", note: "Rickshaw", ts: Date.now() - 86400000 * 4 },
  { id: "t5", kind: "debit",  amount: 2340,  party: "BSES Rajdhani", method: "bill", category: "Electricity", ts: Date.now() - 86400000 * 6 },
  { id: "t6", kind: "debit",  amount: 899,   party: "Tata Sky", method: "bill", category: "DTH", ts: Date.now() - 86400000 * 8 },
];

const DEFAULT_STATE: BankState = {
  accountHolder: "Aarav Mehta",
  accountNumber: "5023 4711 8899 3021",
  ifsc: "HDFC0001729",
  upiId: "aarav@sathibank",
  balance: 48291.75,
  contacts: DEFAULT_CONTACTS,
  transactions: DEFAULT_TRANSACTIONS,
  card: {
    id: "card1",
    brand: "RuPay",
    last4: "3021",
    fullNumber: "5023 4711 8899 3021",
    holder: "AARAV MEHTA",
    expiry: "08/29",
    frozen: false,
    dailyLimit: 50000,
  },
  pin: "1234",
};

function load(): BankState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<BankState>) };
  } catch {
    return DEFAULT_STATE;
  }
}

function save(s: BankState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent("sathi:bank-change"));
  } catch {
    /* no-op */
  }
}

export const bank = {
  get(): BankState {
    return load();
  },
  reset() {
    save(DEFAULT_STATE);
  },
  sendMoney(input: { recipientName: string; upiOrPhone?: string; amount: number; note?: string; method?: "upi" | "bank" }) {
    const s = load();
    if (input.amount <= 0 || input.amount > s.balance) throw new Error("Invalid amount");
    const tx: Txn = {
      id: "t" + Date.now(),
      kind: "debit",
      amount: input.amount,
      party: input.recipientName,
      note: input.note,
      method: input.method ?? "upi",
      ts: Date.now(),
    };
    const next: BankState = {
      ...s,
      balance: +(s.balance - input.amount).toFixed(2),
      transactions: [tx, ...s.transactions],
    };
    save(next);
    return tx;
  },
  payBill(input: { provider: string; category: string; amount: number }) {
    const s = load();
    if (input.amount <= 0 || input.amount > s.balance) throw new Error("Invalid amount");
    const tx: Txn = {
      id: "t" + Date.now(),
      kind: "debit",
      amount: input.amount,
      party: input.provider,
      method: "bill",
      category: input.category,
      ts: Date.now(),
    };
    save({ ...s, balance: +(s.balance - input.amount).toFixed(2), transactions: [tx, ...s.transactions] });
    return tx;
  },
  toggleFreeze() {
    const s = load();
    save({ ...s, card: { ...s.card, frozen: !s.card.frozen } });
    return !s.card.frozen;
  },
  verifyPin(pin: string) {
    return load().pin === pin;
  },
};

// React hook — subscribes to storage changes.
export function useBank(): BankState {
  const [state, setState] = useState<BankState>(() => load());
  useEffect(() => {
    const sync = () => setState(load());
    window.addEventListener("sathi:bank-change", sync);
    window.addEventListener("storage", sync);
    sync();
    return () => {
      window.removeEventListener("sathi:bank-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return state;
}

export function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function maskAccount(n: string): string {
  const digits = n.replace(/\s/g, "");
  const last4 = digits.slice(-4);
  return "•••• •••• •••• " + last4;
}

export function maskCard(n: string): string {
  const digits = n.replace(/\s/g, "");
  const last4 = digits.slice(-4);
  return "•••• •••• •••• " + last4;
}

export function initialsOf(name: string): string {
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
