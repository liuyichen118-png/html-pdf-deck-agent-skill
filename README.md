# HTML PDF Deck Agent Skill

An Agent Skill for creating polished fixed-layout HTML/CSS presentation decks and exporting CJK-safe visual PDFs.

It is designed for customer-facing reports, proposal decks, requirements-confirmation decks, diagnostic reports, and PDF-first slide deliverables where the final file must look exactly right.

[中文说明](README.zh-CN.md) | [Project positioning](docs/PROJECT_POSITIONING.md) | [CJK PDF safety](docs/CJK_PDF_SAFETY.md)

> Status: private release candidate. Public release still requires owner approval and a license decision.

## What This Skill Does

- Guides an AI agent through a repeatable deck production workflow.
- Uses HTML/CSS as the visual source of truth.
- Captures verified per-page PNG previews.
- Builds a montage/contact sheet for fast visual QA.
- Writes `qa.json` with overflow, visible-content, and image-content checks.
- Exports a CJK-safe final PDF from verified page screenshots.
- Keeps Chromium vector PDF output as auxiliary/debug only.

## Example Outputs

The repository includes three visual directions for GitHub previews and smoke testing.

| Executive Brief | Editorial Report | Operations Dashboard |
|---|---|---|
| ![Executive brief demo](assets/demo-executive.png) | ![Editorial report demo](assets/demo-editorial.png) | ![Operations dashboard demo](assets/demo-operations.png) |

## Why Image-Safe PDF Output

Some PDF viewers can drop Chinese, Japanese, or Korean glyphs from Chromium-generated vector PDFs even when the HTML page and screenshots are correct.

This skill treats that as a delivery risk. The default `<name>.pdf` is rebuilt from verified page screenshots so the recipient sees the intended visual result. The `<name>-vector.pdf` file is kept only for auxiliary/debug use.

## Install

```bash
npm install
```

If Playwright browser downloads are unavailable, the renderer falls back to an installed system browser when possible. You can override it:

```bash
PRESENTATION_PIPELINE_BROWSER="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run smoke:cjk
```

## Use As A Codex Skill

The repository root is a skill folder because it contains `SKILL.md`.

Copy or install this folder into your Codex skills directory, then invoke:

```text
Use $html-pdf-deck to create a polished PDF-first deck from HTML/CSS and verify the exported PDF.
```

The skill uses:

```text
SKILL.md
scripts/render-report.js
docs/CJK_PDF_SAFETY.md
references/design-styles.md
examples/
assets/
```

## Commands

```bash
npm run smoke
npm run smoke:cjk
npm run demo:all
npm run render -- /absolute/path/report.html /absolute/path/output-dir
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
report.pdf          # screenshot-packed final PDF, safer for CJK visual fidelity
report-vector.pdf   # Chromium vector PDF, auxiliary/debug output
preview/page-01.png
preview/page-02.png
montage.png
qa.json
```

Delivery-grade output should have:

```json
{
  "overflow_issue_count": 0,
  "content_visibility_issue_count": 0,
  "image_content_issue_count": 0
}
```

Always inspect `montage.png`. For Chinese/CJK decks, also render the final `<name>.pdf` in a real PDF viewer and confirm text is visible.

## Demo Styles

- `examples/executive-brief.html`: restrained strategy/proposal style.
- `examples/editorial-report.html`: premium editorial visual report.
- `examples/operations-dashboard.html`: dense dashboard/status report.
- `examples/cjk-smoke-report.html`: CJK export safety test.

## Public Release Checklist

See `OPEN_SOURCE_PREP_CHECKLIST.md`.

Before making this repository public:

- choose a license.
- confirm `61X-Studio` as author or replace it.
- run secret/private-path scans.
- run GitHub Actions in a private repo.
- review README rendering and demo images on GitHub.

## License

No public license has been granted yet. The project remains private until the owner explicitly approves public release and chooses a license.
