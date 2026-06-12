# Open Source Prep Checklist

Status: public release approved by owner on 2026-06-12. Use this file as the release checklist for future versions.

## Required Before GitHub Public Release

### 1. Repository Identity

- [x] Decide final repo name: `html-pdf-deck-agent-skill`.
- [x] Decide package name: `html-pdf-deck-agent-skill`.
- [x] Decide skill trigger name: `html-pdf-deck`.
- [x] Decide whether to keep `61X-Studio` as author.
- [x] Decide license.
- [x] Confirm repository visibility: public release approved by owner.

### 2. README And Positioning

- [ ] Explain the problem in one sentence: build fixed-layout HTML/CSS decks and export CJK-safe PDFs.
- [ ] Show the default workflow: HTML -> preview PNGs -> montage -> image-safe PDF -> QA JSON.
- [ ] Explain why `*-vector.pdf` is auxiliary only.
- [ ] Add quick start commands.
- [ ] Add a minimal HTML example.
- [ ] Add output file examples.
- [ ] Add screenshots or a small montage image.
- [x] Add English primary README.
- [x] Add Chinese README: `README.zh-CN.md`.
- [x] Add project positioning and naming document: `docs/PROJECT_POSITIONING.md`.
- [x] Add compatibility matrix: `docs/COMPATIBILITY.md`.

### 3. Real Usage Documentation

- [ ] Document the `.slide` HTML contract.
- [ ] Document required 1280 x 720 canvas behavior.
- [ ] Document CJK PDF safety checks.
- [ ] Document QA fields and pass/fail rules.
- [ ] Document macOS Quick Look verification for Chinese PDFs.
- [ ] Document known tradeoff: image-safe PDFs are larger and text is not selectable.

### 4. Code Quality

- [x] Add CLI options for viewport, output name, selectors, and vector-only/debug mode.
- [x] Keep defaults safe for Chinese/CJK delivery.
- [ ] Add structured errors for missing files, empty slides, browser launch failures, and PDF write failures.
- [ ] Add tests for regular smoke and CJK smoke.
- [x] Add a CI workflow that runs smoke tests and dependency audit.

### 5. Security And Privacy

- [x] Scan for secrets, tokens, account IDs, private paths, private customer names, and internal project names.
- [ ] Exclude `outputs/`, `node_modules/`, and generated artifacts from Git.
- [x] Remove private extraction wording from public README before release.
- [ ] Confirm examples contain only generic demo content.
- [x] Confirm no private 61X customer materials are included.

### 6. Legal And Maintenance

- [x] Pick a license after owner approval.
- [ ] Add `CONTRIBUTING.md` if outside contributions are welcome.
- [ ] Add `SECURITY.md` for vulnerability reports.
- [ ] Add `CODE_OF_CONDUCT.md` only if the project is intended to accept community participation.
- [ ] Add release tags only after the API is stable enough.

### 7. GitHub Repository Setup

- [x] Create GitHub repo.
- [x] Push local main branch.
- [ ] Enable GitHub Actions.
- [ ] Confirm CI passes in GitHub, not only locally.
- [ ] Review README rendering on GitHub.
- [x] Switch to public only after explicit owner approval.

## Recommended Public Release Files

```text
README.md
LICENSE
CHANGELOG.md
CONTRIBUTING.md
SECURITY.md
.github/workflows/quality.yml
examples/
docs/CJK_PDF_SAFETY.md
scripts/render-report.js
package.json
package-lock.json
```

## Current Release Decision

Public release approved.

Best next step: wait for GitHub Actions to finish and fix any remote-only CI issue if it appears.
