# Public Release Review

Status: `Public release approved`

This package was approved for public release by the owner on 2026-06-12.

## Current Decision

- Publish as `html-pdf-deck-agent-skill`.
- Keep author as `61X-Studio`.
- Use MIT license.

## Checks Completed Locally

| Check | Result | Evidence |
|---|---|---|
| Skill metadata validation | Pass | `npm run validate:skill` |
| Regular smoke render | Pass | `npm run smoke` |
| CJK smoke render | Pass | `npm run smoke:cjk` |
| CLI options smoke | Pass | `--viewport`, `--output-name`, `--slide-selector` |
| Vector-only debug smoke | Pass | `--vector-only` |
| Private path / secret scan | Pass | No private local path patterns, token, API key, password, or authorization header found in release source files |
| Private customer-name scan | Pass | No known private customer names found in release source files |
| CJK final PDF generated | Pass | `outputs/cjk-smoke/cjk-smoke-report.pdf` |
| CJK Quick Look preview | Pass | Chinese text visible in generated preview PNG |
| Chromium vector PDF CJK risk reproduced | Confirmed | `outputs/cjk-smoke/cjk-smoke-report-vector.pdf` rendered without Chinese text in Quick Look |
| High-severity npm audit | Pass | `npm_config_registry=https://registry.npmjs.org npm audit --audit-level=high` found 0 vulnerabilities |

## Known Follow-Up Tasks

- Decide whether public README should say `customer-facing` or use more neutral `delivery-facing` wording.
- Add configurable footer/branding support if examples should show a branded footer.
- Re-run private path, brand, and secret scan immediately before any public release.
- Watch GitHub Actions after push and fix any remote-only CI issue.
