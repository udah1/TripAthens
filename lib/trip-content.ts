// ═══════════════════════════════════════════════════════════════════════════
// תוכן הטיול — קובץ עריכה קל לשינויים בשטח (מהטלפון דרך GitHub Mobile + Gemini)
// ═══════════════════════════════════════════════════════════════════════════
// כללי עריכה:
// 1. לא לשנות שמות של ה-exports ולא לגעת בסדר של השדות.
// 2. כל שדה הוא עברית/strings — אפשר לשנות חופשי.
// 3. תאריכים בפורמט DD/MM/YYYY, שעות בפורמט "HH:MM" או "HH:MM-HH:MM".
// 4. אם הוספת פעילות/משימה חדשה — פשוט הוסף שורה חדשה לאותו פורמט.
// 5. אחרי commit ב-GitHub, Vercel יעלה deployment תוך דקה.
// ═══════════════════════════════════════════════════════════════════════════

import type {
  ItineraryItem,
  Task,
  CostItem,
  Passenger,
  Restaurant,
  Attraction,
  PackingCategory,
  DayKey,
} from "./data";

// ─── מידע כללי על הטיול ─────────────────────────────────────────────────────
export const TRIP_META = {
  title: "טיול אתונה — אפריל 2026 · משפחת חורי/זויגי",
  groupSize: 12,
  hotel: "Athens Cypria Hotel",
  hotelAddress: "Diomeias 5, Athens 105 63",
  hotelPhone: "+30 210 323 8034",
  airlineFlight: "SKY express — GQ721 (הלוך) / GQ720 (חזור)",
  outbound: "26/04/2026 — יציאה 06:30 מישראל, נחיתה 08:45 באתונה",
  inbound: "29/04/2026 — יציאה 20:30 מאתונה, נחיתה 22:30 בישראל",
  exchangeRate: "~3.58 ILS/EUR",
};

