import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// מחזיר את ה-VAPID PUBLIC key ללקוח (צריך אותו בשביל PushManager.subscribe)
export async function GET() {
  const key = process.env.VAPID_PUBLIC_KEY || "";
  if (!key) {
    return NextResponse.json({ error: "missing_vapid_public_key" }, { status: 500 });
  }
  return NextResponse.json({ key });
}
