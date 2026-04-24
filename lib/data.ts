// ═══════════════════════════════════════════════════════════════════════════
// data.ts — טיפוסים, פונקציות ועזרים קבועים
// התוכן הדינמי (itinerary, tasks, costs...) נמצא ב-trip-content.ts
// זה מאפשר לערוך תוכן בלי לגעת בקוד.
// ═══════════════════════════════════════════════════════════════════════════

// ─── טיפוסים ───────────────────────────────────────────────────────────────
export type DayKey = "יום א" | "יום ב" | "יום ג" | "יום ד";

export interface ItineraryItem {
  day: DayKey;
  date: string;
  time: string;
  activity: string;
  location: string;
  description: string;
  notes: string;
  accessible: string;
  price: string;
  isEvening?: boolean;
  mapQuery?: string; // אופציונלי — מחליף את location בחיפוש Google Maps
}

export interface Task {
  task: string;
  done: boolean;
  contact: string;
  notes: string;
}

export interface CostItem {
  section: "flight" | "hotel" | "activities" | "totals";
  item: string;
  adultEur: string | number;
  childEur: string | number;
  adultIls: string | number;
  childIls: string | number;
  adults: string | number;
  children: string | number;
  totalEur: string | number;
  notes: string;
}

export interface Passenger {
  name: string;
  booking: string;
  ticket: string;
  baggage: string;
  baseEur: number;
  extraEur: string;
  flightTotalEur: number;
  hotelEur: number;
  grandTotalEur: number;
}

export interface Restaurant {
  type: "בשרי" | "חלבי";
  name: string;
  address: string;
  hours: string;
  kashrut: string;
  food: string;
  notes: string;
  whenInSchedule: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
}

export interface Attraction {
  category: string;
  name: string;
  description: string;
  practicalNotes: string;
  price: string;
  accessibility: string;
  url?: string;
}

export type PackingCategory = {
  id: string;
  title: string;
  emoji: string;
  items: string[];
};

// ─── ייבוא + יצוא מחדש של תוכן הטיול ──────────────────────────────────────
import {
  TRIP_META,
  RAW_ITINERARY,
  EZRAIDER_PAIRS,
  EZRAIDER_SOLO,
  TASKS,
  COSTS,
  PASSENGERS,
  RESTAURANTS,
  ACROPOLIS,
  ATTRACTIONS,
  DAY_LABELS,
  PACKING_CATEGORIES,
} from "./trip-content";

export {
  TRIP_META,
  EZRAIDER_PAIRS,
  EZRAIDER_SOLO,
  TASKS,
  COSTS,
  PASSENGERS,
  RESTAURANTS,
  ACROPOLIS,
  ATTRACTIONS,
  DAY_LABELS,
  PACKING_CATEGORIES,
};

// ─── סימון פעילויות ערב ────────────────────────────────────────────────────
const EVENING_KEYWORDS = ["ערב", "בר גג", "פלאקה בלילה", "סינטגמה", "21:00", "20:00+", "19:30+"];

function markEvening(it: Omit<ItineraryItem, "isEvening">): ItineraryItem {
  const blob = `${it.time} ${it.activity}`;
  const isEvening = EVENING_KEYWORDS.some((k) => blob.includes(k));
  return { ...it, isEvening };
}

export const ITINERARY: ItineraryItem[] = RAW_ITINERARY.map(markEvening);

// ─── צבעי ימים ─────────────────────────────────────────────────────────────
export const DAY_COLORS: Record<DayKey, string> = {
  "יום א": "#94DCF8",
  "יום ב": "#F7C7AC",
  "יום ג": "#E49EDD",
  "יום ד": "#7CD367",
};

