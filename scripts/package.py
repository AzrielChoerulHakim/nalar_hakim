#!/usr/bin/env python3
"""Package only the theme; never include WordPress data or secrets."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
theme = root / 'theme' / 'nalar-hakim'
required = ['style.css', 'functions.php', 'index.php', 'assets/site.js', 'assets/donation-qr.png']
for filename in required:
    if not (theme / filename).is_file():
        raise SystemExit(f'Missing required theme file: {filename}')
output = root / 'dist' / 'nalar-hakim.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for path in sorted(theme.rglob('*')):
        if path.is_file() and not path.is_symlink() and path.suffix in {'.php', '.css', '.js', '.png', '.svg', '.json', '.txt'}:
            archive.write(path, Path('nalar-hakim') / path.relative_to(theme))
print(output)
