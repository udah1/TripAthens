// ═══════════════════════════════════════════════════════════════════════════
// lib/notifications.ts
// בונה רשימה של התראות מתוזמנות לכל הטיול — 4 קטגוריות:
//   activity  — לפני כל פעילות בלוז (60/30/15 דק')
//   critical  — תזכורות קריטיות (טיסה, check-out, יציאה לשדה)
//   morning   — סיכום יומי בבוקר 07:30
//   special   — תזכורות מיוחדות (אוכל לנפפליאו, Callimachos וכו')
// כל התראה היא Timestamp + title + body + url + tag + category.
// ═══════════════════════════════════════════════════════════════════════════

import { ITINERARY, DAY_LABELS } from "./data";
import type { DayKey, ItineraryItem } from "./data";

export type NotifCategory = "activity" | "critical" | "morning" | "special";

export interface ScheduledNotif {
  id: string; // tag יציב
  category: NotifCategory;
  sendAt: number; // epoch ms — UTC
  title: string;
  body: string;
  url: string;
}

// IDT = UTC+3 (אין שעון חורף בטיול)
const IDT_OFFSET_MIN = 3 * 60;

// סוף הטיול — אחרי זה לא שולחים שום דבר
export const TRIP_END_MS = Date.UTC(2026, 3, 29, 20, 0); // 29/4 23:00 IDT (אחרי הנחיתה בארץ)

function parseDmy(dmy: string): { y: number; m: number; d: number } {
  const [d, m, y] = dmy.split("/").map((s) => parseInt(s, 10));
  return { d, m, y };
}

// מחזיר epoch ms בזמן IDT עבור date=DD/MM/YYYY ו-time=HH:MM (או HH:MM-HH:MM, אז לוקח את ההתחלה)
export function idtToMs(date: string, time: string): number | null {
  if (!date || !time) return null;
  const { d, m, y } = parseDmy(date);
  const t0 = time.split("-")[0].trim();
  const mt = /^(\d{1,2}):(\d{2})/.exec(t0);
  if (!mt) return null;
  const hh = parseInt(mt[1], 10);
  const mm = parseInt(mt[2], 10);
  // תאריך ב-UTC + הפחתת offset כדי לקבל את הזמן המקומי (IDT)
  return Date.UTC(y, m - 1, d, hh, mm) - IDT_OFFSET_MIN * 60 * 1000;
}

// ─── מיון פעילויות לפי "סוג נסיעה" כדי להחליט על 60/30/15 דק' לפני ─────
function leadMinutesFor(it: ItineraryItem): number {
  const a = it.activity.toLowerCase();
  // מסע ארוך / חשוב → 60 דקות
  const long = ["ezraider", "נפפליאו", "שדה התעופה", "נסיעה לשדה", "יציאה חזרה", "טיסה"];
  if (long.some((k) => a.includes(k))) return 60;
  // פעילויות קרובות מאוד (במלון/סביבה קרובה) → 15 דקות
  const near = ["מנוחה במלון", "ערב ב", "בר גג", "ערב בפלאקה"];
  if (near.some((k) => a.includes(k.toLowerCase()))) return 15;
  // ברירת מחדל → 30 דקות
  return 30;
}

function emojiFor(it: ItineraryItem): string {
  const a = it.activity;
  if (a.includes("טיסה") || a.includes("שדה")) return "✈️";
  if (a.includes("Ezraider")) return "🚗";
  if (a.includes("Shuk") || a.includes("Gostijo") || a.includes("King David") || a.includes("Parakalo") || a.includes("צהריים") || a.includes("ארוחה")) return "🍽️";
  if (a.includes("ליקבטוס") || a.includes("שקיעה")) return "🌅";
  if (a.includes("פלאקה") || a.includes("מונסטיראקי") || a.includes("פסירי")) return "🏛️";
  if (a.includes("מוזיאון")) return "🎨";
  if (a.includes("נפפליאו") || a.includes("קורינטוס") || a.includes("פלמידי") || a.includes("בורג")) return "🏰";
  if (a.includes("הופ-און")) return "🚌";
  if (a.includes("Callimachos") || a.includes("מיסתורן")) return "🎭";
  if (a.includes("מנוחה")) return "😴";
  if (a.includes("ערב") || a.includes("בר")) return "🌃";
  if (a.includes("גן")) return "🌳";
  if (a.includes("קניות")) return "🛍️";
  return "📍";
}