// ─── תקציר הטיול ל-System Prompt של סוכן ה-AI ─────────────────────────────
export function buildTripSummary(): string {
  const lines: string[] = [];
  lines.push(`# ${TRIP_META.title}`);
  lines.push(`קבוצה של ${TRIP_META.groupSize} אנשים. מלון: ${TRIP_META.hotel}, ${TRIP_META.hotelAddress}, טל: ${TRIP_META.hotelPhone}.`);
  lines.push(`טיסות: ${TRIP_META.airlineFlight}. ${TRIP_META.outbound}. ${TRIP_META.inbound}.`);
  lines.push(`שער חליפין: ${TRIP_META.exchangeRate}.`);

  lines.push("\n## נוסעים");
  for (const p of PASSENGERS) {
    lines.push(`- ${p.name} | הזמנה ${p.booking} | ${p.ticket} | ${p.baggage} | בסיס ${p.baseEur}€ | תוספת ${p.extraEur} | סה"כ טיסה ${p.flightTotalEur}€ | מלון ${p.hotelEur}€ | סה"כ ${p.grandTotalEur}€`);
  }

  lines.push("\n## לוז יום-יום");
  for (const it of ITINERARY) {
    lines.push(`- ${it.day} ${it.date} ${it.time} | ${it.activity} @ ${it.location} | ${it.description} | הערות: ${it.notes} | נגיש: ${it.accessible} | מחיר: ${it.price}`);
  }

  lines.push("\n## משימות לפני הטיול");
  for (const t of TASKS) {
    lines.push(`- [${t.done ? "V" : " "}] ${t.task} | ${t.contact} | ${t.notes}`);
  }

  lines.push("\n## עלויות");
  for (const c of COSTS) {
    lines.push(`- [${c.section}] ${c.item} | מבוגר ${c.adultEur}€ | ילד ${c.childEur}€ | סה"כ ${c.totalEur}€ | ${c.notes}`);
  }

  lines.push("\n## מסעדות כשרות");
  for (const r of RESTAURANTS) {
    const contact = [r.phone && `טל: ${r.phone}`, r.whatsapp && `WhatsApp: ${r.whatsapp}`].filter(Boolean).join(" | ");
    lines.push(`- [${r.type}] ${r.name} | ${r.address} | ${r.hours} | ${r.kashrut} | ${r.food} | ${r.notes} | בלוז: ${r.whenInSchedule}${contact ? " | " + contact : ""}`);
  }

  lines.push("\n## אטרקציות");
  for (const a of ATTRACTIONS) {
    lines.push(`- [${a.category}] ${a.name} | ${a.description} | ${a.practicalNotes} | ${a.price} | נגישות: ${a.accessibility}`);
  }
  lines.push("\n## האקרופוליס (אופציונלי)");
  for (const a of ACROPOLIS) {
    lines.push(`- ${a.name} (${a.english}) | ${a.description} | ${a.notes}`);
  }

  lines.push("\n## חלוקה לסיור Ezraider (26/4 14:45)");
  lines.push(`סה"כ ${EZRAIDER_PAIRS.length + EZRAIDER_SOLO.length} כלי רכב: ${EZRAIDER_PAIRS.length} זוגות + ${EZRAIDER_SOLO.length} בודדים.`);
  lines.push("זוגות (שניים על אותו כלי):");
  for (const p of EZRAIDER_PAIRS) {
    lines.push(`- ${p.pair[0]} + ${p.pair[1]}`);
  }
  lines.push(`בודדים (כל אחד על כלי משלו): ${EZRAIDER_SOLO.join(", ")}.`);

  lines.push("\n## ביטוח נסיעות (חשוב!)");
  lines.push("ללקוחות ישרכארט: 5 ימי ביטוח נסיעות חינם (או פחות מ-$1) — דרך AIG.");
  lines.push("להפעלה: אתר ישרכארט — https://marketing.isracard.co.il/pages/insurance-abroad/ — ולחוץ על 'להפעלת ביטוח 5 ימים'.");
  lines.push("הביטוח מכסה ביטול טיסה, מזוודות, כיסוי רפואי ועוד. חובה להפעיל לפני הטיסה!");
  lines.push("ללקוחות Cal/MAX — כדאי לבדוק אם יש הטבה דומה שלהם.");

  lines.push("\n## רשימת אריזה מומלצת לחו\"ל");
  lines.push("(רשימה המוצעת באתר — כל נוסע יכול לסמן/למחוק/להוסיף פריטים בעצמו)");
  for (const cat of PACKING_CATEGORIES) {
    lines.push(`### ${cat.title}`);
    lines.push(cat.items.map((i) => `- ${i}`).join("\n"));
  }

  lines.push("\n## כרטיס SIM / eSIM לטיול");
  lines.push("ההמלצה למי שיש eSIM במכשיר: אפליקציית **Firsty** — €4.40 ל-4 ימים, 5GB ליום.");
  lines.push("קישור: https://play.google.com/store/apps/details?id=com.firsty.app | אתר: https://firsty.app/");
  lines.push("חשוב: להפעיל את ה-eSIM ביום ראשון בבוקר בשדה התעופה בישראל (לפני הטיסה) — ככה מגיעים לאתונה עם חיבור מיידי.");
  lines.push("בדיקה אם יש eSIM: Samsung S20 ומעלה, Pixel 3 ומעלה. חיוג *#06# — אם מופיע EID אז יש eSIM.");
  lines.push("למי שאין eSIM — צריך סים פיזי. חברות מומלצות ביוון:");
  lines.push("- Cosmote — ~€15 ל-10GB, הכיסוי הטוב ביותר ביוון, זמין בשדה התעופה ובעיר.");
  lines.push("- Vodafone GR — ~€15 ל-8GB, רשת איכותית, זמין בשדה התעופה.");
  lines.push("- Wind Hellas — ~€10 ל-8GB, המחיר הזול ביותר.");
  lines.push("- חבילת נדידה ישראלית (Cellcom/HOT/Pelephone/Partner) — ~₪50-100 לשבוע, נוח אבל יקר יותר.");
  lines.push("טיפים: ברוב המלונות באתונה יש Wi-Fi חינם. כדאי להוריד מפות offline של Google Maps לפני הטיסה. WhatsApp/Telegram עובדים מצוין על Wi-Fi.");

  return lines.join("\n");
}
