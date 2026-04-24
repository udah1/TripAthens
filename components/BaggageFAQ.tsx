"use client";
import { useState } from "react";
import Image from "next/image";

const FAQ_ITEMS = [
  {
    q: "🧳 מה גודל ומשקל המזוודות?",
    content: (
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-sky-50 rounded-xl p-3 border border-sky-200">
            <div className="font-bold text-sky-800 mb-1">👜 תיק אישי</div>
            <div className="text-slate-700">מידות: עד 40×30×15 ס"מ</div>
            <div className="text-slate-500 text-xs mt-1">אין הגבלת משקל מוגדרת — בגבולות ההגיון</div>
            <div className="text-slate-500 text-xs">מתחת לכיסא הקדמי</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
            <div className="font-bold text-emerald-800 mb-1">🧳 טרולי / תיק יד</div>
            <div className="text-slate-700">מידות: עד 55×40×23 ס"מ</div>
            <div className="font-semibold text-emerald-700 text-xs mt-1">משקל: עד 8 ק"ג</div>
            <div className="text-slate-500 text-xs">מעל הכיסא</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
            <div className="font-bold text-amber-800 mb-1">🛄 מזוודה גדולה</div>
            <div className="text-slate-700">סך מידות: עד 156 ס"מ</div>
            <div className="text-slate-500 text-xs mt-1">(אורך + רוחב + גובה)</div>
            <div className="text-slate-500 text-xs">משקל: לפי הכרטיס שנרכש</div>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800">
          ⚠️ <b>SKY Joy</b> (רוב הנוסעים) — מזוודה גדולה <b>לא כלולה</b> בכרטיס, צריך לרכוש בנפרד.
        </div>
        <div className="mt-3">
          <div className="text-xs text-slate-400 mb-2 text-center">איור מידות Sky Express:</div>
          <div className="flex justify-center">
            {/* מובייל */}
            <Image
              src="/baggage-allowance.png"
              alt="מידות כבודה Sky Express"
              width={300}
              height={380}
              className="rounded-xl border border-slate-200 shadow-sm md:hidden"
            />
            {/* דסקטופ */}
            <Image
              src="/baggage-allowance-desktop.png"
              alt="מידות כבודה Sky Express"
              width={900}
              height={400}
              className="rounded-xl border border-slate-200 shadow-sm hidden md:block w-full"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    q: "💧 מה מותר ומה אסור בטרולי — נוזלים?",
    content: (
      <div className="space-y-3 text-sm">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="font-bold text-red-700 mb-2">❌ אסור בטרולי:</div>
          <ul className="space-y-1 text-slate-700">
            <li>• נוזלים, ג&apos;לים, קרמים, שמפו, דיאודורנט נוזלי, בושם</li>
            <li>• <b>כל בקבוק מעל 100ml</b> — גם אם הוא חצי ריק!</li>
          </ul>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="font-bold text-green-700 mb-2">✅ מותר בטרולי:</div>
          <ul className="space-y-1 text-slate-700">
            <li>• עד <b>10 מיכלים/בקבוקים</b>, כל אחד עד 100ml בדיוק</li>
            <li>• חייב להיות <b>כתוב על האריזה עצמה</b> 100ml ומטה</li>
            <li>• כל הנוזלים בשקית ניילון <b>שקופה</b> נפרדת</li>
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
          ⚠️ בקבוק 150ml שחצי ריק — <b>לא מותר!</b> חייב לכתוב על הבקבוק 100ml ומטה.<br />
          💡 כל שמפו/קרם/בושם גדול — שימו במזוודה הגדולה.<br />
          💡 בטיסה הלוך מישראל לפעמים פחות קפדנים — אבל לא לסמוך על זה.
        </div>
      </div>
    ),
  },
  {
    q: "🔋 סוללות ופאוורבנק — מה מותר?",
    content: (
      <div className="space-y-3 text-sm">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="font-bold text-green-700 mb-2">✅ מותר בטרולי / תיק יד:</div>
          <ul className="space-y-1 text-slate-700">
            <li>• פאוורבנק / סוללות ליתיום חיצוניות עד <b>100Wh</b></li>
            <li>• מחשב נייד, טלפון, מצלמה, שעון חכם</li>
            <li>• מטענים וכבלים</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="font-bold text-red-700 mb-2">❌ אסור במזוודה גדולה:</div>
          <ul className="space-y-1 text-slate-700">
            <li>• <b>פאוורבנק</b> — בשום אופן לא במזוודה הגדולה</li>
            <li>• כל סוללה ליתיום חיצונית (מעל 100Wh — אסור בכלל)</li>
          </ul>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-800">
          💡 מטענים ו<b>כבלים</b> — מותרים בכל מקום (טרולי ומזוודה).
        </div>
      </div>
    ),
  },
  {
    q: "🚫 מה אסור לחלוטין בטיסה?",
    content: (
      <div className="space-y-3 text-sm">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="font-bold text-red-700 mb-2">❌ אסור בטרולי ובמזוודה:</div>
          <ul className="space-y-1 text-slate-700">
            <li>• נשק מכל סוג</li>
            <li>• סכינים ומספריים מעל 6 ס"מ</li>
            <li>• חומרים נפיצים ודליקים (זיקוקים, פצצות עשן)</li>
            <li>• ספריי גז (פלפל, גז מדמיע, חרדל)</li>
            <li>• משקאות מעל 70% אלכוהול</li>
            <li>• חומרים רדיואקטיביים או כימיים מסוכנים</li>
          </ul>
        </div>
        <div className="text-xs text-slate-500">
          מקור: <a href="https://www.skyexpress.gr/en/sky-experience/before-fly/fare-types" target="_blank" rel="noreferrer" className="text-brand underline">Sky Express — Baggage Rules</a>
        </div>
      </div>
    ),
  },
];

export default function BaggageFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="card mb-6 border-r-4 border-violet-500">
      <div className="flex items-center gap-2 mb-4">
        <span className="chip bg-violet-100 text-violet-800 text-xs font-bold">❓ שאלות נפוצות</span>
        <h2 className="text-xl font-bold text-brand">כבודה וטיסה — FAQ</h2>
      </div>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-right bg-white hover:bg-slate-50 transition font-semibold text-sm text-brand"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span>{item.q}</span>
              <span className={`text-slate-400 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 pt-1 bg-white border-t border-slate-100">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href="/chat"
          className="chip bg-brand text-white hover:bg-brand/90 text-xs font-semibold transition"
        >
          💬 לסוכן ה-AI לשאלות נוספות
        </a>
        <a
          href="https://www.skyexpress.gr/en/sky-experience/before-fly/fare-types"
          target="_blank"
          rel="noopener noreferrer"
          className="chip bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          ✈️ אתר Sky Express
        </a>
        <span className="text-xs text-slate-400">הסוכן יודע את כל כללי הכבודה ויכול לענות על שאלות נוספות.</span>
      </div>
    </section>
  );
}
