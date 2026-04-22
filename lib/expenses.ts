// ─── טיפוסים ופונקציות עזר למעקב הוצאות משותפות ────────────────────────────
import { Redis } from "@upstash/redis";

export type Currency = "ILS" | "EUR";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  payer: string;
  date: string; // ISO (YYYY-MM-DD)
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

export const EXPENSES_KEY = "athens:expenses:v1";

// Redis client — תומך גם ב-Upstash (UPSTASH_REDIS_REST_*) וגם ב-Vercel KV (KV_REST_API_*)
export function getRedis(): Redis {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    "";

  if (!url || !token) {
    throw new Error(
      "Missing Redis env vars (UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN)",
    );
  }

  return new Redis({ url, token });
}

export function makeId(): string {
  return `exp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function sortExpenses(list: Expense[]): Expense[] {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.createdAt - a.createdAt;
  });
}

// בדיקת סיסמה — עובד רק בצד השרת
export function checkPassword(input: string | null | undefined): boolean {
  const expected = process.env.EXPENSES_PASSWORD || "";
  if (!expected) return false;
  if (!input) return false;
  return input === expected;
}
