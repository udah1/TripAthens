# 🇬🇷 אתונה אפריל 2026 — אתר הטיול

אתר Next.js 14 + Tailwind CSS המציג את כל פרטי טיול הקבוצה לאתונה, כולל סוכן AI שמכיר את כל הנתונים.

## התקנה

```bash
cd athens/site
npm install
```

## הגדרת משתני סביבה

צור קובץ `.env.local` בשורש התיקייה:

```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

קבל מפתח כאן: https://aistudio.google.com/app/apikey

## הרצה לוקלית

```bash
npm run dev
```

פתח את http://localhost:3000

## פריסה ל-Vercel

```bash
vercel deploy
```

זכור להגדיר את משתנה הסביבה `GEMINI_API_KEY` בלוח הבקרה של Vercel.

## מבנה

- `app/` — דפי Next.js (App Router)
- `app/api/chat/route.ts` — endpoint לסוכן AI (Gemini)
- `lib/data.ts` — כל נתוני הטיול (נוסעים, לוז, עלויות, מסעדות, אטרקציות, משימות)
- `components/` — רכיבי UI משותפים
