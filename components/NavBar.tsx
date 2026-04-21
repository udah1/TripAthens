"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "🏠 בית" },
  { href: "/schedule", label: "📅 לוז" },
  { href: "/tasks", label: "✅ משימות" },
  { href: "/costs", label: "💰 עלויות" },
  { href: "/passengers", label: "👥 נוסעים" },
  { href: "/restaurants", label: "🍽️ מסעדות" },
  { href: "/attractions", label: "🗺️ אטרקציות" },
  { href: "/chat", label: "💬 סוכן" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-brand text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
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

        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10"
          aria-label="תפריט"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-brand border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-2 grid grid-cols-2 gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    active ? "bg-white/20 font-bold" : "hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
