import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "טיול אתונה — אפריל 2026",
  description: "אתר הטיול הקבוצתי לאתונה — לוז, משימות, עלויות, נוסעים, מסעדות ואטרקציות",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-heebo">
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
          {children}
        </main>
        <footer className="text-center text-xs text-slate-500 py-8">
          נוצר בעזרת סוכן טיולים AI · אתונה אפריל 2026
        </footer>
      </body>
    </html>
  );
}