// פעילויות שצריך להתעלם מהן להתראה "לפני פעילות" (בגלל שיש להן תזכורת קריטית משלהן)
function shouldSkipActivity(it: ItineraryItem): boolean {
  const skip = [
    "נחיתה בשדה התעופה",
    "להיות בשדה התעופה!",
    "טיסה לישראל",
    "הגעה למלון וצ'ק-אין",
    "הגעה למלון",
    "חזרה למלון — איסוף מזוודות",
    "נסיעה לשדה התעופה",
  ];
  return skip.some((s) => it.activity.includes(s));
}

// ─── בונה את כל ההתראות לפני פעילויות ─────────────────────────────────
function buildActivityNotifs(): ScheduledNotif[] {
  const out: ScheduledNotif[] = [];
  for (const it of ITINERARY) {
    if (shouldSkipActivity(it)) continue;
    const startMs = idtToMs(it.date, it.time);
    if (startMs == null) continue;
    const lead = leadMinutesFor(it);
    const sendAt = startMs - lead * 60 * 1000;
    const emoji = emojiFor(it);
    const place = it.location && it.location !== "—" ? ` · ${it.location}` : "";
    out.push({
      id: `act_${it.date.replace(/\//g, "")}_${it.time.replace(/[:\-]/g, "")}_${it.activity.slice(0, 20)}`,
      category: "activity",
      sendAt,
      title: `${emoji} עוד ${lead} דק' — ${it.activity}`,
      body: `${it.time}${place}${it.notes ? `\n${it.notes}` : ""}`,
      url: "/schedule",
    });
  }
  return out;
}

// ─── תזכורות קריטיות ──────────────────────────────────────────────────
function buildCriticalNotifs(): ScheduledNotif[] {
  const out: ScheduledNotif[] = [];

  // יום הטיסה הלוך — התראה 3 שעות לפני (26/4 03:30 IDT)
  const outbound = idtToMs("26/04/2026", "06:30");
  if (outbound != null) {
    out.push({
      id: "crit_wake_outbound",
      category: "critical",
      sendAt: outbound - 3 * 60 * 60 * 1000,
      title: "✈️ התעוררו! טיסה בעוד 3 שעות",
      body: "בדקו שהדרכון בתיק 🛂 · יציאה מהבית עכשיו!",
      url: "/before-flight",
    });
    out.push({
      id: "crit_airport_outbound",
      category: "critical",
      sendAt: outbound - 90 * 60 * 1000,
      title: "🛫 עוד שעה וחצי לטיסה!",
      body: "להיות בשדה. בדקו Check-in אונליין ב-SKY express.",
      url: "/before-flight",
    });
  }

  // יום חזרה — check-out 12:00, יציאה 17:00
  const returnFlight = idtToMs("29/04/2026", "20:30");
  const depToAirport = idtToMs("29/04/2026", "17:00");
  if (depToAirport != null) {
    out.push({
      id: "crit_2h_checkout",
      category: "critical",
      sendAt: idtToMs("29/04/2026", "15:00")!,
      title: "🏨 עוד שעתיים ל-Check-out",
      body: "התחילו לארוז · המזוודות נשארות בקבלה.",
      url: "/schedule",
    });
    out.push({
      id: "crit_30min_airport",
      category: "critical",
      sendAt: depToAirport - 30 * 60 * 1000,
      title: "🚐 בעוד 30 דק' יוצאים לשדה התעופה!",
      body: "איסוף מזוודות מהקבלה · מיניבוס יאנה ב-17:00.",
      url: "/schedule",
    });
  }
  if (returnFlight != null) {
    out.push({
      id: "crit_2h_flight_home",
      category: "critical",
      sendAt: returnFlight - 2 * 60 * 60 * 1000,
      title: "✈️ עוד שעתיים לטיסה חזרה!",
      body: "תהיו בשדה · GQ720 מאתונה לתל אביב.",
      url: "/",
    });
  }

  return out;
}

