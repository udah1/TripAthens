"use client";
import { useState } from "react";

export default function TaxRefundAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <section className="mb-4">
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-right bg-white hover:bg-slate-50 transition"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl">🧾</span>
            <span className="font-bold text-brand">החזר מע&quot;מ לתיירים (Tax Refund)</span>
            <span className="chip bg-emerald-100 text-emerald-800 text-xs font-semibold">עד 15% חזרה!</span>
          </div>
          <span className={`text-slate-400 transition-transform duration-200 text-sm flex-shrink-0 ${open ? "rotate-180" : ""}`}>▼</span>
        </button>

        {open && (
          <div className="px-5 pb-5 pt-2 bg-white border-t border-slate-100 space-y-4 text-sm">

            {/* מי זכאי */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <div className="font-bold text-emerald-800 mb-1">✅ מי זכאי?</div>
              <ul className="space-y-0.5 text-slate-700">
                <li>• <strong>ישראלים זכאים!</strong> — תושבי מדינות מחוץ לאיחוד האירופי</li>
                <li>• קנייה מינימלית: <strong>€50 לקבלה אחת</strong></li>
                <li>• מגיל 18+</li>
              </ul>
            </div>

            {/* כמה מקבלים */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
              <div className="font-bold text-sky-800 mb-1">💰 כמה מחזירים?</div>
              <p className="text-slate-700">מע&quot;מ ביוון = <strong>24%</strong>. בפועל מקבלים בחזרה <strong>12.5%–14.75%</strong> (אחרי עמלות שירות).</p>
              <p className="text-slate-500 text-xs mt-1">קנייה של €200 → החזר של ~€25–30</p>
            </div>

            {/* תהליך */}
            <div>
              <div className="font-bold text-brand mb-2">📋 תהליך — 3 שלבים:</div>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="chip bg-slate-100 text-slate-700 font-bold text-xs h-fit mt-0.5">1</span>
                  <div>
                    <div className="font-semibold">בחנות בזמן הקנייה</div>
                    <div className="text-slate-600">בקשו <strong>&quot;Tax Free&quot;</strong> / &quot;Global Blue form&quot; והציגו דרכון. לא כל חנות משתתפת — חפשו שלט Tax Free. חנויות ב-Ermou ובמונסטיראקי בד&quot;כ כן.</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="chip bg-amber-100 text-amber-800 font-bold text-xs h-fit mt-0.5">2</span>
                  <div>
                    <div className="font-semibold">בשדה התעופה — לפני צ&apos;ק-אין ⚠️</div>
                    <div className="text-slate-600">ללכת ל<strong>Customs Office ממול לדלפק 61</strong> — באותו אולם צ&apos;ק-אין, ~3 דק&apos; הליכה מ-Sky Express. להציג: טופס + דרכון + הפריטים עצמם. קבלת חותמת מכס.</div>
                    <div className="text-rose-600 text-xs mt-1">⚠️ חשוב: הפריטים שרוצים החזר עליהם — <strong>לא לשים במזוודה!</strong> צריך להראות אותם.</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="chip bg-emerald-100 text-emerald-800 font-bold text-xs h-fit mt-0.5">3</span>
                  <div>
                    <div className="font-semibold">אחרי ביטחון — לאסוף כסף</div>
                    <div className="text-slate-600">דלפקי <strong>Global Blue / Planet</strong> (ONExchange) — אחרי נקודות הביטחון, גם ב-Schengen וגם ב-Non-Schengen. פתוח עד 23:00.</div>
                  </div>
                </li>
              </ol>
            </div>

            {/* טיפים */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-1">
              <div className="font-bold mb-1">💡 טיפים לקבוצה:</div>
              <p>• <strong>לשמור קבלות</strong> מכל קנייה לאורך כל הטיול</p>
              <p>• תכננו ~20 דקות נוספות בשדה לפני הצ&apos;ק-אין</p>
              <p>• אפשר לקבל מזומן בשדה (עם עמלה) או העברה לכרטיס אשראי</p>
              <p>• תקף ל-3 חודשים מתאריך הקנייה</p>
            </div>

            <div className="text-xs text-slate-400 text-center">
              מקור:{" "}
              <a href="https://www.aia.gr/traveler/travellers-info/VAT-refund/" target="_blank" rel="noreferrer" className="text-brand underline">
                Athens International Airport — VAT Refund
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
