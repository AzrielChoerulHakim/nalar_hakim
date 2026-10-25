"""Load editor-approved public manuscripts and validate their structure."""
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
    for path in sorted((Path(root) / 'content').glob('*.json')):
        post = json.loads(path.read_text(encoding='utf-8'))
        channel = post.get('channel')
        for key in ('slug', 'channel', 'type', 'title', 'excerpt', 'summary', 'published', 'updated', 'body', 'sources', 'author', 'format', 'thesis', 'lens', 'object', 'editorial_revision'):
            if not post.get(key):
                raise ValueError(f'{path.name}: missing {key}')
        if channel not in channels or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', post['slug']):
            raise ValueError(f'{path.name}: invalid channel or slug')
        if post['format'] not in {'telaah', 'bedah', 'esai', 'perdebatan'}:
            raise ValueError(f'{path.name}: invalid publication format')
        if not isinstance(post['author'], str) or len(post['author']) > 80:
            raise ValueError(f'{path.name}: invalid public author alias')
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
        if not post['text'].strip():
            raise ValueError(f'{path.name}: article body is empty')
        source_ids = [str(source['id']) for source in post['sources']]
        if len(set(source_ids)) != len(source_ids) or not source_ids:
            raise ValueError(f'{path.name}: invalid sources')
        if set(source_ids) != parsed.references:
            raise ValueError(f'{path.name}: sources and inline citations do not match')
        for source in post['sources']:
            if not source['url'].startswith('https://') or not re.fullmatch(r'\d+', str(source['id'])):
                raise ValueError(f'{path.name}: invalid source link or id')
            if f'penanda-{source["id"]}' not in parsed.ids:
                raise ValueError(f'{path.name}: missing reference return target')
        post['minutes'] = max(1, ceil(post['word_count'] / 200))
        posts.append(post)
    order = {channel: index for index, channel in enumerate(channels)}
    posts.sort(key=lambda post: (-date.fromisoformat(post['published']).toordinal(), order[post['channel']], post['slug']))
    for index, post in enumerate(posts, 1):
        post['symbol'] = f'{index:02}'
    return posts
