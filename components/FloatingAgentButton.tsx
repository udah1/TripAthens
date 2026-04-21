"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function FloatingAgentButton() {
  const pathname = usePathname();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("agentPulseShown") === "1") return;
    sessionStorage.setItem("agentPulseShown", "1");
    setPulse(true);
    // שני פעימות × ~1s לפעימה = ~2s
    const timeout = setTimeout(() => setPulse(false), 2100);
    return () => clearTimeout(timeout);
  }, []);

  if (pathname === "/chat") return null;

  return (
    <Link
      href="/chat"
      aria-label="שאל את סוכן הטיול"
      className="fixed bottom-5 left-5 z-50"
    >
      <div className="relative">
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-brand-accent opacity-60 pulse-twice pointer-events-none" />
        )}
        <div className="relative flex items-center gap-2 bg-brand text-white rounded-full shadow-2xl pl-5 pr-4 py-3 hover:bg-black transition-all hover:scale-105 border-2 border-white">
          <span className="text-2xl">💬</span>
          <span className="hidden sm:inline font-bold whitespace-nowrap">שאל את הסוכן</span>
        </div>
      </div>
    </Link>
  );
}
