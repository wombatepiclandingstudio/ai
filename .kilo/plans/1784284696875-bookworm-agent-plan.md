# Plan: Add the `bookworm` agent

## Context

We want a new agent, **bookworm**, modeled on the Kilo marketplace `code-skeptic`
(`https://github.com/Kilo-Org/kilo-marketplace/blob/main/agents/code-skeptic/AGENT_DEFINITION.md`),
but with a twist: in addition to being highly skeptical of *others'* claims, it is also
skeptical of **its own** knowledge. Whenever a task touches **language/framework-specific
implementation details** (architecture, available language tooling, injection patterns, packages,
versions, APIs), it must **verify against an authoritative external source** before asserting
anything.

Research finding (the "most common agent format"): the de-facto standard for a *named persona
subagent* is the **Claude Code subagent format** — a `.md` file with YAML frontmatter
(`name`, `description`, optional `tools`, `model`, `permissionMode`, …) plus a markdown system
prompt body, placed in `.claude/agents/`. This is confirmed by the official Claude Code docs
(`code.claude.com/docs/en/sub-agents`), the `agents/README.md` convention in this repo, and the
dominant community convention (mquinnv/claude-code-agents, claude-config-template, etc.).
Note `AGENTS.md` is a *different* concept (single project-level instruction file), so it is not used.

External verification sources the agent will use (per user direction — body instructions only, no
MCP config writes):
- **Web**: web search / web fetch for current docs and package info.
- **Context7 MCP** (`@upstash/context7-mcp`): when the `context7` MCP server is installed in the
  host tool, prefer its `resolve-library-id` / `query-docs` tools (the `use context7` trigger).
  Fall back to web when it is not available.
- **sigmap** (`manojmallick/sigmap`, `npx sigmap`): for grounding/verifying claims against the
  actual local codebase and installed libraries (`sigmap verify`, `sigmap mcp install <client>`).

## Decisions (confirmed with user)

1. **Format**: Claude Code subagent format (`bookworm.md` with YAML frontmatter + prompt body),
   NOT `SKILL.md`, NOT `AGENT_DEFINITION.md`, NOT `AGENTS.md`.
2. **Context7**: instructions in the agent body only — use Context7 MCP if installed, else web.
   No MCP config files written by the deploy script. Include sigmap as an additional source.
3. **Deploy script**: rename root `install.sh` → `install-skill.sh`; add new `install-agent.sh`
   that symlinks agent files into each supported tool's agents directory.
4. **Tool access**: `Read, Grep, Glob, WebFetch, WebSearch, Bash` (read-mostly but allowed to
   fetch/verify online and run `npx sigmap` / Context7 CLI). `permissionMode: plan` so it does not
   silently mutate the codebase while verifying.

## Deliverables

### 1. `agents/bookworm/bookworm.md` (new)
Claude Code subagent file. Frontmatter:
```yaml
---
name: bookworm
description: >-
  Hyper-skeptical code reviewer that distrusts both others' claims AND its own
  memory. Before asserting any language/framework-specific fact (architecture,
  tooling, injection patterns, packages, versions, APIs), it verifies against
  live sources — web, the Context7 MCP server when available, and sigmap for
  codebase grounding. Use when reviewing code, claims, or implementations where
  correctness depends on current library/version behavior.
tools: [Read, Grep, Glob, WebFetch, WebSearch, Bash]
model: sonnet
permissionMode: plan
---
```
Body (skeptical system prompt) covering:
- Core stance: question everything, including its own training knowledge — "I remember X" is not
  evidence; require a citation/verification.
- Verification protocol (the heart of bookworm): for any claim about a specific language,
  framework, package, version, API, or injection/architecture pattern, do NOT assert from memory.
  - If Context7 MCP is available → use `resolve-library-id` + `query-docs` (or add `use context7`)
    to pull version-specific docs.
  - Else → `WebSearch` / `WebFetch` the official docs/repo/changelog.
  - For claims about *this* codebase or its installed libraries → run `npx sigmap verify` /
    `sigmap ask` / `sigmap mcp install` to ground against real files/symbols.
  - Record the source URL/version checked alongside each conclusion.
