import { ITINERARY, type DayKey } from "@/lib/data";

/** מרכז אתונה (ליד סינטגמה / המלון) */
export const ATHENS_LAT = 37.9755;
export const ATHENS_LON = 23.7348;

export interface TripWeatherDay {
  dayKey: DayKey;
  dateDmy: string; // 26/04/2026
  isoDate: string;
  maxC: number;
  minC: number;
  weathercode: number;
  emoji: string;
  shortLabel: string; // שתי מילים לבערך
  detailLabel: string; // טקסט מעט יותר ארוך לדף הבית
  precipProb: number | null; // 0–100
}

export interface TripWeatherResult {
  ok: boolean;
  error?: string;
  days: TripWeatherDay[];
  fetchedAt: string; // ISO
}

const dayOrder: DayKey[] = ["יום א", "יום ב", "יום ג", "יום ד"];

function dmyToIso(dmy: string): string {
  const [dd, mm, yyyy] = dmy.split("/").map((s) => s.trim());
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export function getTripDatePerDay(): { dayKey: DayKey; dateDmy: string; iso: string }[] {
  return dayOrder.map((dayKey) => {
    const first = ITINERARY.find((i) => i.day === dayKey);
    const dateDmy = first?.date ?? "";
    return { dayKey, dateDmy, iso: dmyToIso(dateDmy) };
  });
}

/** מיפוי WMO (Open-Meteo) לעברית קצרה + אמוג'י */
export function wmoToHebrew(
  code: number,
): { emoji: string; shortLabel: string; detailLabel: string } {
  if (code === 0) {
    return { emoji: "☀️", shortLabel: "בהיר", detailLabel: "בהיר ושמשי" };
  }
  if (code === 1) {
    return { emoji: "🌤️", shortLabel: "מעונן מעט", detailLabel: "רוב הזמן בהיר" };
  }
  if (code === 2) {
    return { emoji: "⛅", shortLabel: "מעונן חלקי", detailLabel: "מעונן חלקית" };
  }
  if (code === 3) {
    return { emoji: "☁️", shortLabel: "מעונן", detailLabel: "מעונן" };
  }
  if (code === 45 || code === 48) {
    return { emoji: "🌫️", shortLabel: "ערפל", detailLabel: "ערפל / ערפל קרח" };
  }
  if (code >= 51 && code <= 55) {
    return { emoji: "🌦️", shortLabel: "טפטוף", detailLabel: "טפטוף קל" };
  }
  if (code >= 61 && code <= 65) {
    return { emoji: "🌧️", shortLabel: "גשם", detailLabel: "גשם" };
  }
  if (code >= 71 && code <= 77) {
    return { emoji: "❄️", shortLabel: "שלג", detailLabel: "שלג" };
  }
  if (code === 80 || code === 81 || code === 82) {
    return { emoji: "🌧️", shortLabel: "ממטרים", detailLabel: "ממטרים" };
  }
  if (code === 85 || code === 86) {
    return { emoji: "🌨️", shortLabel: "מושלג", detailLabel: "ממטרי שלג" };
  }
  if (code >= 95) {
    return { emoji: "⛈️", shortLabel: "סערות", detailLabel: "רעמים / סערה" };
  }
  return { emoji: "🌤️", shortLabel: "מעורב", detailLabel: "מזג אוויר מעורב" };
}

interface OpenMeteoDaily {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max?: number[];
}

interface OpenMeteoResponse {
  daily?: OpenMeteoDaily;
  reason?: string;
}

export async function fetchTripWeather(): Promise<TripWeatherResult> {
  const perDay = getTripDatePerDay().filter((d) => d.iso);
  if (perDay.length === 0) {
    return { ok: false, error: "no_dates", days: [], fetchedAt: new Date().toISOString() };
  }
  const isos = perDay.map((d) => d.iso).sort();
  const start = isos[0]!;
  const end = isos[isos.length - 1]!;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(ATHENS_LAT));
  url.searchParams.set("longitude", String(ATHENS_LON));
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);
  url.searchParams.set("daily", "weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max");
  url.searchParams.set("timezone", "Europe/Athens");

  let res: Response;
  try {
    res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return { ok: false, error: msg, days: [], fetchedAt: new Date().toISOString() };
  }
  if (!res.ok) {
    return { ok: false, error: `HTTP ${res.status}`, days: [], fetchedAt: new Date().toISOString() };
  }

  const data = (await res.json()) as OpenMeteoResponse;
  const daily = data.daily;
  if (!daily?.time?.length) {
    return { ok: false, error: data.reason || "no_daily", days: [], fetchedAt: new Date().toISOString() };
  }

  const byIso = new Map<string, number>();
  for (let i = 0; i < daily.time.length; i++) {
    byIso.set(daily.time[i]!, i);
  }

  const days: TripWeatherDay[] = [];
  for (const { dayKey, dateDmy, iso } of perDay) {
    const idx = byIso.get(iso);
    if (idx === undefined) continue;
    const code = daily.weathercode[idx] ?? 0;
    const maxC = Math.round(daily.temperature_2m_max[idx] ?? 0);
    const minC = Math.round(daily.temperature_2m_min[idx] ?? 0);
    const w = wmoToHebrew(code);
    const precip = daily.precipitation_probability_max?.[idx];
    days.push({
      dayKey,
      dateDmy,
      isoDate: iso,
      maxC,
      minC,
      weathercode: code,
      emoji: w.emoji,
      shortLabel: w.shortLabel,
      detailLabel: w.detailLabel,
      precipProb: typeof precip === "number" ? Math.round(precip) : null,
    });
  }

  return { ok: true, days, fetchedAt: new Date().toISOString() };
}
