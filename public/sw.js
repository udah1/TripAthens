// Service Worker לאתר "אתונה 2026"
// — מטפל ב-Web Push notifications מ-cron חיצוני (cron-job.org) דרך ה-backend.

const CACHE_VERSION = "athens-2026-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
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
      .catch(() => undefined),
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
    })(),
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
        .catch(() => undefined),
    );
  }
});
