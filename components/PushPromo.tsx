"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LS_KEY = "athens-push-prompted-v2";

function isPwa(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    ("standalone" in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export default function PushPromo() {
  const [show, setShow] = useState(false);
  const [isPwaMode, setIsPwaMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(LS_KEY)) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const pwa = isPwa();
    setIsPwaMode(pwa);

    (async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration("/sw.js");
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          if (sub) return;
        }
      } catch {
        // ignore
      }
      setTimeout(() => setShow(true), 1500);
    })();
  }, []);

  function approve() {
    localStorage.setItem(LS_KEY, "1");
    setShow(false);
    router.push("/notifications");
  }

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/50" aria-hidden="true" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="הפעלת התראות"
        className="fixed z-[70] bottom-6 left-1/2 -translate-x-1/2 w-[min(92vw,420px)] bg-white rounded-2xl shadow-2xl p-5 text-right"
        dir="rtl"
      >
        <div className="text-3xl mb-2">🔔</div>
        <h2 className="text-lg font-bold text-brand mb-1">רוצה לקבל תזכורות לטיול?</h2>
        <p className="text-sm text-slate-600 mb-4">נשלח לך אוטומטית:</p>
        <ul className="text-sm text-slate-700 space-y-1 mb-5 list-none">
          <li>⏰ 30 דק׳ לפני כל פעילות בלוז</li>
          <li>🌞 בוקר טוב + סיכום יומי ב-07:30</li>
          <li>🚨 תזכורות קריטיות לטיסות וצ׳ק-אאוט</li>
        </ul>

        {!isPwaMode && (
          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2 mb-4">
            💡 באנדרואיד: הוסיפו למסך הבית (3 נקודות ← &quot;הוסף למסך הבית&quot;) לאמינות מרבית.
          </p>
        )}

        <button
          onClick={approve}
          className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand/90 transition text-base"
        >
          אישור
        </button>
      </div>
    </>
  );
}