// ─── תזכורות בוקר — שעה לפני הפעילות הראשונה של היום ──────────────────
function buildMorningNotifs(): ScheduledNotif[] {
  const days: { key: DayKey; date: string }[] = [
    { key: "יום א", date: "26/04/2026" },
    { key: "יום ב", date: "27/04/2026" },
    { key: "יום ג", date: "28/04/2026" },
    { key: "יום ד", date: "29/04/2026" },
  ];
  const out: ScheduledNotif[] = [];
  for (const { key, date } of days) {
    // מוצאים את הפעילות הראשונה של היום (לא ערב, לא skip)
    const dayItems = ITINERARY.filter((it) => it.day === key && !it.isEvening);
    const firstActivity = dayItems.find((it) => !shouldSkipActivity(it));
    if (!firstActivity) continue;

    const firstMs = idtToMs(firstActivity.date, firstActivity.time);
    if (firstMs == null) continue;

    // שעה לפני הפעילות הראשונה
    const sendAt = firstMs - 60 * 60 * 1000;

    // סיכום 3-4 פעילויות מרכזיות
    const highlights = dayItems
      .filter((it) => !shouldSkipActivity(it))
      .slice(0, 4)
      .map((it) => `${it.time.split("-")[0]} ${it.activity}`)
      .join(" · ");

    out.push({
      id: `morn_${date.replace(/\//g, "")}`,
      category: "morning",
      sendAt,
      title: `🌞 בוקר טוב! ${DAY_LABELS[key].split("|")[0].trim()}`,
      body: highlights || "בדקו את הלוז באתר.",
      url: "/schedule",
    });
  }
  return out;
}

// ─── תזכורות מיוחדות ──────────────────────────────────────────────────
function buildSpecialNotifs(): ScheduledNotif[] {
  const out: ScheduledNotif[] = [];

  // נפפליאו — קחו אוכל (יום לפני ובבוקר של היום)
  const nafplioMorning = idtToMs("28/04/2026", "08:00");
  if (nafplioMorning != null) {
    out.push({
      id: "spec_nafplio_food",
      category: "special",
      sendAt: nafplioMorning,
      title: "🥪 היום נפפליאו — קחו אוכל!",
      body: "אין מסעדה כשרה בנפפליאו. ארזו סנדוויצ'ים, פירות, ושתייה מהמלון.",
      url: "/schedule",
    });
  }

  // Ezraider → Callimachos — תזכורת בסוף הסיור
  const ezEnd = idtToMs("26/04/2026", "17:45");
  if (ezEnd != null) {
    out.push({
      id: "spec_ez_to_calli",
      category: "special",
      sendAt: ezEnd,
      title: "🎭 סיום Ezraider — עכשיו ל-Callimachos!",
      body: "15 דק' הליכה ל-Athens Living Museum · מיסתורן ב-18:00.",
      url: "/schedule",
    });
  }

  // ליקבטוס — תזכרו להגיע ב-18:30 לשקיעה
  const lyca = idtToMs("27/04/2026", "17:30");
  if (lyca != null) {
    out.push({
      id: "spec_lyca_sunset",
      category: "special",
      sendAt: lyca,
      title: "🌅 שקיעה בליקבטוס הערב!",
      body: "שקיעה ~20:15 · להגיע ב-18:30 · רכבל תת-קרקעי, 13€ הלוך-חזור.",
      url: "/schedule",
    });
  }

  // בוקר יום הטיול הראשון — eSIM + ביטוח
  const day0 = idtToMs("26/04/2026", "05:30");
  if (day0 != null) {
    out.push({
      id: "spec_day0_esim",
      category: "special",
      sendAt: day0,
      title: "📱 הפעילו eSIM + ביטוח נסיעות",
      body: "Firsty — הפעילו בשדה לפני ההמראה · ביטוח ישרכארט 5 ימים חינם!",
      url: "/before-flight",
    });
  }

  return out;
}

// ─── האוסף המלא — מסונן רק להתראות שלא עברו ועד סוף הטיול ───────────
export function buildAllNotifications(): ScheduledNotif[] {
  const all = [
    ...buildActivityNotifs(),
    ...buildCriticalNotifs(),
    ...buildMorningNotifs(),
    ...buildSpecialNotifs(),
  ];
  return all.filter((n) => n.sendAt <= TRIP_END_MS).sort((a, b) => a.sendAt - b.sendAt);
}

// ─── פרופיל ההעדפות של משתמש (נשמר ב-KV לכל subscription) ────────────
export interface NotifPrefs {
  enabled: boolean;
  activity: boolean;
  critical: boolean;
  morning: boolean;
  special: boolean;
}

export const DEFAULT_PREFS: NotifPrefs = {
  enabled: true,
  activity: true,
  critical: true,
  morning: true,
  special: true,
};

export function prefsAllow(prefs: NotifPrefs, n: ScheduledNotif): boolean {
  if (!prefs.enabled) return false;
  return prefs[n.category];
}

export const CATEGORY_LABELS: Record<NotifCategory, string> = {
  activity: "לפני כל פעילות",
  critical: "תזכורות קריטיות (טיסות/check-out)",
  morning: "סיכום יומי בבוקר (07:30)",
  special: "תזכורות מיוחדות (אוכל לנפפליאו, שקיעה…)",
};
