// ═══════════════════════════════════════════════════════════════════════════
// POST /api/push/send  — נקרא ע"י cron-job.org כל דקה/5 דקות.
// עובר על כל ההתראות שזמנן הגיע (בחלון [now-15min, now]) ולא נשלחו, ושולח אותן
// לכל subscription שמאושר לפי ההעדפות שלו.
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import webpush, { WebPushError } from "web-push";
import {
  buildAllNotifications,
  prefsAllow,
  type ScheduledNotif,
  TRIP_END_MS,
} from "@/lib/notifications";
import {
  loadAllSubs,
  loadSent,
  removeSub,
  saveSent,
  sentKey,
} from "@/lib/push-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const WINDOW_MS = 15 * 60 * 1000; // חלון חיפוש — 15 דק' אחורה מעכשיו

function checkCronAuth(req: NextRequest): boolean {
  const secret = process.env.NOTIFICATIONS_CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  if (header === `Bearer ${secret}`) return true;
  // תמיכה ב-cron-job.org שמגדיר header בשם "x-cron-secret"
  const x = req.headers.get("x-cron-secret") || req.headers.get("x-secret");
  if (x === secret) return true;
  // fallback — ?secret=...
  const url = new URL(req.url);
  if (url.searchParams.get("secret") === secret) return true;
  return false;
}

function configureWebPush() {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:athens2026@example.com";
  if (!pub || !priv) throw new Error("missing_vapid_env");
  webpush.setVapidDetails(subject, pub, priv);
}

async function handle(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    configureWebPush();
  } catch (err) {
    return NextResponse.json({ error: "missing_vapid_env" }, { status: 500 });
  }

  const now = Date.now();
  if (now > TRIP_END_MS + 24 * 60 * 60 * 1000) {
    return NextResponse.json({ ok: true, skipped: "trip_ended" });
  }

  const all = buildAllNotifications();
  const due: ScheduledNotif[] = all.filter(
    (n) => n.sendAt <= now && n.sendAt >= now - WINDOW_MS,
  );

  if (due.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, due: 0 });
  }

  const subs = await loadAllSubs();
  const sent = await loadSent();
  let newlySent = 0;
  let failures = 0;
  const expired: string[] = [];

  for (const [subId, sub] of Object.entries(subs)) {
    for (const n of due) {
      const key = sentKey(subId, n.id);
      if (sent[key]) continue;
      if (!prefsAllow(sub.prefs, n)) continue;

      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          JSON.stringify({
            title: n.title,
            body: n.body,
            url: n.url,
            tag: n.id,
          }),
          { TTL: 3600 },
        );
        sent[key] = Date.now();
        newlySent += 1;
      } catch (err) {
        failures += 1;
        const wpErr = err as WebPushError;
        if (wpErr && (wpErr.statusCode === 404 || wpErr.statusCode === 410)) {
          // subscription פג תוקף — מחיקה
          expired.push(sub.endpoint);
        }
      }
    }
  }

  // ניקוי subscriptions פגי תוקף
  for (const ep of expired) {
    await removeSub(ep);
  }

  // שמירת ה-sent log (עם "גרבג' קולקשן" קל — מוחק רשומות ישנות מ-7 ימים)
  const cutoff = now - 7 * 24 * 60 * 60 * 1000;
  for (const [k, ts] of Object.entries(sent)) {
    if (ts < cutoff) delete sent[k];
  }
  await saveSent(sent);

  return NextResponse.json({
    ok: true,
    now,
    due: due.length,
    sent: newlySent,
    failures,
    expiredRemoved: expired.length,
    subs: Object.keys(subs).length,
  });
}

export async function GET(req: NextRequest) {
  return handle(req);
}
export async function POST(req: NextRequest) {
  return handle(req);
}
