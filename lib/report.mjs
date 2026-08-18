import path from 'node:path'
import { HOME, PLATFORM } from './env.mjs'

const LEVEL_ORDER = ['project', 'user', 'system']
const LEVEL_TITLE = { project: 'Project', user: 'User', system: 'System / managed' }
const KIND_LABEL = {
  'model-config': 'model/provider config',
  mcp: 'MCP config',
  state: 'auth/state',
  settings: 'tool settings',
  'editor-settings': 'editor settings',
  policy: 'managed policy',
  data: 'data store',
  models: 'model store',
  modes: 'mode definitions',
  ui: 'UI settings',
  pointer: 'pointer file',
  secrets: 'secrets file',
  env: 'env file',
}

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const bold = (s) => (useColor ? `\x1b[1m${s}\x1b[0m` : s)
const dim = (s) => (useColor ? `\x1b[2m${s}\x1b[0m` : s)

function displayPath(r, root) {
  if (r.level === 'project') {
    const rel = path.relative(root, r.path)
    if (rel && !rel.startsWith('..')) return rel.split(path.sep).join('/')
    return r.path
  }
  let p = r.path
  if (HOME && (p === HOME || p.startsWith(HOME + path.sep))) p = `~${p.slice(HOME.length)}`
  return p
}

export function sortResults(results, toolRank) {
  const levelRank = { project: 0, user: 1, system: 2 }
  return results.sort((a, b) => {
    const l = levelRank[a.level] - levelRank[b.level]
    if (l !== 0) return l
    const t = (toolRank.get(a.tool) ?? 999) - (toolRank.get(b.tool) ?? 999)
    if (t !== 0) return t
    return a.path.localeCompare(b.path)
  })
}

export function renderTerminal(data) {
  const { results, root, all, envRelocations, version } = data
  const foundCount = results.filter((r) => r.found).length
  const lines = []
  lines.push(bold(`find-ai-configs v${version} — AI provider/model config locations`))
  const levelNames = data.levels.length ? data.levels.join(', ') : 'none'
  lines.push(dim(`scan root: ${root} · platform: ${PLATFORM} · levels: ${levelNames}`))
  if (envRelocations.length) {
    lines.push(dim(`active relocations: ${envRelocations.map((r) => `${r.var}=${r.value}`).join(', ')}`))
  }
  lines.push('')

  for (const level of LEVEL_ORDER) {
    const levelResults = results.filter((r) => r.level === level)
    if (!levelResults.length) {
      if (data.levels.includes(level)) {
        const rootInfo = level === 'project' ? ` (${root})` : ''
        lines.push(bold(`${LEVEL_TITLE[level]}${rootInfo}`))
        lines.push(dim('  (none found)'))
        lines.push('')
      }
      continue
    }
    const found = levelResults.filter((r) => r.found).length
    const rootInfo = level === 'project' ? ` (${root})` : ''
    lines.push(bold(`${LEVEL_TITLE[level]}${rootInfo} — ${found} found`))
    let currentTool = null
    for (const r of levelResults) {
      if (r.tool !== currentTool) {
        currentTool = r.tool
        const tool = data.toolNotes.get(r.tool)
        lines.push(`  ${bold(r.toolName)}${tool ? dim(` — ${tool}`) : ''}`)
      }
      const parts = [`    ${displayPath(r, root)}`]
      if (r.via) parts.push(dim(`(via ${r.via})`))
      if (KIND_LABEL[r.kind]) parts.push(dim(`[${KIND_LABEL[r.kind]}]`))
      const details = []
      if (r.note) details.push(r.note)
      details.push(...r.annotations)
      if (!r.found) details.unshift('not found')
      if (details.length) parts.push(details.join(dim(' · ')))
      lines.push(r.found ? parts.join('  ') : dim(parts.join('  ')))
    }
    lines.push('')
  }

  const missing = results.length - foundCount
  const missingInfo = all && missing > 0 ? `, ${missing} not found` : ''
  lines.push(dim(`${foundCount} location${foundCount === 1 ? '' : 's'} found${missingInfo} — secret values are never printed`))
  return lines.join('\n')
}

export function renderJson(data) {
  const { version, root, levels, envRelocations, results } = data
  return JSON.stringify(
    {
      version,
      generatedAt: new Date().toISOString(),
      platform: PLATFORM,
      scanRoot: root,
      levels,
      envRelocations,
      results,
    },
    null,
    2,
  )
}
