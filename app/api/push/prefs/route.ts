import { NextRequest, NextResponse } from "next/server";
import { updatePrefs, getSub } from "@/lib/push-store";
import { DEFAULT_PREFS, type NotifPrefs } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PUT /api/push/prefs  — מעדכן העדפות קיימות
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.endpoint !== "string" || !body.prefs) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }
    const existing = await getSub(body.endpoint);
    if (!existing) {
      return NextResponse.json({ error: "not_subscribed" }, { status: 404 });
    }
    const merged: NotifPrefs = { ...DEFAULT_PREFS, ...existing.prefs, ...body.prefs };
    await updatePrefs(body.endpoint, merged);
    return NextResponse.json({ ok: true, prefs: merged });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", message: String(err) },
      { status: 500 },
    );
  }
}
