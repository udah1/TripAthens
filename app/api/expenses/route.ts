import { NextRequest, NextResponse } from "next/server";
import {
  Expense,
  EXPENSES_KEY,
  checkPassword,
  getRedis,
  makeId,
  sortExpenses,
} from "@/lib/expenses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function getAuth(req: NextRequest): string | null {
  return (
    req.headers.get("x-expenses-password") ||
    req.nextUrl.searchParams.get("password")
  );
}

async function loadAll(): Promise<Expense[]> {
  const redis = getRedis();
  const raw = await redis.get<Expense[] | string>(EXPENSES_KEY);
  if (!raw) return [];
  // Upstash מחזיר לפעמים string ולפעמים object כבר מפוענח
  const list = typeof raw === "string" ? (JSON.parse(raw) as Expense[]) : raw;
  return Array.isArray(list) ? list : [];
}

async function saveAll(list: Expense[]): Promise<void> {
  const redis = getRedis();
  await redis.set(EXPENSES_KEY, JSON.stringify(list));
}

export async function GET(req: NextRequest) {
  if (!checkPassword(getAuth(req))) return unauthorized();
  try {
    const list = await loadAll();
    return NextResponse.json({ expenses: sortExpenses(list) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkPassword(getAuth(req))) return unauthorized();
  try {
    const body = await req.json();
    const { description, amount, currency, payer, date, notes } = body ?? {};

    if (
      typeof description !== "string" ||
      !description.trim() ||
      typeof amount !== "number" ||
      !isFinite(amount) ||
      amount <= 0 ||
      (currency !== "ILS" && currency !== "EUR") ||
      typeof payer !== "string" ||
      !payer.trim() ||
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }

    const now = Date.now();
    const expense: Expense = {
      id: makeId(),
      description: description.trim(),
      amount,
      currency,
      payer: payer.trim(),
      date,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const list = await loadAll();
    list.push(expense);
    await saveAll(list);

    return NextResponse.json({ expense });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!checkPassword(getAuth(req))) return unauthorized();
  try {
    const body = await req.json();
    const { id, description, amount, currency, payer, date, notes } = body ?? {};
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "missing id" }, { status: 400 });
    }

    const list = await loadAll();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const prev = list[idx];
    const updated: Expense = {
      ...prev,
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : prev.description,
      amount:
        typeof amount === "number" && isFinite(amount) && amount > 0
          ? amount
          : prev.amount,
      currency:
        currency === "ILS" || currency === "EUR" ? currency : prev.currency,
      payer:
        typeof payer === "string" && payer.trim() ? payer.trim() : prev.payer,
      date:
        typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
          ? date
          : prev.date,
      notes: typeof notes === "string" ? (notes.trim() || undefined) : prev.notes,
      updatedAt: Date.now(),
    };
    list[idx] = updated;
    await saveAll(list);
    return NextResponse.json({ expense: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkPassword(getAuth(req))) return unauthorized();
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "missing id" }, { status: 400 });
    }
    const list = await loadAll();
    const next = list.filter((e) => e.id !== id);
    await saveAll(next);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
