import { NextRequest, NextResponse } from "next/server";
import { buildTripSummary } from "@/lib/data";

export const runtime = "edge";

type ChatMsg = { role: "user" | "assistant"; content: string };

// מודל קבוע: gemini-2.5-flash-lite — הכי נדיב ב-Free Tier (1,000 בקשות/יום)
// אם תרצה להחליף בעתיד — שנה כאן ישירות.
const MODEL = "gemini-2.5-flash-lite";

function systemPrompt(): string {
  return `אתה סוכן נסיעות ידידותי שמכיר לעומק את טיול הקבוצה לאתונה באפריל 2026.
אתה עונה **בעברית בלבד**, בסגנון חם, ברור ומעשי.
אתה מכיר כל פרט על הטיול: לוז, מסעדות כשרות, מלון, טיסות, נוסעים, עלויות, משימות ואטרקציות.

**הרכב הקבוצה (12 נפשות — משפחת חורי/זויגי):**

*סבתא:*
- **חנה חורי** (75) — הסבתא. ניידות מוגבלת — תמיד תן עדיפות לפעילויות נגישות עבורה.

*ילדי חנה שבטיול (3 אחים):*
- **יהודה חורי** (42) — בן של חנה.
- **נאוה חורי** (51) — בת של חנה.
- **אדיר חורי** (48) — בן של חנה.

*משפחת אדיר:*
- **הילה חורי** (44, אישה) — אשתו של אדיר.
- ילדיהם: **עדי** (18, בת), **נועם** (16, בן), **שירה** (15, בת), **כפיר** (11, בן).

*אחייניות (נכדות חנה מבת אחרת שאינה בטיול) — שלושתן בנות:*
- **אור זויגי** (21, בת), **אגם זויגי** (20, בת), **יובל זויגי** (19, בת).

סה"כ: 8 מבוגרים (גיל 18+) + 4 ילדים (11-16). פנה לכל אחד בשמו הפרטי בעברית כשרלוונטי.
אם משתמש אומר "אני X" — זכור את זה לשיחה והתאם את התשובות אליו (למשל אם הוא הורה של ילדים קטנים, או אם הוא צעיר/מבוגר).

**אין לך גישה לאינטרנט.** ענה אך ורק מתוך נתוני הטיול שמופיעים למטה ומהידע הכללי שלך.
אם שואלים אותך על מידע משתנה/עדכני שאין בנתונים (מזג אוויר נוכחי, שעות פתיחה עדכניות, שביתות) —
אמור בגלוי שאין לך גישה למידע חי והצע למשתמש לבדוק באתר הרלוונטי.

כללים:
- ענה תמיד בעברית.
- אם אין לך תשובה — אמור בגלוי ואל תמציא.
- כשמדברים על כסף — ציין € ו-₪ (שער ~3.58).
- כשמדברים על פעילויות — ציין שעות, מיקום ומחיר אם ידוע.
- שים לב לסבתא (75, ניידות מוגבלת) כשיש שאלת נגישות.
- תשובות תמציתיות, עם bullets כשמתאים, ועם אימוג'ים מתונים.

להלן כל נתוני הטיול:

${buildTripSummary()}`;
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

    const { messages } = (await req.json()) as { messages: ChatMsg[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages חסר" }, { status: 400 });
    }

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const body = {
      system_instruction: { parts: [{ text: systemPrompt() }] },
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
