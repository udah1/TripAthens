// Service Worker לאתר "אתונה 2026"
// — מטפל ב-Web Push notifications + offline caching

const CACHE_VERSION = "athens-2026-v2";

// דפים ונכסים לקאש מראש בהתקנה
const PRECACHE_URLS = [
  "/",
  "/schedule",
  "/tasks",
  "/costs",
  "/restaurants",
  "/before-flight",
  "/packing",
  "/currency",
  "/expenses",
  "/notifications",
  "/sim",
  "/attractions",
  "/passengers",
  "/chat",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.webmanifest",
];

// ── Install: pre-cache דפים מרכזיים ─────────────────────────────────────
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {
        // אם דף אחד נכשל — לא נחסום את ההתקנה
      })
    )
  );
});

// ── Activate: מחק קאשים ישנים ────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_VERSION)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
      .then(async () => {
        // הודע לכל הלקוחות לבדוק re-subscribe אחרי עדכון SW
        const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        allClients.forEach((c) => c.postMessage({ type: "SW_UPDATED" }));
      })
  );
});

// ── Fetch: Network-first עם fallback לקאש ───────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // רק GET
  if (request.method !== "GET") return;

  // דלג על API calls (דינמי — לא לקאש)
  if (request.url.includes("/api/")) return;

  // דלג על cross-origin (Open-Meteo, Frankfurter וכו')
  if (!request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(request)
      .then((networkRes) => {
        // שמור עותק עדכני בקאש
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
        }
        return networkRes;
      })
      .catch(() =>
        // אין רשת — החזר מהקאש אם קיים
        caches.match(request).then(
          (cached) =>
            cached ||
            new Response(
              `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="utf-8"><title>אתונה 2026 — אופליין</title>
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <style>body{font-family:sans-serif;text-align:center;padding:3rem;color:#333}h1{color:#1A252F}</style></head>
              <body><h1>✈️ אתונה 2026</h1><p>אין חיבור לאינטרנט.</p><p>הדף הזה לא שמור במכשיר שלך — נסה לפתוח דף אחר.</p>
              <a href="/" style="color:#1A252F">← חזור לדף הבית</a></body></html>`,
              { headers: { "Content-Type": "text/html; charset=utf-8" } }
            )
        )
      )
  );
});

// ── Push handler: מגיע מהשרת דרך web-push ─────────────────────────────
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: "אתונה 2026", body: event.data ? event.data.text() : "" };
  }

  const title = String(payload.title || "אתונה 2026");
  const body = String(payload.body || "");
  const url = typeof payload.url === "string" ? payload.url : "/";
  const tag = typeof payload.tag === "string" ? payload.tag : undefined;

  event.waitUntil(
    self.registration
      .showNotification(title, {
        body,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        lang: "he",
        dir: "rtl",
        tag,
        renotify: Boolean(tag),
        data: { url },
        vibrate: [200, 100, 200],
      })
      .catch(() => undefined)
  );
});

// ── Click על התראה: פתח/מקד את הדף ────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const c of allClients) {
        try {
          const cUrl = new URL(c.url);
          if (cUrl.origin === self.location.origin) {
            await c.focus();
            if ("navigate" in c) {
              await c.navigate(url).catch(() => undefined);
            }
            return;
          }
        } catch {
          // ignore
        }
      }
      if (self.clients.openWindow) {
        await self.clients.openWindow(url);
      }
    })()
  );
});

// ── הודעה מהצד של הקליינט (לבדיקות מקומיות) ──────────────────────────
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;
  if (data.type === "SHOW_NOTIFICATION") {
    const title = String(data.title || "אתונה 2026");
    const body = String(data.body || "");
    const url = typeof data.url === "string" ? data.url : "/";
    const tag = typeof data.tag === "string" ? data.tag : undefined;
    event.waitUntil(
      self.registration
        .showNotification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          lang: "he",
          dir: "rtl",
          tag,
          data: { url },
          vibrate: [200, 100, 200],
        })
        .catch(() => undefined)
    );
  }
});
