# FE Rewrite: copy, install modal, and markdown view toggle

## Context

`_astro/` is a static Astro + Tailwind v4 site for the `wombatepiclandingstudio/ai`
repo (project name: **Wombat Epic Landing Studio AI**), deployed to
`https://ai.wombatepiclanding.studio` via GitHub Pages (`PUBLIC_SITE_URL`).

Three problems to fix on the frontend:

1. **Copy is AI slop.** Hero badge "Open Agent Skills standard", H1 "Reusable AI
   skills & agents for your coding tools", "Reusable capabilities following the
   open Agent Skills standard.", and the "Install in seconds" section read like
   filler. Rewrite to concrete, human copy.
2. **Install flow is a single copy-paste line.** Replace the static `#install`
   section and add a per-item **Install** CTA that opens a **modal** with
   parameter pickers (tool + scope) and a **copy-to-clipboard** button.
3. **Detail pages need a markdown view toggle.** A button switches the body
   between **Rendered** (HTML) and **Source** (raw markdown with symbols).

### Decisions locked with user
- Naming uses plain, neutral terms (no "pure"/"beautified" terminology). Toggle
  labels: **"Source"** vs **"Rendered"**. Modal button: **"Install"**, action:
  **"Copy command"**.
- Install command **mirrors** the existing `install-skill.sh` / `install-agent.sh`
  CLI (`--tool`, `--global`/`--target`), but is also reachable at a **public URL**
  `https://ai.wombatepiclanding.studio/install-skill.sh` (and `.ps1`) instead of a
  GitHub raw link. Add static routes that serve the existing root installer files.

## Plan

### 1. New public install routes (so links aren't GitHub raw)
- Create `_astro/public/install-skill.sh`, `_astro/public/install-skill.ps1`,
  `_astro/public/install-agent.sh`, `_astro/public/install-agent.ps1` as copies of
  the repo-root installers (deployed verbatim to site root).
- Add CTA link option "Install without cloning" pointing to
  `https://ai.wombatepiclanding.studio/install-skill.sh` (relative
  `${import.meta.env.BASE_URL}install-skill.sh`).

### 2. Install command builder (shared logic)
- New `_astro/src/lib/build-install-cmd.ts` exporting:
  `buildSkillCmd({ tool, scope, target?, windows })` and
  `buildAgentCmd({ tool, scope, target?, windows })`.
  - `tool`: comma-joined list from selected tools.
  - `scope`: `'project'` → `--target <path>` (default `/path/to/project`);
    `'global'` → `--global`.
  - Windows variant swaps `--tool`→`-Tool`, `--target`→`-Target`, `--global`→`-Global`
    and outputs the `.ps1` script name.
  - Mirror exact flag names from `install-skill.sh` / `install-agent.sh`.

### 3. Install modal component
- New `_astro/src/components/InstallModal.astro`: a hidden `<dialog>` (or
  `role="dialog"` div) with:
  - Tool multi-select (checkboxes): claude, codex, cursor, kilocode, opencode, kiro,
    cline, gemini, kilo, roo, goose, copilot (subset that the installer supports).
  - Scope toggle: **Project** (shows target path input) vs **Global**.
  - Platform toggle: **macOS / Linux** vs **Windows (PowerShell)**.
  - Live-updating command `<pre>` + **"Copy command"** button (Clipboard API;
    fallback to `execCommand`).
  - For agents, note inline that codex/cursor print a manual `AGENTS.md` hint
    (copy the note from README lines 101–117).
- New `_astro/src/components/InstallCTA.astro`: a button `<button>` that opens the
  modal and receives `kind: 'skill' | 'agent'` + `slug`/`name` as props. Includes a
  `<script>` wiring (Astro client script) for: open/close, control state → rebuild
  command via `build-install-cmd`, and copy-to-clipboard. No framework; vanilla TS
  via Astro `<script>`.

### 4. Landing page changes (`_astro/src/pages/index.astro`)
- **Hero.astro**: drop the "Open Agent Skills standard" badge (or make it a small
  factual footnote, not a marketing pill). Rewrite H1/sub to concrete copy, e.g.
  H1 "Skills and agents you can drop into Claude, Codex, Cursor, and more";
  sub: a sentence about what they are and that one canonical file works everywhere.
- Skills `<p>` subtitle → concrete: e.g. "Ready-made skills — point the installer at
  a project or your home folder and they show up in your tools."
- Agents `<p>` subtitle → concrete: e.g. "Hand-written agent definitions you add to
  a tool's agents directory."
- Replace the entire `#install` section with per-card Install CTAs (see #5) and
  remove the `InstallSnippet` usage there (keep `InstallSnippet.astro` for reuse or
  delete if unused).
- Add an **InstallCTA** to each `SkillCard` and `AgentCard` (or a footer action
  inside the card). Keep the existing "View skill →" link.

### 5. Detail pages (`_astro/src/pages/skills/[name].astro`, `agents/[name].astro`)
- Render markdown **client-side** instead of server `marked.parse`:
  - Pass `item.body` (raw markdown) to a client `<script>`; render Rendered view via
    `marked.parse`, Source view via escaped `<pre>`. Default = Rendered.
  - Add a **Source / Rendered** toggle button near the article header.
  - Add the **InstallCTA** (`kind`, slug/name) in the header area.
  - Keep current `prose-invert` styling for the rendered article.

### 6. Copy review pass (plain, specific, non-slop)
Rewrite the flagged strings:
- `Base.astro` default `description`.
- `Hero.astro` badge/H1/sub + "Install in seconds" CTA label → "Install".
- index.astro Skills/Agents subtitles; `#install` heading + paragraph.
- `StarCTA.astro` heading/copy (keep factual).
- `index.astro` `<Base title=...>` and `Base` default.

## Files to create
- `_astro/src/lib/build-install-cmd.ts`
- `_astro/src/components/InstallModal.astro`
- `_astro/src/components/InstallCTA.astro`
- `_astro/public/install-skill.sh`, `install-skill.ps1`, `install-agent.sh`,
  `install-agent.ps1` (copies of repo-root installers)
- `_astro/src/scripts/install-modal.ts` (optional, if logic extracted from component `<script>`)

## Files to edit
- `_astro/src/components/Hero.astro`
- `_astro/src/components/SkillCard.astro`, `AgentCard.astro`
- `_astro/src/pages/index.astro`
- `_astro/src/pages/skills/[name].astro`, `agents/[name].astro`
- `_astro/src/layouts/Base.astro` (default description)
- `_astro/src/components/StarCTA.astro`

## Risks / notes
- The root installer files and the `/public` copies will drift if installers change.
  Mitigate: keep `/public` copies in sync manually, or (out of scope) generate them
  in a build step. Flag this to user.
- `marked` is already a dependency; reuse on client via a bundled `<script>` import.
- No new runtime deps required (Clipboard API is native).

## Validation
- `npm --prefix _astro install && npm --prefix _astro run build` succeeds.
- `npm --prefix _astro run check` (astro check) passes.
- Manual: `npm --prefix _astro run dev`, open a skill/agent card → Install modal
  opens, tool/scope/platform selection updates the command, Copy works; detail page
  Source/Rendered toggle works; landing copy no longer contains the flagged phrases.
- Confirm `/install-skill.sh` is served at site root (e.g. `npm run preview`).
