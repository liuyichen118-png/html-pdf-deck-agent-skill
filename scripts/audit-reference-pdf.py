import json
import math
import sys
from pathlib import Path

import fitz
from PIL import Image, ImageDraw, ImageFont


def render_pdf(pdf_path: Path, out_dir: Path, scale: float = 1.35):
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    pages = []
    stats = []
    for index, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
        image_path = out_dir / f"page-{index:02d}.png"
        pix.save(image_path)
        pages.append(image_path)

        text = page.get_text("text").strip()
        blocks = page.get_text("blocks")
        stats.append(
            {
                "page": index,
                "width": page.rect.width,
                "height": page.rect.height,
                "text_chars": len(text),
                "text_blocks": len(blocks),
            }
        )
    return pages, stats


def make_montage(image_paths, out_path: Path, columns: int = 4, thumb_width: int = 360):
    thumbs = []
    for image_path in image_paths:
        img = Image.open(image_path).convert("RGB")
        ratio = thumb_width / img.width
        thumb_height = int(img.height * ratio)
        img = img.resize((thumb_width, thumb_height), Image.LANCZOS)
        thumbs.append((image_path, img))

    label_height = 24
    gap = 22
    rows = math.ceil(len(thumbs) / columns)
    thumb_height = max(img.height for _, img in thumbs)
    canvas = Image.new(
        "RGB",
        (
            columns * thumb_width + (columns + 1) * gap,
            rows * (thumb_height + label_height) + (rows + 1) * gap,
        ),
        "white",
    )
    draw = ImageDraw.Draw(canvas)
    for i, (image_path, img) in enumerate(thumbs):
        col = i % columns
        row = i // columns
        x = gap + col * (thumb_width + gap)
        y = gap + row * (thumb_height + label_height + gap)
        canvas.paste(img, (x, y))
        draw.text((x, y + thumb_height + 5), image_path.stem, fill=(75, 85, 99))

    canvas.save(out_path)


def main():
    if len(sys.argv) < 3:
        print("Usage: audit-reference-pdf.py <pdf> <out-dir>", file=sys.stderr)
        raise SystemExit(1)

    pdf_path = Path(sys.argv[1]).resolve()
    out_dir = Path(sys.argv[2]).resolve()
    pages_dir = out_dir / "pages"
    pages, stats = render_pdf(pdf_path, pages_dir)
    montage_path = out_dir / "montage.png"
    make_montage(pages, montage_path)
    (out_dir / "audit.json").write_text(
        json.dumps(
            {
                "source_pdf": str(pdf_path),
                "page_count": len(pages),
                "montage": str(montage_path),
                "stats": stats,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(json.dumps({"page_count": len(pages), "montage": str(montage_path)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
