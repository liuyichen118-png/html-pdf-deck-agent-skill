# Compatibility

This project is built as an Agent Skill plus a local Node.js renderer.

The core skill content is portable because it is plain files:

```text
SKILL.md
scripts/
references/
assets/
examples/
docs/
```

However, each agent platform has its own install path, trigger behavior, sandbox model, and rules for running local scripts. Treat the table below as a compatibility guide, not a guarantee that every platform will auto-install and auto-run it the same way.

## Compatibility Matrix

| Platform | Status | Notes |
|---|---:|---|
| OpenAI Codex | Supported / primary target | Native `SKILL.md` skill structure with optional `scripts`, `references`, `assets`, and `agents` metadata. |
| Claude Code / Claude Agent Skills | Compatible structure | Uses `SKILL.md` based Agent Skills. Installation path and invocation differ from Codex. |
| OpenClaw | Compatible structure, not yet fully tested | OpenClaw skills use a directory containing `SKILL.md` with YAML frontmatter and markdown body. Local command/script permission depends on the user's OpenClaw setup. |
| Hermes Agent | Compatible structure, not yet fully tested | Hermes supports skill installation from `SKILL.md` and has a skill library model. Local Node/Playwright execution depends on environment permissions. |
| VS Code Copilot Agent Skills | Likely compatible structure, not yet tested | VS Code Agent Skills can point to directories containing `SKILL.md`. Runtime script execution depends on workspace trust and agent permissions. |
| Tencent CodeBuddy Code | Likely adaptable, not yet tested | CodeBuddy Code has a Skills system for specialized knowledge and workflow templates. Exact packaging/import behavior should be verified before marking supported. |
| Tencent WorkBuddy | Likely adaptable, not yet tested | Public materials describe WorkBuddy as supporting Skills/MCP and reusable skill packages; this repo has not yet been tested inside WorkBuddy. |
| Coze / 扣子 | Conceptually adaptable, not drop-in tested | Coze supports Skills/workflows, but its cloud/product model may require repackaging the instructions and replacing local Node/Playwright execution with a platform-supported tool or plugin. |
| Other SKILL.md-compatible agents | May work | If the agent can read `SKILL.md`, access bundled files, and run local Node.js scripts, it should be possible to adapt this skill. |

## Not Listed Does Not Mean Unsupported

Platforms not listed here may still work.

The minimum requirements are:

1. The agent can read `SKILL.md`.
2. The agent can access bundled files in `scripts/`, `examples/`, `docs/`, `references/`, and `assets/`.
3. The runtime can install Node.js dependencies with `npm install`.
4. The runtime can run Playwright/Chromium or an installed browser.
5. The runtime can write files to an output directory.

If a platform cannot run local scripts, the skill can still be adapted as a workflow guide, but the renderer must be exposed as a plugin, MCP tool, API service, or manually run CLI command.

## Recommended Status Labels

Use these labels when reporting compatibility:

- `Supported`: tested end-to-end on that platform.
- `Compatible structure`: the skill format matches, but end-to-end execution has not been completed.
- `Likely adaptable`: the platform has a skill/workflow/plugin concept, but packaging or script execution needs adaptation.
- `Not tested`: no reliable public or local verification yet.

## Public References Checked

- OpenAI Codex Agent Skills: https://developers.openai.com/codex/skills
- Claude Agent Skills: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- OpenClaw Skills: https://docs.openclaw.ai/tools/skills
- Hermes Agent Skills: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- VS Code Copilot Agent Skills: https://code.visualstudio.com/docs/copilot/customization/agent-skills
- Tencent CodeBuddy Code Skills: https://www.codebuddy.ai/docs/cli/skills
- Tencent WorkBuddy skill packaging article: https://cloud.tencent.com/developer/article/2650591
- Coze public product page: https://www.coze.cn/

## 中文说明

这个项目不是 Codex-only。它优先适配 Codex，但核心是通用的 Agent Skill 结构。

已经列出的平台不代表全部支持范围；没有列出的平台也不代表不能用。只要某个平台能读取 `SKILL.md`，能访问仓库内的资源文件，并能运行 Node.js + Playwright，本 Skill 就有机会直接或经过少量适配后使用。

对于扣子、WorkBuddy 这类产品化平台，需要特别注意：它们可能支持 Skill 或工作流，但不一定允许直接执行本地 Node.js 脚本。因此这类平台通常需要把渲染脚本包装成插件、MCP 工具、API 服务，或者由用户手动运行 CLI。
