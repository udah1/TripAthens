import ExpensesApp from "@/components/ExpensesApp";

export const metadata = { title: "מעקב תשלומים — אתונה 2026" };

export default function ExpensesPage() {
  return (
    <div>
      <h1 className="page-title">💳 מעקב תשלומים</h1>
      <p className="page-sub">
        תיעוד משותף של תשלומים בטיול — כולם רואים את כולם, אפשר להוסיף, לערוך
        ולמחוק. הנתונים מסונכרנים בענן.
      </p>
      <ExpensesApp />
    </div>
  );
}
