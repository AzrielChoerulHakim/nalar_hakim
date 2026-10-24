"""Load the five hand-edited editorial publications and validate their structure."""
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from math import ceil
import json
import re
from datetime import date


class Prose(HTMLParser):
    def __init__(self):
        super().__init__()
        self.words = []
        self.ids = set()
        self.references = set()
        self.headings = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {'script', 'style', 'iframe', 'object', 'embed', 'form', 'input'}:
            raise ValueError(f'Unsupported article element: {tag}')
        if any(k.lower().startswith('on') for k in attrs):
            raise ValueError('Event handlers do not belong in article prose')
        if tag == 'h2':
            self.headings += 1
        if attrs.get('id'):
            if attrs['id'] in self.ids:
                raise ValueError(f'Duplicate article id: {attrs["id"]}')
            self.ids.add(attrs['id'])
        href = attrs.get('href', '')
        if href.startswith('#rujukan-'):
            self.references.add(href.removeprefix('#rujukan-'))
        elif href and not (href.startswith('#') or href.startswith('https://')):
            raise ValueError(f'Unexpected article URL: {href}')

    def handle_data(self, data):
        self.words.append(data)


def load_articles(root, channels):
    posts = []
    slugs = set()
    for index, channel in enumerate(channels, 1):
        path = Path(root) / 'content' / f'{channel}.json'
        post = json.loads(path.read_text(encoding='utf-8'))
        for key in ('slug', 'channel', 'type', 'title', 'excerpt', 'summary', 'published', 'updated', 'body', 'sources'):
            if not post.get(key):
                raise ValueError(f'{path.name}: missing {key}')
        if post['channel'] != channel or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', post['slug']):
            raise ValueError(f'{path.name}: invalid channel or slug')
        if post['slug'] in slugs:
            raise ValueError('Duplicate article slug')
        slugs.add(post['slug'])
        if len(post['summary']) != 3:
            raise ValueError(f'{path.name}: expected three key points')
        if date.fromisoformat(post['updated']) < date.fromisoformat(post['published']):
            raise ValueError(f'{path.name}: invalid publication dates')
        parsed = Prose()
        parsed.feed(post['body'])
        post['text'] = ' '.join(' '.join(parsed.words).split())
        post['word_count'] = len(re.findall(r'\b[\w-]+\b', post['text']))
        if post['word_count'] < 800 or parsed.headings < 4:
            raise ValueError(f'{path.name}: article is incomplete')
        source_ids = [str(source['id']) for source in post['sources']]
        if len(set(source_ids)) != len(source_ids) or len(source_ids) < 2:
            raise ValueError(f'{path.name}: invalid sources')
        if set(source_ids) != parsed.references:
            raise ValueError(f'{path.name}: sources and inline citations do not match')
        for source in post['sources']:
            if not source['url'].startswith('https://') or not re.fullmatch(r'\d+', str(source['id'])):
                raise ValueError(f'{path.name}: invalid source link or id')
            if f'penanda-{source["id"]}' not in parsed.ids:
                raise ValueError(f'{path.name}: missing reference return target')
        post['minutes'] = max(1, ceil(post['word_count'] / 200))
        post['symbol'] = f'{index:02}'
        posts.append(post)
    return posts
