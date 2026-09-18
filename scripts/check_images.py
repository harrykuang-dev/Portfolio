"""Check responsive preview paths and preservation of original-image links."""
from pathlib import Path
from html.parser import HTMLParser
import subprocess

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.images, self.links = [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'img':
            self.images.append(attrs)
        if tag == 'a':
            self.links.append(attrs.get('href'))

for name in ('index.html', 'zh-hant/index.html', 'zh-hans/index.html'):
    path = ROOT / name
    page = Page(path.read_text(encoding='utf-8'))
    original = Page(subprocess.check_output(['git', 'show', f'origin/main:{name}'], cwd=ROOT).decode())
    assert page.links == original.links, f'Links changed in {name}'
    assert len(page.images) == len(original.images) == 28
    for image in page.images:
        assert image['loading'] == 'lazy' and image['decoding'] == 'async'
        assert image['width'] and image['height']
        for src in [image['src']] + [item.strip().split()[0] for item in image['srcset'].split(',')]:
            assert src.endswith('.webp') and (path.parent / src).is_file(), src
    print(f'{name}: 28 responsive previews verified; all original links preserved')
