import CurrencyConverter from "@/components/CurrencyConverter";

export const metadata = {
  title: "מחשבון מט\"ח — אתונה 2026",
};

export const revalidate = 3600;

export default function CurrencyPage() {
  return (
    <div>
      <h1 className="page-title">💱 מחשבון מט&quot;ח</h1>
      <p className="page-sub">המרה מהירה בין יורו (€) לשקל (₪) לפי השער היומי</p>

      <CurrencyConverter />

      <section className="card mt-4">
        <h2 className="section-title">💡 טיפים להחלפת כסף ביוון</h2>
        <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
          <li>
            <b>כספומטים</b> — הכי משתלם למשוך יורו בכספומט של בנק יווני גדול
            (Alpha, Eurobank, NBG, Piraeus). הימנעו מ-Euronet בתחנות תיירות —
            גובים עמלות גבוהות.
          </li>
          <li>
            <b>כרטיסי אשראי</b> — קבלו כמעט בכל מקום. העדיפו כרטיס ללא עמלת
            המרה (כמו Cal Max, Max Payment, Isracard Global וכו&apos;).
          </li>
          <li>
            <b>מזומן</b> — כדאי מעט ליד למסעדות קטנות, טיפים ומוניות. עדיף
            לסגור הכל בכרטיס אשראי טוב.
          </li>
          <li>
            <b>טיפ להמרה</b> — אם תציעו לכם לחייב אתכם בשקלים במקום ביורו
            (&quot;DCC&quot;) — <b>סרבו!</b> זה תמיד גרוע יותר.
          </li>
        </ul>
      </section>
    </div>
  );
}