// ─── לוז יום-יום ───────────────────────────────────────────────────────────
// (בלי השדה isEvening — זה מחושב אוטומטית מהמילים במחרוזת activity/time)
export const RAW_ITINERARY: Omit<ItineraryItem, "isEvening">[] = [
  // יום א
  { day: "יום א", date: "26/04/2026", time: "08:45", activity: "נחיתה בשדה התעופה", location: "Athens International Airport", description: "", notes: "", accessible: "כן", price: "" },
  { day: "יום א", date: "26/04/2026", time: "10:30", activity: "הגעה למלון וצ'ק-אין", location: "Athens Cypria Hotel - Diomeias 5", description: "", notes: "אם החדרים לא מוכנים — השאירו מזוודות", accessible: "כן", price: "" },
  { day: "יום א", date: "26/04/2026", time: "11:00-13:00", activity: "הופ-און הופ-אוף", location: "מרכז אתונה", description: "אוטובוס תיירותי קומתיים פתוח. קונים כרטיס 48 שעות ועולים/יורדים בכל תחנה. מקבלים אוזניות שם.", notes: "מומלץ ביום ראשון — עייפים!", accessible: "כן — ישיבה", price: "~28€ מבוגר / ~14€ ילד" },
  { day: "יום א", date: "26/04/2026", time: "13:30", activity: "צהריים — Shuk (בשרי)", location: "Ermou 117", description: "", notes: "הזמינו מקום ל-12!", accessible: "כן", price: "~20-25€/אדם" },
  { day: "יום א", date: "26/04/2026", time: "14:45-17:45", activity: "סיור Ezraider", location: "נקודת מפגש לתיאום", description: "כלי רכב חשמלי ישראלי על 4 גלגלים. מדריך עברית, עוצרים באטרקציות.", notes: "לאשר יציאה ב-14:45 + נגישות לסבתא!", accessible: "לאשר", price: "70€ מבוגר / 35€ ילד" },
  { day: "יום א", date: "26/04/2026", time: "18:00-19:00", activity: "Who Killed Callimachos — מיסתורן", location: "Athens Living Museum", description: "מופע תיאטרון אינטראקטיבי. שחקן מגלם דמויות מאתונה העתיקה, הקהל הם הבלשים.", notes: "הנחה ל-10+ אנשים! הזמינו מראש.", accessible: "כן", price: "22€ מבוגר / 15€ ילד" },
  { day: "יום א", date: "26/04/2026", time: "19:00-20:00", activity: "מנוחה במלון", location: "Athens Cypria Hotel", description: "", notes: "חובה אחרי טיסת שחר", accessible: "כן", price: "" },
  { day: "יום א", date: "26/04/2026", time: "20:00+", activity: "ערב בכיכר סינטגמה", location: "Syntagma Square", description: "כיכר המרכזית של אתונה — מוארת ותוססת. בתי קפה, ברים, אנשים.", notes: "שתייה מבקבוקים סגורים בסדר", accessible: "כן", price: "" },

  // יום ב
  { day: "יום ב", date: "27/04/2026", time: "09:30-11:30", activity: "שכונת פלאקה", location: "Plaka neighborhood", description: "שכונת העיר העתיקה. רחובות מרוצפים מהמאה ה-19, חנויות מזכרות, אווירה יוונית.", notes: "שטוח ונגיש לסבתא", accessible: "כן", price: "כניסה חופשית" },
  { day: "יום ב", date: "27/04/2026", time: "11:30-13:30", activity: "קניות", location: "Ermou + Monastiraki", description: "רחוב ארמו — קניות ראשי. מונסטיראקי — מזכרות.", notes: "קחו תיק לקניות", accessible: "כן — שטוח", price: "—" },
  { day: "יום ב", date: "27/04/2026", time: "13:30", activity: "צהריים — Gostijo (בשרי)", location: "Esopou 10", description: "ממש ליד מונסטיראקי. פותח ב-13:30. יש מכולת כשרה בפנים.", notes: "לאשר זמינות ל-12", accessible: "כן", price: "~20-25€/אדם" },
  { day: "יום ב", date: "27/04/2026", time: "14:30-18:00", activity: "המשך קניות", location: "Ermou + Monastiraki", description: "המשך קניות בארמו ומונסטיראקי.", notes: "", accessible: "כן — שטוח", price: "—" },
  { day: "יום ב", date: "27/04/2026", time: "18:30-20:30", activity: "גבעת ליקבטוס + שקיעה", location: "Lycabettus Hill", description: "הגבעה הכי גבוהה באתונה (277מ'). נוף פנורמי. שקיעה ~20:15 — לא לפספס!", notes: "רכבל תת-קרקעי — 3 דקות. להגיע ב-18:30!", accessible: "כן — רכבל", price: "13€ הלוך-חזור" },
  { day: "יום ב", date: "27/04/2026", time: "21:00+", activity: "בר גג לשתייה", location: "Rooftop bar", description: "נוף לילי על העיר המוארת.", notes: "שתייה מבקבוקים סגורים בסדר", accessible: "לשיקול דעת", price: "" },

  // יום ג
  { day: "יום ג", date: "28/04/2026", time: "10:00", activity: "יציאה לנפפליאו — ואן פרטי", location: "Athens Cypria Hotel", description: "קחו אוכל כשר מהמלון — אין מסעדה כשרה בנפפליאו!", notes: "", accessible: "כן — ואן", price: "650€ לקבוצה (~54€/אדם)" },
  { day: "יום ג", date: "28/04/2026", time: "11:00", activity: "תעלת קורינטוס", location: "Corinth Canal", description: "תעלה צרה ועמוקה מרהיבה. הישג הנדסי מדהים. עצירה ~20-30 דקות.", notes: "נוף מדהים מהגשר. שטוח ונגיש.", accessible: "כן", price: "חינם" },
  { day: "יום ג", date: "28/04/2026", time: "12:30-13:00", activity: "הגעה לנפפליאו", location: "Nafplio", description: "", notes: "", accessible: "כן — ואן", price: "" },
  { day: "יום ג", date: "28/04/2026", time: "13:00-14:30", activity: "מבצר פלמידי", location: "Fortress Palamidi", description: "אחד המבצרים היפים ביוון. נוף פנורמי על העיירה והמפרץ.", notes: "סבתא יכולה לחכות בנמל — הרבה מדרגות!", accessible: "חלקי", price: "~8€/אדם" },
  { day: "יום ג", date: "28/04/2026", time: "14:30-16:30", activity: "טיול חופשי בנפפליאו", location: "Nafplio — Old Town + Harbor", description: "סמטאות ציוריות, ארכיטקטורה וונציאנית, נמל יפהפה.", notes: "שטוח בעיירה ובנמל. נגיש לסבתא.", accessible: "כן — שטוח", price: "כניסה חופשית" },
  { day: "יום ג", date: "28/04/2026", time: "16:30", activity: "סירה לבורג'י (אופציונלי)", location: "Nafplio Harbor", description: "מגדל ים באמצע המפרץ — ~15 דקות הפלגה.", notes: "", accessible: "כן", price: "~5€/אדם" },
  { day: "יום ג", date: "28/04/2026", time: "17:00", activity: "יציאה חזרה לאתונה", location: "Nafplio - Athens", description: "", notes: "", accessible: "כן — ואן", price: "" },
  { day: "יום ג", date: "28/04/2026", time: "18:30", activity: "הגעה למלון", location: "Athens Cypria Hotel", description: "", notes: "", accessible: "כן", price: "" },
  { day: "יום ג", date: "28/04/2026", time: "21:00+", activity: "ערב בפלאקה", location: "Plaka neighborhood", description: "פלאקה יפה בלילה. אווירה רומנטית, בתי קפה שקטים.", notes: "שתייה בסדר. ערב נינוח.", accessible: "כן", price: "" },

  // יום ד
  { day: "יום ד", date: "29/04/2026", time: "09:00-11:00", activity: "סיור גרפיטי + פסירי", location: "Psiri / Kerameikos", description: "שכונת האמנות של אתונה. קירות מלאי מורלים. ממשיכים ישר לשוק הפשפשים!", notes: "אפליקציית Street Art Cities (חינם)", accessible: "כן — שטוח", price: "חינם" },
  { day: "יום ד", date: "29/04/2026", time: "11:00-13:00", activity: "מונסטיראקי ושוק הפשפשים", location: "Monastiraki Square", description: "שוק פשפשים ססגוני. תכשיטים, ביגוד, עתיקות, מזכרות.", notes: "שטוח, הרבה ספסלים לסבתא", accessible: "כן — שטוח", price: "כניסה חופשית" },
  { day: "יום ד", date: "29/04/2026", time: "13:00-14:00", activity: "מוזיאון האשליות", location: "Museum of Illusions Athens", description: "אשליות אופטיות ותמונות אינטראקטיביות. ~60 דקות. כיפי לכל הגילאים!", notes: "לשאול על הנחות קבוצה ל-12", accessible: "כן", price: "~13€/אדם" },
  { day: "יום ד", date: "29/04/2026", time: "14:15", activity: "צהריים — Shuk (בשרי)", location: "Ermou 117", description: "5 דקות הליכה מהמוזיאון", notes: "", accessible: "כן", price: "~20-25€/אדם" },
  { day: "יום ד", date: "29/04/2026", time: "15:30-16:30", activity: "הגן הלאומי", location: "National Garden", description: "פארק ירוק ענק ליד סינטגמה. שבילים, בריכות, צל, שקט.", notes: "הליכה קצרה מהמלון", accessible: "כן — שטוח", price: "חינם" },
  { day: "יום ד", date: "29/04/2026", time: "16:30", activity: "חזרה למלון — איסוף מזוודות", location: "Athens Cypria Hotel", description: "", notes: "מזוודות בקבלה מאז 12:00", accessible: "כן", price: "" },
  { day: "יום ד", date: "29/04/2026", time: "17:00", activity: "נסיעה לשדה התעופה", location: "Athens International Airport", description: "", notes: "מיניבוס (יאנה) או מטרו (10 euro/person). לא לאחר!", accessible: "כן — מיניבוס", price: "~10€/אדם" },
  { day: "יום ד", date: "29/04/2026", time: "18:00", activity: "להיות בשדה התעופה!", location: "Athens International Airport", description: "", notes: "לא לאחר!", accessible: "כן", price: "" },
  { day: "יום ד", date: "29/04/2026", time: "20:30", activity: "טיסה לישראל", location: "Athens - Israel", description: "", notes: "", accessible: "כן", price: "" },
];

