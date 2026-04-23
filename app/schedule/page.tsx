"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ITINERARY,
  DAY_LABELS,
  DAY_COLORS,
  EZRAIDER_PAIRS,
  EZRAIDER_SOLO,
  type DayKey,
  type ItineraryItem,
} from "@/lib/data";
import type { TripWeatherDay, TripWeatherResult } from "@/lib/weather";
import { ScheduleDayWeatherBadge } from "@/components/ScheduleDayWeatherBadge";

const dayKeys: DayKey[] = ["יום א", "יום ב", "יום ג", "יום ד"];

// פארסר: "26/04/2026" + "11:00-13:00" / "18:00" / "20:00+" → Date
function parseItemDate(it: ItineraryItem): Date | null {
  const [dd, mm, yyyy] = it.date.split("/").map(Number);
  if (!dd || !mm || !yyyy) return null;
  // לוקחים את שעת ההתחלה — חותכים על מקף ומסירים "+"
  const startToken = it.time.split(/[-–]/)[0].replace("+", "").trim();
  const [hh, min] = startToken.split(":").map(Number);
  if (isNaN(hh)) return null;
  // זמן מקומי יווני = אתונה. UTC+3 באפריל (DST). נבנה ב-UTC בצורה עקבית.
  return new Date(Date.UTC(yyyy, mm - 1, dd, hh - 3, min || 0));
}

// מחזיר את index הפעילות "הנוכחית" — האחרונה שהתחילה כבר. אחרת הראשונה.
function findCurrentIndex(now: Date): number {
  let currentIdx = -1;
  for (let i = 0; i < ITINERARY.length; i++) {
    const d = parseItemDate(ITINERARY[i]);
    if (!d) continue;
    if (d.getTime() <= now.getTime()) currentIdx = i;
    else break;
  }
  if (currentIdx === -1) return 0; // הטיול עוד לא התחיל
  return currentIdx;
}

// האם כבר אחרי סוף הטיול?
function isTripOver(now: Date): boolean {
  const last = ITINERARY[ITINERARY.length - 1];
  const d = parseItemDate(last);
  if (!d) return false;
  // סוף יום הטיול = שעת הטיסה + כמה שעות
  return now.getTime() > d.getTime() + 6 * 3600 * 1000;
}

// האם הטיול כבר התחיל (הטיסה נחתה) ועוד לא נגמר
function isTripActive(now: Date): boolean {
  const first = parseItemDate(ITINERARY[0]);
  if (!first) return false;
  return now.getTime() >= first.getTime() && !isTripOver(now);
}

