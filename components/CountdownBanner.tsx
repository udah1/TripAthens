"use client";

import { useEffect, useState } from "react";

// זמני יעד (שעון ישראל, אפריל = UTC+3)
const OUTBOUND_MS = Date.UTC(2026, 3, 26, 3, 30); // 26/4 06:30 IDT — טיסה הלוך
const RETURN_MS = Date.UTC(2026, 3, 29, 16, 0); // 29/4 19:00 IDT — טיסה חזור (משוער)

function parts(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  return { days, hours, minutes };
}

function formatParts(p: { days: number; hours: number; minutes: number }) {
  const bits: string[] = [];
  if (p.days > 0) bits.push(`${p.days} ${p.days === 1 ? "יום" : "ימים"}`);
  if (p.hours > 0 || p.days > 0)
    bits.push(`${p.hours} ${p.hours === 1 ? "שעה" : "שעות"}`);
  bits.push(`${p.minutes} ${p.minutes === 1 ? "דקה" : "דקות"}`);
  return bits.join(", ");
}

export default function CountdownBanner() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (now == null) return null;

  let targetMs: number;
  let label: string;

  if (now < OUTBOUND_MS) {
    targetMs = OUTBOUND_MS;
    label = "לטיסה הלוך";
  } else if (now < RETURN_MS) {
    targetMs = RETURN_MS;
    label = "לטיסה חזור";
  } else {
    return null; // אחרי הטיול — מוסתר
  }

  const p = parts(targetMs - now);

  return (
    <div className="text-sm text-slate-600 mt-1">
      ⏳ <span className="font-semibold text-brand">{formatParts(p)}</span>{" "}
      <span className="text-slate-500">{label}</span>
    </div>
  );
}
