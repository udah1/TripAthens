// POST /api/push/test  — שולח התראת בדיקה ל-endpoint ספציפי
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getSub } from "@/lib/push-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function configureWebPush() {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:athens2026@example.com";
  if (!pub || !priv) throw new Error("missing_vapid_env");
  webpush.setVapidDetails(subject, pub, priv);
}

export async function POST(req: NextRequest) {
  try {
    configureWebPush();
  } catch {
    return NextResponse.json({ error: "missing_vapid_env" }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.endpoint !== "string") {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }
    const sub = await getSub(body.endpoint);
    if (!sub) {
      return NextResponse.json({ error: "not_subscribed" }, { status: 404 });
    }
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: sub.keys },
      JSON.stringify({
        title: "🎉 התראת בדיקה — אתונה 2026",
        body: "מצוין! ההתראות עובדות. תקבלו תזכורות לפני כל פעילות.",
        url: "/notifications",
        tag: "test_" + Date.now(),
      }),
      { TTL: 60 },
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", message: String(err) },
      { status: 500 },
    );
  }
}