export default function SchedulePage() {
  const [now, setNow] = useState<Date | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [tripActive, setTripActive] = useState<boolean>(false);
  const [tripOver, setTripOver] = useState<boolean>(false);
  const [weatherByDay, setWeatherByDay] = useState<Record<DayKey, TripWeatherDay | undefined>>({
    "יום א": undefined,
    "יום ב": undefined,
    "יום ג": undefined,
    "יום ד": undefined,
  });
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/weather/trip", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as TripWeatherResult;
        if (cancelled || !data?.ok) return;
        const map: Record<DayKey, TripWeatherDay | undefined> = {
          "יום א": undefined,
          "יום ב": undefined,
          "יום ג": undefined,
          "יום ד": undefined,
        };
        for (const d of data.days) map[d.dayKey] = d;
        setWeatherByDay(map);
      } catch {
        // מתעלם — פשוט לא נציג מזג אוויר
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const n = new Date();
      setNow(n);
      setTripActive(isTripActive(n));
      setTripOver(isTripOver(n));
      setCurrentIdx(findCurrentIndex(n));
    };
    update();
    // רענון כל דקה
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  // גלילה לפעילות הנוכחית בטעינה הראשונית (רק אם הטיול פעיל)
  const scrolledRef = useRef(false);
  useEffect(() => {
    if (scrolledRef.current) return;
    if (!tripActive) return;
    if (currentIdx < 0) return;
    const el = itemRefs.current[currentIdx];
    if (!el) return;
    scrolledRef.current = true;
    // מחכים רגע שהדף יסיים לרנדר
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, [tripActive, currentIdx]);

  // נבנה מפה של index גלובלי ב-ITINERARY לפי יום
  const globalIndex = useMemo(() => {
    const m = new Map<ItineraryItem, number>();
    ITINERARY.forEach((it, idx) => m.set(it, idx));
    return m;
  }, []);

  // refs לכותרות הימים (לגלילה מה-chips)
  const dayHeaderRefs = useRef<Record<DayKey, HTMLDivElement | null>>({
    "יום א": null,
    "יום ב": null,
    "יום ג": null,
    "יום ד": null,
  });

  function scrollToDay(day: DayKey) {
    const el = dayHeaderRefs.current[day];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <h1 className="page-title">📅 לוז הטיול</h1>
      <p className="page-sub">תוכנית יום-יום מלאה. צבע = יום. אפור = פעילות ערב.</p>

      {now && tripActive && currentIdx >= 0 && (
        <div className="card mb-6 bg-gradient-to-l from-emerald-50 to-white border-emerald-300">
          <div className="flex items-start gap-3">
            <div className="text-3xl">📍</div>
            <div className="flex-1">
              <div className="text-xs text-emerald-700 font-bold mb-1">עכשיו בטיול</div>
              <div className="font-bold text-brand">
                {ITINERARY[currentIdx].time} · {ITINERARY[currentIdx].activity}
              </div>
              <div className="text-sm text-slate-600">📍 {ITINERARY[currentIdx].location}</div>
            </div>
          </div>
        </div>
      )}

      {/* Chips לקפיצה מהירה בין הימים */}
      <div className="flex flex-wrap gap-2 mb-6">
        {dayKeys.map((day) => (
          <button
            key={day}
            onClick={() => scrollToDay(day)}
            className="chip font-bold text-brand shadow-sm hover:brightness-95 hover:scale-105 transition"
            style={{ background: DAY_COLORS[day] }}
          >
            {DAY_LABELS[day]}
          </button>
        ))}
      </div>

      {now && tripOver && (
        <div className="card mb-6 bg-gradient-to-l from-slate-100 to-white border-slate-300 text-sm text-slate-600">
          ✈️ הטיול הסתיים. ברוכים השבים! מקווים שנהניתם 🇬🇷
        </div>
      )}

      {dayKeys.map((day) => {
        const items = ITINERARY.filter((i) => i.day === day);
        return (
          <section key={day} className="mb-8">
            <div
              ref={(el) => {
                dayHeaderRefs.current[day] = el;
              }}
              className="rounded-t-2xl px-5 py-3 font-bold text-brand shadow-card scroll-mt-4"
              style={{ background: DAY_COLORS[day] }}
            >
              {DAY_LABELS[day]} · {items[0]?.date}
              {weatherByDay[day] && <span className="inline-block w-4" />}
              <ScheduleDayWeatherBadge w={weatherByDay[day]} />
            </div>
            <div className="bg-white rounded-b-2xl border border-slate-200 overflow-hidden">
              {items.map((it, idx) => {
                const gi = globalIndex.get(it) ?? -1;
                const isCurrent = tripActive && gi === currentIdx;
                return (
                  <div
                    key={idx}
                    ref={(el) => {
                      if (gi >= 0) itemRefs.current[gi] = el;
                    }}
                    className={`relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 px-4 md:px-5 py-3 border-t border-slate-100 transition ${
                      it.isEvening ? "bg-slate-100" : ""
                    } ${isCurrent ? "!bg-emerald-100 ring-2 ring-emerald-400 ring-inset" : ""}`}
                  >
                    {isCurrent && (
                      <span className="absolute top-2 left-2 chip bg-emerald-500 text-white">
                        ● עכשיו
                      </span>
                    )}
                    <div className="md:min-w-[110px] font-bold text-brand">
                      {it.isEvening && <span className="ml-1">🌙</span>}
                      {it.time}
                    </div>
                    <div>
                      <div className="font-semibold flex flex-wrap items-center gap-2">
                        {it.activity}
                        {it.activity.toLowerCase().includes("ezraider") && (
                          <EzraiderPairsChip />
                        )}
                      </div>
                      <div className="text-xs text-slate-500">📍 {it.location}</div>
                      {it.description && <div className="text-sm text-slate-700 mt-1">{it.description}</div>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {it.notes && (
                          <span className="chip bg-amber-100 text-amber-800">💡 {it.notes}</span>
                        )}
                        {it.accessible && (
                          <span className="chip bg-emerald-100 text-emerald-800">♿ {it.accessible}</span>
                        )}
                      </div>
                    </div>
                    {it.price && (
                      <div className="text-sm font-semibold text-brand whitespace-nowrap">
                        💶 {it.price}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function EzraiderPairsChip() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="chip bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-semibold"
        title="הצג חלוקה לכלים"
      >
        👥 חלוקה לכלים
      </button>
      {open && (
        <div className="absolute z-20 top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs text-slate-700">
          <div className="font-bold text-brand mb-2">
            חלוקה ל-Ezraider ({EZRAIDER_PAIRS.length + EZRAIDER_SOLO.length} כלים)
          </div>
          <div className="mb-2">
            <div className="font-semibold text-amber-700 mb-1">
              זוגות (2 על כלי):
            </div>
            <ul className="space-y-0.5 pr-2">
              {EZRAIDER_PAIRS.map((p, i) => (
                <li key={i}>
                  • {p.pair[0]} + {p.pair[1]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-sky-700 mb-1">
              בודדים ({EZRAIDER_SOLO.length} כלים):
            </div>
            <div className="text-slate-600">{EZRAIDER_SOLO.join(", ")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
