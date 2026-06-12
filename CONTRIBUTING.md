# Contributing

Thanks for your interest in improving `html-pdf-deck-agent-skill`.

## Local Setup

```bash
npm install
npm run validate:skill
npm run smoke
npm run smoke:cjk
```

## Pull Request Checklist

- Keep examples generic and free of private customer data.
- Do not commit `node_modules/`, `outputs/`, `.env`, or generated logs.
- For Chinese/CJK changes, run `npm run smoke:cjk` and inspect the generated `montage.png`.
- Keep the default output CJK-safe unless a change is explicitly limited to debug/vector mode.

