"""Editorial UI cleanup shared by the static preview and VPS exporter build.
Keep published manuscripts, real covers, article codes, links and accessible controls.
"""
import json
import re
from pathlib import Path

RULES = json.loads(Path(__file__).with_name("reading-cleanup.json").read_text(encoding="utf-8"))
PROGRESS = Path(__file__).with_name("reading-progress.js").read_text(encoding="utf-8")
BALANCE = Path(__file__).with_name("mobile-balance.js").read_text(encoding="utf-8")
CASUAL_PAGES = ["index.html","tentang.html","kirim-naskah.html","kebijakan-redaksi.html"]

def clean_reading_ui(html, path):
    for pattern, replacement in RULES:
        replacement = re.sub(r'\$(\d+)', lambda m: r'\g<' + m.group(1) + '>', replacement)
        html = re.sub(pattern, replacement, html)
    if path in CASUAL_PAGES:
        chunks = re.split(r'(<blockquote\b[\s\S]*?</blockquote>)', html)
        html = ''.join(part if i % 2 else re.sub(r'\bAnda\b', 'kamu', part) for i, part in enumerate(chunks))
    motion = '<script>\n' + PROGRESS + '</script>' if path.startswith('artikel/') else ''
    if path in ('index.html', 'beranda.html'):
        motion = '<script>\n' + BALANCE + '</script>'
    if path == 'beranda.html':
        html = html.replace('</div></aside></div><section class="latest-section">', '</div><aside class="nh-mobile-quote"><blockquote cite="artikel/harta-bersama-bukan-seluruhnya-warisan/">Jika hanya penghasilan yang dihitung, pekerjaan merawat keluarga yang memungkinkan seseorang bekerja mudah terabaikan.</blockquote><a href="artikel/harta-bersama-bukan-seluruhnya-warisan/">Kerja yang tidak masuk rekening: menguji pembagian harta bersama</a></aside></aside></div><section class="latest-section">', 1)
    def compact_nav(match):
        nav = match.group(0)
        for full, short in (('Telaah Fenomena', 'Telaah'), ('Bedah Putusan atau Norma', 'Bedah')):
            nav = nav.replace('>' + full + '</a>', ' aria-label="' + full + '"><span class="nh-nav-full">' + full + '</span><span class="nh-nav-short" aria-hidden="true">' + short + '</span></a>')
        return nav
    html = re.sub(r'<nav class="publication-nav"[\s\S]*?</nav>', compact_nav, html)
    return html.replace('</head>', motion + '</head>', 1)
