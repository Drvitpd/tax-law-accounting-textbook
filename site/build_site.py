#!/usr/bin/env python3
"""สร้างเว็บใน docs/ จากแอปรายบทใน site/src/ และค่าแบรนด์ใน site/brand.json
ใช้: python3 site/build_site.py
"""
import html, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE, DOCS = ROOT / "site", ROOT / "docs"
B = json.loads((SITE / "brand.json").read_text(encoding="utf-8"))
LOGO_RE = re.compile(r'<svg class="logo".*?</svg><span class="tax">TAX</span>', re.S)
CSS = ("<style>header img.logo{height:52px;width:auto;max-width:100%}"
       "@media (max-width:480px){header img.logo{height:40px}}"
       ".atx-nav{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.9rem;margin:0 0 6px}"
       ".atx-nav a{color:var(--accent,#F26B21);font-weight:700;text-decoration:none}"
       ".atx-nav a:hover{text-decoration:underline}</style>")


def title_of(s):
    m = re.search(r"<h1>([^<]+)", s)
    t = html.unescape(m.group(1)).strip() if m else ""
    return re.sub(r"^แอปประจำบทที่\s*\d+\s*·?\s*", "", t)


def build():
    pages = sorted((SITE / "src").glob("ch*.html"))
    nums = [int(p.stem[2:]) for p in pages]
    chapters, errors = [], []
    for i, p in enumerate(pages):
        n, s = nums[i], p.read_text(encoding="utf-8")
        s, k = LOGO_RE.subn(f'<img class="logo" src="{B["logo"]}" alt="{B["logo_alt"]}">', s)
        for name, cnt in (("โลโก้หัวแอป", k), ("</head>", s.count("</head>")), ("<main>", s.count("<main>"))):
            if cnt != 1:
                errors.append(f"{p.name}: {name} พบ {cnt} ครั้ง")
        s = s.replace("</head>", f'{CSS}\n<script src="gate.js"></script>\n</head>', 1)
        links = ['<a href="./">สารบัญแอปประจำเล่ม</a>']
        if i > 0:
            links.append(f'<a href="ch{nums[i-1]:02d}.html">บทที่ {nums[i-1]}</a>')
        if i < len(pages) - 1:
            links.append(f'<a href="ch{nums[i+1]:02d}.html">บทที่ {nums[i+1]}</a>')
        s = s.replace("<main>", '<main>\n<div class="atx-nav" role="navigation" aria-label="นำทาง">' + " · ".join(links) + "</div>", 1)
        (DOCS / f"ch{n:02d}.html").write_text(s, encoding="utf-8")
        chapters.append((n, title_of(s)))
    if errors:
        print("\n".join(errors)); sys.exit(1)
    gate = (SITE / "gate.template.js").read_text(encoding="utf-8")
    gate = (gate.replace("__GATE_HASH__", B["gate_hash"]).replace("__BOOK__", B["book"])
            .replace("__GATE_LOGO__", B["logo_stacked"]).replace("__ALT__", B["logo_alt"]))
    (DOCS / "gate.js").write_text(gate, encoding="utf-8")
    rows = "\n".join(f'<li><a href="ch{n:02d}.html"><span class="no">บทที่ {n}</span><span class="t">{html.escape(t)}</span></a></li>'
                     for n, t in chapters)
    idx = (SITE / "index.template.html").read_text(encoding="utf-8")
    for k, v in {"__ROWS__": rows, "__LOGO__": B["logo"], "__ALT__": B["logo_alt"], "__SERIES__": B["series"],
                 "__BOOK__": B["book"], "__AUTHOR__": B["author"]}.items():
        idx = idx.replace(k, v)
    (DOCS / "index.html").write_text(idx, encoding="utf-8")
    (DOCS / ".nojekyll").write_text("", encoding="utf-8")
    import qrcode
    (DOCS / "qr").mkdir(exist_ok=True)
    for n, _ in chapters:
        qrcode.make(f'{B["site_url"]}ch{n:02d}.html', border=1).save(DOCS / "qr" / f"ch{n:02d}.png")
    qrcode.make(B["site_url"], border=1).save(DOCS / "qr" / "index.png")
    print("สร้างแล้ว", len(chapters), "บท:", ", ".join(str(n) for n, _ in chapters))


if __name__ == "__main__":
    build()
