import { RESTAURANTS } from "@/lib/data";

export const metadata = { title: "מסעדות כשרות — אתונה 2026" };

export default function RestaurantsPage() {
  const meat = RESTAURANTS.filter((r) => r.type === "בשרי");
  const dairy = RESTAURANTS.filter((r) => r.type === "חלבי");

  return (
    <div>
      <h1 className="page-title">🍽️ מסעדות כשרות</h1>
      <p className="page-sub">מסעדות בשריות וחלביות באתונה · כולן ליד המלון</p>

      <div className="flex gap-3 mb-6">
        <span className="chip bg-meat text-white">🥩 בשרי</span>
        <span className="chip bg-dairy text-brand">🥛 חלבי</span>
      </div>

      <section className="mb-8">
        <h2 className="section-title">🥩 בשרי</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {meat.map((r, idx) => (
            <RestaurantCard key={idx} r={r} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="section-title">🥛 חלבי</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {dairy.map((r, idx) => (
            <RestaurantCard key={idx} r={r} />
          ))}
        </div>
      </section>
    </div>
  );
}

function RestaurantCard({ r }: { r: typeof RESTAURANTS[number] }) {
  const isMeat = r.type === "בשרי";
  return (
    <div
      className="card"
      style={{
        borderRight: `6px solid ${isMeat ? "#F1948A" : "#AED6F1"}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-xl font-extrabold text-brand">{r.name}</h3>
        <span className={`chip ${isMeat ? "bg-meat text-white" : "bg-dairy text-brand"}`}>{r.type}</span>
      </div>
      <div className="text-sm text-slate-600 mb-1">📍 {r.address}</div>
      <div className="text-sm text-slate-600 mb-3 whitespace-pre-line">🕐 {r.hours}</div>
      <div className="text-xs font-semibold text-brand mb-2">כשרות: {r.kashrut}</div>
      <div className="text-sm mb-2">{r.food}</div>

      {(r.phone || r.whatsapp || r.website) && (
        <div className="flex flex-wrap gap-2 mb-2" dir="ltr">
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              className="chip bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-semibold transition"
              title="לאתר המסעדה"
            >
              🌐 אתר
            </a>
          )}
          {r.phone && (
            <a
              href={`tel:${r.phone}`}
              className="chip bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold transition"
              title="חיוג רגיל (נדידה)"
            >
              📞 {r.phone}
            </a>
          )}
          {r.phone && (
            <a
              href={`tel:${toBezeq013(r.phone)}`}
              className="chip bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-semibold transition"
              title="חיוג דרך 013 בזק בינלאומי (זול מישראל)"
            >
              ☎️ 013
            </a>
          )}
          {r.whatsapp && (
            <a
              href={r.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="chip bg-green-100 hover:bg-green-200 text-green-800 text-xs font-semibold transition"
              title="WhatsApp"
            >
              💬 WhatsApp
            </a>
          )}
        </div>
      )}

      {r.notes && <div className="text-xs text-amber-700 bg-amber-50 rounded p-2 mb-2">💡 {r.notes}</div>}
      {r.whenInSchedule && (
        <div className="text-xs text-slate-500">📅 בלוז: {r.whenInSchedule}</div>
      )}
    </div>
  );
}

// ממיר מספר בפורמט בינלאומי (+30...) לחיוג דרך 013 בזק בינלאומי.
// דוגמה: "+306970252857" -> "013306970252857"
function toBezeq013(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  return `013${digits}`;
}
