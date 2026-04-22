import { NextRequest, NextResponse } from "next/server";
import { checkPassword } from "@/lib/expenses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password =
      (body && typeof body.password === "string" && body.password) ||
      req.headers.get("x-expenses-password") ||
      "";
    if (!checkPassword(password)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
