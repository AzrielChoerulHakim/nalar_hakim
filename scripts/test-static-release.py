#!/usr/bin/env python3
"""Exercise domain exports and filesystem-only activation, without services."""
from hashlib import sha256
from html.parser import HTMLParser
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

from site_config import DEFAULT_SITE, normalize_site_url

ROOT = Path(__file__).resolve().parents[1]


class Metadata(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.canonical = []
        self.og_urls = []
        self.share_urls = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs['href'])
        if tag == 'meta' and attrs.get('property') == 'og:url':
            self.og_urls.append(attrs['content'])
        if 'data-copy-url' in attrs:
            self.share_urls.append(attrs['data-copy-url'])


def checksums(bundle):
    value = ''.join(f'{sha256(p.read_bytes()).hexdigest()}  {p.relative_to(bundle).as_posix()}\n'
                    for p in sorted((bundle / 'public').rglob('*')) if p.is_file())
    (bundle / 'SHA256SUMS').write_text(value)


class StaticReleaseTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.can_drop_uid = False
        if os.getuid() == 0:
            probe = subprocess.run([sys.executable, '-c', 'import os; os.setgroups([]); os.setgid(65534); os.setuid(65534)'], capture_output=True)
            cls.can_drop_uid = probe.returncode == 0
            if not cls.can_drop_uid:
                print('UID switching unavailable here; release harness is confined to a temporary directory.', flush=True)
        cls.temp = tempfile.TemporaryDirectory(prefix='nalar-deploy-test-')
        cls.base = Path(cls.temp.name)
        cls.base.chmod(0o755)
        cls.source = cls.base / 'source'
        cls.source.mkdir()
        for folder in ('scripts', 'content', 'preview', 'theme', 'deploy', 'docs'):
            shutil.copytree(ROOT / folder, cls.source / folder)
        spec = importlib.util.spec_from_file_location('static_release', cls.source / 'scripts/build-static-release.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        cls.before = {str(p.relative_to(cls.source)): sha256(p.read_bytes()).hexdigest()
                      for p in cls.source.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
        cls.bundle = module.build_release(cls.base / 'first', 'https://nalarhakim.com/')
        cls.bundle_again = module.build_release(cls.base / 'second', 'https://nalarhakim.com/')

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def setUp(self):
        self.case_dir = Path(tempfile.mkdtemp(dir=self.base))
        self.case_dir.chmod(0o777)
        self.destination = self.case_dir / 'nalarhakim'

    def activate(self, bundle=None, success=True):
        def unprivileged():
            if self.can_drop_uid:
                os.setgroups([])
                os.setgid(65534)
                os.setuid(65534)
        result = subprocess.run(['bash', str((bundle or self.bundle) / 'deploy/release.sh'), str(self.destination)],
                                text=True, capture_output=True, preexec_fn=unprivileged)
        self.assertEqual(result.returncode == 0, success, result.stdout + result.stderr)
        return result

    def copy_bundle(self):
        destination = self.case_dir / 'package'
        shutil.copytree(self.bundle, destination)
        return destination

    def test_url_validation(self):
        self.assertEqual(normalize_site_url(DEFAULT_SITE), DEFAULT_SITE)
        self.assertEqual(normalize_site_url('https://nalarhakim.com'), 'https://nalarhakim.com/')
        for value in ('http://example.com', 'https://a.test/../x', 'https://a.test/%2e%2e/',
                      'https://a.test?x=1', 'https://u:p@a.test', 'https://a.test/#x',
                      'https://a.test:443/', 'https://a.test:0/', 'https://a.test:/',
                      'https://a.test/"', 'https://a.test\\x'):
            with self.subTest(value=value), self.assertRaises(ValueError):
                normalize_site_url(value)

    def test_domain_metadata_and_404(self):
        public = self.bundle / 'public'
        for page in public.rglob('*.html'):
            metadata = Metadata(page)
            self.assertEqual(len(metadata.canonical), 1, page)
            for url in metadata.canonical + metadata.og_urls + metadata.share_urls:
                self.assertTrue(url.startswith('https://nalarhakim.com/'), (page, url))
            self.assertNotIn('https://azrielchoerulhakim.github.io/nalar_hakim/', page.read_text())
        self.assertIn('<base href="/">', (public / '404.html').read_text())
        self.assertIn('href="/beranda.html"', (public / '404.html').read_text())
        self.assertIn('Sitemap: https://nalarhakim.com/sitemap.xml', (public / 'robots.txt').read_text())
        self.assertNotIn('github.io', (public / 'sitemap.xml').read_text())
        for page in (public / 'artikel').glob('*/index.html'):
            for block in __import__('re').findall(r'<script type="application/ld\+json">(.*?)</script>', page.read_text()):
                self.assertTrue(json.loads(block)['mainEntityOfPage'].startswith('https://nalarhakim.com/'))

    def test_export_contains_only_public_files(self):
        public = self.bundle / 'public'
        forbidden = {'.py', '.php', '.json', '.sqlite3', '.db', '.sh', '.env'}
        for path in public.rglob('*'):
            self.assertFalse(path.is_symlink(), path)
            self.assertNotIn(path.suffix, forbidden, path)
            self.assertNotIn('donation-qr', path.name)
            self.assertFalse(any(part.startswith('.') for part in path.relative_to(public).parts))
        self.assertTrue((public / 'preview/justitia-engraving-v2.webp').is_file())

    def test_deterministic_and_source_unchanged(self):
        self.assertEqual((self.bundle / 'SHA256SUMS').read_bytes(), (self.bundle_again / 'SHA256SUMS').read_bytes())
        after = {str(p.relative_to(self.source)): sha256(p.read_bytes()).hexdigest()
                 for p in self.source.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
        self.assertEqual(self.before, after)

    def test_default_pages_build_retains_project_path(self):
        work = self.case_dir / 'pages'
        shutil.copytree(self.source, work)
        env = dict(os.environ, PYTHONDONTWRITEBYTECODE='1')
        env.pop('NH_SITE_URL', None)
        for script in ('build-preview.py', 'check-preview.py'):
            subprocess.run([sys.executable, str(work / 'scripts' / script)], env=env, check=True, capture_output=True)
        self.assertEqual(Metadata(work / 'index.html').canonical, [DEFAULT_SITE])
        self.assertIn('<base href="/nalar_hakim/">', (work / '404.html').read_text())
        self.assertIn(DEFAULT_SITE + 'sitemap.xml', (work / 'robots.txt').read_text())

    def test_filesystem_first_install_and_repeat(self):
        self.activate()
        target = os.readlink(self.destination / 'current')
        self.activate()
        self.assertEqual(target, os.readlink(self.destination / 'current'))
        self.assertEqual((self.destination / 'current/index.html').read_bytes(), (self.bundle / 'public/index.html').read_bytes())
        self.assertEqual(list((self.destination / 'releases').glob('.staging.*')), [])
        self.assertFalse((self.destination / 'current/deploy').exists())

    def test_update_and_previous_release_reactivation(self):
        self.activate()
        old_target = os.readlink(self.destination / 'current')
        bundle = self.copy_bundle()
        index = bundle / 'public/index.html'
        index.write_text(index.read_text() + '\n<!-- release two -->\n')
        checksums(bundle)
        self.activate(bundle)
        self.assertNotEqual(old_target, os.readlink(self.destination / 'current'))
        self.assertTrue((self.destination / old_target / 'index.html').is_file())
        self.activate()
        self.assertEqual(old_target, os.readlink(self.destination / 'current'))

    def test_bad_checksum_does_not_replace_current(self):
        self.activate()
        old_target = os.readlink(self.destination / 'current')
        bundle = self.copy_bundle()
        (bundle / 'public/index.html').write_text('broken')
        self.activate(bundle, success=False)
        self.assertEqual(old_target, os.readlink(self.destination / 'current'))

    def test_extra_file_and_symlink_are_rejected(self):
        bundle = self.copy_bundle()
        extra = bundle / 'public/private.json'
        extra.write_text('{}')
        self.activate(bundle, success=False)
        extra.unlink()
        (bundle / 'public/leak').symlink_to('/etc/passwd')
        self.activate(bundle, success=False)
        self.assertFalse(self.destination.exists())

    def test_unowned_destination_is_preserved(self):
        self.destination.mkdir(mode=0o777)
        original = self.destination / 'other-site.txt'
        original.write_text('unchanged')
        self.activate(success=False)
        self.assertEqual(original.read_text(), 'unchanged')
        self.assertFalse((self.destination / 'current').exists())

    def test_existing_release_extra_file_is_rejected(self):
        self.activate()
        unexpected = self.destination / 'current/private.json'
        unexpected.write_text('{}')
        self.activate(success=False)

    def test_traversal_manifest_is_rejected(self):
        bundle = self.copy_bundle()
        with (bundle / 'SHA256SUMS').open('a') as manifest:
            manifest.write('0' * 64 + '  public/../private.html\n')
        self.activate(bundle, success=False)
        self.assertFalse(self.destination.exists())

    def test_shell_syntax(self):
        for path in (self.bundle / 'deploy').glob('*.sh'):
            subprocess.run(['bash', '-n', str(path)], check=True)


if __name__ == '__main__':
    unittest.main(verbosity=2)
