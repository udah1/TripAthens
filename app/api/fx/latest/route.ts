import { NextResponse } from "next/server";
import { fetchLatestEurIls } from "@/lib/fx";

export const runtime = "nodejs";
export const revalidate = 3600; // שעה

export async function GET() {
  const data = await fetchLatestEurIls();
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "fx_unavailable" },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, ...data });
}
