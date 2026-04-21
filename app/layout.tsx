import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import FloatingAgentButton from "@/components/FloatingAgentButton";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "טיול אתונה — אפריל 2026 · משפחת חורי/זויגי",
  description: "אתר הטיול הקבוצתי לאתונה — לוז, משימות, עלויות, נוסעים, מסעדות ואטרקציות",
  manifest: "/manifest.webmanifest",
  applicationName: "אתונה 2026",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "אתונה 2026",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1A252F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
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
        <FloatingAgentButton />
        <PWARegister />
      </body>
    </html>
  );
}
