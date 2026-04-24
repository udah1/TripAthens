import { NextRequest, NextResponse } from "next/server";
import { buildTripSummary } from "@/lib/data";
import { getBaggageInfo } from "@/lib/baggage-info";

export const runtime = "edge";

type ChatMsg = { role: "user" | "assistant"; content: string };

type PackingSummary = {
  checked?: string[];
  deleted?: string[];
  custom?: string[];
  customChecked?: string[];
};

function formatPackingSummary(p: PackingSummary | null | undefined): string {
  if (!p) return "";
  const parts: string[] = [];
  if (p.checked?.length) {
    parts.push(`**פריטים שהמשתמש כבר ארז (סימן ✓):**\n${p.checked.map((i) => `- ${i}`).join("\n")}`);
  }
  if (p.deleted?.length) {
    parts.push(`**פריטים שהמשתמש סימן כלא רלוונטיים (מחק):**\n${p.deleted.map((i) => `- ${i}`).join("\n")}`);
  }
  if (p.custom?.length) {
    parts.push(`**פריטים שהמשתמש הוסיף ידנית:**\n${p.custom.map((i) => `- ${i}${p.customChecked?.includes(i) ? " (ארוז)" : ""}`).join("\n")}`);
  }
  if (!parts.length) return "";
  return `\n\n## מצב רשימת האריזה האישית של המשתמש\n(המשתמש עובר על הרשימה באתר — יש לו אפשרות לסמן פריטים כארוזים, למחוק פריטים לא רלוונטיים, ולהוסיף פריטים אישיים.)\n\n${parts.join("\n\n")}`;
}

// מודל קבוע: gemini-2.5-flash-lite — הכי נדיב ב-Free Tier (1,000 בקשות/יום)
// אם תרצה להחליף בעתיד — שנה כאן ישירות.
const MODEL = "gemini-2.5-flash-lite";

async function fetchFxLine(): Promise<string> {
  try {
    const r = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=ILS",
      { next: { revalidate: 3600 } },
    );
    if (!r.ok) return "";
    const j = (await r.json()) as { date?: string; rates?: { ILS?: number } };
    if (!j?.rates?.ILS) return "";
    return `\n\n**שער מט"ח נוכחי (מקור: ECB / Frankfurter):** 1€ = ${j.rates.ILS.toFixed(4)} ₪ (עודכן: ${j.date}).\nהשתמש בשער זה לכל חישובי המרה כשמבקשים סכום בשקלים.`;
  } catch {
    return "";
  }
}

