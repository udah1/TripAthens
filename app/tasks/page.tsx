import { TASKS } from "@/lib/data";

export const metadata = { title: "משימות — אתונה 2026" };

function renderContact(contact: string) {
  if (!contact) return null;
  const parts = contact.split(/\s*\|\s*/);
  return (
    <span className="space-y-1 block">
      {parts.map((p, i) => {
        const urlMatch = p.match(/https?:\/\/\S+/);
        if (urlMatch) {
          const url = urlMatch[0];
          const before = p.slice(0, p.indexOf(url));
          return (
            <span key={i} className="block text-sm">
              {before}
              <a href={url} target="_blank" rel="noreferrer" className="text-brand-accent underline break-all">
                {url}
              </a>
            </span>
          );
        }
        return <span key={i} className="block text-sm">{p}</span>;
      })}
    </span>
  );
}

export default function TasksPage() {
  return (
    <div>
      <h1 className="page-title">✅ משימות לפני הטיול</h1>
      <p className="page-sub">רשימה של {TASKS.length} משימות. ירוק = הושלם. כתום = פתוח.</p>

      <div className="grid md:grid-cols-2 gap-3">
        {TASKS.map((t, idx) => (
          <div
            key={idx}
            className={`card ${t.done ? "bg-emerald-50 border-emerald-300" : "bg-orange-50 border-orange-300"}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                  t.done ? "bg-emerald-500 text-white" : "bg-white border-2 border-slate-300"
                }`}
              >
                {t.done ? "✓" : ""}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-brand">{t.task}</div>
                {t.contact && <div className="mt-2">{renderContact(t.contact)}</div>}
                {t.notes && <div className="text-xs text-slate-600 mt-2">📝 {t.notes}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
