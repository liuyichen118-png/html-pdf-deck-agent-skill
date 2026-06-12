# Public Release Review

Status: `Private extraction draft`

This package is not approved for public release yet.

## Current Decision

- Keep repository private.
- Use this extraction to stabilize the pipeline and CJK-safe PDF output.
- Public release requires explicit owner approval.

## Checks Completed Locally

| Check | Result | Evidence |
|---|---|---|
| Regular smoke render | Pass | `npm run smoke` |
| CJK smoke render | Pass | `npm run smoke:cjk` |
| CJK final PDF generated | Pass | `outputs/cjk-smoke/cjk-smoke-report.pdf` |
| CJK Quick Look preview | Pass | Chinese text visible in generated preview PNG |
| Chromium vector PDF CJK risk reproduced | Confirmed | `outputs/cjk-smoke/cjk-smoke-report-vector.pdf` rendered without Chinese text in Quick Look |
| High-severity npm audit | Pass | `npm_config_registry=https://registry.npmjs.org npm audit --audit-level=high` found 0 vulnerabilities |

## Known Public-Release Tasks

- Decide final public package name.
- Decide license.
- Decide whether `61X-Studio` should remain as author.
- Add a clearer CLI API for viewport, footer, selectors, and output mode.
- Run private path and brand scan before any public release.
- Create GitHub private repo first; public visibility only after final approval.
- Complete `OPEN_SOURCE_PREP_CHECKLIST.md` before changing visibility to public.
