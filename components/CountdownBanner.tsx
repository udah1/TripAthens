"use client";

import { useEffect, useState } from "react";

const FLIGHT_MS = Date.UTC(2026, 3, 26, 3, 30); // 26/4/2026 06:30 IDT = 03:30 UTC

function computeParts(target: number) {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

export default function CountdownBanner() {
  const [parts, setParts] = useState<ReturnType<typeof computeParts>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => setParts(computeParts(FLIGHT_MS));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted || !parts) return null;

  const Cell = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white/80 rounded-xl px-3 py-2 min-w-[62px] shadow-sm">
      <div className="text-2xl md:text-3xl font-extrabold text-brand leading-none tabular-nums">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-[10px] md:text-xs text-slate-600 mt-1">{label}</div>
    </div>
  );

  return (
    <section
      className="card mb-4 bg-gradient-to-l from-sky-100 via-white to-emerald-100 border-sky-200"
      dir="rtl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-3xl">✈️</span>
          <div className="min-w-0">
            <div className="font-bold text-brand text-sm md:text-base">
              ספירה לאחור לטיסה
            </div>
            <div className="text-xs text-slate-500">
              26/04/2026 · 06:30 · נתב&quot;ג
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 md:gap-2" dir="ltr">
          <Cell value={parts.days} label="ימים" />
          <Cell value={parts.hours} label="שעות" />
          <Cell value={parts.minutes} label="דקות" />
          <Cell value={parts.seconds} label="שניות" />
        </div>
      </div>
    </section>
  );
}
