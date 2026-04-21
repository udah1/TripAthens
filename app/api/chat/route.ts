import { NextRequest, NextResponse } from "next/server";
import { buildTripSummary } from "@/lib/data";

export const runtime = "edge";

type ChatMsg = { role: "user" | "assistant"; content: string };

const MODEL = "gemini-2.0-flash";

function systemPrompt(): string {
  return `אתה סוכן נסיעות ידידותי שמכיר לעומק את טיול הקבוצה לאתונה באפריל 2026.
אתה עונה **בעברית בלבד**, בסגנון חם, ברור ומעשי.
אתה מכיר כל פרט על הטיול: לוז, מסעדות כשרות, מלון, טיסות, נוסעים, עלויות, משימות ואטרקציות.

כללים:
- ענה תמיד בעברית.
- אם נשאלת משהו שלא קיים בנתונים — אמור בגלוי שאתה לא יודע ואל תמציא.
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
      return NextResponse.json(
        { error: `Gemini API שגיאה: ${res.status} — ${errText}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ||
      "לא קיבלתי תשובה מהמודל — נסה שוב.";

    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "שגיאה לא צפויה" },
      { status: 500 }
    );
  }
}
