"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  DEFAULT_PREFS,
  buildAllNotifications,
  prefsAllow,
  type NotifCategory,
  type NotifPrefs,
  type ScheduledNotif,
} from "@/lib/notifications";

type Status =
  | "checking"
  | "unsupported"
  | "denied"
  | "not-subscribed"
  | "subscribed";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function formatIdt(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsApp() {
  const [status, setStatus] = useState<Status>("checking");
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  // ── אתחול ראשוני ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }

      // רישום SW (אם טרם נרשם — למשל ב-dev)
      let reg: ServiceWorkerRegistration;
      try {
        reg = await navigator.serviceWorker.register("/sw.js");
      } catch {
        setStatus("unsupported");
        return;
      }
      // נחכה שה-SW יהיה active
      await navigator.serviceWorker.ready;

      const sub = await reg.pushManager.getSubscription();
      if (cancelled) return;
      if (!sub) {
        setStatus("not-subscribed");
        return;
      }
      setEndpoint(sub.endpoint);

      // ננסה לטעון את ההעדפות מהשרת
      try {
        const r = await fetch(
          `/api/push/subscribe?endpoint=${encodeURIComponent(sub.endpoint)}`,
        );
        const j = await r.json();
        if (j?.sub?.prefs) {
          setPrefs({ ...DEFAULT_PREFS, ...j.sub.prefs });
        }
      } catch {
        // ignore
      }
      setStatus("subscribed");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── re-subscribe אוטומטי אחרי עדכון SW ────────────────────────────
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type !== "SW_UPDATED") return;
      if (Notification.permission !== "granted") return;

      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (!sub) return; // לא היה רשום — לא צריך לעשות כלום

        const keys = sub.toJSON().keys as { p256dh: string; auth: string } | undefined;
        if (!keys) return;

        // שמור מחדש את ה-subscription ב-KV (שומר על ההעדפות הקיימות)
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint, keys, prefs }),
        });
        setEndpoint(sub.endpoint);
        setStatus("subscribed");
      } catch {
        // silent fail — המשתמש לא צריך לדעת
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, [prefs]);

  // ── הרשמה ───────────────────────────────────────────────────────
  const subscribe = useCallback(async () => {
    setError(null);
    setMessage(null);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setStatus("denied");
        setError("לא ניתן אישור להתראות בדפדפן.");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const r = await fetch("/api/push/vapid");
      const j = await r.json();
      if (!j?.key) throw new Error("missing VAPID key on server");

      const appServerKey = urlBase64ToUint8Array(j.key);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appServerKey.buffer.slice(
          appServerKey.byteOffset,
          appServerKey.byteOffset + appServerKey.byteLength,
        ) as ArrayBuffer,
      });
      const keys = sub.toJSON().keys as { p256dh: string; auth: string };

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys,
          prefs,
        }),
      });
      if (!res.ok) throw new Error("failed to save subscription");
      setEndpoint(sub.endpoint);
      setStatus("subscribed");
      setMessage("מעולה! נרשמת להתראות 🎉");
    } catch (err) {
      setError(String(err));
    }
  }, [prefs]);

  // ── ביטול הרשמה ────────────────────────────────────────────────
  const unsubscribe = useCallback(async () => {
    setError(null);
    setMessage(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setEndpoint(null);
      setStatus("not-subscribed");
      setMessage("ההרשמה בוטלה. לא יישלחו עוד התראות.");
    } catch (err) {
      setError(String(err));
    }
  }, []);

  // ── שמירת העדפות ────────────────────────────────────────────────
  const savePrefs = useCallback(
    async (next: NotifPrefs) => {
      if (!endpoint) {
        setPrefs(next);
        return;
      }
      setSavingPrefs(true);
      setError(null);
      try {
        const res = await fetch("/api/push/prefs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint, prefs: next }),
        });
        if (!res.ok) throw new Error("failed to save prefs");
        setPrefs(next);
      } catch (err) {
        setError(String(err));
      } finally {
        setSavingPrefs(false);
      }
    },
    [endpoint],
  );

  const toggleMaster = useCallback(() => {
    savePrefs({ ...prefs, enabled: !prefs.enabled });
  }, [prefs, savePrefs]);

  const toggleCategory = useCallback(
    (cat: NotifCategory) => {
      savePrefs({ ...prefs, [cat]: !prefs[cat] } as NotifPrefs);
    },
    [prefs, savePrefs],
  );

  // ── שליחת התראת בדיקה ──────────────────────────────────────────
  const sendTest = useCallback(async () => {
    if (!endpoint) return;
    setTesting(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/push/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.message || j?.error || "failed");
      setMessage("נשלחה התראת בדיקה — תוך שנייה-שתיים תראו אותה!");
    } catch (err) {
      setError(`${String(err)} · נסו שוב, או בטלו וחזרו להפעיל מחדש את ההתראות.`);
    } finally {
      setTesting(false);
    }
  }, [endpoint]);

  // ── תצוגה של ההתראות הבאות ────────────────────────────────────
  const upcoming = useMemo<ScheduledNotif[]>(() => {
    if (now == null) return [];
    return buildAllNotifications()
      .filter((n) => n.sendAt >= now - 5 * 60 * 1000)
      .filter((n) => prefsAllow(prefs, n))
      .slice(0, 12);
  }, [prefs, now]);

  // ── UI ──────────────────────────────────────────────────────────
  if (status === "checking") {
    return <div className="card">טוען…</div>;
  }

  if (status === "unsupported") {
    return (
      <div className="card">
        <h2 className="text-lg font-bold text-brand mb-2">⚠️ התראות לא נתמכות</h2>
        <p className="text-sm text-slate-700">
          הדפדפן שלכם לא תומך ב-Web Push. באנדרואיד — השתמשו ב-Chrome / Edge
          והוסיפו את האתר למסך הבית (PWA) לאמינות מלאה.
        </p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="card">
        <h2 className="text-lg font-bold text-brand mb-2">🚫 התראות חסומות</h2>
        <p className="text-sm text-slate-700">
          בחרתם בעבר &quot;חסום&quot; להתראות. כדי להפעיל:
        </p>
        <ol className="list-decimal list-inside text-sm text-slate-700 mt-2 space-y-1">
          <li>לחצו על סמל המנעול 🔒 בסרגל הכתובת</li>
          <li>בחרו בהתראות / Notifications</li>
          <li>שנו ל-&quot;אפשר&quot;</li>
          <li>רעננו את הדף</li>
        </ol>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="card bg-rose-50 border border-rose-200 text-rose-900 text-sm">
          שגיאה: {error}
        </div>
      )}
      {message && (
        <div className="card bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
          {message}
        </div>
      )}

      {status === "not-subscribed" && (
        <div className="card">
          <h2 className="text-lg font-bold text-brand mb-2">🔔 הפעלת התראות</h2>
          <p className="text-sm text-slate-700 mb-4">
            קבלו תזכורות אוטומטיות לפני כל פעילות בלוז, סיכום יומי בבוקר,
            ותזכורות קריטיות לטיסות ו-check-out.
          </p>
          <p className="text-xs text-slate-500 mb-4">
            💡 טיפ: באנדרואיד, הוסיפו את האתר למסך הבית (3 נקודות →
            &quot;הוסף למסך הבית&quot;) לאמינות מרבית.
          </p>
          <button
            onClick={subscribe}
            className="chip bg-brand text-white hover:bg-brand/90 text-sm font-bold"
          >
            🔔 הפעלת התראות
          </button>
        </div>
      )}

      {status === "subscribed" && (
        <>
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-brand">⚙️ הגדרות</h2>
              <div className="flex gap-2">
                <button
                  onClick={sendTest}
                  disabled={testing}
                  className="chip bg-sky-100 text-sky-800 hover:bg-sky-200 text-xs"
                >
                  {testing ? "שולח…" : "🧪 בדיקה"}
                </button>
                <button
                  onClick={unsubscribe}
                  className="chip bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs"
                >
                  🚫 ביטול הרשמה
                </button>
              </div>
            </div>

            {/* Master toggle */}
            <label className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="font-bold text-brand">הפעלה כללית</span>
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={prefs.enabled}
                onChange={toggleMaster}
                disabled={savingPrefs}
              />
            </label>

            {/* Per-category */}
            <div className={prefs.enabled ? "" : "opacity-50 pointer-events-none"}>
              {(Object.keys(CATEGORY_LABELS) as NotifCategory[]).map((cat) => (
                <label
                  key={cat}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <span className="text-sm text-slate-700">
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={prefs[cat]}
                    onChange={() => toggleCategory(cat)}
                    disabled={savingPrefs}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-brand mb-3">
              📅 ההתראות הבאות ({upcoming.length})
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-500">
                אין התראות עתידיות מותאמות להעדפות שבחרתם.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {upcoming.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start gap-3 p-2 rounded-lg bg-slate-50"
                  >
                    <span className="text-xs text-slate-500 whitespace-nowrap mt-0.5">
                      {formatIdt(n.sendAt)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-brand text-sm">
                        {n.title}
                      </div>
                      <div className="text-xs text-slate-600 whitespace-pre-line">
                        {n.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
