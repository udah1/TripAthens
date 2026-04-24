// ═══════════════════════════════════════════════════════════════════════════
// lib/push-store.ts — ניהול Web Push subscriptions ב-Upstash KV
// ═══════════════════════════════════════════════════════════════════════════

import { getRedis } from "./expenses";
import { DEFAULT_PREFS, type NotifPrefs } from "./notifications";

export interface PushSubRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  prefs: NotifPrefs;
  label?: string; // למשל "אנדרואיד של יהודה"
  createdAt: number;
  updatedAt: number;
}

// sent log — לפי (endpointHash + notifId) כדי לא לשלוח פעמיים.
export const SUBS_KEY = "athens:push:subs:v1";
export const SENT_KEY = "athens:push:sent:v1";

export function endpointId(endpoint: string): string {
  // hash פשוט (djb2) — לא מאובטח, רק בשביל לקצר endpoint לשם key יציב
  let h = 5381;
  for (let i = 0; i < endpoint.length; i++) {
    h = (h * 33) ^ endpoint.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

export async function loadAllSubs(): Promise<Record<string, PushSubRecord>> {
  const redis = getRedis();
  const raw = await redis.get<Record<string, PushSubRecord> | string | null>(
    SUBS_KEY,
  );
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, PushSubRecord>;
    } catch {
      return {};
    }
  }
  return raw as Record<string, PushSubRecord>;
}

export async function saveAllSubs(subs: Record<string, PushSubRecord>) {
  const redis = getRedis();
  await redis.set(SUBS_KEY, subs);
}

export async function upsertSub(
  endpoint: string,
  keys: { p256dh: string; auth: string },
  prefs: NotifPrefs = DEFAULT_PREFS,
  label?: string,
): Promise<PushSubRecord> {
  const id = endpointId(endpoint);
  const subs = await loadAllSubs();
  const now = Date.now();
  const existing = subs[id];
  const next: PushSubRecord = {
    endpoint,
    keys,
    prefs: existing?.prefs ?? prefs,
    label: label ?? existing?.label,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  subs[id] = next;
  await saveAllSubs(subs);
  return next;
}

export async function updatePrefs(endpoint: string, prefs: NotifPrefs): Promise<void> {
  const id = endpointId(endpoint);
  const subs = await loadAllSubs();
  if (!subs[id]) return;
  subs[id].prefs = prefs;
  subs[id].updatedAt = Date.now();
  await saveAllSubs(subs);
}

export async function removeSub(endpoint: string): Promise<void> {
  const id = endpointId(endpoint);
  const subs = await loadAllSubs();
  if (subs[id]) {
    delete subs[id];
    await saveAllSubs(subs);
  }
}

export async function getSub(endpoint: string): Promise<PushSubRecord | null> {
  const subs = await loadAllSubs();
  return subs[endpointId(endpoint)] ?? null;
}

// ── sent log ────────────────────────────────────────────────────────
export async function loadSent(): Promise<Record<string, number>> {
  const redis = getRedis();
  const raw = await redis.get<Record<string, number> | string | null>(SENT_KEY);
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, number>;
    } catch {
      return {};
    }
  }
  return raw as Record<string, number>;
}

export async function saveSent(sent: Record<string, number>) {
  const redis = getRedis();
  await redis.set(SENT_KEY, sent);
}

export function sentKey(subId: string, notifId: string): string {
  return `${subId}::${notifId}`;
}