// ─── חלוקה לסיור Ezraider (26/4 14:45) ────────────────────────────────────
// 3 זוגות + 6 בודדים = 9 כלי רכב
export const EZRAIDER_PAIRS: { pair: [string, string] }[] = [
  { pair: ["אדיר", "כפיר"] },
  { pair: ["חנה", "אור"] },
  { pair: ["אגם", "יובל"] },
];
export const EZRAIDER_SOLO: string[] = ["הילה", "עדי", "נועם", "שירה", "יהודה", "נאוה"];

// ─── משימות לפני הטיסה ─────────────────────────────────────────────────────
export const TASKS: Task[] = [
  { task: "הפעלת ביטוח נסיעות (ישרכארט — חינם ל-5 ימים)", done: false, contact: "https://marketing.isracard.co.il/pages/insurance-abroad/", notes: "ללקוחות ישרכארט: 5 ימי ביטוח חינם לכל הטיול (פחות מ-$1). לחצו 'להפעלת ביטוח 5 ימים'. חובה לפני הטיסה!" },
  { task: "הזמנת מיניבוס ליאנה — הגעה מהשדה (26/4)", done: false, contact: "https://wa.me/message/NLNHNSS46SLHE1", notes: "12 איש + מזוודות. נסיעה ~45 דק" },
  { task: "הזמנת מיניבוס ליאנה — חזרה לשדה (29/4)", done: false, contact: "https://wa.me/message/NLNHNSS46SLHE1", notes: "להיות בשדה ב-18:00" },
  { task: "הזמנת טיול יום לנפפליאו (28/4 10:00)", done: false, contact: "https://wa.me/message/NLNHNSS46SLHE1", notes: "650 euro לקבוצה. ואן פרטי ל-12. לאשר תעלת קורינטוס + מבצר פלמידי" },
  { task: "לברר הזמנה מוקדמת — Shuk / King David / Gostijo", done: false, contact: "Shuk: +306970252857 | King David: https://wa.me/306949527534", notes: "כנראה לא חובה — אבל כדאי לבדוק" },
  { task: "הזמנת כרטיסי מוזיאון האשליות (29/4 13:00)", done: false, contact: "https://athens.museumofillusions.gr", notes: "לשאול על הנחות קבוצה ל-12" },
  { task: "הזמנת סיור Ezraider (26/4 14:45)", done: false, contact: "https://wa.me/message/NLNHNSS46SLHE1", notes: "70 euro מבוגר / 35 euro ילד. לאשר יציאה ב-14:45 + נגישות לסבתא" },
  { task: "הזמנת Who Killed Callimachos (26/4 18:00)", done: false, contact: "https://athenslivingmuseum.com/who-killed-callimachos/", notes: "22 euro מבוגר / 15 euro ילד. הנחה ל-10+ אנשים!" },
  { task: "הזמנת כרטיסי הופ-און הופ-אוף אונליין", done: false, contact: "https://www.bigbustours.com/en/athens/athens-bus-tours", notes: "כרטיס 48 שעות" },
  { task: "אישור עם המלון — מעלית + נגישות לחדר", done: false, contact: "Athens Cypria Hotel - Diomeias 5", notes: "" },
];

