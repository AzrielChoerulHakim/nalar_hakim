#!/usr/bin/env python3
"""Validate generated Pages routes, assets and in-page reading links."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://preview.invalid/nalar_hakim/'


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = set()
        self.links = []
        self.base = ORIGIN + path.relative_to(ROOT).as_posix()
        self.errors = []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        ident = attrs.get('id')
        if ident:
            if ident in self.ids:
                self.errors.append(f'duplicate id: {ident}')
            self.ids.add(ident)
        if tag == 'base' and attrs.get('href'):
            self.base = urljoin(self.base, attrs['href'])
            return
        for attr in ('href', 'src', 'action'):
            if attrs.get(attr):
                self.links.append(attrs[attr])


paths = sorted(ROOT.glob('*.html'))
for folder in ('artikel', 'kanal', 'bentuk'):
    paths.extend(sorted((ROOT / folder).rglob('*.html')))
pages = {p.resolve(): Page(p) for p in paths}
errors = []
checked = 0
for path, page in pages.items():
    label = path.relative_to(ROOT)
    errors.extend(f'{label}: {error}' for error in page.errors)
    for link in page.links:
        target = urlsplit(urljoin(page.base, link))
        if target.scheme in ('javascript', 'data'):
            errors.append(f'{label}: unexpected URL: {link}')
            continue
        if target.netloc != 'preview.invalid':
            continue
        if not target.path.startswith('/nalar_hakim/'):
            errors.append(f'{label}: escapes project path: {link}')
            continue
        dest = ROOT / unquote(target.path[len('/nalar_hakim/'):])
        if dest.is_dir():
            dest /= 'index.html'
        dest = dest.resolve()
        checked += 1
        if not dest.is_file():
            errors.append(f'{label}: missing target: {link}')
        elif target.fragment and dest in pages:
            if unquote(target.fragment) not in pages[dest].ids:
                errors.append(f'{label}: missing anchor: {link}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} pages, {checked} local routes/assets/anchors')
