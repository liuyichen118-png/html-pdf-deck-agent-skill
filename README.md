# HTML PDF Deck Pipeline

Private extraction draft for a local HTML/CSS to fixed-layout PDF deck pipeline.

This repository is not public-release-ready yet. It is private by default until the open-source review passes.

## What It Does

The pipeline renders slide-style HTML locally and produces:

- a vector PDF from Chromium;
- a CJK-safe image PDF built from verified page screenshots;
- per-page PNG previews;
- a montage/contact sheet;
- `qa.json` with overflow, visible-content, and low-image-content checks.

The image PDF exists because some PDF viewers can drop or hide Chinese/CJK text from vector PDFs even when the HTML and screenshots render correctly. For delivery where visual fidelity matters, use the `*-image.pdf` output.

## Commands

```bash
npm install
npm run smoke
npm run smoke:cjk
npm run render -- /absolute/path/report.html /absolute/path/output-dir
```

If Playwright browser downloads are unavailable, the script falls back to an installed system browser when possible. You can also override it:

```bash
PRESENTATION_PIPELINE_BROWSER="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run render -- examples/cjk-smoke-report.html outputs/cjk-smoke
```

## HTML Contract

Use one `.slide` element per page.

```html
<section class="slide">
  <div class="content">
    <h1>Slide title</h1>
    <p>Slide body</p>
  </div>
</section>
```

Default canvas:

```text
1280 x 720
```

## Output

For `report.html`, the output directory contains:

```text
report.pdf          # Chromium vector PDF
report-image.pdf    # screenshot-packed image PDF, safer for CJK visual fidelity
preview/page-01.png
preview/page-02.png
montage.png
qa.json
```

Delivery-grade output should have:

- `overflow_issue_count = 0`
- `content_visibility_issue_count = 0`
- `image_content_issue_count = 0`

Always inspect `montage.png` before sending a PDF.

## CJK / Chinese Text Rule

For Chinese, Japanese, Korean, or any deck where missing glyphs are unacceptable:

1. Use font stacks that include available CJK fonts.
2. Render the deck.
3. Inspect `montage.png`.
4. Use `*-image.pdf` as the final visual PDF when viewer compatibility matters.

This turns the previous manual "Chinese disappeared in PDF preview" fix into a standard pipeline output.

## Public Release TODO

- Rename package for public release.
- Decide license.
- Remove this private-extraction notice.
- Add GitHub Actions.
- Add CLI options for viewport, footer, selectors, and image-PDF toggle.
- Run private path, brand, secret, and dependency license scans.