// ─── עלויות ────────────────────────────────────────────────────────────────
export const COSTS: CostItem[] = [
  // טיסות
  { section: "flight", item: "טיסה — בסיס שווה לכולם", adultEur: 131.59, childEur: 131.59, adultIls: 471, childIls: 471, adults: 8, children: 4, totalEur: 1579.08, notes: "חלוקה שווה אחרי הורדת תוספות אישיות" },
  { section: "flight", item: "תוספת — הילה (SKY enjoy)", adultEur: "+82", childEur: "", adultIls: "+294", childIls: "", adults: 1, children: "", totalEur: "", notes: "מטען 23kg + Extra legroom" },
  { section: "flight", item: "תוספת — נאוה (SKY enjoy)", adultEur: "+82", childEur: "", adultIls: "+294", childIls: "", adults: 1, children: "", totalEur: "", notes: "מטען 23kg + Extra legroom" },
  { section: "flight", item: "תוספת — אור (SKY joy+)", adultEur: "+64", childEur: "", adultIls: "+229", childIls: "", adults: 1, children: "", totalEur: "", notes: "מטען 15kg + שינוי חינם" },
  { section: "flight", item: "תוספת — יהודה (SKY joy+)", adultEur: "+64", childEur: "", adultIls: "+229", childIls: "", adults: 1, children: "", totalEur: "", notes: "מטען 15kg + שינוי חינם" },
  { section: "flight", item: "תוספת — אדיר (מושב שמור)", adultEur: "+14", childEur: "", adultIls: "+50", childIls: "", adults: 1, children: "", totalEur: "", notes: "מושב חלון 15F" },
  { section: "flight", item: "תוספת — כפיר (מושב שמור)", adultEur: "+14", childEur: "", adultIls: "+50", childIls: "", adults: 1, children: "", totalEur: "", notes: "מושב אמצע 15E" },
  { section: "flight", item: 'סה"כ טיסות כולל תוספות', adultEur: "", childEur: "", adultIls: "", childIls: "", adults: 12, children: "", totalEur: 1899.08, notes: "" },
  // מלון
  { section: "hotel", item: "מלון — 4 חדרים 3 לילות (Agoda)", adultEur: 172.04, childEur: 172.04, adultIls: 616, childIls: 616, adults: 8, children: 4, totalEur: 2064.44, notes: "תשלום אוטומטי 19 אפריל!" },
  // פעילויות
  { section: "activities", item: "הסעה שדה + מלון (x2)", adultEur: "~12", childEur: "~12", adultIls: "~43", childIls: "~43", adults: 8, children: 4, totalEur: "~288", notes: "מיניבוס פרטי — יאנה" },
  { section: "activities", item: "הופ-און הופ-אוף", adultEur: "~28", childEur: "~14", adultIls: "~100", childIls: "~50", adults: 8, children: 4, totalEur: "~280", notes: "כרטיס 48 שעות" },
  { section: "activities", item: "סיור Ezraider", adultEur: 70, childEur: 35, adultIls: 251, childIls: 125, adults: 8, children: 4, totalEur: "~700", notes: "מחיר קבוע לאדם" },
  { section: "activities", item: "Who Killed Callimachos", adultEur: 22, childEur: 15, adultIls: 79, childIls: 54, adults: 8, children: 4, totalEur: "~236", notes: "הנחה קבוצתית ל-10+" },
  { section: "activities", item: "טיול יום — נפפליאו (ואן פרטי)", adultEur: "~54", childEur: "~54", adultIls: "~193", childIls: "~193", adults: 8, children: 4, totalEur: 650, notes: "650 euro / 12. כולל תעלת קורינטוס" },
  { section: "activities", item: "כניסה מבצר פלמידי", adultEur: "~8", childEur: "~8", adultIls: "~29", childIls: "~29", adults: 8, children: 4, totalEur: "~96", notes: "ילדים עד 18 — חינם" },
  { section: "activities", item: "גבעת ליקבטוס (רכבל)", adultEur: 13, childEur: 13, adultIls: 47, childIls: 47, adults: 8, children: 4, totalEur: "~156", notes: "הלוך-חזור" },
  { section: "activities", item: "מוזיאון האשליות", adultEur: "~13", childEur: "~13", adultIls: "~47", childIls: "~47", adults: 8, children: 4, totalEur: "~156", notes: "הנחות קבוצה — לשאול" },
  { section: "activities", item: "ארוחות צהריים x4", adultEur: "~22", childEur: "~15", adultIls: "~79", childIls: "~54", adults: 8, children: 4, totalEur: "~816", notes: "ממוצע" },
  { section: "activities", item: "קניות / קפה / שונות", adultEur: "~30", childEur: "~30", adultIls: "~107", childIls: "~107", adults: 12, children: "", totalEur: "~360", notes: "לפי שיקול דעת אישי" },
  // סיכומים
  { section: "totals", item: 'סה"כ פעילויות+אוכל — מבוגר', adultEur: "~270-320", childEur: "", adultIls: "~967-1146", childIls: "", adults: "", children: "", totalEur: "", notes: "לא כולל קניות אישיות" },
  { section: "totals", item: 'סה"כ פעילויות+אוכל — ילד/נוער', adultEur: "~193-233", childEur: "", adultIls: "~691-834", childIls: "", adults: "", children: "", totalEur: "", notes: "הנחות כניסה / פחות אוכל" },
  { section: "totals", item: 'סה"כ כולל הכל — מבוגר (בסיס)', adultEur: "~599", childEur: "", adultIls: "~2,144", childIls: "", adults: "", children: "", totalEur: "", notes: "שער 3.58 ILS/euro (15/4/2026)" },
  { section: "totals", item: 'סה"כ כולל הכל — ילד/נוער', adultEur: "~517", childEur: "", adultIls: "~1,851", childIls: "", adults: "", children: "", totalEur: "", notes: "שער 3.58 ILS/euro (15/4/2026)" },
];

