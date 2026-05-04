# 🇬🇷 TripAthens — Trip Planning Website Template

A full-featured group trip website built with Next.js 14 + Tailwind CSS.
Originally built for a family trip to Athens (April 2026), designed to be reused as a template for any group trip.

**Live demo:** [trip-athens.vercel.app](https://trip-athens.vercel.app)

---

## ✨ Features

- 📅 Day-by-day schedule with travel times, Google Maps chips, weather widget
- 🍽️ Restaurants page with filters (meat/dairy/vegan), phone/WhatsApp/website links
- ✈️ Before-flight page: baggage FAQ with images, checklist, insurance link
- 🧳 Packing list (localStorage, categories, add custom items)
- ✅ Shared task manager (real-time, password-protected, Vercel KV)
- 💳 Shared expense tracker (Vercel KV, Excel export, WhatsApp/share button, ILS conversion)
- 💱 Currency converter (live rates via frankfurter.app — no API key needed)
- 🤖 AI chat assistant (Google Gemini, knows all trip data)
- 🔔 Web Push notifications (VAPID, scheduled per activity, per-category settings)
- 📲 PWA — installable, works offline
- 🌤️ Weather widget (Open-Meteo — no API key needed)
- 👥 Passengers page with flight details and cost breakdown
- 🏛️ Attractions page
- 📊 Python scripts for Excel + PDF generation
- 💰 Expense settlement calculator (individual + family-unit modes)

---

## 🗂️ Structure

```
app/                        → Next.js pages (App Router)
  page.tsx                  → Homepage (countdown, weather, quick links)
  schedule/                 → Day-by-day itinerary
  before-flight/            → Baggage rules, checklist, flight info
  restaurants/              → Restaurant list with filters
  api/chat/                 → AI assistant endpoint (Gemini)
  api/expenses/             → Shared expense CRUD (Vercel KV)
  api/push/                 → Web Push subscription management
  api/notifications/cron    → Scheduled notification sender (cron endpoint)

components/                 → Shared UI components
lib/
  trip-content.ts           → ⭐ SINGLE SOURCE OF TRUTH for all trip data
  notifications.ts          → Scheduled push notification logic
  expenses.ts               → Expense types + Redis key
  baggage-info.ts           → Airline baggage rules

public/
  manifest.webmanifest      → PWA manifest
  sw.js                     → Service worker (offline + push)
  icon-192.png / icon-512.png / apple-icon.png

scripts/
  generate_excel.py         → Generates styled Excel file (RTL, colors, freeze panes)
  generate_pdf.py           → Generates PDF itinerary
  settle_expenses.py        → Calculates expense settlement with debt simplification
  data/                     → Source data files (CSV + Markdown)
  README.md                 → Scripts usage instructions
```

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local
# fill in your keys (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

Create `.env.local` with the following variables (see `.env.example` for a template):

| Variable | Required for | How to get |
|----------|-------------|-----------|
| `GEMINI_API_KEY` | AI chat | [aistudio.google.com](https://aistudio.google.com) → Create API key (free) |
| `VAPID_PUBLIC_KEY` | Push notifications | Run: `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | Push notifications | Same command (keep private!) |
| `VAPID_SUBJECT` | Push notifications | `mailto:your@email.com` |
| `NOTIFICATIONS_CRON_SECRET` | Push notifications | Any random string you choose |
| `EXPENSES_PASSWORD` | Expense tracker | Any shared password for the group |
| `KV_REST_API_URL` | Expenses + tasks + push | [upstash.com](https://upstash.com) → Redis → REST URL (free) |
| `KV_REST_API_TOKEN` | Expenses + tasks + push | Same Upstash dashboard |

> **Push notifications setup:** After generating VAPID keys, go to [cron-job.org](https://cron-job.org) and create a cron job pointing to `https://your-site.vercel.app/api/notifications/cron` every 5 minutes, with header `X-Cron-Secret: <your NOTIFICATIONS_CRON_SECRET>`.

> **Upstash Redis:** Create a free database at [upstash.com](https://upstash.com) → Redis → copy the REST URL and token. No credit card needed.

---

## 📦 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Set **Root Directory** to the folder containing this README (e.g. `site/` if nested)
4. Add all environment variables from the table above
5. Click Deploy

---

## 🐍 Python Scripts

Generate the Excel and PDF trip documents:

```bash
pip install openpyxl markdown
py scripts/generate_excel.py   # → scripts/ + public/downloads/
py scripts/generate_pdf.py     # → scripts/ + public/downloads/ (requires Edge/Chrome)
py scripts/settle_expenses.py  # → scripts/data/ (expense settlement report)
```

See [`scripts/README.md`](scripts/README.md) for full details.

---

## 🔄 Using This as a Template for a New Trip

All trip data lives in **`lib/trip-content.ts`** — this is the single source of truth.
Every page pulls data from here. Do NOT hardcode trip data in React components.

Key files to update for a new trip:

| File | What to change |
|------|---------------|
| `lib/trip-content.ts` | All trip data: itinerary, passengers, costs, restaurants, attractions, packing, tasks |
| `lib/notifications.ts` | Timezone offset, trip end date, activity keyword lists, critical reminders |
| `lib/expenses.ts` | Change `EXPENSES_KEY` to a unique value (e.g. `"paris:expenses:v1"`) |
| `lib/baggage-info.ts` | Airline baggage rules |
| `public/manifest.webmanifest` | App name, short name, description, lang, dir |
| `public/icon-*.png` | App icons (192×192, 512×512, apple-icon) |
| `app/api/chat/route.ts` | AI system prompt language/tone |
| `scripts/data/` | Rename `athens_*` files and rewrite with new trip data |
| `scripts/generate_excel.py` | Passenger data, hotel info, cost rows, itinerary |
| `scripts/generate_pdf.py` | Source `.md` filename |
| `scripts/settle_expenses.py` | Participant list, family units, expenses list |

> For a complete step-by-step guide with a copy-paste AI agent prompt, see the section below.

---

## 🤖 AI Agent Prompt — Adapting This Repo for a New Trip

Clone this repo, then paste the following prompt into a **Cursor AI Agent (Agent mode)**:

```
You are a travel planning agent. You have access to a cloned repository with a fully working trip website (Next.js + Tailwind CSS), Python scripts for Excel/PDF, and an expense settlement calculator. Your job is to adapt everything for a brand new trip.

IMPORTANT — what this repo already has (do NOT rebuild, only update data):
- A full Next.js site with pages: schedule, restaurants, before-flight, expenses, tasks, packing, currency, notifications, chat, sim, attractions, passengers
- A shared expense tracker with Vercel KV
- A shared task manager with Vercel KV
- A Web Push notification system with VAPID keys + cron
- An AI chat assistant (Google Gemini)
- A PWA with offline support
- A weather widget (Open-Meteo)
- A currency converter (Frankfurter.app)
- Python scripts for Excel + PDF generation
- An expense settlement calculator (individual + family-unit modes)

Your job is ONLY to replace the data, not to rebuild any features.

The single source of truth for website data is: lib/trip-content.ts
Read it carefully before making any changes — it contains TRIP_META, RAW_ITINERARY, TASKS, COSTS, PASSENGERS, RESTAURANTS, ATTRACTIONS, PACKING_CATEGORIES, EZRAIDER_PAIRS, etc.

---

START by asking the user for trip information in batches. Be conversational and helpful.

=== BATCH 1: BASICS ===
1. Trip name, destination, country, language of website (Hebrew RTL / English LTR)
2. Departure date + time (local), return date + time (local), departure airport, destination airport
3. Airline name, outbound flight number, return flight number
4. Number of participants — for each person ask:
   - Full name in local language + transliteration in English
   - Age
   - Role: adult / teen / child (price discount?) / elderly (accessibility needed?)
   - Which family unit they belong to (if any) — for expense settlement grouping
   - Flight booking reference
   - Ticket type + add-ons (extra baggage kg, seat upgrade, etc.)

=== BATCH 2: ACCOMMODATION ===
5. Hotel name, address, phone number, website
6. Booking reference(s) — there may be multiple bookings split among organizers
7. Room allocation — who sleeps in which room, how many rooms per booking
8. Check-in time, check-out time
9. Any fees payable at hotel (city tax / climate tax / resort fee) — amount per room/night, who pays
10. Is breakfast included?

=== BATCH 3: ITINERARY ===
11. Day-by-day plan. For each activity ask:
    - Day number + date
    - Start time (and end time if known)
    - Activity name (short, for display)
    - Location name + address (for Google Maps chip)
    - Short description (1-2 sentences)
    - Estimated cost per person (adult / child if different)
    - Accessible for elderly/disabled? (yes / partial / no)
    - Estimated travel/walking time FROM the previous activity (e.g. "🚶 10 min" or "🚕 15 min")
    - Any notes (book in advance? tip? dietary?)
    - Is this an evening activity? (will be styled differently)
12. Any pre-booked tours — provider, meeting point, time, adult price, child price, group size, discounts, pairing (e.g. Ezraider: who rides together)
13. Special constraints — kosher food, limited mobility, budget limits, religious observance

=== BATCH 4: COSTS & SETTLEMENT ===
14. All shared expenses paid so far — for each: description, amount, currency, who paid, which participants share it (everyone / specific people / specific family)
15. Are there any participants who pay on behalf of their whole family? If yes, who and for whom?
16. Exchange rate to home currency (fixed rate or use live rates?)
17. Currency used on the trip (EUR / USD / other)

=== BATCH 5: FOOD & KOSHER ===
18. Are kosher dietary laws required? If yes:
    - Any local Chabad house / kosher authority with approved product list?
    - Any kosher grocery stores at the destination?
    - Recommended kosher apps for the destination
    - Recommended supermarket chains for finding kosher products
19. Recommended restaurants — for each: name, type (meat/dairy/vegan/fish), address, phone, WhatsApp, website, kosher certification, price range, opening hours, notes

=== BATCH 6: PRACTICAL INFO ===
20. Local SIM / eSIM recommendations — provider name, price, data limit, link, how to activate
21. Travel insurance — is there a free card-benefit insurance? Link to activate it
22. Airline baggage rules — ticket types and their allowances (personal item dimensions, carry-on kg + dimensions, checked baggage kg + dimensions), liquids rules, power bank rules
23. Any VAT/tax refund opportunities at the destination?
24. Useful apps for the destination (maps, transport, art, etc.)
25. Recommended attractions not in the itinerary (for the attractions page)
26. What is the destination's timezone? (e.g. UTC+2 / UTC+3 / UTC+1) — CRITICAL for push notification timing

=== BATCH 7: WEBSITE & FEATURES ===
27. Do you want the AI chat assistant? (needs Google Gemini API key from aistudio.google.com — free)
28. Do you want push notifications for trip reminders? (needs cron-job.org account — free)
29. Do you want the shared expense tracker + settlement calculator? (needs Upstash Redis — free)
30. Do you want the shared task manager?
31. What domain/URL will the site be on? (needed for PWA manifest and push notifications)

---

Once you have all the information, follow these steps IN ORDER:

STEP 1 — Update lib/trip-content.ts (MOST IMPORTANT — do this first)
  - TRIP_META: title, groupSize, hotel, hotelAddress, hotelPhone, airlineFlight, outbound, inbound, exchangeRate
  - RAW_ITINERARY: full day-by-day array. Each item must have: day, date, time, activity, location, description, notes, accessible, price. Optionally: travelTo (e.g. "🚶 ~10 min from hotel"), mapQuery (custom Google Maps search), isEvening (auto-detected)
  - TASKS: pre-trip checklist items with task, done (false), contact (URL or phone), notes
  - COSTS: cost breakdown per person (flights, hotel, tours, etc.) with section, item, adultEur, childEur, adultIls, childIls, adults, children, totalEur, notes
  - PASSENGERS: array with name, booking, ticket, baggage, baseEur, extraEur, flightTotalEur, hotelEur, grandTotalEur
  - RESTAURANTS: array with name, type, address, phone, whatsapp, website, kosher, price, hours, notes, color
  - ATTRACTIONS: array with name, description, location, price, accessible, tip, link, emoji
  - PACKING_CATEGORIES: array with category name and items array (each item: id, label, defaultChecked)
  - PAYER_ORDER: ordered list of participant names for expense dropdown
  - If there are paired activities (like Ezraider): EZRAIDER_PAIRS and EZRAIDER_SOLO arrays

STEP 2 — Update lib/notifications.ts (CRITICAL — easy to forget)
  - This is a SEPARATE file from trip-content.ts. It controls all scheduled push notifications.
  - Update IDT_OFFSET_MIN to match the destination timezone (e.g. UTC+2 → 2 * 60, not always 3 * 60)
  - Update TRIP_END_MS to the new trip's return date/time
  - Update the keyword lists in leadMinutesFor() and emojiFor() — they contain activity names specific to the old trip (e.g. "ezraider", "נפפליאו", "Callimachos")
  - Update the shouldSkipActivity() list with the new trip's activity names that have their own critical reminders
  - Update all hardcoded critical reminders (flight times, check-out time, shuttle time) in the buildCriticalNotifs() section
  - Update special reminders in buildSpecialNotifs() — they reference old trip-specific activities
  - If push notifications are not needed, you can skip this step but remove the cron setup too

STEP 3 — Update public/manifest.webmanifest
  - Update "name", "short_name", and "description" to match the new trip name
  - Update "lang" and "dir" if the site language changes (e.g. "en" + "ltr" for English)
  - Update "theme_color" and "background_color" if desired
  - Replace icon files (public/icon-192.png, public/icon-512.png, public/apple-icon.png) with new trip icons

STEP 4 — Update lib/expenses.ts
  - Change EXPENSES_KEY from "athens:expenses:v1" to something unique for this trip (e.g. "paris:expenses:v1")
  - This prevents expense data from different trips mixing in the same Redis database

STEP 5 — Update lib/baggage-info.ts
  - Replace with the airline's actual baggage rules for this trip

STEP 6 — Update app/api/chat/route.ts
  - Update the system prompt nationality/language/tone to match the group
  - The trip data is injected automatically from trip-content.ts — no need to copy it manually

STEP 7 — Update scripts/data/ source files
  - Rename all files from athens_*.md / athens_*.csv to match the new trip (e.g. paris_*.md)
  - Rewrite the main .md itinerary file for the trip
  - Rewrite CSV files: itinerary, tasks, costs, restaurants

STEP 8 — Update scripts/generate_excel.py
  - Replace passenger data, hotel info, cost rows, itinerary rows
  - Keep RTL formatting, color-coded days, freeze panes

STEP 9 — Update scripts/generate_pdf.py
  - Update the source .md filename to match the renamed file from STEP 7

STEP 10 — Update scripts/settle_expenses.py
  - Replace PEOPLE, HURI_FAMILY (or equivalent family unit), INDIVIDUALS, and expenses list

STEP 11 — Generate documents
  py scripts/generate_excel.py
  py scripts/generate_pdf.py

STEP 12 — Deploy to Vercel
  a. git add . && git commit -m "new trip: [destination]" && git push
  b. vercel.com → New Project → Import from GitHub
  c. Set these environment variables:

  | Variable | Required for | How to get |
  |----------|-------------|-----------|
  | GEMINI_API_KEY | AI chat | aistudio.google.com → Create API key (free) |
  | VAPID_PUBLIC_KEY | Push notifications | Run: npx web-push generate-vapid-keys |
  | VAPID_PRIVATE_KEY | Push notifications | Same command (keep private!) |
  | VAPID_SUBJECT | Push notifications | mailto:your@email.com |
  | NOTIFICATIONS_CRON_SECRET | Push notifications | Any random string you choose |
  | EXPENSES_PASSWORD | Expense tracker | Any shared password for the group |
  | KV_REST_API_URL | Expenses + tasks + push | upstash.com → Redis → REST API URL (free) |
  | KV_REST_API_TOKEN | Expenses + tasks + push | Same Upstash dashboard |

  d. After deploying: go to cron-job.org → create a cron job pointing to
     https://your-site.vercel.app/api/notifications/cron every 5 minutes
     with header X-Cron-Secret: [your NOTIFICATIONS_CRON_SECRET]
  e. Click Deploy

---

GOLDEN RULES:
- NEVER rebuild features that already exist — only update data
- NEVER hardcode trip data in React components — always use lib/trip-content.ts
- NEVER use NEXT_PUBLIC_VAPID_PUBLIC_KEY — the code uses VAPID_PUBLIC_KEY (server-side only, served via /api/push/vapid)
- NEVER commit generated .xlsx or .pdf files (they are gitignored)
- NEVER skip lib/notifications.ts — if push notifications are enabled, failing to update it will send old-trip reminders with wrong dates
- NEVER forget to update EXPENSES_KEY in lib/expenses.ts — two trips sharing the same Redis will mix their expense data
- Always keep dir="rtl" and lang="he" if the trip language is Hebrew
- Always update the timezone offset (IDT_OFFSET_MIN) in notifications.ts to match the destination
- The settle_expenses.py supports family-unit mode — ask who pays on behalf of whom
- After every significant change, run: npm run build to check for TypeScript errors
```
