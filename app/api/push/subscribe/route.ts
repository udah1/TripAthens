import { NextRequest, NextResponse } from "next/server";
import { upsertSub, removeSub, getSub } from "@/lib/push-store";
import { DEFAULT_PREFS, type NotifPrefs } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/push/subscribe
// body: { endpoint, keys: {p256dh, auth}, prefs?, label? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (
      !body ||
      typeof body.endpoint !== "string" ||
      !body.keys ||
      typeof body.keys.p256dh !== "string" ||
      typeof body.keys.auth !== "string"
    ) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }
    const prefs: NotifPrefs =
      body.prefs && typeof body.prefs === "object"
        ? { ...DEFAULT_PREFS, ...body.prefs }
        : DEFAULT_PREFS;
    const label = typeof body.label === "string" ? body.label : undefined;

    const record = await upsertSub(body.endpoint, body.keys, prefs, label);
    return NextResponse.json({ ok: true, sub: { endpoint: record.endpoint, prefs: record.prefs } });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", message: String(err) },
      { status: 500 },
    );
  }
}

// DELETE /api/push/subscribe  — מוחק לפי endpoint בגוף
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.endpoint !== "string") {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }
    await removeSub(body.endpoint);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", message: String(err) },
      { status: 500 },
    );
  }
}

// GET /api/push/subscribe?endpoint=...  — מחזיר את ההעדפות הנוכחיות
export async function GET(req: NextRequest) {
  const endpoint = req.nextUrl.searchParams.get("endpoint");
  if (!endpoint) {
    return NextResponse.json({ error: "missing_endpoint" }, { status: 400 });
  }
  const sub = await getSub(endpoint);
  if (!sub) return NextResponse.json({ ok: true, sub: null });
  return NextResponse.json({
    ok: true,
    sub: { endpoint: sub.endpoint, prefs: sub.prefs, label: sub.label ?? null },
  });
}