- Reporting format (extends code-skeptic's): FAILURES (claim vs evidence), UNVERIFIED CLAIMS
  (statements made without a checked source), SKIPPED STEPS, VERIFICATION LOG (what was checked,
  against what source, result), VIOLATIONS.
- "Show me the source or it didn't happen" — adapt code-skeptic's motto to require a source URL
  or sigmap output, not just build/test logs.
- Anti-pattern guidance + a short Rules section of hard constraints (never assert unverified
  framework specifics; always cite the source/version).

### 2. Root `install.sh` → `install-skill.sh` (rename)
- `git mv install.sh install-skill.sh`.
- Update the top comment to say it installs **skills** (not generic "the skills in this repo"
  ambiguity — keep existing wording but clarify it is skills-only now).
- No behavioral change to logic; just the filename + comment.

### 3. `install-agent.sh` (new)
Mirror of `install-skill.sh` but for agents:
- Symlink each `agents/*/agent.md` (or `*.md`) into a target project under each tool's agents path.
- Tool → agents path map (best-effort, aligned with the existing skills map and official docs):
  - `claude`     → `.claude/agents`
  - `codex`      → `AGENTS.md` (single file, project-level; note: Codex reads AGENTS.md — for a
    named subagent there is no per-agent dir, so document this limitation and write/copy into
    `AGENTS.md` only if user opts in, otherwise skip with a warning) — **decision: skip codex with
    a clear warning** that Codex has no named-subagent dir; provide instructions to paste into
    `AGENTS.md` manually.
  - `opencode`   → `.opencode/agents` (OpenCode supports `.claude/agents` fallback; use native)
  - `cursor`     → `.cursor/agents` (Cursor has no native subagent dir; best-effort symlink to
    `.cursor/agents`, document limitation)
  - `copilot`    → `.github/agents` (best-effort)
  - `kiro`       → `.kiro/agents`
  - `gemini`     → `.gemini/agents`
  - `kilocode`   → `.kilocode/agents`
  - `kilo`       → `.kilo/agents`
  - `roo`        → `.roo/agents`
  - `cline`      → `.cline/agents`
  - `goose`      → `.goose/agents`
  - `vscode`     → `.github/agents`
- Same CLI surface as `install-skill.sh`: `--tool <key[,key...]>`, `--target <dir>`, `--remove`,
  `--list-tools`, `-h/--help`. Default to `*.md` inside each `agents/<name>/` folder; if a folder
  has multiple `.md`, link the one matching `<name>.md` (fallback to first `.md`).
- Print `linked` / `exists` / `removed` / `WARN unknown tool` lines identical in style to
  `install-skill.sh`.

### 4. Update `agents/README.md`
- Clarify the agent file format is the **Claude Code subagent format** (frontmatter `name`,
  `description`, `tools`, `model`, `permissionMode` + prompt body), with a corrected example.
- Document the `install-agent.sh` usage.
- Note tool-specific limitations (Codex/Cursor lack a native named-subagent directory).

### 5. Update root `README.md`
- Mention `install-skill.sh` and `install-agent.sh` separately.
- List the `bookworm` agent under an "Agents" section.

## Risks / open questions
- **Codex & Cursor** have no native named-subagent directory; `install-agent.sh` will skip them
  with a warning and document manual `AGENTS.md` pasting. (Acceptable, documented.)
- The `bookworm.md` filename must match the `name` frontmatter field (`bookworm`) — enforced.
- `permissionMode: plan` + `Bash` is allowed in Claude Code (plan mode still permits read/Bash for
  verification); if a target tool ignores `permissionMode`, the body's "do not mutate" rules still
  apply as instructions.

## Validation
- `bash install-agent.sh --list-tools` lists all supported tools.
- `bash install-agent.sh --tool claude --target /tmp/agenttest` creates
  `/tmp/agenttest/.claude/agents/bookworm` symlinked to `agents/bookworm/bookworm.md`; verify
  `name:` in frontmatter equals the folder/file basename.
- `bash install-agent.sh --tool claude --target /tmp/agenttest --remove` removes it.
- `python3 -c "import yaml,sys; yaml.safe_load(open('agents/bookworm/bookworm.md').read().split('---')[1])"`
  (or a manual frontmatter check) confirms valid YAML frontmatter.
- `git mv install.sh install-skill.sh` then `bash install-skill.sh --list-tools` still works.
- No regression: existing skills install path unchanged.
