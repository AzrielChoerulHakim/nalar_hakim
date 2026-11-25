"""Editorial UI cleanup shared by the static preview and VPS exporter build.
Keep published manuscripts, real covers, article codes, links and accessible controls.
"""
import json
import re
from pathlib import Path

RULES = json.loads(Path(__file__).with_name("reading-cleanup.json").read_text(encoding="utf-8"))
STYLE = Path(__file__).with_name("reading-cleanup.css").read_text(encoding="utf-8")
CASUAL_PAGES = ["index.html","tentang.html","kirim-naskah.html","kebijakan-redaksi.html"]

def clean_reading_ui(html, path):
    for pattern, replacement in RULES:
        replacement = re.sub(r'\$(\d+)', lambda m: r'\g<' + m.group(1) + '>', replacement)
        html = re.sub(pattern, replacement, html)
    if path in CASUAL_PAGES:
        chunks = re.split(r'(<blockquote\b[\s\S]*?</blockquote>)', html)
        html = ''.join(part if i % 2 else re.sub(r'\bAnda\b', 'kamu', part) for i, part in enumerate(chunks))
    return html.replace('</head>', '<style>\n' + STYLE + '</style></head>', 1)
