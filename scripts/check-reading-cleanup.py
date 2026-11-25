"""Check public reading pages after intentional retirement of ornamental motion."""
from pathlib import Path
from html.parser import HTMLParser
import re
ROOT=Path(__file__).resolve().parents[1]
pages=list(ROOT.glob('*.html'))+list((ROOT/'artikel').glob('*/index.html'))+list((ROOT/'bentuk').glob('*/index.html'))
count=0
for p in pages:
    html=p.read_text()
    if 'http-equiv="refresh"' in html: continue
    count+=1
    assert not re.search(r'<script src="[^"]*preview/(motion|editorial-motion|article-transitions|nature-scene|desktop-nature)\.js',html),p
    assert '<svg class="nh-icon' not in html,p
    assert 'data-scale-replay' not in html,p
    assert 'id="gagasan"' not in html,p
    assert '<h1' in html and '<main' in html,p
    if p.parent.parent.name=='artikel':
        assert 'id="sumber-rujukan"' in html,p
print(f'PASS: {count} public pages, ornamental motion not active; core reading landmarks remain')
