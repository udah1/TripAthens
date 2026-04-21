import { ITINERARY, DAY_LABELS, DAY_COLORS, type DayKey } from "@/lib/data";

const dayKeys: DayKey[] = ["יום א", "יום ב", "יום ג", "יום ד"];

export const metadata = { title: "לוז הטיול — אתונה 2026" };

export default function SchedulePage() {
  return (
    <div>
      <h1 className="page-title">📅 לוז הטיול</h1>
      <p className="page-sub">תוכנית יום-יום מלאה. צבע = יום. אפור = פעילות ערב.</p>

      {dayKeys.map((day) => {
        const items = ITINERARY.filter((i) => i.day === day);
        return (
          <section key={day} className="mb-8">
            <div
              className="rounded-t-2xl px-5 py-3 font-bold text-brand shadow-card"
              style={{ background: DAY_COLORS[day] }}
            >
              {DAY_LABELS[day]} · {items[0]?.date}
            </div>
            <div className="bg-white rounded-b-2xl border border-slate-200 overflow-hidden">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 px-4 md:px-5 py-3 border-t border-slate-100 ${
                    it.isEvening ? "bg-slate-100" : ""
                  }`}
                >
                  <div className="md:min-w-[110px] font-bold text-brand">
                    {it.isEvening && <span className="ml-1">🌙</span>}
                    {it.time}
                  </div>
                  <div>
                    <div className="font-semibold">{it.activity}</div>
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
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
