import Link from "next/link";
import BaggageFAQ from "@/components/BaggageFAQ";

export default function BeforeFlightPage() {
  return (
    <div>
      <section className="card mb-6 bg-gradient-to-bl from-day1 via-white to-day2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-brand mb-2">
          ✈️ לפני הטיסה
        </h1>
        <p className="text-slate-600 text-sm">
          כל מה שחשוב להכין ולהפעיל לפני שיוצאים לשדה — ביטוח, אינטרנט,
          מפות, וטיפים אחרונים.
        </p>
      </section>

      {/* ביטוח — הכי חשוב */}
      <section className="card mb-6 border-r-4 border-emerald-500 bg-emerald-50/50">
        <div className="flex items-center gap-2 mb-3">
          <span className="chip bg-emerald-600 text-white text-xs font-bold">
            🛡️ חובה
          </span>
          <h2 className="text-xl font-bold text-brand">
            ביטוח נסיעות — כמעט חינם!
          </h2>
        </div>

        <p className="text-sm text-slate-700 mb-3">
          לכל לקוחות <b>ישרכארט</b>: 5 ימי ביטוח נסיעות <b>חינם</b>
          {" "}(או פחות מ-$1 לכל הטיול שלנו). הביטוח מופעל דרך AIG ומכסה:
          ביטול טיסה, מזוודות, רפואי, ועוד.
        </p>

        <div className="bg-white rounded-xl p-4 mb-3 border border-emerald-200">
          <div className="font-bold text-brand mb-2">איך מפעילים:</div>
          <ol className="list-decimal pr-5 space-y-1 text-sm text-slate-700">
            <li>נכנסים לאתר ישרכארט (קישור למטה)</li>
            <li>לוחצים על &ldquo;להפעלת ביטוח 5 ימים&rdquo;</li>
            <li>ממלאים פרטים אישיים + תאריכי הטיול (26-29/4/2026)</li>
            <li>מקבלים אישור במייל</li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="https://marketing.isracard.co.il/pages/insurance-abroad/"
            target="_blank"
            rel="noreferrer"
            className="chip bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1 font-bold"
          >
            🔗 אתר ישרכארט (מומלץ)
          </a>
          <a
            href="https://sales.aig.co.il/travel/start/c1bc5cdb-5141-473f-bbd3-e65c2a0bd7c5"
            target="_blank"
            rel="noreferrer"
            className="chip bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50"
          >
            🔗 קישור ישיר AIG
          </a>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          💡 אם אתם לקוחות של Cal / MAX — כדאי לבדוק אם גם להם יש הטבת
          ביטוח נסיעות דומה.
        </div>
      </section>

      {/* eSIM */}
      <section className="card mb-6 border-r-4 border-sky-500">
        <div className="flex items-center gap-2 mb-3">
          <span className="chip bg-sky-100 text-sky-800 text-xs font-bold">
            📱 אינטרנט
          </span>
          <h2 className="text-xl font-bold text-brand">
            כרטיס SIM / eSIM
          </h2>
        </div>
        <p className="text-sm text-slate-700 mb-3">
          ההמלצה שלנו: <b>Firsty eSIM</b> — €4.40 ל-4 ימים, 5GB ליום.
          מתקינים לפני הטיסה ומפעילים בשדה בארץ.
        </p>
        <Link href="/sim" className="btn btn-primary inline-flex">
          לפרטים מלאים ←
        </Link>
      </section>

      {/* רשימת אריזה */}
      <section className="card mb-6 border-r-4 border-amber-500">
        <div className="flex items-center gap-2 mb-3">
          <span className="chip bg-amber-100 text-amber-800 text-xs font-bold">
            🧳 אריזה
          </span>
          <h2 className="text-xl font-bold text-brand">רשימת אריזה</h2>
        </div>
        <p className="text-sm text-slate-700 mb-3">
          רשימה מלאה עם תיבות סימון לכל פריט — אפשר למחוק פריטים שלא
          רלוונטיים ולהוסיף משלכם. הכל נשמר אוטומטית.
        </p>
        <Link href="/packing" className="btn btn-primary inline-flex">
          לרשימה ←
        </Link>
      </section>

      {/* משימות */}
      <section className="card mb-6 border-r-4 border-rose-500">
        <div className="flex items-center gap-2 mb-3">
          <span className="chip bg-rose-100 text-rose-800 text-xs font-bold">
            ✅ משימות
          </span>
          <h2 className="text-xl font-bold text-brand">
            משימות לסגירה לפני הטיסה
          </h2>
        </div>
        <p className="text-sm text-slate-700 mb-3">
          הזמנות, אישורים, כרטיסים — כל המשימות לקבוצה מרוכזות בדף אחד.
        </p>
        <Link href="/tasks" className="btn btn-primary inline-flex">
          לרשימת המשימות ←
        </Link>
      </section>

      {/* FAQ כבודה */}
      <BaggageFAQ />

      {/* טיפים נוספים */}
      <section className="card">
        <h2 className="text-lg font-bold text-brand mb-3">💡 טיפים נוספים</h2>
        <ul className="space-y-2 text-sm text-slate-700">
            <li>
            📅 <b>בדקו תוקף דרכון</b> — חייב להיות תקף לפחות 6 חודשים מעבר
            לתאריך החזרה.
            </li>
          <li>
            🗺️ <b>הורידו מפות offline</b> של Google Maps (אזור אתונה +
            נפפליאו) לפני הטיסה — חוסך גלישה משמעותית.
          </li>
          <li>
            📸 <b>צלמו את הדרכון</b> והעלו לענן (Google Drive / iCloud) —
            גיבוי במקרה אובדן.
          </li>
          <li>
            💳 <b>עדכנו את הבנק/חברת האשראי</b> שאתם נוסעים לחו&quot;ל —
            כדי שלא יחסמו לכם כרטיסים.
          </li>
          <li>
            💵 <b>משיכת מזומן</b> — כדאי להגיע עם ~€100-200 במזומן לטיפים
            ומקומות ללא אשראי.
          </li>
          <li>
            💊 <b>תרופות אישיות</b> — שמו במזוודת יד, לא במטען!
          </li>
          <li>
            📱 <b>הורידו WhatsApp / Waze / Google Maps</b> לפני הטיסה עם
            מפות offline.
          </li>
        </ul>
      </section>
    </div>
  );
}