function systemPrompt(packing?: PackingSummary | null, fxLine = ""): string {
  return `אתה סוכן נסיעות ידידותי שמכיר לעומק את טיול הקבוצה לאתונה באפריל 2026.
אתה עונה **בעברית בלבד**, בסגנון חם, ברור ומעשי.
אתה מכיר כל פרט על הטיול: לוז, מסעדות כשרות, מלון, טיסות, נוסעים, עלויות, משימות ואטרקציות.

**הרכב הקבוצה (13 נפשות — משפחת חורי/זויגי):**

*סבתא:*
- **חנה חורי** (75) — הסבתא. ניידות מוגבלת — תמיד תן עדיפות לפעילויות נגישות עבורה.

*ילדי חנה שבטיול (3 אחים):*
- **יהודה חורי** (42) — בן של חנה.
- **נאוה חורי** (51) — בת של חנה.
- **אדיר חורי** (48) — בן של חנה.

*משפחת אדיר:*
- **הילה חורי** (44, אישה) — אשתו של אדיר.
- ילדיהם: **עדי** (18, בת), **נועם** (16, בן), **שירה** (15, בת), **כפיר** (11, בן).

*אחייניות (נכדות חנה מבת אחרת שאינה בטיול) — ארבעתן בנות:*
- **אור זויגי** (21, בת), **אגם זויגי** (20, בת), **יובל זויגי** (19, בת), **ירין זויגי** (17, בת).

סה"כ: 8 מבוגרים (גיל 18+) + 5 ילדים (11-17). פנה לכל אחד בשמו הפרטי בעברית כשרלוונטי.
אם משתמש אומר "אני X" — זכור את זה לשיחה והתאם את התשובות אליו (למשל אם הוא הורה של ילדים קטנים, או אם הוא צעיר/מבוגר).

**אין לך גישה לאינטרנט.** ענה אך ורק מתוך נתוני הטיול שמופיעים למטה ומהידע הכללי שלך.
אם שואלים אותך על מידע משתנה/עדכני שאין בנתונים (מזג אוויר נוכחי, שעות פתיחה עדכניות, שביתות) —
אמור בגלוי שאין לך גישה למידע חי והצע למשתמש לבדוק באתר הרלוונטי.

כללים:
- ענה תמיד בעברית.
- אם אין לך תשובה — אמור בגלוי ואל תמציא.
- כשמדברים על כסף — ציין € ו-₪. השתמש בשער העדכני המופיע למטה אם ניתן, אחרת שער ברירת מחדל ~3.58.
- כשמדברים על פעילויות — ציין שעות, מיקום ומחיר אם ידוע.
- שים לב לסבתא (75, ניידות מוגבלת) כשיש שאלת נגישות.
- תשובות תמציתיות, עם bullets כשמתאים, ועם אימוג'ים מתונים.

**מערכת התראות באתר:** לאתר יש דף "🔔 התראות" (בניווט הראשי / במגירה) שבו המשתמש
יכול להפעיל Web Push. אחרי שהוא מפעיל — הוא מקבל אוטומטית:
- 60/30/15 דק' לפני כל פעילות בלוז (60 לנסיעות ארוכות כמו Ezraider/נפפליאו/שדה, 30 רגיל, 15 לפעילות קרובה למלון).
- תזכורות קריטיות ליום הטיסה הלוך (3 שעות לפני, שעה וחצי לפני), ליום החזרה (שעתיים ל-check-out, 30 דק' ליציאה לשדה, שעתיים לטיסה חזור).
- סיכום יומי בבוקר 07:30 עם הפעילויות המרכזיות.
- תזכורות מיוחדות (אוכל לנפפליאו, מעבר מ-Ezraider ל-Callimachos, הכנה לשקיעה בליקבטוס, הפעלת eSIM וביטוח ביום הטיסה).
אם משתמש מבקש "להוסיף תזכורת" — הפנה אותו לדף **/notifications** ותסביר שהוא צריך לוודא שהוא הוסיף את האתר למסך הבית (PWA) לאמינות מיטבית באנדרואיד.

להלן כל נתוני הטיול:

${buildTripSummary()}${formatPackingSummary(packing)}${fxLine}

${getBaggageInfo()}`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY לא מוגדר. הגדר Environment Variable ב-Vercel או ב-.env.local" },
        { status: 500 }
      );
    }

    const { messages, packing } = (await req.json()) as {
      messages: ChatMsg[];
      packing?: PackingSummary | null;
    };
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages חסר" }, { status: 400 });
    }

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const fxLine = await fetchFxLine();

    const body = {
      system_instruction: { parts: [{ text: systemPrompt(packing, fxLine) }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[chat] Gemini ${res.status}:`, errText);

      if (res.status === 429) {
        // ננסה לחלץ פרטי quota מתוך ההודעה כדי להראות למשתמש הסבר מדויק
        let quotaHint = "";
        try {
          const errObj = JSON.parse(errText);
          const details = errObj?.error?.details || [];
          const quotaFailure = details.find(
            (d: any) => d["@type"]?.includes("QuotaFailure")
          );
          const retryInfo = details.find((d: any) => d["@type"]?.includes("RetryInfo"));
          if (quotaFailure?.violations?.[0]?.quotaId) {
            quotaHint = ` (מכסה: ${quotaFailure.violations[0].quotaId})`;
          }
          if (retryInfo?.retryDelay) {
            quotaHint += ` · נסה שוב בעוד ${retryInfo.retryDelay}`;
          }
        } catch {}

        return NextResponse.json(
          {
            error:
              `⏳ חרגת ממכסת Gemini${quotaHint}. זה יכול להיות rate limit דקתי (נסה שוב בעוד דקה) או מכסה יומית (1,000/יום). פרטים מלאים בקונסול השרת.`,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `Gemini API שגיאה: ${res.status} — ${errText}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    const reply =
      candidate?.content?.parts?.map((p: any) => p.text).filter(Boolean).join("") ||
      "לא קיבלתי תשובה מהמודל — נסה שוב.";

    const grounding = candidate?.groundingMetadata;
    const chunks: any[] = grounding?.groundingChunks || [];
    const sources = chunks
      .map((c) => c?.web)
      .filter((w) => w?.uri)
      .map((w: any) => ({ title: w.title || w.uri, uri: w.uri }));

    // הסרת כפילויות לפי URI
    const uniqueSources = Array.from(
      new Map(sources.map((s) => [s.uri, s])).values()
    );

    return NextResponse.json({ reply, sources: uniqueSources });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "שגיאה לא צפויה" },
      { status: 500 }
    );
  }
}
