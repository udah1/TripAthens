import { TASKS } from "@/lib/data";
import TasksApp from "@/components/TasksApp";

export const metadata = { title: "משימות — אתונה 2026" };

export default function TasksPage() {
  return (
    <div>
      <h1 className="page-title">✅ משימות לפני הטיול</h1>
      <p className="page-sub">
        רשימה של {TASKS.length} משימות משותפות. סמנו את מה שביצעתם — כולם רואים
        בזמן אמת.
      </p>

      <TasksApp />
    </div>
  );
}
