#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TOOLS, TOOL_INDEX } from '../lib/catalog.mjs'
import { scanProject, scanUserSystem, SKIP_DIRS } from '../lib/scan.mjs'
import { renderTerminal, renderJson, sortResults } from '../lib/report.mjs'
import { activeRelocations } from '../lib/env.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))

const LEVELS = ['project', 'user', 'system']

function usage() {
  return `find-ai-configs — locate AI provider/model configuration files (project / user / system)

Usage:
  npx github:wombatepiclandingstudio/ai [options]

Scans the current folder and its subfolders for project-level configs, the user home
for user-level configs, and machine-wide paths for system/managed configs, across
${TOOLS.length} AI tools (Claude Code, Codex, Gemini CLI, Copilot CLI, OpenCode, Cursor,
Windsurf, Cline, Roo Code, Continue, Kilo Code, Goose, Amp, Kiro, Ollama, LM Studio,
LiteLLM, Aider, Hugging Face, Jan). Config relocations via env vars such as
CLAUDE_CONFIG_DIR, CODEX_HOME, GEMINI_CLI_HOME, KILO_CONFIG_DIR are honored.

Options:
  --path <dir>        Project root to scan (default: current directory)
  --level <levels>    Comma-separated: project,user,system (default: all)
  --tools <ids>       Comma-separated tool ids (see --list-tools)
  --max-depth <n>     Project scan depth limit (default: 12)
  --no-ignore         Do not skip node_modules/.git/vendor/... directories
  --all               Also list checked-but-not-found default paths
  --json              Machine-readable JSON output
  --list-tools        Print supported tool ids and exit
  -h, --help          Show this help
  -V, --version       Show version

API key and token values are never printed — only key/variable names.`
}

function fail(msg) {
  process.stderr.write(`ERROR: ${msg}\n\n${usage()}\n`)
  process.exit(1)
}

function parseArgs(argv) {
  const opts = { json: false, all: false, listTools: false, noIgnore: false, root: process.cwd(), maxDepth: 12, tools: null, levels: null }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    switch (arg) {
      case '--help':
      case '-h':
        process.stdout.write(`${usage()}\n`)
        process.exit(0)
        break
      case '--version':
      case '-V':
        process.stdout.write(`${pkg.version}\n`)
        process.exit(0)
        break
      case '--json':
        opts.json = true
        break
      case '--all':
        opts.all = true
        break
      case '--no-ignore':
        opts.noIgnore = true
        break
      case '--list-tools':
        opts.listTools = true
        break
      case '--path':
      case '--level':
      case '--tools':
      case '--max-depth': {
        const val = argv[i + 1]
        if (val === undefined) fail(`${arg} requires a value`)
        i += 1
        if (arg === '--path') opts.root = val
        if (arg === '--level') opts.levels = val
        if (arg === '--tools') opts.tools = val
        if (arg === '--max-depth') {
          const n = Number.parseInt(val, 10)
          if (!Number.isFinite(n) || n < 0) fail(`--max-depth must be a non-negative integer, got "${val}"`)
          opts.maxDepth = n
        }
        break
      }
      default:
        fail(`unknown argument: ${arg}`)
    }
  }
  return opts
}

function main() {
  const opts = parseArgs(process.argv.slice(2))

  if (opts.listTools) {
    for (const t of TOOLS) {
      const desc = t.note ? ` — ${t.note}` : ''
      process.stdout.write(`${t.id.padEnd(14)} ${t.name}${desc}\n`)
    }
    return
  }

  const levelSet = new Set(LEVELS)
  if (opts.levels !== null) {
    levelSet.clear()
    for (const l of opts.levels.split(',').map((s) => s.trim()).filter(Boolean)) {
      if (!LEVELS.includes(l)) fail(`unknown level "${l}" (valid: ${LEVELS.join(', ')})`)
      levelSet.add(l)
    }
    if (!levelSet.size) fail('--level received no valid levels')
  }

  let selected = TOOLS
  if (opts.tools !== null) {
    const ids = opts.tools.split(',').map((s) => s.trim()).filter(Boolean)
    const unknown = ids.filter((id) => !TOOL_INDEX.has(id))
    if (unknown.length) fail(`unknown tool id(s): ${unknown.join(', ')} — run with --list-tools to see valid ids`)
    const idSet = new Set(ids)
    selected = TOOLS.filter((t) => idSet.has(t.id))
  }

  const root = path.resolve(opts.root)
  if (levelSet.has('project') && !fs.existsSync(root)) {
    fail(`scan root does not exist: ${root}`)
  }

  const scanOpts = { root, maxDepth: opts.maxDepth, all: opts.all, ignore: opts.noIgnore ? new Set() : SKIP_DIRS }

  const results = []
  if (levelSet.has('project')) results.push(...scanProject(selected, scanOpts))
  results.push(...scanUserSystem(selected, levelSet, scanOpts))

  const toolRank = new Map(TOOLS.map((t, i) => [t.id, i]))
  sortResults(results, toolRank)

  const data = {
    version: pkg.version,
    root,
    levels: [...levelSet],
    envRelocations: activeRelocations(),
    results,
    all: opts.all,
    toolNotes: new Map(TOOLS.filter((t) => t.note).map((t) => [t.id, t.note])),
  }

  if (opts.json) {
    process.stdout.write(`${renderJson(data)}\n`)
  } else {
    process.stdout.write(`${renderTerminal(data)}\n`)
  }
}

main()
