"use client";

import { useEffect, useMemo, useState } from "react";

type Category = {
  id: string;
  title: string;
  emoji: string;
  items: string[];
};

const CATEGORIES: Category[] = [
  {
    id: "money",
    title: "כסף ומסמכים",
    emoji: "💳",
    items: [
      "דרכון",
      "וויזות",
      "חיסונים",
      "ביטוח בריאות",
      "מזומנים במטבע מקומי",
      "כרטיס אשראי",
      "רישיון נהיגה",
      "כרטיסי טיסה",
      "מסלול הנסיעה",
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
      "סוודר",
      "מעיל",
      "נעליים",
      "סנדלים",
      "חגורה",
      "מעיל גשם",
      "מטריה",
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
      "מנקי אוזניים",
      "פינצטה",
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
      "סוכריות / מסטיקים לטיסה"
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

type ItemState = "open" | "checked" | "deleted";
type StateMap = Record<string, ItemState>;

const STORAGE_KEY = "packing-state-v1";

function itemKey(catId: string, item: string) {
  return `${catId}::${item}`;
}

export default function PackingPage() {
  const [state, setState] = useState<StateMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  function getStatus(catId: string, item: string): ItemState {
    return state[itemKey(catId, item)] ?? "open";
  }

  function setStatus(catId: string, item: string, s: ItemState) {
    setState((prev) => ({ ...prev, [itemKey(catId, item)]: s }));
  }

  function toggleCheck(catId: string, item: string) {
    const cur = getStatus(catId, item);
    setStatus(catId, item, cur === "checked" ? "open" : "checked");
  }

  function deleteItem(catId: string, item: string) {
    setStatus(catId, item, "deleted");
  }

  function restoreItem(catId: string, item: string) {
    setStatus(catId, item, "open");
  }

  function setAllInCategory(cat: Category, s: ItemState) {
    setState((prev) => {
      const next = { ...prev };
      for (const item of cat.items) {
        next[itemKey(cat.id, item)] = s;
      }
      return next;
    });
  }

  function resetAll() {
    if (confirm("לאפס את כל הרשימה?")) setState({});
  }

  const totals = useMemo(() => {
    let checked = 0;
    let deleted = 0;
    let total = 0;
    for (const cat of CATEGORIES) {
      for (const item of cat.items) {
        total++;
        const s = state[itemKey(cat.id, item)];
        if (s === "checked") checked++;
        else if (s === "deleted") deleted++;
      }
    }
    return { checked, deleted, total, open: total - checked - deleted };
  }, [state]);

  return (
    <div>
      <section className="card mb-6 bg-gradient-to-bl from-day1 via-white to-day2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-brand mb-2">
          🧳 מה לקחת לחו״ל
        </h1>
        <p className="text-slate-600 text-sm mb-3">
          סמן פריטים כשארזת, או מחק פריטים לא רלוונטיים. הכול נשמר במכשיר שלך
          אוטומטית.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="chip bg-slate-100 text-slate-700">
            סה״כ: {totals.total}
          </span>
          <span className="chip bg-emerald-100 text-emerald-800">
            ✓ ארוז: {totals.checked}
          </span>
          <span className="chip bg-amber-100 text-amber-800">
            נותר: {totals.open}
          </span>
          <span className="chip bg-rose-100 text-rose-800">
            🗑 נמחק: {totals.deleted}
          </span>
          <button
            onClick={resetAll}
            className="chip bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            איפוס
          </button>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            getStatus={getStatus}
            onToggle={toggleCheck}
            onDelete={deleteItem}
            onRestore={restoreItem}
            onSetAll={setAllInCategory}
            loaded={loaded}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({
  cat,
  getStatus,
  onToggle,
  onDelete,
  onRestore,
  onSetAll,
  loaded,
}: {
  cat: Category;
  getStatus: (catId: string, item: string) => ItemState;
  onToggle: (catId: string, item: string) => void;
  onDelete: (catId: string, item: string) => void;
  onRestore: (catId: string, item: string) => void;
  onSetAll: (cat: Category, s: ItemState) => void;
  loaded: boolean;
}) {
  const sorted = useMemo(() => {
    if (!loaded) return cat.items.map((i) => ({ item: i, status: "open" as ItemState }));
    const withStatus = cat.items.map((item) => ({
      item,
      status: getStatus(cat.id, item),
    }));
    const order: Record<ItemState, number> = { open: 0, checked: 1, deleted: 2 };
    return withStatus.sort((a, b) => order[a.status] - order[b.status]);
  }, [cat, getStatus, loaded]);

  const counts = useMemo(() => {
    const c = { open: 0, checked: 0, deleted: 0 };
    for (const r of sorted) c[r.status]++;
    return c;
  }, [sorted]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-brand text-lg">
          {cat.emoji} {cat.title}
        </div>
        <div className="text-xs text-slate-500">
          {counts.checked}/{cat.items.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <button
          onClick={() => onSetAll(cat, "checked")}
          className="chip bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs"
          title="סמן הכל כארוז"
        >
          ✓ סמן הכל
        </button>
        <button
          onClick={() => onSetAll(cat, "open")}
          className="chip bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs"
          title="נקה סימונים"
        >
          ↺ נקה
        </button>
        <button
          onClick={() => onSetAll(cat, "deleted")}
          className="chip bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs"
          title="מחק הכל"
        >
          🗑 מחק הכל
        </button>
      </div>

      <ul className="space-y-1">
        {sorted.map(({ item, status }) => (
          <li
            key={item}
            className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition ${
              status === "checked"
                ? "bg-emerald-50"
                : status === "deleted"
                ? "bg-rose-50 opacity-70"
                : "hover:bg-slate-50"
            }`}
          >
            {status === "deleted" ? (
              <>
                <span className="text-rose-400 shrink-0">🗑</span>
                <span className="flex-1 line-through text-slate-400 text-xs">
                  {item}
                </span>
                <button
                  onClick={() => onRestore(cat.id, item)}
                  className="text-xs text-brand-accent hover:underline shrink-0"
                  title="שחזר"
                >
                  שחזר
                </button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={status === "checked"}
                  onChange={() => onToggle(cat.id, item)}
                  className="w-4 h-4 accent-emerald-600 shrink-0 cursor-pointer"
                  id={`${cat.id}-${item}`}
                />
                <label
                  htmlFor={`${cat.id}-${item}`}
                  className={`flex-1 cursor-pointer ${
                    status === "checked" ? "line-through text-slate-500" : ""
                  }`}
                >
                  {item}
                </label>
                <button
                  onClick={() => onDelete(cat.id, item)}
                  className="text-slate-300 hover:text-rose-500 text-sm shrink-0"
                  title="מחק פריט"
                  aria-label="מחק"
                >
                  ✕
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
