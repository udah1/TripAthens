import { DAY_COLORS, DAY_LABELS, type DayKey } from "@/lib/data";
import type { TripWeatherDay, TripWeatherResult } from "@/lib/weather";

function dayDataByKey(
  data: TripWeatherResult,
  key: DayKey,
): TripWeatherDay | undefined {
  return data.days.find((d) => d.dayKey === key);
}

export default function TripWeatherHome({ data }: { data: TripWeatherResult }) {
  const dayKeys: DayKey[] = ["יום א", "יום ב", "יום ג", "יום ד"];

  if (!data.ok || data.days.length === 0) {
    return (
      <section className="mb-4">
        <h2 className="section-title">🌤️ מזג אוויר — אתונה</h2>
        <div className="card bg-slate-50 text-slate-600 text-sm text-center py-4">
          תחזית לא זמינה כרגע. נסו לרענן מאוחר יותר.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-4">
      <h2 className="section-title">🌤️ מזג אוויר — אתונה</h2>
      <div className="grid grid-cols-4 gap-1.5 md:gap-3">
        {dayKeys.map((day) => {
          const w = dayDataByKey(data, day);
          const label = DAY_LABELS[day].split("—")[0]?.trim() ?? day;
          if (!w) {
            return (
              <div
                key={day}
                className="card text-center text-slate-500 text-[11px] md:text-sm p-2 md:p-3"
                style={{ borderTop: `4px solid ${DAY_COLORS[day]}` }}
              >
                {label}
                <div className="mt-1">—</div>
              </div>
            );
          }
          return (
            <div
              key={day}
              className="card text-center p-2 md:p-4 flex flex-col items-center shadow-sm"
              style={{ borderTop: `4px solid ${DAY_COLORS[day]}` }}
            >
              <div className="w-full">
                <div className="text-[11px] md:text-xs font-bold text-slate-600 leading-tight">
                  {label}
                </div>
                <div className="text-[10px] md:text-[11px] text-slate-500 mb-1 md:mb-2">
                  {w.dateDmy}
                </div>
                <div className="text-2xl md:text-4xl leading-none mb-1" aria-hidden>
                  {w.emoji}
                </div>
                <div className="text-xs md:text-sm font-bold text-brand">
                  {w.maxC}° / {w.minC}°
                </div>
                <div className="hidden md:block text-xs text-slate-700 mt-1 line-clamp-2">
                  {w.detailLabel}
                </div>
                {w.precipProb != null && w.precipProb > 15 && (
                  <div className="text-[10px] text-sky-600 mt-1">
                    גשם {w.precipProb}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
