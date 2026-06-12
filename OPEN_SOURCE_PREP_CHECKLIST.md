# Open Source Prep Checklist

Status: private draft. Do not publish until every required item is resolved and the owner explicitly approves public release.

## Required Before GitHub Public Release

### 1. Repository Identity

- [ ] Decide final repo name.
- [ ] Decide package name.
- [ ] Decide whether to keep `61X-Studio` as author.
- [ ] Decide license.
- [ ] Confirm repository visibility: start private, switch public only after final approval.

### 2. README And Positioning

- [ ] Explain the problem in one sentence: build fixed-layout HTML/CSS decks and export CJK-safe PDFs.
- [ ] Show the default workflow: HTML -> preview PNGs -> montage -> image-safe PDF -> QA JSON.
- [ ] Explain why `*-vector.pdf` is auxiliary only.
- [ ] Add quick start commands.
- [ ] Add a minimal HTML example.
- [ ] Add output file examples.
- [ ] Add screenshots or a small montage image.

### 3. Real Usage Documentation

- [ ] Document the `.slide` HTML contract.
- [ ] Document required 1280 x 720 canvas behavior.
- [ ] Document CJK PDF safety checks.
- [ ] Document QA fields and pass/fail rules.
- [ ] Document macOS Quick Look verification for Chinese PDFs.
- [ ] Document known tradeoff: image-safe PDFs are larger and text is not selectable.

### 4. Code Quality

- [ ] Add CLI options for viewport, output name, selectors, and vector-only/debug mode.
- [ ] Keep defaults safe for Chinese/CJK delivery.
- [ ] Add structured errors for missing files, empty slides, browser launch failures, and PDF write failures.
- [ ] Add tests for regular smoke and CJK smoke.
- [ ] Add a CI workflow that runs smoke tests and dependency audit.

### 5. Security And Privacy

- [ ] Scan for secrets, tokens, account IDs, private paths, private customer names, and internal project names.
- [ ] Exclude `outputs/`, `node_modules/`, and generated artifacts from Git.
- [ ] Remove private extraction wording from public README before release.
- [ ] Confirm examples contain only generic demo content.
- [ ] Confirm no private 61X customer materials are included.

### 6. Legal And Maintenance

- [ ] Pick a license after owner approval.
- [ ] Add `CONTRIBUTING.md` if outside contributions are welcome.
- [ ] Add `SECURITY.md` for vulnerability reports.
- [ ] Add `CODE_OF_CONDUCT.md` only if the project is intended to accept community participation.
- [ ] Add release tags only after the API is stable enough.

### 7. GitHub Repository Setup

- [ ] Create GitHub repo as private first.
- [ ] Push local main branch.
- [ ] Enable GitHub Actions.
- [ ] Confirm CI passes in GitHub, not only locally.
- [ ] Review README rendering on GitHub.
- [ ] Switch to public only after explicit owner approval.

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

Not ready for public release yet.

Best next step: keep the repo private, clean the public-facing README, decide the license, and run one GitHub private CI pass before considering public visibility.
