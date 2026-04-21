"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "מה עושים ביום הראשון?",
  "איפה אוכלים בשרי ליד המלון?",
  "כמה עולה הטיול למבוגר?",
  "מה הפעילויות הנגישות לסבתא?",
  "איך מגיעים מהשדה למלון?",
  "מה צריך להזמין לפני הטיסה?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "שלום! אני הסוכן של הטיול לאתונה 🇬🇷. אני מכיר את כל הפרטים — לוז, מסעדות, עלויות, נוסעים ומשימות. שאל אותי מה שבא לך!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: userText }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setError(e.message || "שגיאה בתקשורת עם הסוכן");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">💬 סוכן הטיול</h1>
      
      <div className="card p-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-[60vh] overflow-y-auto p-4 md:p-6 space-y-3 bg-gradient-to-b from-sky-50/50 to-white"
        >
          {messages.map((m, idx) => (
            <MessageBubble key={idx} msg={m} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <Dot /> <Dot delay={0.2} /> <Dot delay={0.4} />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}
        </div>

        {messages.length <= 2 && (
          <div className="px-4 md:px-6 pb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={loading}
                className="chip bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          className="border-t border-slate-200 p-3 md:p-4 flex gap-2 bg-white"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="שאל את הסוכן..."
            disabled={loading}
            className="flex-1 bg-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-brand-accent text-right"
            dir="rtl"
          />
          <button type="submit" className="btn btn-primary disabled:opacity-50" disabled={loading || !input.trim()}>
            שלח
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-brand text-white rounded-br-sm"
            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
        }`}
      >
        {!isUser && <div className="text-xs font-bold text-brand-accent mb-1">🤖 סוכן הטיול</div>}
        {msg.content}
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="w-2 h-2 bg-slate-400 rounded-full inline-block animate-bounce"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}
