# Plan: `find-ai-configs` — npx-runnable AI provider/model config locator

## Goal

Add a zero-dependency Node.js CLI to this repo that locates all AI provider/model configuration
files on the machine at three levels — **project** (cwd + subfolders), **user** (home dir),
**system/managed** (machine-wide) — and prints a rich report of where they are and what
provider/model settings they contain. Executable via `npx github:wombatepiclandingstudio/ai`.

## Decisions (confirmed with user)

1. **Distribution**: root `package.json` with `bin` entry; run via `npx github:wombatepiclandingstudio/ai`. No npm publishing. Set `private: true` to block accidental publish (doesn't affect npx-github).
2. **Coverage**: all ~20 researched tools (CLI agents, IDE extensions, local runtimes).
3. **Output**: rich terminal report grouped by level → tool, each found path annotated with provider/model info found inside (model names, provider IDs, which env vars hold keys — **never secret values**). Flags: `--json`, `--tools a,b`, `--level project|user|system`, `--path DIR`, `--max-depth N`, `--no-ignore`, `--help`, `--version`.
4. **Project scan**: recursive walk of cwd (or `--path`) for known config filenames, skipping `node_modules`, `.git`, `dist`, `build`, `.next`, `.venv`, `venv`, `vendor`, `target`, `__pycache__`, `.turbo`, `.cache`, `coverage`, `.gradle`, `bin/obj`-style dirs; don't follow symlinks; default `--max-depth 12`. Report files that exist at a documented path, annotated as "model config" vs "rules/MCP only".

## Files to create/modify

```
package.json                 # NEW root package. name "ai", private:true, type:module,
                             # bin { "find-ai-configs": "bin/find-ai-configs.js" },
                             # engines node>=18, files [bin, lib]. No dependencies.
bin/find-ai-configs.js       # NEW executable entry (#!/usr/bin/env node): arg parsing, orchestration
lib/catalog.mjs              # NEW tool catalog (see path tables below)
lib/scan.mjs                 # NEW project walker + user/system existence checks
lib/inspect.mjs              # NEW per-format content summarizer (json/jsonc, toml, yaml, env)
lib/report.mjs               # NEW terminal + JSON renderers
README.md                    # MODIFY: add "find-ai-configs" usage section
```

All logic in plain ESM JavaScript, zero npm deps. Ignore `_astro/` (site has its own package).

## Path catalog (from official-docs research, Aug 2026) → `lib/catalog.mjs`

Each entry: tool id, display name, docs URL, and paths per level. `~` = `os.homedir()`;
XDG bases resolved from `XDG_CONFIG_HOME`/`XDG_DATA_HOME`; Windows bases from `APPDATA`,
`LOCALAPPDATA`, `ProgramData`, `ProgramFiles`; macOS bases `~/Library/Application Support`.
**Env-var relocations respected** (scan env-redirected path instead of default when set).

### User level

| Tool | Paths (defaults) | Reloc env |
|---|---|---|
| Claude Code | `~/.claude/settings.json`, `~/.claude.json` | `CLAUDE_CONFIG_DIR` |
| Codex | `~/.codex/config.toml`, `~/.codex/auth.json` | `CODEX_HOME` |
| Gemini CLI | `~/.gemini/settings.json` | `GEMINI_CLI_HOME` |
| Copilot CLI | `~/.copilot/settings.json`, `~/.copilot/config.json`, `~/.copilot/mcp-config.json` | `COPILOT_HOME` |
| OpenCode | `$XDG_CONFIG_HOME/opencode/opencode.json[c]`, `.../tui.json` | `OPENCODE_CONFIG`, `OPENCODE_CONFIG_DIR` |
| Goose | `$XDG_CONFIG_HOME/goose/config.yaml`, `.../secrets.yaml` (Win: `%APPDATA%/Block/goose/config/`) | `GOOSE_PATH_ROOT` |
| Amp | `$XDG_CONFIG_HOME/amp/settings.json[c]` | — |
| Kiro | `~/.kiro/settings/cli.json`, `~/.kiro/settings/mcp.json` | `KIRO_HOME` |
| Cursor | `~/.cursor/mcp.json`, `~/.cursor/cli-config.json`; VS Code-fork user settings `<AppData|~/.config|App Support>/Cursor/User/settings.json` (undocumented model keys → annotate "editor settings") | `CURSOR_CONFIG_DIR` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json`, `~/.codeium/windsurf/config_config.json` (undocumented → annotate) | — |
| Cline | `~/.cline/data/settings/providers.json`, `~/.cline/data/settings/global-settings.json`, `~/.cline/mcp.json`; VS Code globalStorage `saoudrizwan.claude-dev/settings/cline_mcp_settings.json` | `CLINE_DATA_DIR` |
| Roo Code | VS Code globalStorage `rooveterinaryinc.roo-cline/settings/mcp_settings.json`, `custom_modes.yaml`; `~/.roo/rules/` (note: provider profiles live in VS Code SecretStorage, not files — print that note) | — |
| Continue | `~/.continue/config.yaml`, `~/.continue/config.json` (legacy), `~/.continue/agents/` | — |
| Kilo Code | `$XDG_CONFIG_HOME/kilo/kilo.json[c]` (legacy: `~/.kilocode/` dirs, `~/.config/kilo/opencode.json[c]`); auth `$XDG_DATA_HOME/kilo/auth.json`; legacy VS Code globalStorage `kilocode.kilo-code/settings/` | `KILO_CONFIG`, `KILO_CONFIG_DIR` |
| Ollama | `~/.ollama` (Linux service: `/usr/share/ollama/.ollama`), `models/manifests` tree, `server.json` | `OLLAMA_MODELS` |
| LM Studio | `~/.lmstudio` (+ `~/.lmstudio-home-pointer`), legacy `~/.cache/lm-studio` | — |
| LiteLLM | none by default (project-only) | — |
| Aider | `~/.aider.conf.yml`, `~/.aider.model.settings.yml`, `~/.aider.model.metadata.json` | — |
| Hugging Face | `$HF_HOME/token` (default `~/.cache/huggingface/token`), `$HF_HOME/hub` | `HF_HOME`, `HF_TOKEN_PATH` |
| Jan | Jan data folder: Win `%APPDATA%/Jan/data`, macOS `~/Library/Application Support/Jan/data`, Linux `$XDG_DATA_HOME/Jan/data` (also legacy `~/.config/Jan/data`) | — |

### Project level (filenames the recursive walker matches)

- Claude Code: `.claude/settings.json`, `.claude/settings.local.json`, `.mcp.json` (mcp→annotate)
- Codex: `.codex/config.toml` (annotate: provider keys ignored in project files)
- Gemini: `.gemini/settings.json`
- Copilot: `.github/copilot/settings.json`, `.github/copilot/settings.local.json`
- OpenCode: `opencode.json`, `opencode.jsonc`, `.opencode/opencode.json[c]`
- Goose: none (`.goosehints` = prompts only → skip or annotate as rules)
- Amp: `.amp/settings.json`, `.amp/settings.jsonc`
- Kiro: `.kiro/settings/cli.json`, `.kiro/settings/mcp.json`
- Cursor: `.cursor/mcp.json`, `.cursor/cli.json` (annotate)
- Windsurf: `.windsurf/mcp_config.json` (no project MCP officially; keep as found-if-exists)
- Cline: `.cline/mcp.json`; Roo: `.roo/mcp.json`, `.roomodes`
- Continue: `.continue/config.yaml`, `.continue/config.json` (real model config)
- Kilo: `kilo.jsonc`, `.kilo/kilo.json[c]`, `.kilo/tui.json` (legacy `.kilocode/`)
- LiteLLM: `litellm_config.yaml`, `litellm_config.yml`
- Aider: `.aider.conf.yml`, `.aider.model.settings.yml`, `.aider.model.metadata.json`, `.env`
- Generic: `.env` (annotate: "may contain provider API keys — names only, values never shown")
- Skip prompt-only files (AGENTS.md, CLAUDE.md, rules dirs) — not provider/model config.

### System/managed level (existence-checked per OS)

| Tool | macOS | Linux | Windows |
|---|---|---|---|
| Claude Code | `/Library/Application Support/ClaudeCode/managed-settings.json` (+ `managed-settings.d/`) | `/etc/claude-code/` | `C:\Program Files\ClaudeCode\` |
| Codex | — | `/etc/codex/config.toml` | — |
| Gemini | `/Library/Application Support/GeminiCli/system-defaults.json`, `.../settings.json` | `/etc/gemini-cli/` | `C:\ProgramData\gemini-cli\` |
| Copilot | `/Library/Application Support/GitHubCopilot/managed-settings.json` | `/etc/github-copilot/` | `%ProgramFiles%\GitHubCopilot\` |
| OpenCode | `/Library/Application Support/opencode/opencode.json[c]` | `/etc/opencode/` | `%ProgramData%\opencode\` |
| Amp | `/Library/Application Support/ampcode/managed-settings.json` | `/etc/ampcode/` | `%ProgramData%\ampcode\` |
| Ollama | — | `/usr/share/ollama/.ollama` (service user) | — |

## Content inspection (`lib/inspect.mjs`)

- JSON/JSONC: strip `//` and `/* */` comments + trailing commas, `JSON.parse`; extract `model`,
  `small_model`, `provider`/`providers`/`model_providers` keys, `disabled_providers`,
  `chat.defaultModel`, `model.name`, `subagents` model fields; detect `env` blocks.
- TOML (Codex/LiteLLM-adjacent): regex-extract `model =`, `model_provider =`,
  `[model_providers.<id>]` sections with `base_url`/`env_key`.
- YAML (Goose/Continue/LiteLLM/aider): naive line-based scan for `model:`, `active_provider:`,
  `providers:`/`model_list:` (LiteLLM `litellm_params.api_key` → report as "key ref", not value).
- `.env` / env blocks: list **variable names only** matching known provider key patterns
  (`*_API_KEY`, `*_TOKEN`, `ANTHROPIC_*`, `OPENAI_*`, `GOOSE_*`, `AIDER_*`, `HF_TOKEN`...).
- Hard rule: never output any value that looks like a secret; on parse failure, still list the
  file with note "unreadable/unparseable".

## Report shape (terminal)

```
Project (./some/repo — 3 configs)
  claude-code   .claude/settings.json            model: claude-sonnet-4-5
  claude-code   .claude/settings.local.json      (no model key)
  aider         .env                             key names: OPENAI_API_KEY, OPENROUTER_API_KEY
User (/home/x)
  codex         ~/.codex/config.toml             model: gpt-5-codex; provider: openai; [model_providers.ollama]
  ...
System
  opencode      /etc/opencode/opencode.json      (not found → omitted; found sections only)
```

`--json` emits `{generatedAt, cwd, results: [{tool, level, path, annotations[], kind}]}`.
NotFound paths are omitted by default (report what exists); `--all` flag lists checked-but-missing defaults.

## Validation plan

1. `node bin/find-ai-configs.js --help` and no-args run in repo — must not crash, print report.
2. Fixture test with fake HOME (no touching real home):
   `mkdir -p /tmp/kilo/fixture-home/.codex` + sample `config.toml`, `~fixture/.claude/settings.json`;
   run `HOME=/tmp/kilo/fixture-home node bin/... --level user` → paths + model annotations appear.
3. Fixture project tree in `/tmp/kilo/fixture-proj`: nested `packages/a/.claude/settings.json`,
   `deep/.continue/config.yaml`, a `node_modules/x/.codex/config.toml` (must be skipped),
   symlink loop (must not hang). Run with `--path /tmp/kilo/fixture-proj`.
4. Secret safety: fixture `.env` with real-looking keys → output must contain var names only.
5. `npm pack --dry-run` → tarball contains only bin/ + lib/; then `npx ./ai-*.tgz --help` works
   (simulates npx-github flow). Real `npx github:wombatepiclandingstudio/ai` works after push (out of scope here).
6. Windows/macOS path logic: unit-check base-dir resolution via a small `--debug` env override
   (`AICF_FAKE_PLATFORM`/`AICF_FAKE_HOME`) — Linux sandbox can't run real Windows checks; note this.

## Out of scope / risks

- No reading of OS keychains, VS Code `state.vscdb`, or SecretStorage (Roo/Cline API keys) — print a note pointing at them instead.
- Cursor/Windsurf model-selection files are officially UI-managed; files like `config_config.json` are annotated as "undocumented/community-known".
- Actual `npx github:` execution can only be verified after push to `main`.
