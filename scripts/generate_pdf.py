# -*- coding: utf-8 -*-
"""
המרת athens_trip_april_2026.md ל-PDF בעברית עם RTL מלא.
פלט: תוכנית מלאה.pdf

משתמש ב-Microsoft Edge (או Chrome) ב-headless mode — רינדור מושלם של עברית,
RTL ואימוג'ים, ללא תלות ב-xhtml2pdf/WeasyPrint שלא מתמודדים טוב עם עברית.

דרישות:
    pip install markdown
    (Edge או Chrome חייבים להיות מותקנים — ברירת מחדל בכל Windows 10/11)
"""

import sys
import os
import subprocess
import tempfile
import shutil

sys.stdout.reconfigure(encoding="utf-8")

import markdown

MD_FILE  = os.path.join(os.path.dirname(__file__), "data", "athens_trip_april_2026.md")
PDF_FILE = os.path.join(os.path.dirname(__file__), "תוכנית מלאה.pdf")

CSS_STYLE = """
@page { size: A4; margin: 18mm 15mm; }

* { box-sizing: border-box; }

html, body {
    font-family: "Segoe UI", "Arial Hebrew", Arial, "Noto Sans Hebrew", sans-serif;
    font-size: 11pt;
    line-height: 1.65;
    color: #2c3e50;
    direction: rtl;
    text-align: right;
    background: white;
    margin: 0;
    padding: 0;
}

h1 {
    font-size: 22pt;
    font-weight: 700;
    color: #1a252f;
    border-bottom: 3px solid #3498db;
    padding-bottom: 8px;
    margin: 0 0 18px 0;
}

h2 {
    font-size: 15pt;
    font-weight: 700;
    color: #2471a3;
    border-bottom: 1px solid #aed6f1;
    padding-bottom: 5px;
    margin: 26px 0 12px 0;
    page-break-after: avoid;
}

h3 {
    font-size: 12.5pt;
    font-weight: 700;
    color: #1a5276;
    margin: 18px 0 8px 0;
    background: #eaf4fb;
    padding: 6px 12px;
    border-radius: 4px;
    page-break-after: avoid;
}

h4 {
    font-size: 11pt;
    font-weight: 700;
    color: #2c3e50;
    margin: 10px 0 4px 0;
    page-break-after: avoid;
}

p { margin: 6px 0 9px 0; }

ul, ol {
    padding-right: 24px;
    padding-left: 0;
    margin: 6px 0;
}

li { margin-bottom: 4px; }

a { color: #2980b9; text-decoration: none; word-break: break-word; }

code {
    background: #f0f3f4;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 9.5pt;
    font-family: "Consolas", "Courier New", monospace;
    direction: ltr;
    display: inline-block;
    unicode-bidi: embed;
}

blockquote {
    border-right: 4px solid #f39c12;
    border-left: none;
    margin: 10px 0;
    padding: 8px 14px;
    background: #fef9e7;
    color: #7d6608;
    border-radius: 0 4px 4px 0;
    font-size: 10pt;
}

blockquote p { margin: 3px 0; }

table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 10pt;
    direction: rtl;
    page-break-inside: avoid;
}

thead tr {
    background-color: #2c3e50;
    color: white;
}

thead tr th {
    padding: 8px 10px;
    text-align: right;
    font-weight: 600;
    border: 1px solid #566573;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

td {
    padding: 7px 10px;
    border: 1px solid #d5d8dc;
    text-align: right;
    vertical-align: top;
}

tbody tr:nth-child(even) td {
    background-color: #f8f9fa;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

hr {
    border: none;
    border-top: 1.5px solid #d5d8dc;
    margin: 18px 0;
}

strong { font-weight: 700; color: #1a252f; }

img { max-width: 100px; max-height: 100px; vertical-align: middle; }

div[dir="rtl"] { direction: rtl; text-align: right; }
"""


def build_html(md_path: str) -> str:
    with open(md_path, encoding="utf-8") as f:
        md_text = f.read()

    # הסרת wrapper של <div dir="rtl"> — ה-RTL מוגדר ברמת body, והעטיפה
    # הזו מונעת מ-markdown להמיר את התוכן (בלוקי HTML = raw).
    md_text = md_text.replace('<div dir="rtl">', "").replace("</div>", "")

    # חשוב: לא להשתמש ב-nl2br — הוא שובר תאי טבלה ארוכים עם **bold** בתוכם
    html_body = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "sane_lists", "attr_list"],
    )

    return f"""<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>תוכנית טיול אתונה 2026</title>
  <style>{CSS_STYLE}</style>
</head>
<body>
{html_body}
</body>
</html>"""


def find_browser() -> str:
    """מוצא את הנתיב ל-Edge או Chrome."""
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path

    for name in ("msedge", "chrome"):
        found = shutil.which(name)
        if found:
            return found

    raise RuntimeError("לא נמצא Edge או Chrome במערכת.")


def html_to_pdf(html: str, pdf_path: str) -> None:
    browser = find_browser()

    tmp_dir = tempfile.mkdtemp(prefix="athens_pdf_")
    html_path = os.path.join(tmp_dir, "doc.html")
    tmp_pdf = os.path.join(tmp_dir, "out.pdf")

    try:
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)

        file_url = "file:///" + html_path.replace("\\", "/")

        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=10000",
            f"--print-to-pdf={tmp_pdf}",
            file_url,
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

        if not os.path.isfile(tmp_pdf):
            print("STDOUT:", result.stdout)
            print("STDERR:", result.stderr)
            raise RuntimeError("יצירת PDF נכשלה.")

        # העתקה ליעד הסופי (כדי לעקוף קובץ נעול)
        shutil.move(tmp_pdf, pdf_path)
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


def main() -> None:
    html = build_html(MD_FILE)
    html_to_pdf(html, PDF_FILE)
    print(f"OK - PDF created: {PDF_FILE}")

    # העתק לתיקיית downloads של האתר (site/scripts/ → site/public/downloads/)
    downloads_dir = os.path.join(os.path.dirname(__file__), "..", "public", "downloads")
    os.makedirs(downloads_dir, exist_ok=True)
    import shutil
    dest = os.path.join(downloads_dir, "athens_full_plan.pdf")
    shutil.copy2(PDF_FILE, dest)
    print(f"OK - Copied to: {dest}")


if __name__ == "__main__":
    main()
