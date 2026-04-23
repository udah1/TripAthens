import { NextResponse } from "next/server";
import { fetchTripWeather } from "@/lib/weather";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const data = await fetchTripWeather();
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json(
      { ok: false, error: message, days: [], fetchedAt: new Date().toISOString() },
      { status: 500 },
    );
  }
}
