import { RESTAURANTS } from "@/lib/data";

export const metadata = { title: "אוכל וכשרות — אתונה 2026" };

export default function RestaurantsPage() {
  const meat = RESTAURANTS.filter((r) => r.type === "בשרי");
  const dairy = RESTAURANTS.filter((r) => r.type === "חלבי");

  return (
    <div>
      <h1 className="page-title">🍽️ אוכל וכשרות</h1>
      <p className="page-sub">מסעדות, קניות ואפליקציות כשרות באתונה</p>

      {/* קניות וכשרות */}
      <section className="mb-8">
        <h2 className="section-title">🛒 קניות וכשרות</h2>

        {/* PDF מוצרים */}
        <div className="card mb-4 border-r-4 border-emerald-400">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <div className="font-bold text-brand mb-1">רשימת מוצרים מאושרים — בית חב&quot;ד אתונה</div>
              <p className="text-sm text-slate-600 mb-3">
                ביצים, חלב, שמן, לחם, גבינות ועוד מוצרי בסיס שניתן לקנות בכל סופרמרקט ביוון.
                אושרה על ידי בית חב&quot;ד אתונה.
              </p>
              <a
                href="https://www.chabad.gr/media/pdf/1288/bEWd12889323.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="chip bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-sm transition"
              >
                📥 פתיחת רשימת המוצרים (PDF)
              </a>
            </div>
          </div>
        </div>

        {/* מכולת חב"ד */}
        <div className="card mb-4 border-r-4 border-sky-400">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🏪</span>
            <div>
              <div className="font-bold text-brand mb-1">מכולת כשרה — Gostijo / חב&quot;ד</div>
              <p className="text-sm text-slate-600 mb-1">
                בתוך מסעדת Gostijo (Esopou 10) יש מכולת כשרה קטנה — מוצרי בסיס, שימורים ועוד.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Esopou+10+Athens"
                target="_blank"
                rel="noopener noreferrer"
                className="chip bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-semibold transition"
              >
                🗺️ Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* טיפ */}
        <div className="card bg-amber-50 border border-amber-200 mb-4">
          <p className="text-sm text-amber-800 mb-2">
            💡 <strong>טיפ:</strong> קחו מישראל — שוקולד, ביסקוויטים, ממרחים. הרבה יותר קל מלחפש ביוון.
          </p>
          <p className="text-sm text-amber-800">
            🛒 <strong>סופרמרקטים מומלצים לחיפוש מוצרים כשרים:</strong> AB, Sklavenitis, Bazaar, My Market — לרשתות הגדולות יש יותר מוצרים מיובאים עם הכשר.
          </p>
        </div>

        {/* אפליקציות */}
        <div className="card">
          <div className="font-bold text-brand mb-3">📱 אפליקציות כשרות מומלצות</div>
          <div className="flex flex-col gap-3">
            <AppLink
              href="https://play.google.com/store/apps/details?id=app.kosherscan.kosher_scan&hl=he"
              emoji="📷"
              name="KosherScan"
              desc="סריקת ברקוד של מוצרים — כשר או לא?"
            />
            <AppLink
              href="https://play.google.com/store/apps/details?id=com.kosherNearMe&hl=he"
              emoji="📍"
              name="Kosher Near Me"
              desc="מסעדות ומקומות כשרים בעולם על מפה"
            />
            <AppLink
              href="https://kosher.global/zekasher/"
              emoji="🔍"
              name="ZeKasher"
              desc="מאגר מוצרים כשרים — כולל קטגוריית יוון"
            />
          </div>
        </div>
      </section>

      {/* מסעדות */}
      <section className="mb-4">
        <h2 className="section-title">🥩 מסעדות בשריות</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {meat.map((r, idx) => (
            <RestaurantCard key={idx} r={r} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="section-title">🥛 מסעדות חלביות</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {dairy.map((r, idx) => (
            <RestaurantCard key={idx} r={r} />
          ))}
        </div>
      </section>
    </div>
  );
}

function AppLink({ href, emoji, name, desc }: { href: string; emoji: string; name: string; desc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
    >
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-brand text-sm">{name}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      <span className="text-slate-400 text-xs">←</span>
    </a>
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
