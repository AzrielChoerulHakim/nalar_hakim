"""Render decorative navigation arrows without changing editorial text.

Only text-node slices are replaced. Attributes, JSON, source formatting and
article prose remain byte-for-byte intact; the result also works without JS.
"""
from html.parser import HTMLParser
import re


ARROWS = {
    '→': ('right', 'M5 12h14M12 5l7 7-7 7'),
    '←': ('left', 'M19 12H5M12 5l-7 7 7 7'),
    '↑': ('up', 'M12 19V5M5 12l7-7 7 7'),
    '↓': ('down', 'M12 5v14M5 12l7 7 7-7'),
    '↗': ('up-right', 'M6 18 18 6M6 6h12v12'),
    '↘': ('down-right', 'M6 6l12 12M6 18h12V6'),
    '↙': ('down-left', 'M18 6 6 18M18 18H6V6'),
    '↖': ('up-left', 'M18 18 6 6M18 6H6v12'),
}
PATTERN = re.compile('[' + ''.join(ARROWS) + ']')
VOID_TAGS = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
             'link', 'meta', 'param', 'source', 'track', 'wbr'}
UNTOUCHED_TAGS = {'script', 'style', 'svg', 'math', 'pre', 'code', 'textarea',
                  'title', 'noscript', 'template'}


def arrow_icon(character):
    """A decorative icon; surrounding link text supplies the accessible name."""
    direction, path = ARROWS[character]
    return (f'<svg class="nh-icon nh-icon-{direction}" xmlns="http://www.w3.org/2000/svg" '
            'viewBox="0 0 24 24" width="20" height="20" fill="none" '
            'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="{path}"/></svg>')


class _NavigationIcons(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.stack = []
        self.replacements = []
        self.lines = [0]
        self.lines.extend(match.end() for match in re.finditer('\n', source))

    def handle_starttag(self, tag, attributes):
        if tag not in VOID_TAGS:
            self.stack.append((tag, dict(attributes)))

    def handle_startendtag(self, tag, attributes):
        pass

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def is_navigation(self):
        if any(tag in UNTOUCHED_TAGS for tag, _ in self.stack):
            return False
        classes = {name for _, attrs in self.stack for name in attrs.get('class', '').split()}
        decorative = any(attrs.get('aria-hidden') == 'true' for _, attrs in self.stack)
        if {'article-content', 'admin-prose'} & classes:
            # References have intentionally decorative source/return arrows.
            # Do not reinterpret arrows in quotations, analysis or citations.
            return 'article-references' in classes and (decorative or 'reference-return' in classes)
        if any(tag in {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'} for tag, _ in self.stack):
            return decorative
        return (decorative or 'eyebrow' in classes or
                any(tag in {'a', 'button', 'summary'} for tag, _ in self.stack))

    def handle_data(self, data):
        if not PATTERN.search(data) or not self.is_navigation():
            return
        line, column = self.getpos()
        start = self.lines[line - 1] + column
        self.replacements.append((start, start + len(data), PATTERN.sub(
            lambda match: arrow_icon(match.group()), data)))


def render_navigation_icons(source):
    parser = _NavigationIcons(source)
    parser.feed(source)
    parser.close()
    for start, end, replacement in reversed(parser.replacements):
        source = source[:start] + replacement + source[end:]
    return source
