import { ATTRACTIONS, ACROPOLIS } from "@/lib/data";

export const metadata = { title: "אטרקציות — אתונה 2026" };

function linkLabel(url: string): string {
  if (url.includes("wa.me")) return "WhatsApp";
  if (url.includes("google.com/maps")) return "Google Maps";
  if (url.includes("wikipedia")) return "ויקיפדיה";
  if (url.includes("streetartcities")) return "Street Art Cities";
  if (url.includes("bigbustours")) return "BigBusTours";
  if (url.includes("museumofillusions")) return "אתר המוזיאון";
  if (url.includes("athenslivingmuseum")) return "אתר התיאטרון";
  if (url.includes("theacropolismuseum")) return "אתר המוזיאון";
  return "לאתר";
}

export default function AttractionsPage() {
  return (
    <div>
      <h1 className="page-title">🗺️ אטרקציות</h1>
      <p className="page-sub">{ATTRACTIONS.length} אטרקציות בלוז + מידע על האקרופוליס (אופציונלי)</p>

      <section className="mb-8">
        <h2 className="section-title">🏛️ האקרופוליס (אופציונלי)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {ACROPOLIS.map((a, idx) => (
            <div key={idx} className="card bg-blue-50 border-blue-200 flex flex-col">
              <h3 className="text-xl font-extrabold text-brand">{a.name}</h3>
              <div className="text-sm text-slate-500 italic mb-2">{a.english}</div>
              <p className="text-sm mb-3">{a.description}</p>
              <div className="text-xs text-amber-800 bg-amber-50 rounded p-2 mb-3">💡 {a.notes}</div>
              {a.url && (
                <a
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary text-sm mt-auto self-start"
                >
                  🔗 {linkLabel(a.url)}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">🎯 אטרקציות בלוז</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {ATTRACTIONS.map((a, idx) => (
            <div key={idx} className="card flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-extrabold text-brand">{a.name}</h3>
                <span className="chip bg-slate-100 text-slate-700">{a.category}</span>
              </div>
              <p className="text-sm mb-3">{a.description}</p>
              <div className="text-xs text-slate-600 mb-2">💡 {a.practicalNotes}</div>
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <span className="chip bg-emerald-50 text-emerald-800">💶 {a.price}</span>
                <span className="chip bg-blue-50 text-blue-800">♿ {a.accessibility}</span>
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="chip bg-brand text-white hover:bg-black inline-flex items-center gap-1"
                  >
                    🔗 {linkLabel(a.url)}
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
