"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LS_KEY = "athens-push-prompted";

export default function PushPromo() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // אל נציג אם כבר הוצג, אם Web Push לא נתמך, או אם כבר registered
    if (typeof window === "undefined") return;
    if (localStorage.getItem(LS_KEY)) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    (async () => {
      // אם כבר יש subscription — לא מציגים
      try {
        const reg = await navigator.serviceWorker.getRegistration("/sw.js");
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          if (sub) return;
        }
      } catch {
        // ignore — נציג בכל מקרה
      }
      // קצת השהיה כדי שהדף ייטען קודם
      setTimeout(() => setShow(true), 1500);
    })();
  }, []);

  function dismiss() {
    localStorage.setItem(LS_KEY, "1");
    setShow(false);
  }

  function approve() {
    localStorage.setItem(LS_KEY, "1");
    setShow(false);
    router.push("/notifications");
  }

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="הפעלת התראות"
        className="fixed z-[70] bottom-6 left-1/2 -translate-x-1/2 w-[min(92vw,420px)] bg-white rounded-2xl shadow-2xl p-5 text-right"
        dir="rtl"
      >
        {/* כפתור סגירה */}
        <button
          onClick={dismiss}
          aria-label="סגור"
          className="absolute top-3 left-3 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="text-3xl mb-2">🔔</div>
        <h2 className="text-lg font-bold text-brand mb-1">רוצה לקבל תזכורות לטיול?</h2>
        <p className="text-sm text-slate-600 mb-4">נשלח לך אוטומטית:</p>
        <ul className="text-sm text-slate-700 space-y-1 mb-5 list-none">
          <li>⏰ 30 דק׳ לפני כל פעילות בלוז</li>
          <li>🌞 בוקר טוב + סיכום יומי ב-07:30</li>
          <li>🚨 תזכורות קריטיות לטיסות וצ׳ק-אאוט</li>
        </ul>

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
