"use client";

import { useState } from "react";
import { DAY_COLORS, DAY_LABELS, type DayKey, type ItineraryItem } from "@/lib/data";
import type { TripWeatherDay } from "@/lib/weather";

const INITIAL_LIMIT = 4;

export default function DaySummaryCard({
  day,
  items,
  weather,
}: {
  day: DayKey;
  items: ItineraryItem[];
  weather?: TripWeatherDay;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > INITIAL_LIMIT;
  const shown = expanded || !hasMore ? items : items.slice(0, INITIAL_LIMIT);

  return (
    <div className="card" style={{ borderTop: `6px solid ${DAY_COLORS[day]}` }}>
      <div className="font-bold text-brand mb-1">{DAY_LABELS[day]}</div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mb-2">
        <span>{items[0]?.date}</span>
        {weather && (
          <span className="flex items-center gap-1 text-slate-600" dir="ltr">
            <span aria-hidden>{weather.emoji}</span>
            <span className="font-semibold">
              {weather.maxC}° / {weather.minC}°
            </span>
            <span className="text-slate-500">· {weather.shortLabel}</span>
          </span>
        )}
      </div>
      <ul className="text-sm space-y-1">
        {shown.map((it, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="text-slate-500 shrink-0">{it.time}</span>
            <span className="truncate">{it.activity}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs text-brand-accent hover:underline font-semibold"
        >
          {expanded
            ? "פחות ▲"
            : `+ עוד ${items.length - INITIAL_LIMIT} פעילויות ▼`}
        </button>
      )}
    </div>
  );
}