// ─── נוסעים ────────────────────────────────────────────────────────────────
export const PASSENGERS: Passenger[] = [
  { name: "עדי חורי",    booking: "0L4ZFG", ticket: "SKY joy",   baggage: "יד 8kg",                       baseEur: 131.59, extraEur: "—",   flightTotalEur: 131.59, hotelEur: 172.04, grandTotalEur: 303.63 },
  { name: "שירה חורי",   booking: "0L4ZFG", ticket: "SKY joy",   baggage: "יד 8kg",                       baseEur: 131.59, extraEur: "—",   flightTotalEur: 131.59, hotelEur: 172.04, grandTotalEur: 303.63 },
  { name: "יובל זויגי",  booking: "0L4ZFG", ticket: "SKY joy",   baggage: "יד 8kg",                       baseEur: 131.59, extraEur: "—",   flightTotalEur: 131.59, hotelEur: 172.04, grandTotalEur: 303.63 },
  { name: "אגם זויגי",   booking: "FW9ZS7", ticket: "SKY joy",   baggage: "יד 8kg",                       baseEur: 131.59, extraEur: "—",   flightTotalEur: 131.59, hotelEur: 172.04, grandTotalEur: 303.63 },
  { name: "חנה חורי",    booking: "FW9ZS7", ticket: "SKY joy",   baggage: "יד 8kg",                       baseEur: 131.59, extraEur: "—",   flightTotalEur: 131.59, hotelEur: 172.04, grandTotalEur: 303.63 },
  { name: "הילה חורי",   booking: "GEIMP8", ticket: "SKY enjoy", baggage: "יד + מטען 23kg, Extra legroom", baseEur: 131.59, extraEur: "+82", flightTotalEur: 213.59, hotelEur: 172.04, grandTotalEur: 385.63 },
  { name: "נועם חורי",   booking: "UDJWVK", ticket: "SKY joy",   baggage: "יד 8kg",                       baseEur: 131.59, extraEur: "—",   flightTotalEur: 131.59, hotelEur: 172.04, grandTotalEur: 303.63 },
  { name: "אור זויגי",   booking: "V2FDEL", ticket: "SKY joy+",  baggage: "יד + מטען 15kg",               baseEur: 131.59, extraEur: "+64", flightTotalEur: 195.59, hotelEur: 172.04, grandTotalEur: 367.63 },
  { name: "יהודה חורי",  booking: "V2FDEL", ticket: "SKY joy+",  baggage: "יד + מטען 15kg",               baseEur: 131.59, extraEur: "+64", flightTotalEur: 195.59, hotelEur: 172.04, grandTotalEur: 367.63 },
  { name: "אדיר חורי",   booking: "WR7O1Y", ticket: "SKY joy",   baggage: "יד 8kg, מושב 15F",             baseEur: 131.59, extraEur: "+14", flightTotalEur: 145.59, hotelEur: 172.04, grandTotalEur: 317.63 },
  { name: "כפיר חורי",   booking: "WR7O1Y", ticket: "SKY joy",   baggage: "יד 8kg, מושב 15E",             baseEur: 131.59, extraEur: "+14", flightTotalEur: 145.59, hotelEur: 172.04, grandTotalEur: 317.63 },
  { name: "נאוה חורי",   booking: "0GI2VD", ticket: "SKY enjoy", baggage: "יד + מטען 23kg, Extra legroom", baseEur: 131.59, extraEur: "+82", flightTotalEur: 213.59, hotelEur: 172.04, grandTotalEur: 385.63 },
];

