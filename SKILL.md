---
name: html-pdf-deck
description: Create polished fixed-layout HTML/CSS presentation decks and export CJK-safe visual PDFs with screenshot QA. Use when Codex needs to build customer-facing PDF decks, diagnostic reports, proposal decks, requirements-confirmation decks, visual reports, or PDF-first slides from HTML/CSS, especially when Chinese/CJK text must remain visible in the final exported PDF.
---

# HTML PDF Deck

Use this skill to create visually polished 16:9 HTML/CSS decks and export delivery-safe PDFs.

## Core Contract

- Build one `.slide` element per page.
- Use a fixed `1280 x 720` canvas unless the user explicitly asks for another size.
- Prefer direct, customer-facing copy.
- Render through `scripts/render-report.js`.
- Treat `<name>.pdf` as the final delivery file.
- Treat `<name>-vector.pdf` as auxiliary/debug output only.
- Do not deliver a Chinese/CJK PDF until the actual exported final PDF has been rendered by a real PDF viewer and the text is visible.

## Workflow

1. Draft the deck structure:
   - audience and use case.
   - page list.
   - one claim per page.
   - visual component for each page.
2. Create or edit an HTML deck using the examples in `examples/`.
3. Use strong visual hierarchy, stable spacing, and readable font stacks with CJK fallbacks.
4. Run:

```bash
npm install
npm run render -- /absolute/path/report.html /absolute/path/output-dir
```

5. Check `qa.json`:
   - `overflow_issue_count = 0`
   - `content_visibility_issue_count = 0`
   - `image_content_issue_count = 0`
6. Inspect `montage.png`.
7. For Chinese/CJK decks, render the final `<name>.pdf` with a real PDF renderer such as Quick Look or Preview.
8. Deliver `<name>.pdf`, not `<name>-vector.pdf`.

## CJK Safety

Chromium vector PDFs may lose Chinese/CJK glyphs even when browser preview and screenshots look correct. This skill avoids that by rebuilding the final `<name>.pdf` from verified page screenshots.

Read `docs/CJK_PDF_SAFETY.md` when working on Chinese, Japanese, Korean, or any deck where missing glyphs are unacceptable.

## Style References

Use `references/design-styles.md` when choosing a visual direction or creating new examples.

Included example directions:

- `examples/executive-brief.html`: restrained executive strategy report.
- `examples/editorial-report.html`: editorial, premium visual report.
- `examples/operations-dashboard.html`: dense operational dashboard style.
- `examples/cjk-smoke-report.html`: CJK export safety test.

## Delivery Rules

- Never accept command success alone as delivery readiness.
- Never accept browser preview alone for Chinese/CJK output.
- Never send `*-vector.pdf` as the customer-facing final PDF unless separately validated.
- If QA fails, fix the HTML/CSS before delivery.
- If the final PDF render loses text, stop and regenerate using the image-safe path.
