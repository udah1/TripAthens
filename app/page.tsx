import Link from "next/link";
import { TRIP_META, PASSENGERS, ITINERARY, DAY_LABELS, DAY_COLORS, type DayKey } from "@/lib/data";
import DaySummaryCard from "@/components/DaySummaryCard";

const dayKeys: DayKey[] = ["יום א", "יום ב", "יום ג", "יום ד"];

const NAV_CARDS = [
  { href: "/schedule", emoji: "📅", title: "לוז הטיול", desc: "תוכנית יום-יום מפורטת" },
  { href: "/tasks", emoji: "✅", title: "משימות", desc: "מה צריך להזמין לפני הטיסה" },
  { href: "/packing", emoji: "🧳", title: "מה לקחת", desc: "רשימת אריזה לחו\"ל" },
  { href: "/costs", emoji: "💰", title: "עלויות", desc: "פירוט טיסה, מלון, פעילויות" },
  { href: "/passengers", emoji: "👥", title: "נוסעים", desc: "12 משתתפים ופירוט אישי" },
  { href: "/restaurants", emoji: "🍽️", title: "מסעדות כשרות", desc: "בשרי + חלבי באתונה" },
  { href: "/attractions", emoji: "🗺️", title: "אטרקציות", desc: "מה לראות ולעשות" },
  { href: "/sim", emoji: "📱", title: "סים / eSIM", desc: "חיבור לאינטרנט ביוון" },
  { href: "/chat", emoji: "💬", title: "סוכן AI", desc: "שאל שאלות על הטיול" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="card mb-8 bg-gradient-to-bl from-day1 via-white to-day2">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🇬🇷</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand">{TRIP_META.title}</h1>
        </div>
        <p className="text-lg md:text-xl text-slate-700 font-semibold">
          {TRIP_META.groupSize} משתתפים · כשרים · {TRIP_META.hotel}
        </p>
        <div className="grid md:grid-cols-3 gap-3 mt-5 text-sm">
          <InfoBox title="✈️ טיסות" value={TRIP_META.airlineFlight} />
          <FlightBox
            title="🛬 הלוך"
            value={TRIP_META.outbound}
            flightNumber="GQ721"
            icao="SEH721"
          />
          <FlightBox
            title="🛫 חזור"
            value={TRIP_META.inbound}
            flightNumber="GQ720"
            icao="SEH720"
          />
        </div>
      </section>

      {/* לפני הטיסה — כרטיס בולט */}
      <section className="mb-8">
        <Link
          href="/before-flight"
          className="card block bg-gradient-to-l from-emerald-50 via-white to-emerald-50 border-2 border-emerald-300 hover:border-emerald-500 hover:shadow-lg transition group"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-3xl md:text-4xl shrink-0">✈️</div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                <h2 className="text-lg md:text-xl font-extrabold text-brand">
                  לפני הטיסה — מה חשוב להכין?
                </h2>
                <span className="chip bg-emerald-600 text-white text-[11px] md:text-xs font-bold whitespace-nowrap">
                  🛡️ ביטוח חינם!
                </span>
              </div>
              <p className="text-sm text-slate-600">
                ביטוח נסיעות (חינם ללקוחות ישרכארט), eSIM, מפות offline,
                רשימת אריזה וטיפים להכנה.
              </p>
            </div>
            <div className="text-brand-accent text-2xl shrink-0 group-hover:translate-x-[-4px] transition">
              ←
            </div>
          </div>
        </Link>
      </section>

      {/* עץ משפחתי */}
      <section className="mb-8">
        <h2 className="section-title">👨‍👩‍👧‍👦 המשפחה</h2>
        <div className="card bg-gradient-to-b from-sky-50/60 to-white">
          <FamilyTree />
        </div>
      </section>

      {/* תקציר ימים */}
      <section className="mb-8">
        <h2 className="section-title">📅 סקירה מהירה</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {dayKeys.map((day) => {
            const items = ITINERARY.filter((i) => i.day === day);
            return <DaySummaryCard key={day} day={day} items={items} />;
          })}
        </div>
      </section>

      {/* הערות חשובות */}
      <section className="mb-8">
        <h2 className="section-title">⚠️ הערות חשובות</h2>
        <div className="card bg-amber-50 border-amber-300">
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>⚠️ <strong>תשלום מלון אוטומטי ב-19 אפריל</strong> — ודאו שהכרטיס תקין!</li>
            <li>⚠️ <strong>צ'ק-אין מ-15:00</strong> — הטיסה נוחתת ב-08:45. להפקיד מזוודות בקבלה.</li>
            <li>⚠️ <strong>צ'ק-אאוט עד 12:00</strong> — לתאם אחסון מזוודות עד הטיסה (20:30).</li>
            <li>⚠️ <strong>בשדה התעופה לא יאוחר מ-18:00 ביום 29/4</strong></li>
            <li>💡 <strong>צ'ק-אין אונליין</strong> פותח 48 שעות לפני — יום שישי 24/4 מ-06:30</li>
            <li>💡 <strong>נפפליאו:</strong> קחו אוכל כשר מהמלון — אין כשרות בדרך!</li>
          </ul>
        </div>
      </section>

      {/* ניווט */}
      <section className="mb-8">
        <h2 className="section-title">🧭 ניווט מהיר</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {NAV_CARDS.map((c) => (
            <Link key={c.href} href={c.href} className="card hover:scale-[1.02] transition text-center">
              <div className="text-4xl mb-2">{c.emoji}</div>
              <div className="font-bold text-brand">{c.title}</div>
              <div className="text-xs text-slate-500 mt-1">{c.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* הורדות */}
      <section className="mb-8">
        <h2 className="section-title">📥 הורדות</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <a
            href="/downloads/athens_full_plan.pdf"
            download
            className="card hover:shadow-lg hover:border-rose-300 border border-transparent transition flex items-center gap-3"
          >
            <div className="text-4xl">📄</div>
            <div className="flex-1">
              <div className="font-bold text-brand">תוכנית מלאה (PDF)</div>
              <div className="text-xs text-slate-500">לצפייה והדפסה · 2.3MB</div>
            </div>
            <div className="chip bg-rose-100 text-rose-800 text-xs font-bold">
              הורד ↓
            </div>
          </a>
          <a
            href="/downloads/athens_trip_full.xlsx"
            download
            className="card hover:shadow-lg hover:border-emerald-300 border border-transparent transition flex items-center gap-3"
          >
            <div className="text-4xl">📊</div>
            <div className="flex-1">
              <div className="font-bold text-brand">לוז ועלויות (Excel)</div>
              <div className="text-xs text-slate-500">לעריכה אישית · 20KB</div>
            </div>
            <div className="chip bg-emerald-100 text-emerald-800 text-xs font-bold">
              הורד ↓
            </div>
          </a>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="section-title">💰 תקציב משוער לאדם</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="card bg-gradient-to-br from-emerald-50 to-white">
            <div className="text-sm text-slate-500">מבוגר (בסיס)</div>
            <div className="text-3xl font-extrabold text-brand">~599 €</div>
            <div className="text-sm text-slate-600">~2,144 ₪</div>
            <div className="text-xs text-slate-400 mt-2">טיסה + מלון + פעילויות + אוכל</div>
          </div>
          <div className="card bg-gradient-to-br from-sky-50 to-white">
            <div className="text-sm text-slate-500">ילד / נוער</div>
            <div className="text-3xl font-extrabold text-brand">~517 €</div>
            <div className="text-sm text-slate-600">~1,851 ₪</div>
            <div className="text-xs text-slate-400 mt-2">הנחות כניסה + פחות אוכל</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">* {TRIP_META.exchangeRate} · לא כולל קניות אישיות. לפירוט מלא ראו <Link className="text-brand-accent underline" href="/costs">דף העלויות</Link>. {PASSENGERS.length} נוסעים.</p>
      </section>
    </div>
  );
}

function InfoBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white/70 rounded-xl p-3 border border-white">
      <div className="text-xs text-slate-500 font-bold">{title}</div>
      <div className="text-sm font-semibold text-brand">{value}</div>
    </div>
  );
}

function FlightBox({
  title,
  value,
  flightNumber,
  icao,
}: {
  title: string;
  value: string;
  flightNumber: string;
  icao: string;
}) {
  const faUrl = `https://flightaware.com/live/flight/${icao}`;
  const frUrl = `https://www.flightradar24.com/data/flights/${flightNumber.toLowerCase()}`;
  return (
    <div className="bg-white/70 rounded-xl p-3 border border-white">
      <div className="text-xs text-slate-500 font-bold">{title}</div>
      <div className="text-sm font-semibold text-brand">{value}</div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <a
          href={faUrl}
          target="_blank"
          rel="noreferrer"
          className="chip bg-sky-100 hover:bg-sky-200 text-sky-800 inline-flex items-center gap-1"
          title={`סטטוס ${flightNumber} ב-FlightAware`}
        >
          FlightAware
        </a>
        <a
          href={frUrl}
          target="_blank"
          rel="noreferrer"
          className="chip bg-emerald-100 hover:bg-emerald-200 text-emerald-800 inline-flex items-center gap-1"
          title={`מפה חיה של ${flightNumber} ב-FlightRadar24`}
        >
          FlightRadar24
        </a>
      </div>
    </div>
  );
}

function Person({
  name,
  age,
  gender,
  note,
  emphasis,
}: {
  name: string;
  age: number;
  gender: "m" | "f";
  note?: string;
  emphasis?: boolean;
}) {
  const icon = gender === "f" ? "👩" : "👨";
  const isKid = age < 18;
  const kidIcon = gender === "f" ? "👧" : "👦";
  const displayIcon = isKid ? kidIcon : icon;
  return (
    <div
      className={`inline-flex flex-col items-center rounded-xl px-2.5 py-1.5 border text-center min-w-[70px] ${
        emphasis
          ? "bg-amber-50 border-amber-300"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      <div className="text-xl leading-none">{displayIcon}</div>
      <div className="font-bold text-brand text-sm leading-tight mt-0.5">{name}</div>
      <div className="text-[11px] text-slate-500">גיל {age}</div>
      {note && <div className="text-[10px] text-amber-700 font-semibold mt-0.5">{note}</div>}
    </div>
  );
}

function FamilyTree() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* דור 1: הסבתא */}
      <Person name="חנה" age={75} gender="f" emphasis />

      {/* קו אנכי מהסבתא למטה */}
      <div className="w-0.5 h-4 bg-slate-300"></div>

      {/* תווית: כל ילדיה של חנה שבטיול */}
      <div className="text-xs text-slate-500 font-semibold">משפחת חורי גדולה</div>

      {/* דור 2: ילדי חנה ומשפחותיהם */}
      <div className="flex flex-wrap items-start justify-center gap-6 md:gap-10 relative">
        {/* אחים לא נשואים: נאוה + יהודה באותה שורה */}
        <div className="flex items-start gap-2">
          <Person name="נאוה" age={51} gender="f" />
          <Person name="יהודה" age={42} gender="m" />
        </div>
        
        {/* משפחה: אדיר + הילה + 4 ילדים */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-slate-500 font-semibold">משפחת חורי קטנה</div>
          <div className="flex items-center gap-2">
            <Person name="אדיר" age={48} gender="m" />
            <span className="text-rose-400 text-xl">♥</span>
            <Person name="הילה" age={44} gender="f" />
          </div>
          <div className="w-0.5 h-3 bg-slate-300"></div>
          <div className="text-[11px] text-slate-500 font-semibold">הילדים שלהם</div>
          <div className="flex flex-wrap justify-center gap-2">
            <Person name="עדי" age={18} gender="f" />
            <Person name="נועם" age={16} gender="m" />
            <Person name="שירה" age={15} gender="f" />
            <Person name="כפיר" age={11} gender="m" />
          </div>
        </div>
      </div>

      {/* מפריד עדין */}
      <div className="w-full max-w-xs h-px bg-slate-200 my-2"></div>

      {/* משפחת זוגי — נכדות חנה מבת אחרת שאינה בטיול */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-slate-500 font-semibold text-center">
          משפחת זוגי
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Person name="אור" age={21} gender="f" />
          <Person name="אגם" age={20} gender="f" />
          <Person name="יובל" age={19} gender="f" />
        </div>
      </div>

      {/* סיכום */}
      <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 w-full text-center">
        סה"כ <span className="font-bold text-brand">12 נפשות</span> · 8 נשים ו-4 גברים · 8 מבוגרים ו-4 ילדים
      </div>
    </div>
  );
}
