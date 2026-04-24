import NotificationsApp from "@/components/NotificationsApp";

export const metadata = { title: "התראות — אתונה 2026" };

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="page-title">🔔 התראות ותזכורות</h1>
      <p className="page-sub">
        תזכורות אוטומטיות לפני כל פעילות, סיכום יומי בבוקר, ותזכורות קריטיות
        לטיסות. עובד גם כשהאפליקציה סגורה (אם הוספתם למסך הבית).
      </p>
      <NotificationsApp />
    </div>
  );
}
