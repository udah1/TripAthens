import { NextRequest, NextResponse } from "next/server";
import { fetchEurIlsOnDate } from "@/lib/fx";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { ok: false, error: "invalid_date" },
      { status: 400 },
    );
  }
  const data = await fetchEurIlsOnDate(date);
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "fx_unavailable" },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, ...data });
}
