import { NextRequest, NextResponse } from "next/server";
import {
  TASK_STATE_KEY,
  TaskState,
  checkPassword,
  getRedis,
} from "@/lib/task-state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function getAuth(req: NextRequest): string | null {
  return req.headers.get("x-expenses-password");
}

async function loadAll(): Promise<Record<string, TaskState>> {
  const redis = getRedis();
  const raw = await redis.get<Record<string, TaskState> | string | null>(
    TASK_STATE_KEY,
  );
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, TaskState>;
    } catch {
      return {};
    }
  }
  return raw as Record<string, TaskState>;
}

async function saveAll(state: Record<string, TaskState>) {
  const redis = getRedis();
  await redis.set(TASK_STATE_KEY, state);
}

export async function GET() {
  try {
    const state = await loadAll();
    return NextResponse.json({ ok: true, state });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", message: String(err) },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const pwd = getAuth(req);
    if (!checkPassword(pwd)) return unauthorized();

    const body = await req.json().catch(() => null);
    if (!body || typeof body.id !== "string" || typeof body.done !== "boolean") {
      return NextResponse.json(
        { error: "invalid_payload" },
        { status: 400 },
      );
    }
    const doneBy = typeof body.doneBy === "string" ? body.doneBy.trim() : "";

    const state = await loadAll();
    if (body.done) {
      state[body.id] = {
        id: body.id,
        done: true,
        doneBy: doneBy || state[body.id]?.doneBy || "",
        doneAt: Date.now(),
      };
    } else {
      delete state[body.id];
    }
    await saveAll(state);
    return NextResponse.json({ ok: true, state });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", message: String(err) },
      { status: 500 },
    );
  }
}