// ─── מסעדות כשרות ─────────────────────────────────────────────────────────
export const RESTAURANTS: Restaurant[] = [
  { type: "בשרי", name: "Shuk (השוק)",      address: "Ermou 117", hours: "09:00-22:30",                       kashrut: 'בד"צ למהדרין', food: "פלאפל, שקשוקה, חומוס, שניצל, דגים",                        notes: "הכי מומלצת. קרובה למלון.",                  whenInSchedule: "יום א צהריים + יום ד צהריים" },
  { type: "בשרי", name: "King David Burger", address: "Ermou 78",  hours: 'א-ה 11:00-23:00\nמוצ"ש עד 01:00',    kashrut: "בית יוסף",     food: "המבורגרים, מעורב ירושלמי, עראיס. גם משלוחים בוולט.",   notes: "",                                           whenInSchedule: "" },
  { type: "בשרי", name: 'Gostijo / חב"ד',    address: "Esopou 10", hours: "א-ה 13:30-21:30",                   kashrut: 'בית חב"ד',     food: "אוכל בית חב\"ד. יש מכולת כשרה בפנים!",                notes: "מאובטח, צריך דרכון.",                        whenInSchedule: "יום ב צהריים" },
  { type: "חלבי", name: "Parakalo",          address: "Mikonos 18",hours: "א-ה 8:00-20:00\nו עד 15:00",         kashrut: 'חב"ד',         food: "ארוחות בוקר, פיצות, מאפים, סלטים.",                     notes: "מומלץ לארוחות בוקר!",                         whenInSchedule: "יום ב/ג/ד בוקר" },
];

