#!/usr/bin/env python3
"""Build a public-only VPS bundle without changing the Pages working tree."""
import argparse
from hashlib import sha256
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

from site_config import normalize_site_url

ROOT = Path(__file__).resolve().parents[1]
ASSET_TYPES = {'.css', '.js', '.svg', '.webp', '.png', '.jpg', '.jpeg', '.avif', '.woff', '.woff2'}
THEME_FILES = ('theme/nalar-hakim/style.css', 'theme/nalar-hakim/assets/site.js')


def copy_file(source, destination):
    if source.is_symlink():
        raise ValueError(f'Symlinks are not allowed in a release: {source}')
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)
    destination.chmod(0o644)


def asset_files(root):
    return [p for p in (root / 'preview').rglob('*') if p.is_file() and p.suffix in ASSET_TYPES]


def build_release(output, site_url):
    site_url = normalize_site_url(site_url)
    # The included nginx/HTTPS scripts are deliberately scoped to this domain.
    if site_url != 'https://nalarhakim.com/':
        raise ValueError('The VPS bundle targets https://nalarhakim.com/; use NH_SITE_URL for other preview builds')
    output = Path(output).absolute()
    if output.exists() or output.is_symlink():
        raise ValueError(f'Output already exists; choose a new empty path: {output}')
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='nalar-build-') as work_dir:
        work = Path(work_dir)
        sources = list((ROOT / 'scripts').glob('*.py')) + list((ROOT / 'content').glob('*.json'))
        sources += asset_files(ROOT) + [ROOT / name for name in THEME_FILES]
        for source in sources:
            copy_file(source, work / source.relative_to(ROOT))
        env = dict(os.environ, NH_SITE_URL=site_url, PYTHONDONTWRITEBYTECODE='1')
        for script in ('build-preview.py', 'check-preview.py'):
            subprocess.run([sys.executable, str(work / 'scripts' / script)], env=env, check=True)
        with tempfile.TemporaryDirectory(prefix='.nalar-release-', dir=output.parent) as stage_dir:
            stage = Path(stage_dir) / 'bundle'
            public = stage / 'public'
            public.mkdir(parents=True)
            files = list(work.glob('*.html'))
            for folder in ('artikel', 'bentuk'):
                files += list((work / folder).rglob('*.html'))
            files += asset_files(work) + [work / name for name in THEME_FILES]
            files += [work / 'robots.txt', work / 'sitemap.xml']
            for source in sorted(files):
                copy_file(source, public / source.relative_to(work))
            for source in sorted((ROOT / 'deploy').iterdir()):
                if source.is_file():
                    target = stage / 'deploy' / source.name
                    copy_file(source, target)
                    if target.suffix == '.sh':
                        target.chmod(0o755)
            copy_file(ROOT / 'docs' / 'VPS_NALARHAKIM.md', stage / 'PANDUAN_VPS.md')
            hashes = ''.join(f'{sha256(p.read_bytes()).hexdigest()}  {p.relative_to(stage).as_posix()}\n'
                             for p in sorted(public.rglob('*')) if p.is_file())
            (stage / 'SHA256SUMS').write_text(hashes, encoding='ascii')
            release_id = sha256(hashes.encode('ascii')).hexdigest()[:20]
            (stage / 'release.json').write_text(json.dumps({
                'site_url': site_url, 'release_id': release_id,
                'public_files': len(files), 'html_pages': len(list(public.rglob('*.html'))),
            }, indent=2) + '\n', encoding='utf-8')
            stage.rename(output)
    print(f'Release {release_id}: {output} ({len(files)} public files)')
    return output


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / 'dist' / 'nalarhakim-vps')
    parser.add_argument('--site-url', default='https://nalarhakim.com/')
    args = parser.parse_args()
    try:
        build_release(args.output, args.site_url)
    except (ValueError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error)) from error
