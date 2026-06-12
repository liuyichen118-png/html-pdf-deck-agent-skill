# Project Positioning

## Naming Decision

Recommended public repository name:

```text
html-pdf-deck-agent-skill
```

Recommended skill trigger name:

```text
html-pdf-deck
```

Recommended package name:

```text
html-pdf-deck-agent-skill
```

Why:

- `html-pdf-deck` is short enough for an Agent Skill trigger.
- `agent-skill` makes the GitHub repository understandable as more than a standalone script.
- `html-pdf-deck` clearly communicates the source format, output format, and use case.
- The name avoids private brand dependency, so it can be open-sourced without requiring 61X context.

## One-Line Description

English:

```text
An Agent Skill for creating polished HTML/CSS presentation decks and exporting CJK-safe visual PDFs with screenshot QA.
```

中文：

```text
一个用于生成高质感 HTML/CSS 视觉型演示文稿，并导出中文/CJK 安全 PDF 的 Agent Skill。
```

## Short GitHub Description

English:

```text
Agent Skill for polished HTML/CSS decks, screenshot QA, and CJK-safe PDF export.
```

中文：

```text
用于高质感 HTML/CSS 演示文稿、截图 QA 和中文安全 PDF 导出的 Agent Skill。
```

## Target Users

- AI agents that need a repeatable PDF-first deck production workflow.
- Developers building customer-facing reports from HTML/CSS.
- Consultants and operators who need polished proposal, diagnostic, or requirements-confirmation PDFs.
- Chinese/CJK users who need final exported PDFs to preserve visible text.

## What This Is

- An Agent Skill.
- A local HTML/CSS deck rendering pipeline.
- A CJK-safe PDF export workflow.
- A screenshot-based visual QA flow.
- A set of example deck styles and acceptance rules.

## What This Is Not

- Not a general-purpose PowerPoint editor.
- Not a full design system.
- Not a hosted SaaS service.
- Not a replacement for human review of customer-facing claims.
- Not a guarantee that vector PDFs preserve selectable text across viewers.

## Release Position

Best public framing:

```text
PDF-first deck production for AI agents.
```

Secondary framing:

```text
Make AI-generated decks shippable, visual, and CJK-safe.
```

## Language Strategy

Use English as the primary GitHub `README.md` because it reaches the broader open-source audience.

Provide `README.zh-CN.md` for Chinese users because the CJK PDF problem is one of the key reasons this project exists.

Keep `SKILL.md` in English for broad agent compatibility, but mention CJK/Chinese safety directly in the description and body.
