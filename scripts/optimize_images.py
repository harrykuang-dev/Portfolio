"""Generate responsive previews; originals remain untouched. Requires Pillow."""
from pathlib import Path
import re
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / p for p in ('index.html', 'zh-hant/index.html', 'zh-hans/index.html')]
OUT = ROOT / 'assets/previews'
OUT.mkdir(exist_ok=True)
sources = sorted({p for page in PAGES for p in re.findall(r'href="(?:\.\./)?(assets/[^" ]+\.(?:png|jpg))"', page.read_text(encoding='utf-8'))})
variants = {}
for source in sources:
    with Image.open(ROOT / source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        widths = sorted({min(w, image.width) for w in (480, 960, 1440)})
        variants[Path(source).stem] = widths
        for width in widths:
            preview = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            preview.save(OUT / f'{Path(source).stem}-{width}.webp', quality=78, method=6)

for page in PAGES:
    prefix = '../' if page.parent != ROOT else ''
    def replace(match):
        tag = match.group()
        src = re.search(r'src="([^"]+)"', tag).group(1)
        stem = re.sub(r'-\d+$', '', Path(src).stem) if '/previews/' in src else Path(src).stem
        widths = variants[stem]
        base = f'{prefix}assets/previews/{stem}'
        tag = re.sub(r'\s(?:srcset|sizes)="[^"]*"', '', tag)
        tag = re.sub(r'src="[^"]+"', f'src="{base}-{widths[min(1, len(widths)-1)]}.webp"', tag)
        srcset = ', '.join(f'{base}-{w}.webp {w}w' for w in widths)
        # Auto sizes uses the actual laid-out width for lazy images. Fallback
        # remains conservative on browsers without auto-size support.
        return tag.replace('<img ', f'<img srcset="{srcset}" sizes="auto, (max-width: 700px) 88vw, (max-width: 1320px) 90vw, 1188px" ')
    page.write_text(re.sub(r'<img\b[^>]*>', replace, page.read_text(encoding='utf-8')), encoding='utf-8')

original_bytes = sum((ROOT / s).stat().st_size for s in sources)
largest_bytes = sum((OUT / f'{stem}-{widths[-1]}.webp').stat().st_size for stem, widths in variants.items())
print(f'{len(sources)} images: originals {original_bytes:,} bytes; largest previews {largest_bytes:,} bytes; saved {1-largest_bytes/original_bytes:.1%}')
