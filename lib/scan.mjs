import fs from 'node:fs'
import path from 'node:path'
import { resolveBase, getenv, PLATFORM } from './env.mjs'
import { inspectFile } from './inspect.mjs'

export const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.hg',
  '.svn',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  '.output',
  '.turbo',
  '.svelte-kit',
  '.cache',
  '.pytest_cache',
  '.mypy_cache',
  '.ruff_cache',
  '.tox',
  '.venv',
  'venv',
  'vendor',
  'target',
  '__pycache__',
  'coverage',
  '.nyc_output',
  '.gradle',
  '.idea',
  'Pods',
  '.terraform',
  '.yarn',
])

function existsAs(p, wantDir) {
  try {
    const st = fs.statSync(p)
    return wantDir ? st.isDirectory() : st.isFile()
  } catch {
    return false
  }
}

function candidatesFor(entry) {
  const list = []
  const base = entry.abs !== undefined ? entry.abs : resolveBase(entry.base)
  list.push({ path: path.join(base, ...entry.rel) })
  if (entry.envDir && getenv(entry.envDir.var)) {
    list.push({ path: path.join(getenv(entry.envDir.var), ...entry.envDir.rel), via: `$${entry.envDir.var}` })
  }
  if (entry.envFile && getenv(entry.envFile.var)) {
    list.push({ path: getenv(entry.envFile.var), via: `$${entry.envFile.var}` })
  }
  return list
}

function platformOk(entry) {
  return !entry.only || entry.only.includes(PLATFORM)
}

export function scanUserSystem(tools, levels, opts) {
  const results = []
  const seen = new Set()
  const emit = (tool, level, cand, entry) => {
    const key = `${tool.id}|${level}|${cand.path}`
    if (seen.has(key)) return
    seen.add(key)
    const found = existsAs(cand.path, Boolean(entry.dir))
    if (!found && !opts.all) return
    results.push({
      tool: tool.id,
      toolName: tool.name,
      level,
      path: cand.path,
      kind: entry.kind,
      note: entry.note,
      via: cand.via || null,
      dir: Boolean(entry.dir),
      found,
      annotations: found && !entry.dir ? inspectFile(cand.path) : [],
    })
  }
  for (const tool of tools) {
    if (levels.has('user')) {
      for (const entry of tool.user || []) {
        if (!platformOk(entry)) continue
        for (const cand of candidatesFor(entry)) emit(tool, 'user', cand, entry)
      }
    }
    if (levels.has('system')) {
      for (const entry of tool.system?.[PLATFORM] || []) {
        for (const cand of candidatesFor(entry)) emit(tool, 'system', cand, entry)
      }
    }
  }
  return results
}

export function scanProject(tools, opts) {
  const root = path.resolve(opts.root)
  const byLastName = new Map()
  const byFileName = new Map()
  for (const tool of tools) {
    for (const spec of tool.project || []) {
      if (spec.segments) {
        const last = spec.segments[spec.segments.length - 1]
        if (!byLastName.has(last)) byLastName.set(last, [])
        byLastName.get(last).push({ spec, tool })
      } else if (spec.file) {
        if (!byFileName.has(spec.file)) byFileName.set(spec.file, [])
        byFileName.get(spec.file).push({ spec, tool })
      }
    }
  }

  const results = []
  const seen = new Set()
  const match = (absPath, relPosix, name) => {
    const hits = []
    for (const { spec, tool } of byFileName.get(name) || []) hits.push({ spec, tool })
    for (const { spec, tool } of byLastName.get(name) || []) {
      const joined = spec.segments.join('/')
      if (relPosix === joined || relPosix.endsWith(`/${joined}`)) hits.push({ spec, tool })
    }
    for (const { spec, tool } of hits) {
      const key = `${tool.id}|project|${absPath}`
      if (seen.has(key)) continue
      seen.add(key)
      results.push({
        tool: tool.id,
        toolName: tool.name,
        level: 'project',
        path: absPath,
        kind: spec.kind,
        note: spec.note || '',
        via: null,
        dir: false,
        found: true,
        annotations: inspectFile(absPath),
      })
    }
  }

  const stack = [{ dir: root, depth: 0 }]
  while (stack.length) {
    const { dir, depth } = stack.pop()
    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const dirent of entries) {
      const full = path.join(dir, dirent.name)
      if (dirent.isDirectory()) {
        if (opts.ignore.has(dirent.name)) continue
        if (dirent.isSymbolicLink()) continue
        if (depth + 1 <= opts.maxDepth) stack.push({ dir: full, depth: depth + 1 })
      } else if (dirent.isFile()) {
        const rel = path.relative(root, full).split(path.sep).join('/')
        match(full, rel, dirent.name)
      }
    }
  }
  return results
}
