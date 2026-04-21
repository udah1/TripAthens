import { COSTS, TRIP_META } from "@/lib/data";

export const metadata = { title: "עלויות — אתונה 2026" };

const SECTION_TITLES = {
  flight: "✈️ טיסות",
  hotel: "🏨 מלון",
  activities: "🎯 פעילויות ואוכל",
  totals: "📊 סיכומים",
} as const;

const SECTION_COLORS = {
  flight: "bg-sky-100",
  hotel: "bg-emerald-100",
  activities: "bg-amber-100",
  totals: "bg-brand text-white",
} as const;

type Section = keyof typeof SECTION_TITLES;

export default function CostsPage() {
  const sections: Section[] = ["flight", "hotel", "activities", "totals"];

  return (
    <div>
      <h1 className="page-title">💰 עלויות הטיול</h1>
      <p className="page-sub">שער חליפין: {TRIP_META.exchangeRate}. מחירי בסיס שווים לכולם, תוספות אישיות נפרדות.</p>

      {sections.map((section) => {
        const rows = COSTS.filter((c) => c.section === section);
        const isTotals = section === "totals";
        return (
          <section key={section} className="mb-8">
            <h2 className="section-title">{SECTION_TITLES[section]}</h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th className="th th-item">פריט</th>
                    <th className="th">מבוגר</th>
                    <th className="th">ילד</th>
                    <th className="th">סה"כ (€)</th>
                    <th className="th">הערות</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={idx} className={`${SECTION_COLORS[section]} ${isTotals ? "font-bold" : ""}`}>
                      <td className="td td-item">{r.item}</td>
                      <td className="td whitespace-nowrap">
                        <PriceCell eur={r.adultEur} ils={r.adultIls} />
                      </td>
                      <td className="td whitespace-nowrap">
                        <PriceCell eur={r.childEur} ils={r.childIls} />
                      </td>
                      <td className="td">{r.totalEur}</td>
                      <td className="td text-xs">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PriceCell({ eur, ils }: { eur: number | string | undefined; ils: number | string | undefined }) {
  const hasEur = eur !== undefined && eur !== "" && eur !== null;
  const hasIls = ils !== undefined && ils !== "" && ils !== null;
  if (!hasEur && !hasIls) return <span className="text-slate-400">—</span>;
  return (
    <div className="flex flex-col gap-0.5 leading-tight">
      {hasEur && <span>€ {eur}</span>}
      {hasIls && <span className="text-xs text-slate-500">₪ {ils}</span>}
    </div>
  );
}
