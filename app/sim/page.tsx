export default function SimPage() {
  return (
    <div>
      <section className="card mb-6 bg-gradient-to-bl from-day1 via-white to-day2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-brand mb-2">
          📱 כרטיס SIM / eSIM לטיול
        </h1>
        <p className="text-slate-600 text-sm">
          אפשרויות לחיבור לאינטרנט ביוון — הורדת eSIM לפני הטיסה או סים פיזי בהגעה.
        </p>
      </section>

      {/* יש eSIM */}
      <section className="card mb-6 border-r-4 border-emerald-500">
        <div className="flex items-center gap-2 mb-3">
          <span className="chip bg-emerald-100 text-emerald-800 text-xs font-bold">
            ✅ מומלץ
          </span>
          <h2 className="text-xl font-bold text-brand">
            אם למכשיר שלכם יש eSIM
          </h2>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 mb-4">
          <div className="font-bold text-lg text-brand mb-1">Firsty</div>
          <div className="text-sm text-slate-700 mb-3">
            אפליקציה שמתקינה eSIM אוטומטית — פשוט, זול ונוח.
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="bg-white rounded-lg p-2">
              <div className="text-xs text-slate-500">מחיר</div>
              <div className="font-bold text-brand">€4.40 ל-4 ימים</div>
            </div>
            <div className="bg-white rounded-lg p-2">
              <div className="text-xs text-slate-500">נפח</div>
              <div className="font-bold text-brand">5GB ליום</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.firsty.app"
              target="_blank"
              rel="noreferrer"
              className="chip bg-brand text-white hover:bg-brand-accent inline-flex items-center gap-1"
            >
              ▶ Google Play
            </a>
            <a
              href="https://firsty.app/"
              target="_blank"
              rel="noreferrer"
              className="chip bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              🌐 אתר רשמי
            </a>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
          <div className="font-bold text-amber-900 mb-1">⏰ מתי להפעיל?</div>
          <div className="text-amber-900">
            יום ראשון בבוקר בשדה התעופה בישראל — לפני הטיסה. ככה תגיעו לאתונה
            עם חיבור מיידי, בלי לחפש Wi-Fi בשדה.
          </div>
        </div>
      </section>

      {/* איך לבדוק אם יש eSIM */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold text-brand mb-3">
          🔍 איך לבדוק אם למכשיר שלי יש eSIM?
        </h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>
            <b>Samsung Galaxy:</b> S20 ומעלה, Z Flip/Fold — הגדרות → חיבורים
            → מנהל כרטיס SIM
          </li>
          <li>
            <b>Google Pixel:</b> Pixel 3 ומעלה
          </li>
          <li>
            <b>בדיקה מהירה:</b> חייגו <code className="bg-slate-100 px-1.5 py-0.5 rounded">*#06#</code>
            {" "}— אם מופיע &ldquo;EID&rdquo;, יש לכם eSIM.
          </li>
        </ul>
      </section>

      {/* אין eSIM */}
      <section className="card mb-6 border-r-4 border-sky-500">
        <div className="flex items-center gap-2 mb-3">
          <span className="chip bg-sky-100 text-sky-800 text-xs font-bold">
            💳 סים פיזי
          </span>
          <h2 className="text-xl font-bold text-brand">
            אם אין למכשיר שלכם eSIM
          </h2>
        </div>

        <p className="text-sm text-slate-700 mb-4">
          תצטרכו לרכוש כרטיס סים פיזי. אפשר בישראל לפני הטיסה, בנתב&quot;ג,
          או בהגעה לאתונה (בשדה התעופה או בעיר). לרכישה ביוון צריך דרכון.
        </p>

        <div className="overflow-x-auto">
          <table className="table text-sm">
            <thead>
              <tr>
                <th className="th">חברה</th>
                <th className="th">איפה לרכוש</th>
                <th className="th">מחיר משוער</th>
                <th className="th">יתרון</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td font-bold">Cosmote</td>
                <td className="td text-xs">חנויות ברחבי אתונה, שדה התעופה</td>
                <td className="td whitespace-nowrap">€15 / 10GB</td>
                <td className="td text-xs">הכיסוי הטוב ביותר ביוון</td>
              </tr>
              <tr>
                <td className="td font-bold">Vodafone GR</td>
                <td className="td text-xs">שדה התעופה, חנויות באתונה</td>
                <td className="td whitespace-nowrap">€15 / 8GB</td>
                <td className="td text-xs">רשת איכותית ויציבה</td>
              </tr>
              <tr>
                <td className="td font-bold">Wind Hellas</td>
                <td className="td text-xs">חנויות ברחבי אתונה</td>
                <td className="td whitespace-nowrap">€10 / 8GB</td>
                <td className="td text-xs">המחיר הזול ביותר</td>
              </tr>
              <tr>
                <td className="td font-bold">חבילת נדידה ישראלית</td>
                <td className="td text-xs">Cellcom / HOT / Pelephone / Partner</td>
                <td className="td whitespace-nowrap">₪50-100 / שבוע</td>
                <td className="td text-xs">נשארים עם אותו מספר, ללא החלפה</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* טיפים */}
      <section className="card">
        <h2 className="text-lg font-bold text-brand mb-3">💡 טיפים</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>📶 ברוב המלונות באתונה יש Wi-Fi חינם — שווה לבדוק אם זה מספיק.</li>
          <li>
            🗺️ הורידו מפות offline של Google Maps (אזור אתונה) לפני הטיסה —
            חוסך נתונים משמעותית.
          </li>
          <li>
            💬 WhatsApp / Messenger / Telegram עובדים מצוין על Wi-Fi —
            לתקשורת עם ישראל לא חייבים חבילת גלישה גדולה.
          </li>
          <li>
            🔋 הפעילו &ldquo;Data Saver&rdquo; במכשיר (אנדרואיד) או &ldquo;Low Data Mode&rdquo;
            (אייפון) לחיסכון בנתונים.
          </li>
        </ul>
      </section>
    </div>
  );
}
