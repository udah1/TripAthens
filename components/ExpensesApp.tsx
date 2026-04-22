"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PAYER_ORDER } from "@/lib/trip-content";
import type { Currency, Expense } from "@/lib/expenses";

const STORAGE_KEY = "athens:expenses:password";

interface FormState {
  id: string | null;
  description: string;
  amount: string;
  currency: Currency;
  payer: string;
  date: string;
}

function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function emptyForm(): FormState {
  return {
    id: null,
    description: "",
    amount: "",
    currency: "EUR",
    payer: PAYER_ORDER[0] ?? "",
    date: todayISO(),
  };
}

function formatAmount(amount: number, currency: Currency): string {
  const symbol = currency === "EUR" ? "€" : "₪";
  const formatted = amount.toLocaleString("he-IL", {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  });
  return `${symbol}${formatted}`;
}

function formatDateHe(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export default function ExpensesApp() {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [submitting, setSubmitting] = useState(false);

  // טעינת סיסמה מה-localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPassword(stored);
      }
    } catch {
      // ignore
    }
    setAuthChecking(false);
  }, []);

  const loadExpenses = useCallback(async (pwd: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/expenses", {
        headers: { "x-expenses-password": pwd },
        cache: "no-store",
      });
      if (res.status === 401) {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        setPassword(null);
        setAuthError("הסיסמה שגויה או פגה.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינה");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (password) {
      loadExpenses(password);
    }
  }, [password, loadExpenses]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const pwd = passwordInput.trim();
    if (!pwd) return;
    try {
      const res = await fetch("/api/expenses/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (!res.ok) {
        setAuthError("סיסמה שגויה");
        return;
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, pwd);
      } catch {
        // ignore
      }
      setPassword(pwd);
      setPasswordInput("");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "שגיאה");
    }
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setPassword(null);
    setExpenses([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setError(null);

    const amount = parseFloat(form.amount);
    if (!form.description.trim()) {
      setError("צריך למלא תיאור");
      return;
    }
    if (!isFinite(amount) || amount <= 0) {
      setError("הסכום חייב להיות גדול מ-0");
      return;
    }
    if (!form.payer.trim()) {
      setError("בחרו מי שילם");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) {
      setError("תאריך לא תקין");
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = !!form.id;
      const res = await fetch("/api/expenses", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-expenses-password": password,
        },
        body: JSON.stringify({
          id: form.id ?? undefined,
          description: form.description.trim(),
          amount,
          currency: form.currency,
          payer: form.payer,
          date: form.date,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setForm(emptyForm());
      await loadExpenses(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בשמירה");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setForm({
      id: expense.id,
      description: expense.description,
      amount: String(expense.amount),
      currency: expense.currency,
      payer: expense.payer,
      date: expense.date,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancelEdit = () => {
    setForm(emptyForm());
  };

  const handleDelete = async (expense: Expense) => {
    if (!password) return;
    if (!window.confirm(`למחוק את "${expense.description}"?`)) return;
    setError(null);
    try {
      const res = await fetch(
        `/api/expenses?id=${encodeURIComponent(expense.id)}`,
        {
          method: "DELETE",
          headers: { "x-expenses-password": password },
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      await loadExpenses(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה במחיקה");
    }
  };

  const totals = useMemo(() => {
    const byCurrency: Record<Currency, number> = { ILS: 0, EUR: 0 };
    const byPayer: Record<string, { ILS: number; EUR: number }> = {};
    for (const e of expenses) {
      byCurrency[e.currency] += e.amount;
      if (!byPayer[e.payer]) byPayer[e.payer] = { ILS: 0, EUR: 0 };
      byPayer[e.payer][e.currency] += e.amount;
    }
    const payerList = Object.entries(byPayer).sort((a, b) => {
      const ai = PAYER_ORDER.findIndex((p) => a[0].includes(p));
      const bi = PAYER_ORDER.findIndex((p) => b[0].includes(p));
      const aRank = ai === -1 ? 999 : ai;
      const bRank = bi === -1 ? 999 : bi;
      return aRank - bRank;
    });
    return { byCurrency, payerList };
  }, [expenses]);

  // ─── מסך התחברות ──────────────────────────────────────────────────────
  if (authChecking) {
    return (
      <div className="card text-center text-slate-500">טוען…</div>
    );
  }

  if (!password) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <h2 className="text-xl font-extrabold text-brand mb-2">
            🔒 כניסה למעקב תשלומים
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            הקלידו את הסיסמה המשותפת של הקבוצה (תשמר במכשיר — לא תצטרכו שוב).
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="סיסמה"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {authError && (
              <div className="text-sm text-red-600">{authError}</div>
            )}
            <button
              type="submit"
              className="px-4 py-3 rounded-xl bg-brand text-white font-bold hover:opacity-90 transition"
            >
              כניסה
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── מסך ראשי ──────────────────────────────────────────────────────────
  const isEdit = !!form.id;
  return (
    <div className="space-y-6">
      {/* טופס הוספה/עריכה */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-extrabold text-brand">
            {isEdit ? "✏️ עריכת תשלום" : "➕ הוספת תשלום"}
          </h2>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
            title="יציאה"
          >
            יציאה
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-slate-700 block mb-1">
              תיאור
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder='למשל: "מונית מהשדה", "ארוחת ערב Shuk"'
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-1">
              סכום
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value as Currency })
                }
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="EUR">€ EUR</option>
                <option value="ILS">₪ ILS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-1">
              מי שילם?
            </label>
            <select
              value={form.payer}
              onChange={(e) => setForm({ ...form, payer: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {PAYER_ORDER.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-1">
              תאריך
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="md:col-span-2 flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-xl bg-brand text-white font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "שומר…" : isEdit ? "שמור שינויים" : "הוסף תשלום"}
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-3 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 transition"
              >
                ביטול
              </button>
            )}
          </div>

          {error && (
            <div className="md:col-span-2 text-sm text-red-600">{error}</div>
          )}
        </form>
      </section>

      {/* סיכום */}
      <section className="card">
        <h2 className="text-xl font-extrabold text-brand mb-3">📊 סיכום</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="chip bg-emerald-100 text-emerald-800 text-sm font-bold">
            סה״כ: {formatAmount(totals.byCurrency.EUR, "EUR")}
          </div>
          <div className="chip bg-sky-100 text-sky-800 text-sm font-bold">
            סה״כ: {formatAmount(totals.byCurrency.ILS, "ILS")}
          </div>
        </div>

        {totals.payerList.length === 0 ? (
          <div className="text-sm text-slate-500">
            אין עדיין תשלומים. הוסיפו את הראשון למעלה ↑
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-700">לפי משלם:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {totals.payerList.map(([payer, amounts]) => (
                <div
                  key={payer}
                  className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2"
                >
                  <div className="font-bold text-brand">{payer}</div>
                  <div className="flex gap-2 text-sm">
                    {amounts.EUR > 0 && (
                      <span className="text-emerald-700 font-semibold">
                        {formatAmount(amounts.EUR, "EUR")}
                      </span>
                    )}
                    {amounts.ILS > 0 && (
                      <span className="text-sky-700 font-semibold">
                        {formatAmount(amounts.ILS, "ILS")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* רשימה */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">💳 כל התשלומים</h2>
          {loading && (
            <span className="text-xs text-slate-500">מרענן…</span>
          )}
        </div>

        {expenses.length === 0 && !loading ? (
          <div className="card text-center text-slate-500">
            עוד לא נרשמו תשלומים.
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((e) => (
              <div key={e.id} className="card flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <div className="font-bold text-brand truncate">
                      {e.description}
                    </div>
                    <div className="text-lg font-extrabold text-emerald-700">
                      {formatAmount(e.amount, e.currency)}
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    <span>👤 {e.payer}</span>
                    <span>📅 {formatDateHe(e.date)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(e)}
                    className="px-2 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                    title="עריכה"
                  >
                    ✏️ עריכה
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(e)}
                    className="px-2 py-1 rounded-lg text-xs bg-red-50 hover:bg-red-100 text-red-700 transition"
                    title="מחיקה"
                  >
                    🗑️ מחק
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
