"use client";

import { useEffect, useMemo, useState } from "react";
import { PACKING_CATEGORIES as CATEGORIES, type PackingCategory as Category } from "@/lib/data";

type ItemState = "open" | "checked" | "deleted";
type StateMap = Record<string, ItemState>;
type CustomMap = Record<string, string[]>;

const STORAGE_KEY = "packing-state-v1";
const CUSTOM_KEY = "packing-custom-v1";

function itemKey(catId: string, item: string) {
  return `${catId}::${item}`;
}

export default function PackingPage() {
  const [state, setState] = useState<StateMap>({});
  const [custom, setCustom] = useState<CustomMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
      const rawCustom = localStorage.getItem(CUSTOM_KEY);
      if (rawCustom) setCustom(JSON.parse(rawCustom));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
    } catch {}
  }, [state, custom, loaded]);

  function getAllItems(cat: Category): string[] {
    return [...cat.items, ...(custom[cat.id] ?? [])];
  }

  function addCustomItem(catId: string, item: string) {
    const trimmed = item.trim();
    if (!trimmed) return;
    setCustom((prev) => {
      const existing = prev[catId] ?? [];
      const cat = CATEGORIES.find((c) => c.id === catId);
      const allExisting = [...(cat?.items ?? []), ...existing];
      if (allExisting.includes(trimmed)) return prev;
      return { ...prev, [catId]: [...existing, trimmed] };
    });
  }

  function removeCustomItem(catId: string, item: string) {
    setCustom((prev) => ({
      ...prev,
      [catId]: (prev[catId] ?? []).filter((i) => i !== item),
    }));
    setState((prev) => {
      const next = { ...prev };
      delete next[itemKey(catId, item)];
      return next;
    });
  }

  function isCustom(catId: string, item: string): boolean {
    return (custom[catId] ?? []).includes(item);
  }

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
      for (const item of getAllItems(cat)) {
        next[itemKey(cat.id, item)] = s;
      }
      return next;
    });
  }

  function resetAll() {
    if (confirm("לאפס את כל הרשימה?")) {
      setState({});
      setCustom({});
    }
  }

  const totals = useMemo(() => {
    let checked = 0;
    let deleted = 0;
    let total = 0;
    for (const cat of CATEGORIES) {
      const all = [...cat.items, ...(custom[cat.id] ?? [])];
      for (const item of all) {
        total++;
        const s = state[itemKey(cat.id, item)];
        if (s === "checked") checked++;
        else if (s === "deleted") deleted++;
      }
    }
    return { checked, deleted, total, open: total - checked - deleted };
  }, [state, custom]);

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
            customItems={custom[cat.id] ?? []}
            getStatus={getStatus}
            onToggle={toggleCheck}
            onDelete={deleteItem}
            onRestore={restoreItem}
            onSetAll={setAllInCategory}
            onAddCustom={addCustomItem}
            onRemoveCustom={removeCustomItem}
            isCustom={isCustom}
            loaded={loaded}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({
  cat,
  customItems,
  getStatus,
  onToggle,
  onDelete,
  onRestore,
  onSetAll,
  onAddCustom,
  onRemoveCustom,
  isCustom,
  loaded,
}: {
  cat: Category;
  customItems: string[];
  getStatus: (catId: string, item: string) => ItemState;
  onToggle: (catId: string, item: string) => void;
  onDelete: (catId: string, item: string) => void;
  onRestore: (catId: string, item: string) => void;
  onSetAll: (cat: Category, s: ItemState) => void;
  onAddCustom: (catId: string, item: string) => void;
  onRemoveCustom: (catId: string, item: string) => void;
  isCustom: (catId: string, item: string) => boolean;
  loaded: boolean;
}) {
  const [newItem, setNewItem] = useState("");
  const allItems = useMemo(() => [...cat.items, ...customItems], [cat.items, customItems]);

  const sorted = useMemo(() => {
    if (!loaded) return allItems.map((i) => ({ item: i, status: "open" as ItemState }));
    const withStatus = allItems.map((item) => ({
      item,
      status: getStatus(cat.id, item),
    }));
    const order: Record<ItemState, number> = { open: 0, checked: 1, deleted: 2 };
    return withStatus.sort((a, b) => order[a.status] - order[b.status]);
  }, [cat.id, allItems, getStatus, loaded]);

  const counts = useMemo(() => {
    const c = { open: 0, checked: 0, deleted: 0 };
    for (const r of sorted) c[r.status]++;
    return c;
  }, [sorted]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    onAddCustom(cat.id, newItem);
    setNewItem("");
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-brand text-lg">
          {cat.emoji} {cat.title}
        </div>
        <div className="text-xs text-slate-500">
          {counts.checked}/{allItems.length}
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
                {isCustom(cat.id, item) && (
                  <button
                    onClick={() => onRemoveCustom(cat.id, item)}
                    className="text-rose-300 hover:text-rose-600 shrink-0"
                    title="הסר לצמיתות"
                    aria-label="הסר"
                  >
                    <TrashIcon />
                  </button>
                )}
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
                  {isCustom(cat.id, item) && (
                    <span className="mr-1 text-[10px] text-brand-accent">✦</span>
                  )}
                </label>
                <button
                  onClick={() =>
                    isCustom(cat.id, item)
                      ? onRemoveCustom(cat.id, item)
                      : onDelete(cat.id, item)
                  }
                  className="text-rose-300 hover:text-rose-600 shrink-0"
                  title={isCustom(cat.id, item) ? "הסר פריט" : "מחק פריט"}
                  aria-label="מחק"
                >
                  <TrashIcon />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="הוסף פריט..."
          className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-brand-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newItem.trim()}
          className="chip bg-brand text-white hover:bg-brand-accent disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          + הוסף
        </button>
      </form>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
