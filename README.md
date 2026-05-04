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

> For a complete step-by-step guide with a copy-paste AI agent prompt, see the [root README](../../README.md).
