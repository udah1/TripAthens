"use client";

import type { TripWeatherDay } from "@/lib/weather";

export function ScheduleDayWeatherBadge({ w }: { w?: TripWeatherDay }) {
  if (!w) return null;
  return (
    <span
      className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-normal text-slate-600"
      dir="ltr"
    >
      <span className="font-semibold">
        {w.maxC}° / {w.minC}°
      </span>
      <span>· {w.shortLabel}</span>
      <span className="text-sm leading-none" aria-hidden>
        {w.emoji}
      </span>
    </span>
  );
}
