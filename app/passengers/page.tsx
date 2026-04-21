import { PASSENGERS } from "@/lib/data";

export const metadata = { title: "נוסעים — אתונה 2026" };

export default function PassengersPage() {
  const totalFlight = PASSENGERS.reduce((s, p) => s + p.flightTotalEur, 0);
  const totalHotel = PASSENGERS.reduce((s, p) => s + p.hotelEur, 0);
  const grand = totalFlight + totalHotel;

  return (
    <div>
      <h1 className="page-title">👥 נוסעים</h1>
      <p className="page-sub">{PASSENGERS.length} נוסעים · פירוט טיסה + מלון לאדם</p>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <StatCard label='סה"כ טיסות' value={`${totalFlight.toFixed(2)} €`} color="bg-sky-100" />
        <StatCard label='סה"כ מלון' value={`${totalHotel.toFixed(2)} €`} color="bg-emerald-100" />
        <StatCard label='סה"כ כללי' value={`${grand.toFixed(2)} €`} color="bg-brand text-white" />
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="th">שם</th>
              <th className="th">הזמנה</th>
              <th className="th">כרטיס</th>
              <th className="th">כבודה</th>
              <th className="th">בסיס (€)</th>
              <th className="th">תוספת (€)</th>
              <th className="th">טיסה (€)</th>
              <th className="th">מלון (€)</th>
              <th className="th">סה"כ (€)</th>
            </tr>
          </thead>
          <tbody>
            {PASSENGERS.map((p, idx) => (
              <tr key={idx} className={idx % 2 ? "bg-sky-50" : "bg-day1/40"}>
                <td className="td font-bold">{p.name}</td>
                <td className="td">{p.booking}</td>
                <td className="td">{p.ticket}</td>
                <td className="td text-xs">{p.baggage}</td>
                <td className="td">{p.baseEur}</td>
                <td className="td">{p.extraEur}</td>
                <td className="td font-semibold">{p.flightTotalEur}</td>
                <td className="td">{p.hotelEur}</td>
                <td className="td font-bold text-brand">{p.grandTotalEur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`card ${color}`}>
      <div className="text-sm opacity-80">{label}</div>
      <div className="text-2xl font-extrabold">{value}</div>
    </div>
  );
}
