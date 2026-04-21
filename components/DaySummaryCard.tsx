"use client";

import { useState } from "react";
import { DAY_COLORS, DAY_LABELS, type DayKey, type ItineraryItem } from "@/lib/data";

const INITIAL_LIMIT = 4;

export default function DaySummaryCard({
  day,
  items,
}: {
  day: DayKey;
  items: ItineraryItem[];
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > INITIAL_LIMIT;
  const shown = expanded || !hasMore ? items : items.slice(0, INITIAL_LIMIT);

  return (
    <div className="card" style={{ borderTop: `6px solid ${DAY_COLORS[day]}` }}>
      <div className="font-bold text-brand mb-1">{DAY_LABELS[day]}</div>
      <div className="text-xs text-slate-500 mb-2">{items[0]?.date}</div>
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
