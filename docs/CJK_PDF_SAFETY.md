# CJK PDF Safety

## Problem

Some PDF viewers can display a Chromium-generated vector PDF with missing Chinese, Japanese, or Korean text. The HTML page and screenshots may be correct, while the final PDF preview looks blank or partially missing.

This pipeline treats that as a delivery risk, not a one-off manual repair.

## Built-In Fix

Every render produces two PDFs:

```text
report.pdf
report-image.pdf
```

- `report.pdf` is the Chromium vector PDF.
- `report-image.pdf` is rebuilt from verified per-page PNG screenshots.

Use `*-image.pdf` when visual fidelity matters more than selectable text.

## Required Test

Run:

```bash
npm run smoke:cjk
```

The test must produce:

```text
outputs/cjk-smoke/cjk-smoke-report.pdf
outputs/cjk-smoke/cjk-smoke-report-image.pdf
outputs/cjk-smoke/montage.png
outputs/cjk-smoke/qa.json
```

Expected QA:

```json
{
  "overflow_issue_count": 0,
  "content_visibility_issue_count": 0,
  "image_content_issue_count": 0
}
```

## Visual Check

Inspect `montage.png`. CJK text must be visible on every page.

On macOS, Quick Look can also be used as a practical compatibility check:

```bash
qlmanage -t -s 1280 -o outputs/cjk-smoke/ql-preview outputs/cjk-smoke/cjk-smoke-report-image.pdf
```

The generated preview PNG should show the Chinese title and body text.

## Tradeoff

The image PDF is usually larger and text is not selectable. That is acceptable for final visual delivery when the priority is "the recipient sees the correct page."
