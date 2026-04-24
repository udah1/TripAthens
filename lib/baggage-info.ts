// ═══════════════════════════════════════════════════════════════════════════
// baggage-info.ts — מידע על כבודה לטיסה עם Sky Express
// ─── כאן תוסיפו/תעדכנו מידע על כבודה ───────────────────────────────────────
// אחרי עריכה — commit ב-GitHub ו-Vercel יפרוס אוטומטית.
// מקור: https://www.skyexpress.gr/en/sky-experience/before-fly/fare-types
// ═══════════════════════════════════════════════════════════════════════════

// ─── כרטיסי הקבוצה ──────────────────────────────────────────────────────────
// רוב הנוסעים: SKY Joy — כולל טרולי 8kg בלבד, ללא מזוודה גדולה.
// חלק מהנוסעים: SKY Joy+ — כולל טרולי 8kg + מזוודה גדולה 15kg.
// מזוודה גדולה שנרכשה בנפרד: תלוי בהזמנה האישית.

export const BAGGAGE_INFO = `
=== כללי כבודה — Sky Express (טיסות הקבוצה) ===

** כרטיסי הקבוצה:**
- רוב הנוסעים: SKY Joy — כולל 8kg טרולי בלבד. מזוודה גדולה צריך לרכוש בנפרד (מ-15€).
- חלק: SKY Joy+ — כולל 8kg טרולי + מזוודה גדולה 15kg.

** תיק אישי (מתחת לכיסא הקדמי):**
- מידות מקסימום: 40×30×15 ס"מ
- אין הגבלת משקל מוגדרת — בגבולות ההגיון
- דוגמאות: תיק יד, תיק מחשב נייד, תיק גב קטן

** טרולי / תיק יד (מעל הכיסא):**
- מידות מקסימום: 55×40×23 ס"מ
- משקל מקסימום: 8 ק"ג (SKY Joy / SKY Joy+)
- אם פחים עליונים מלאים — ייתכן שייקחו לתא המטען בחינם בשדה

** מזוודה גדולה (כבודה רשומה):**
- מידות מקסימום: סך מידות (אורך + רוחב + גובה) לא יעלה על 156 ס"מ
- אין מגבלת גודל נפרדת — רק סך 156 ס"מ
- משקל לפי כרטיס: SKY Joy+ = 15kg, SKY enjoy = 23kg, BLISS = 2×32kg
- SKY Joy: לא כלולה — צריך לרכוש בנפרד

** כלל הנוזלים (חל גם בישראל — ביטחון שדה):**
- ❌ אסור בטרולי: נוזלים, ג'לים, קרמים, שמפו, דיאודורנט נוזלי, בושם — כל מה שמעל 100ml
- ✅ מותר בטרולי: עד 10 מיכלים/בקבוקים, כל אחד עד 100ml בדיוק
- חובה: חייב להיות כתוב על האריזה עצמה 100ml ומטה — בקבוק של 150ml שחצי ריק = אסור!
- חובה: כל הנוזלים בשקית ניילון שקופה נפרדת (1 ליטר סה"כ)
- בטיסה הלוך מישראל לפעמים פחות קפדנים — אבל לא לסמוך על זה!
- ✅ כל נוזל גדול (שמפו, קרם גדול, בושם גדול) — חייב במזוודה הגדולה

** סוללות וציוד אלקטרוני:**
- ✅ פאוורבנק / סוללות ליתיום חיצוניות עד 100Wh — מותר רק בטרולי/תיק יד, אסור במזוודה גדולה!
- ✅ מחשב נייד, טלפון, מצלמה — מותר בטרולי
- ✅ מטענים, כבלים — מותר בכל מקום
- ❌ סוללות ליתיום חיצוניות (פאוורבנק) — אסור להכניס למזוודה הגדולה

** פריטים אסורים לחלוטין (לא בטרולי ולא במזוודה):**
- נשק, חפצים חדים (סכינים מעל 6 ס"מ, מספריים מעל 6 ס"מ)
- חומרים נפיצים, דליקים, זיקוקים
- ספריי גז (פלפל, חרדל, גז מדמיע)
- משקאות חריפים מעל 70% אלכוהול
- חומרים רדיואקטיביים / כימיים

** פריטים אסורים במזוודה גדולה בלבד (מותר בטרולי):**
- פאוורבנק / סוללות ליתיום חיצוניות
- מצית (1 בלבד מותר בכיס/תיק אישי)

** טיפ מעשי לאריזה:**
1. כל הנוזלים הגדולים — במזוודה גדולה
2. פאוורבנק — בטרולי, לא במזוודה
3. תרופות אישיות — בטרולי (לא במטען)
4. דרכון, כרטיסי טיסה — בתיק אישי תמיד

## מידע מהאתר של Sky Express - https://www.skyexpress.gr/en/sky-experience/before-fly/fare-types
Baggage Allowance
Cabin baggage allowance:
Each of our passengers can carry in the cabin of the aircraft at no extra charge, up to one (1) piece of hand luggage and one (1) small personal item. The personal item can be 1 personal item, handbag or laptop case, with maximum dimensions 40 x 30 x 15 cm and must fit under the front seat.


The hand luggage, which should have a maximum dimensions of 55 x 40 x 23 cm and should not exceed 8 kg in economy and 13 kg in BLISS & BLISS+ (Business class), is stored in the space above the seats.

If the overhead bins are full, your carry-on may need to be checked at the gate at no extra cost, as long as it complies with the allowed dimensions and weight.

Checked baggage allowance:
Each passenger may carry luggage, which must be delivered to the SKY express boarding control point.

The total dimensions (Length + Width + Height) must not exceed 156cm.

The permissible weight of the checked luggage varies according to fare category. In any case, passengers may purchase additional baggage or extra kg according to their needs.

Fare	Baggage weight per fare
SKY offer, SKY joy	n/a
SKY joy+	15kg
SKY enjoy	23kg
SKY basic	15kg
BLISS, BLISS+	2 x 32kg
Infants (0-2 years old) are only entitled to carry a folding stroller which is checked in and handed over to SKY express staff for storage in the hold of the aircraft. The stroller will be delivered to you with priority upon arrival, depending on airport availability.

With regard to children’s baggage (2 to 12-year-old children), the baggage limits are the same as the baggage limits for adult passengers.

Children over 2 to 12 years old, are entitled to carry a folding stroller which is checked in and handed over to SKY express staff for storage in the hold of the aircraft. The stroller will be delivered to you with priority upon arrival, depending on airport availability. The service is free of charge and in addition to any baggage entitlement according to purchased fare type.




Prohibited objects & items:
Please make sure that during the flight you don’t have any of the following with you:

Disabling devices such as pepper spray, electroshock weapons, stun guns or any other object containing irritant or incapacitating substance.
Alcoholic beverages (containing over 70% alcohol by volume)
Dangerous goods such as compressed gases, lithium batteries.
Security –type attaché cases, cash boxes, cash bags, etc. incorporating dangerous goods, such as lithium batteries and/or pyrotechnic material.
Explosive substances or articles which are liable to dangerously react, produce a flame or dangerous evolution of heat.
Items containing or liable to emit toxic, corrosive or flammable gazes or vapors.
Non safety matches or cigar lighters with blue flame.
Liquid Oxygen systems /cylinders.
Not allowed in your checked luggage:

Passengers are not allowed to carry in their checked luggage any explosive substances and incendiary materials and devices including the following:

Ammunition (please check for Exception at the end of the list)
Capsules
Detonators and fuses
Mines, grenades and other explosive ordnance
Fireworks and other pyrotechnic devices
Smoke canisters and cartridges
Dynamite, gunpowder and plastic explosives
Not allowed in your carry-on luggage (cabin & personal item):

Passengers are not allowed to carry the following items in their carry-on luggage (cabin and personal item):

Weapons, firearms, and other devices that launch projectiles, that are capable or appear capable, of being used to cause serious injury by launching a projectile, including:
All kinds of firearms, such as pistols, revolvers, rifles, shotguns
Toy weapons, replicas, and imitations of firearms that could be mistaken for real weapons
Parts of firearms, except for sights
Air and CO2-powered weapons, such as pistols, shotguns, rifles, and weapons that carry pellets
Flare guns and starting pistols
Bows, crossbows, and arrows
Harpoons and spearguns
Slingshots and stone throwers
Paralyzing & Stunning devices which are specifically designed to stun and to cause paralysis or immobilization, including:
Immobilization devices (for shocking), such as temporary paralysis weapons, electroshock weapons, stun guns, tasers, stun rods and stun batons.
Non-lethal anesthetizing and euthanizing devices for animals, commonly referred as animal stunners and animal killers.
Disabling and incapacitating chemicals, gases, and sprays commonly used for neutralization and immobilization, such as neutralizing gas, mace, peppers sprays, capsicum sprays, tear gas, acid sprays and animal repellent sprays.
Sharp-edged or pointed objects, that are capable to cause serious injury, including:
Cutting tools, such as small and large axes and hatchets
Ice picks and ice breakers
Razor blades
Cutters
Knives with blades longer than 6 cm
Scissors with blades longer than 6 cm from the point of attachment
Martial arts objects with sharp edges or pointed ends
Swords and sabers
Cleavers
Professional tools, that may cause serious injury, including:
Maces and Crowbars
Drills and drill bits, as well as cordless portable drills
Tools with blades or shafts longer than 6 cm that can be used as weapons, such as screwdrivers and chisels
Saws, as well as cordless portable saws
Stoves & Blow torches
Screwing and pinning guns (commonly referred as bolt and nail guns)
Pointed tools, that may cause serious injury when used aggressively, including:
Baseball and softball bats
Maces and rods, such as police clubs, truncheons, and protective rods
Martial arts equipment
Explosive and incendiary materials and devices that are capable or appear capable to cause serious injury, including:
Ammunition
Caps
Fuses and detonation cords
Replicas or imitations of explosive devices
Mines, hand grenades, and other explosive munitions
Fireworks and other pyrotechnics
Smoke canisters and cartridges
Dynamite, gunpowder, and plastic explosives.
Liquid, aerosols and gels, unless subjected to security control using LEDS equipment, based on the relevant procedures applicable at the airport or if exempt from security checks according to the provisions of this document.
Allowed in your checked luggage:

Alcoholic beverages (containing up to 70% alcohol by volume, in receptacles not exceeding 5L, with a total net quantity per person of 5L)
Ammunition (cartridges for weapons), securely packaged. Quantities not exceeding 5kg gross weight per person.
Camping / expeditionary equipment and fuel containers with empty fuel tank and/or fuel container.
Dry ice (carbon dioxide, solid) in quantities not exceeding 2,5 kg.
Properly packed knives and cutting instruments
Sporting equipment
Non – flammable, non-toxic aerosols with no subsidiary risk, for sporting or home use.
Thermometer, medical or clinical which contain mercury, when in its protective case.
Allowed in your carry-on:

Matches (one small packet) or a small cigarette lighter
Properly packed liquids up to 100ml and up to 10 pieces
Batteries, spare / loose not exceeding 100wh, including lithium metal or lithium ion cells or batteries for portable electronic devices
E-cigarettes including e-cigars, e-pipes other personal vaporizers but containing batteries must be individually protected to prevent accidental activation
Lamps, energy efficient when in retail packaging intended for personal or home use.
Non-radioactive medicinal or toiletry articles (including aerosols) such as hair sprays, perfumes colognes and medicines containing alcohol up to 100ml
Oxygen on air, gaseous, cylinders required for medical use. The cylinder must not exceed 5kg gross weight.
Portable electronic devices containing non – spillable batteries.
`;

// פונקציה להכנסה לסיכום הטיול עבור הסוכן
export function getBaggageInfo(): string {
  return BAGGAGE_INFO;
}
