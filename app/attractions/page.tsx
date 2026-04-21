import { ATTRACTIONS, ACROPOLIS } from "@/lib/data";

export const metadata = { title: "אטרקציות — אתונה 2026" };

export default function AttractionsPage() {
  return (
    <div>
      <h1 className="page-title">🗺️ אטרקציות</h1>
      <p className="page-sub">{ATTRACTIONS.length} אטרקציות בלוז + מידע על האקרופוליס (אופציונלי)</p>

      <section className="mb-8">
        <h2 className="section-title">🏛️ האקרופוליס (אופציונלי)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {ACROPOLIS.map((a, idx) => (
            <div key={idx} className="card bg-blue-50 border-blue-200">
              <h3 className="text-xl font-extrabold text-brand">{a.name}</h3>
              <div className="text-sm text-slate-500 italic mb-2">{a.english}</div>
              <p className="text-sm mb-3">{a.description}</p>
              <div className="text-xs text-amber-800 bg-amber-50 rounded p-2">💡 {a.notes}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">🎯 אטרקציות בלוז</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {ATTRACTIONS.map((a, idx) => (
            <div key={idx} className="card">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-extrabold text-brand">{a.name}</h3>
                <span className="chip bg-slate-100 text-slate-700">{a.category}</span>
              </div>
              <p className="text-sm mb-3">{a.description}</p>
              <div className="text-xs text-slate-600 mb-2">💡 {a.practicalNotes}</div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <span className="chip bg-emerald-50 text-emerald-800">💶 {a.price}</span>
                <span className="chip bg-blue-50 text-blue-800">♿ {a.accessibility}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
