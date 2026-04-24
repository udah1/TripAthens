"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TASKS, type Task } from "@/lib/data";
import { PAYER_ORDER } from "@/lib/trip-content";

const PWD_KEY = "athens:expenses:password";
const ME_KEY = "athens:me";

interface TaskState {
  id: string;
  done: boolean;
  doneBy?: string;
  doneAt?: number;
}

function taskIdFromText(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return `t_${(hash >>> 0).toString(36)}`;
}

function renderContact(contact: string) {
  if (!contact) return null;
  const parts = contact.split(/\s*\|\s*/);
  return (
    <span className="space-y-1 block">
      {parts.map((p, i) => {
        const urlMatch = p.match(/https?:\/\/\S+/);
        if (urlMatch) {
          const url = urlMatch[0];
          const before = p.slice(0, p.indexOf(url));
          return (
            <span key={i} className="block text-sm">
              {before}
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-brand-accent underline break-all"
              >
                {url}
              </a>
            </span>
          );
        }
        return (
          <span key={i} className="block text-sm">
            {p}
          </span>
        );
      })}
    </span>
  );
}

function formatTimeAgo(ms?: number): string {
  if (!ms) return "";
  try {
    const d = new Date(ms);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export default function TasksApp() {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [me, setMe] = useState<string>("");
  const [state, setState] = useState<Record<string, TaskState>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const pwd = window.localStorage.getItem(PWD_KEY);
      if (pwd) setPassword(pwd);
      const m = window.localStorage.getItem(ME_KEY);
      if (m) setMe(m);
    } catch {
      // ignore
    }
    setAuthChecking(false);
  }, []);

  const loadState = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setState(data.state || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינה");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadState();
    const id = setInterval(loadState, 20_000);
    return () => clearInterval(id);
  }, [loadState]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const pwd = passwordInput.trim();
    if (!pwd) return;
    try {
      const res = await fetch("/api/expenses/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (!res.ok) {
        setAuthError("סיסמה שגויה");
        return;
      }
      try {
        window.localStorage.setItem(PWD_KEY, pwd);
      } catch {
        // ignore
      }
      setPassword(pwd);
      setPasswordInput("");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "שגיאה");
    }
  };

  const handleMeChange = (value: string) => {
    setMe(value);
    try {
      window.localStorage.setItem(ME_KEY, value);
    } catch {
      // ignore
    }
  };

  const toggleTask = async (t: Task) => {
    if (!password) return;
    const id = taskIdFromText(t.task);
    const current = state[id]?.done ?? false;
    const nextDone = !current;
    setPending((p) => ({ ...p, [id]: true }));

    // optimistic
    setState((prev) => {
      const copy = { ...prev };
      if (nextDone) {
        copy[id] = {
          id,
          done: true,
          doneBy: me || "",
          doneAt: Date.now(),
        };
      } else {
        delete copy[id];
      }
      return copy;
    });

    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-expenses-password": password,
        },
        body: JSON.stringify({ id, done: nextDone, doneBy: me || "" }),
      });
      if (res.status === 401) {
        try {
          window.localStorage.removeItem(PWD_KEY);
        } catch {
          // ignore
        }
        setPassword(null);
        setError("הסיסמה שגויה — התחבר מחדש");
        await loadState();
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setState(data.state || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בעדכון");
      await loadState();
    } finally {
      setPending((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
    }
  };

  const doneCount = TASKS.filter(
    (t) => state[taskIdFromText(t.task)]?.done,
  ).length;

  // מיון: פתוחות קודם (לפי הסדר המקורי), מסומנות בסוף (לפי זמן הסימון)
  const sortedTasks = useMemo(() => {
    return TASKS.map((t, idx) => ({ t, idx }))
      .sort((a, b) => {
        const aDone = state[taskIdFromText(a.t.task)]?.done ?? false;
        const bDone = state[taskIdFromText(b.t.task)]?.done ?? false;
        if (aDone !== bDone) return aDone ? 1 : -1;
        if (aDone && bDone) {
          const at = state[taskIdFromText(a.t.task)]?.doneAt ?? 0;
          const bt = state[taskIdFromText(b.t.task)]?.doneAt ?? 0;
          return at - bt;
        }
        return a.idx - b.idx;
      })
      .map((e) => e.t);
  }, [state]);

  if (authChecking) {
    return <div className="card text-center text-slate-500">טוען…</div>;
  }

  if (!password) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <h2 className="text-xl font-extrabold text-brand mb-2">
            🔒 כניסה למשימות
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            הקלידו את הסיסמה המשותפת של הקבוצה (אותה סיסמה של מעקב תשלומים).
            היא תישמר במכשיר שלכם.
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="סיסמה"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {authError && (
              <div className="text-sm text-red-600">{authError}</div>
            )}
            <button
              type="submit"
              className="px-4 py-3 rounded-xl bg-brand text-white font-bold hover:opacity-90 transition"
            >
              כניסה
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* פרטים: מי אני? */}
      <div className="card mb-4 flex flex-wrap items-center gap-3">
        <div className="text-sm">
          <span className="font-bold text-brand">מי אני?</span>{" "}
          <span className="text-slate-500 text-xs">
            (ישמש לסימון מי ביצע משימה)
          </span>
        </div>
        <select
          value={me}
          onChange={(e) => handleMeChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="">— בחר —</option>
          {PAYER_ORDER.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className="ml-auto text-xs text-slate-500">
          {doneCount} / {TASKS.length} הושלמו
          {loading && " · מרענן…"}
        </div>
      </div>

      {error && (
        <div className="card mb-4 bg-red-50 border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {sortedTasks.map((t) => {
          const id = taskIdFromText(t.task);
          const s = state[id];
          const done = s?.done ?? false;
          const isPending = pending[id];
          return (
            <div
              key={id}
              className={`card ${done ? "bg-emerald-50 border-emerald-300" : "bg-orange-50 border-orange-300"}`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleTask(t)}
                  disabled={isPending}
                  aria-label={done ? "בטל סימון" : "סמן כהושלם"}
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold shrink-0 mt-0.5 transition ${
                    done
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-white border-2 border-slate-300 hover:border-brand"
                  } ${isPending ? "opacity-50" : ""}`}
                >
                  {done ? "✓" : ""}
                </button>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-bold ${done ? "text-emerald-800 line-through decoration-emerald-400" : "text-brand"}`}
                  >
                    {t.task}
                  </div>
                  {done && (s?.doneBy || s?.doneAt) && (
                    <div className="text-xs text-emerald-700 mt-1">
                      ✓ סומן
                      {s?.doneBy && (
                        <>
                          {" על ידי "}
                          <b>{s.doneBy}</b>
                        </>
                      )}
                      {s?.doneAt && (
                        <span className="text-emerald-600">
                          {" · "}
                          {formatTimeAgo(s.doneAt)}
                        </span>
                      )}
                    </div>
                  )}
                  {t.contact && <div className="mt-2">{renderContact(t.contact)}</div>}
                  {t.notes && (
                    <div className="text-xs text-slate-600 mt-2">
                      📝 {t.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
