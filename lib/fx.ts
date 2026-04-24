// Frankfurter.app — חינם, בלי API key. נתוני ECB, עדכון יומי בימי חול.

const BASE = "https://api.frankfurter.app";

export interface FxLatest {
  base: "EUR";
  date: string; // YYYY-MM-DD
  rates: { ILS: number };
}

export interface FxHistorical extends FxLatest {}

export async function fetchLatestEurIls(): Promise<FxLatest | null> {
  try {
    const r = await fetch(`${BASE}/latest?from=EUR&to=ILS`, {
      next: { revalidate: 3600 },
    });
    if (!r.ok) return null;
    const j = await r.json();
    if (!j || typeof j.rates?.ILS !== "number") return null;
    return { base: "EUR", date: j.date, rates: { ILS: j.rates.ILS } };
  } catch {
    return null;
  }
}

// מחזיר שער EUR->ILS לתאריך היסטורי (YYYY-MM-DD).
// Frankfurter מחזיר את השער של יום העבודה האחרון לפני/שווה ל-date.
export async function fetchEurIlsOnDate(
  date: string,
): Promise<FxHistorical | null> {
  try {
    const r = await fetch(`${BASE}/${date}?from=EUR&to=ILS`, {
      next: { revalidate: 86400 * 7 }, // שער היסטורי לא משתנה — קאש שבוע
    });
    if (!r.ok) return null;
    const j = await r.json();
    if (!j || typeof j.rates?.ILS !== "number") return null;
    return { base: "EUR", date: j.date, rates: { ILS: j.rates.ILS } };
  } catch {
    return null;
  }
}
