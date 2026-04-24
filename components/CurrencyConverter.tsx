"use client";

import { useEffect, useMemo, useState } from "react";

interface FxState {
  rate: number | null;
  date: string | null;
  loading: boolean;
  error: string | null;
}

export default function CurrencyConverter() {
  const [fx, setFx] = useState<FxState>({
    rate: null,
    date: null,
    loading: true,
    error: null,
  });
  const [amount, setAmount] = useState<string>("100");
  const [direction, setDirection] = useState<"EUR_TO_ILS" | "ILS_TO_EUR">(
    "EUR_TO_ILS",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/fx/latest", { cache: "no-store" });
        const j = await res.json();
        if (cancelled) return;
        if (!j.ok) {
          setFx({
            rate: null,
            date: null,
            loading: false,
            error: "לא ניתן לטעון את השער כרגע",
          });
          return;
        }
        setFx({
          rate: j.rates.ILS,
          date: j.date,
          loading: false,
          error: null,
        });
      } catch {
        if (!cancelled)
          setFx({
            rate: null,
            date: null,
            loading: false,
            error: "תקלה בחיבור",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const n = Number(amount.replace(",", "."));
  const converted = useMemo(() => {
    if (!fx.rate || !Number.isFinite(n)) return null;
    return direction === "EUR_TO_ILS" ? n * fx.rate : n / fx.rate;
  }, [fx.rate, n, direction]);

  const fromCode = direction === "EUR_TO_ILS" ? "EUR" : "ILS";
  const toCode = direction === "EUR_TO_ILS" ? "ILS" : "EUR";
  const fromSym = fromCode === "EUR" ? "€" : "₪";
  const toSym = toCode === "EUR" ? "€" : "₪";

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="font-bold text-brand">שער נוכחי</div>
        <div className="text-sm text-slate-600">
          {fx.loading && "טוען…"}
          {fx.error && <span className="text-rose-600">{fx.error}</span>}
          {fx.rate && (
            <>
              <span className="font-bold text-brand">1€ = {fx.rate.toFixed(4)} ₪</span>
              <span className="text-slate-500 text-xs mr-2">· {fx.date}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3" dir="ltr">
        <button
          type="button"
          onClick={() =>
            setDirection((d) =>
              d === "EUR_TO_ILS" ? "ILS_TO_EUR" : "EUR_TO_ILS",
            )
          }
          className="chip bg-slate-100 hover:bg-slate-200 text-slate-700"
          title="החלפת כיוון"
          aria-label="החלפת כיוון"
        >
          🔄 {fromCode} → {toCode}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-600">מ־{fromCode}</span>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-lg font-bold text-brand focus:outline-none focus:border-brand"
              min="0"
              step="0.01"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {fromSym}
            </span>
          </div>
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-600">ל־{toCode}</span>
          <div className="relative">
            <div className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-lg font-bold text-brand">
              {converted == null
                ? "—"
                : converted.toLocaleString("he-IL", {
                    maximumFractionDigits: 2,
                  })}
            </div>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {toSym}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        מקור: Frankfurter / ECB · השער מתעדכן פעם ביום בימי חול. אין כאן עמלות
        המרה של הבנק/כרטיס האשראי שלכם.
      </div>
    </div>
  );
}