// ─── האקרופוליס (אופציונלי — לא מתוכנן בלוז) ──────────────────────────────
export const ACROPOLIS = [
  { name: "האקרופוליס", english: "Acropolis Hill",   description: "גובה סלע 156 מטר שעליו עתיקים בני 2,500 שנה — בראשם הפרתנון, מקדש אתנה. הסמל של יוון ואחד מהמורשות החשובים בעולם.", notes: "קן כרטיסים אונליין מראש! (נסיעה + מעלית פנורמית). תאמו 24ש מראש: +30 4172 321 210", url: "https://www.google.com/maps/search/?api=1&query=Acropolis+Athens" },
  { name: "מוזיאון האקרופוליס", english: "Acropolis Museum", description: "מוזיאון הבנוי מתחת לאקרופוליס, מציג את האפסלות והממצאים המקוריים מהגבעה. רצפת זכוכית עם חפירות ארכיאולוגיות מתחתיה.", notes: "נגיש לחלוטין — מעלית ורמפות. מדהים!", url: "https://www.theacropolismuseum.gr/en" },
];

// ─── אטרקציות ──────────────────────────────────────────────────────────────
export const ATTRACTIONS: Attraction[] = [
  { category: "מוזיאון",   name: "מוזיאון האשליות",         description: "אשליות אופטיות ותמונות אינטראקטיביות. ~60 דקות. כיפי לכל הגילאים.",  practicalNotes: "פתוח מ-10:00. הנחות קבוצה ל-12.",   price: "~13€/אדם",              accessibility: "כן",         url: "https://athens.museumofillusions.gr" },
  { category: "תיאטרון",   name: "Who Killed Callimachos",  description: "מיסתורן אינטראקטיבי. שחקן + קהל בלשים. אתונה עתיקה.",               practicalNotes: "מדי יום 18:00. הנחה ל-10+.",         price: "22€ מבוגר / 15€ ילד",  accessibility: "כן",         url: "https://athenslivingmuseum.com/who-killed-callimachos/" },
  { category: "סיור",      name: "Ezraider",                description: "כלי חשמלי ל-4 גלגלים. מדריך עברית. היסטוריה יהודית.",                practicalNotes: "לאשר ב-14:45 + נגישות לסבתא.",       price: "70€ מבוגר / 35€ ילד",  accessibility: "לאשר",       url: "https://wa.me/message/NLNHNSS46SLHE1" },
  { category: "טיול יום", name: "נפפליאו + תעלת קורינטוס",  description: "עיירת בוטיק ציורית + תעלה הנדסית. ואן פרטי.",                       practicalNotes: "10:00-18:30. אוכל מהבית!",           price: "650€ לקבוצה (~54€)",   accessibility: "כן — ואן",   url: "https://wa.me/message/NLNHNSS46SLHE1" },
  { category: "מבצר",      name: "מבצר פלמידי",             description: "אחד המבצרים היפים ביוון. נוף פנורמי.",                                practicalNotes: "הרבה מדרגות — סבתא נשארת בנמל.",    price: "~8€/אדם",              accessibility: "חלקי",       url: "https://en.wikipedia.org/wiki/Palamidi" },
  { category: "גבעה",      name: "גבעת ליקבטוס",            description: "הגבעה הכי גבוהה. נוף 360 מעלות. שקיעה מרהיבה ~20:15.",              practicalNotes: "רכבל עד 02:30. להגיע ב-18:30.",      price: "13€ הלוך-חזור",        accessibility: "כן — רכבל", url: "https://en.wikipedia.org/wiki/Lycabettus" },
  { category: "פארק",      name: "הגן הלאומי",              description: "פארק ירוק ענק ליד סינטגמה. שבילים, בריכות, צל.",                   practicalNotes: "פתוח עד שקיעה.",                      price: "חינם",                 accessibility: "כן — שטוח",  url: "https://www.google.com/maps/search/?api=1&query=National+Garden+Athens" },
  { category: "שכונה",     name: "פלאקה",                   description: "שכונת העיר העתיקה. רחובות מרוצפים, מזכרות, קפה.",                  practicalNotes: "שטוח ונגיש. יפה גם בלילה.",           price: "כניסה חופשית",         accessibility: "כן",         url: "https://www.google.com/maps/search/?api=1&query=Plaka+Athens" },
  { category: "שכונה",     name: "פסירי",                   description: "שכונת הגרפיטי של אתונה. מורלים, אמנות רחוב.",                       practicalNotes: "אפליקציה: Street Art Cities.",        price: "חינם",                 accessibility: "כן — שטוח",  url: "https://streetartcities.com/cities/athens" },
  { category: "שוק",       name: "מונסטיראקי",              description: "כיכר + שוק פשפשים ססגוני. תכשיטים, ביגוד, עתיקות.",                practicalNotes: "שטוח. הרבה ספסלים לסבתא.",          price: "כניסה חופשית",         accessibility: "כן",         url: "https://www.google.com/maps/search/?api=1&query=Monastiraki+Square+Athens" },
  { category: "תחבורה",    name: "הופ-און הופ-אוף",         description: "אוטובוס קומתי פתוח. עולים/יורדים בכל תחנה. כרטיס 48 שעות.",       practicalNotes: "bigbustours.com — לרכוש מראש.",      price: "~28€ מבוגר / ~14€ ילד",accessibility: "כן — ישיבה", url: "https://www.bigbustours.com/en/athens/athens-bus-tours" },
  { category: "טיול ים",   name: "סירה לבורג'י",            description: "מגדל ים באמצע מפרץ נפפליאו. ~15 דקות הפלגה.",                       practicalNotes: "אופציונלי. מהנמל.",                    price: "~5€/אדם",              accessibility: "כן" },
];

