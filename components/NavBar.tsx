"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "🏠 בית" },
  { href: "/schedule", label: "📅 לוז" },
  { href: "/tasks", label: "✅ משימות" },
  { href: "/packing", label: "🧳 מה לקחת" },
  { href: "/costs", label: "💰 עלויות" },
  { href: "/passengers", label: "👥 נוסעים" },
  { href: "/restaurants", label: "🍽️ מסעדות" },
  { href: "/attractions", label: "🗺️ אטרקציות" },
  { href: "/chat", label: "💬 סוכן" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // מונע גלילה ברקע כשה-drawer פתוח
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // סוגר ב-Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 order-first"
            aria-label="תפריט"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>

          <Link href="/" className="font-bold text-sm md:text-lg whitespace-nowrap">
            🇬🇷 אתונה 2026 — משפחת חורי/זויגי
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    active ? "bg-white/20 font-bold" : "hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Overlay רקע כהה */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer מצד ימין */}
      <aside
        className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-brand text-white shadow-2xl transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="תפריט ניווט"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
          <span className="font-bold text-sm">אתונה 2026 🇬🇷</span>
          <button
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="סגור תפריט"
            onClick={() => setOpen(false)}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="p-3 flex flex-col gap-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-base transition ${
                  active ? "bg-white/20 font-bold" : "hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
