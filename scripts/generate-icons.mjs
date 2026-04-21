// מייצר אייקונים ל-PWA (PNG + SVG) מתוך תבנית SVG עם טקסט כ-paths.
// משתמש ב-opentype.js כדי להמיר עברית ל-paths (librsvg לא יודע עברית).
// הרצה: npm run icons
import sharp from "sharp";
import opentype from "opentype.js";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const CACHE = join(ROOT, ".icons-cache");
if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true });

const FONT_URL =
  "https://github.com/google/fonts/raw/main/ofl/heebo/Heebo%5Bwght%5D.ttf";
const FONT_PATH = join(CACHE, "Heebo.ttf");

async function downloadFont() {
  if (existsSync(FONT_PATH)) return;
  console.log("⬇ מוריד פונט Heebo...");
  const res = await fetch(FONT_URL);
  if (!res.ok) throw new Error(`Font download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(FONT_PATH, buf);
}

function textToPath(font, text, x, y, size, color) {
  // opentype.js ב-RTL: הטקסט ירוץ שמאל-לימין פיזית, אבל לעברית צריך להפוך.
  // פשוט: נפוך את המחרוזת — כי SVG מצייר תו-אחר-תו משמאל לימין.
  const reversed = [...text].reverse().join("");
  const path = font.getPath(reversed, x, y, size);
  path.fill = color;
  return path.toSVG(2);
}

function centeredPath(font, reversedText, cx, y, size, color) {
  const measure = font.getPath(reversedText, 0, 0, size);
  const bb = measure.getBoundingBox();
  const w = bb.x2 - bb.x1;
  const x = cx - w / 2 - bb.x1;
  const p = font.getPath(reversedText, x, y, size);
  p.fill = color;
  return p;
}

function buildSvg(font) {
  // שורה עליונה: חורי/זויגי (קטן)
  const pTop = centeredPath(font, "יגיוז/ירוח", 256, 165, 52, "#94DCF8");
  // אתונה (מעט קטן יותר מקודם)
  const pAthens = centeredPath(font, "הנותא", 256, 250, 95, "#94DCF8");
  // 2026
  const p2026 = centeredPath(font, "2026", 256, 340, 85, "#FFFFFF");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A252F"/>
      <stop offset="100%" stop-color="#0b1218"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <circle cx="256" cy="240" r="170" fill="#94DCF8" opacity="0.12"/>
  ${pTop.toSVG(2)}
  ${pAthens.toSVG(2)}
  ${p2026.toSVG(2)}

  <!-- דגל יוון: 9 פסים + קנטון עם צלב -->
  <g transform="translate(166 400)">
    <rect x="0" y="0"  width="180" height="9" fill="#0D5EAF"/>
    <rect x="0" y="9"  width="180" height="9" fill="#FFFFFF"/>
    <rect x="0" y="18" width="180" height="9" fill="#0D5EAF"/>
    <rect x="0" y="27" width="180" height="9" fill="#FFFFFF"/>
    <rect x="0" y="36" width="180" height="9" fill="#0D5EAF"/>
    <rect x="0" y="45" width="180" height="9" fill="#FFFFFF"/>
    <rect x="0" y="54" width="180" height="9" fill="#0D5EAF"/>
    <rect x="0" y="63" width="180" height="9" fill="#FFFFFF"/>
    <rect x="0" y="72" width="180" height="9" fill="#0D5EAF"/>
    <rect x="0" y="0" width="81" height="45" fill="#0D5EAF"/>
    <rect x="33" y="4.5"  width="15" height="36" fill="#FFFFFF"/>
    <rect x="12" y="15" width="57" height="15" fill="#FFFFFF"/>
  </g>
</svg>`;
}

async function main() {
  await downloadFont();
  const font = opentype.loadSync(FONT_PATH);
  const svg = buildSvg(font);
  writeFileSync(join(PUBLIC, "icon.svg"), svg);
  console.log("✓ icon.svg (vectorized text)");

  const sizes = [
    { size: 192, name: "icon-192.png" },
    { size: 512, name: "icon-512.png" },
    { size: 180, name: "apple-icon.png" },
  ];

  for (const { size, name } of sizes) {
    await sharp(Buffer.from(svg), { density: 384 })
      .resize(size, size)
      .png()
      .toFile(join(PUBLIC, name));
    console.log(`✓ ${name} (${size}x${size})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