// ─── כותרות ימים ───────────────────────────────────────────────────────────
export const DAY_LABELS: Record<DayKey, string> = {
  "יום א": "יום א׳ — ראשון 26/4 | נחיתה + הופ-און + Ezraider + מיסתורן",
  "יום ב": "יום ב׳ — שני 27/4 | פלאקה + קניות + ליקבטוס",
  "יום ג": "יום ג׳ — שלישי 28/4 | טיול יום לנפפליאו",
  "יום ד": "יום ד׳ — רביעי 29/4 | גרפיטי + מוזיאון + טיסה",
};

// ─── רשימת אריזה ───────────────────────────────────────────────────────────
export const PACKING_CATEGORIES: PackingCategory[] = [
  {
    id: "money",
    title: "כסף ומסמכים",
    emoji: "💳",
    items: [
      "דרכון",
      "ביטוח בריאות",
      "מזומנים במטבע מקומי",
      "כרטיס אשראי",
    ],
  },
  {
    id: "clothes",
    title: "בגדים",
    emoji: "👕",
    items: [
      "בגדים תחתונים, לבנים, גופיות, חזיות",
      "חולצות",
      "טי שירטס",
      "מכנסיים",
      "מכנסיים קצרים",
      "גרביים",
      "נעליים",
      "סנדלים",
      "חגורה",
      "כובע",
      "בגד ים",
      "פיג'מה",
      "תכשיטים",
      "בגדים ליציאה",
      "שקיות ניילון",
      "משקפי שמש",
      "מפתחות",
      "ערכת תפירה",
    ],
  },
  {
    id: "hygiene",
    title: "היגיינה",
    emoji: "🧼",
    items: [
      "סכין גילוח",
      "קצף גילוח",
      "מברשת שיניים (אם חשמלית גם מטען)",
      "משחת שיניים",
      "שמפו",
      "ג'ל לשיער",
      "דיאודורנט",
      "קרם הגנה מהשמש",
      "עדשות מגע, נוזל",
      "משקפיים נוספים",
      "איפור",
      "טמפונים",
      "כדורים ותרופות (גלולות, נגד כאבי ראש, נגד אלרגיה)",
      "מספריים",
      "קרם לחות",
      "מסרק",
      "פלסטרים",
    ],
  },
  {
    id: "food",
    title: "אוכל",
    emoji: "🥨",
    items: [
      "פיתות",
      "ממרח שוקולד (לתאם עם אחרים)",
      "חטיפים",
      "כלי חד״פ (צלחות, כוסות, סכו״ם)",
      "דגני בוקר",
      "טונה / שימורים",
      "מנה חמה",
      "קפה / תה / סוכר",
      "עוגיות / וופלים",
      "בייגלה / פיצוחים",
      "סוכריות / מסטיקים לטיסה",
    ],
  },
  {
    id: "electronics",
    title: "אלקטרוניקה",
    emoji: "🔌",
    items: [
      "טלפון נייד",
      "מצלמה",
      "מטען לנייד",
      "מטען למצלמה",
      "כבל למצלמה",
      "מחשב נייד",
      "מתאם לשקעי חשמל",
      "נגן מוזיקה",
      "אוזניות",
    ],
  },
];
