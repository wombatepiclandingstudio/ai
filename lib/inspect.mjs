import fs from 'node:fs'
import path from 'node:path'

const MAX_BYTES = 2_000_000
const SECRET_KEY_RE = /api[-_]?key|apikey|token|secret|password|credential|^key$|auth/i
const SECRET_VALUE_RE = /^(sk-|sk_|ghp_|github_pat_|gsk_|hf_|xai-|AIza|or-|r8_|gl-|cop_)/
const MODEL_KEYS = new Set([
  'model',
  'small_model',
  'weak_model',
  'default_model',
  'defaultModel',
  'model_provider',
  'modelProvider',
  'active_provider',
  'activeProvider',
  'weak-model',
])
const PROVIDER_OBJ_KEYS = new Set(['provider', 'providers', 'model_providers'])
const ENV_NAME_RE = /API_?KEY|_KEY\b|^KEY\b|_TOKEN\b|^TOKEN\b|SECRET|PASSWORD|_CREDENTIAL/i
const ENV_PREFIX_RE =
  /^(ANTHROPIC|OPENAI|GEMINI|GOOGLE|OPENROUTER|GROQ|MISTRAL|DEEPSEEK|XAI|TOGETHER|FIREWORKS|AZURE|AWS|BEDROCK|VERTEX|GOOSE|AIDER|HF|OLLAMA|COHERE|PERPLEXITY|GITHUB|COPILOT|CODEX|CLAUDE|KILO|AMP|CONTINUE|LMSTUDIO|LM_STUDIO|WINDSURF|CODEIUM|CURSOR|ROO|CLINE|HUGGING)/i

function trunc(s, n = 60) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

function isProviderEnvName(name) {
  return ENV_NAME_RE.test(name) || ENV_PREFIX_RE.test(name)
}

export function inspectFile(absPath) {
  try {
    const st = fs.statSync(absPath)
    if (!st.isFile()) return []
    if (st.size > MAX_BYTES) return ['file too large to inspect']
    const text = fs.readFileSync(absPath, 'utf8')
    return inspectText(absPath, text)
  } catch {
    return ['unreadable']
  }
}

function inspectText(p, text) {
  const name = path.basename(p)
  if (name === '.env' || name.endsWith('.env')) return inspectEnv(text)
  if (/\.(json|jsonc)$/i.test(name)) {
    const parsed = parseJsonc(text)
    return parsed === undefined ? ['unparseable JSON'] : collectJson(parsed)
  }
  if (/\.toml$/i.test(name)) return inspectToml(text)
  if (/\.(ya?ml)$/i.test(name)) return inspectYaml(text)
  return []
}

function stripJsonc(text) {
  let out = ''
  let i = 0
  let inStr = false
  while (i < text.length) {
    const ch = text[i]
    if (inStr) {
      out += ch
      if (ch === '\\') {
        out += text[i + 1] ?? ''
        i += 2
        continue
      }
      if (ch === '"') inStr = false
      i += 1
      continue
    }
    if (ch === '"') {
      inStr = true
      out += ch
      i += 1
      continue
    }
    if (ch === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i += 1
      continue
    }
    if (ch === '/' && text[i + 1] === '*') {
      i += 2
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i += 1
      i += 2
      continue
    }
    if (ch === ',') {
      let j = i + 1
      while (j < text.length && /\s/.test(text[j])) j += 1
      if (text[j] === '}' || text[j] === ']') {
        i += 1
        continue
      }
    }
    out += ch
    i += 1
  }
  return out
}

function parseJsonc(text) {
  try {
    return JSON.parse(stripJsonc(text))
  } catch {
    return undefined
  }
}

function collectJson(root) {
  const out = []
  const push = (s) => {
    if (out.length < 12 && !out.includes(s)) out.push(s)
  }
  const walk = (value, depth) => {
    if (depth > 6 || out.length >= 12) return
    if (Array.isArray(value)) {
      for (const item of value) walk(item, depth + 1)
      return
    }
    if (!value || typeof value !== 'object') return
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === 'string' || typeof v === 'number') {
        const str = String(v)
        if (SECRET_KEY_RE.test(k)) {
          push(`${k}: set (value redacted)`)
          continue
        }
        if (SECRET_VALUE_RE.test(str)) {
          push(`${k}: contains credential (redacted)`)
          continue
        }
        if (MODEL_KEYS.has(k)) push(`${k}: ${trunc(str)}`)
        continue
      }
      if (Array.isArray(v)) {
        if (k === 'disabled_providers' || k === 'enabled_providers') {
          push(`${k}: ${v.join(', ')}`)
          continue
        }
        walk(v, depth + 1)
        continue
      }
      if (v && typeof v === 'object') {
        if (k === 'model' && typeof v.name === 'string') {
          push(`model.name: ${trunc(v.name)}`)
          continue
        }
        if (k === 'env') {
          const names = Object.keys(v).filter(isProviderEnvName)
          if (names.length) push(`env: ${names.join(', ')}`)
          continue
        }
        if (PROVIDER_OBJ_KEYS.has(k)) {
          const ids = Object.keys(v)
          if (ids.length) {
            push(`${k}: ${ids.slice(0, 6).join(', ')}${ids.length > 6 ? ` (+${ids.length - 6} more)` : ''}`)
            for (const id of ids.slice(0, 6)) {
              const key = v[id]?.options?.apiKey ?? v[id]?.apiKey
              if (typeof key === 'string') {
                push(`${id} apiKey: ${key.startsWith('{env:') ? key : key.startsWith('os.environ/') ? key : '(set, redacted)'}`)
              }
            }
          }
          continue
        }
        walk(v, depth + 1)
      }
    }
  }
  walk(root, 0)
  return out
}

function inspectToml(text) {
  const out = []
  const m = text.match(/^\s*model\s*=\s*"([^"]+)"/m)
  if (m) out.push(`model: ${trunc(m[1])}`)
  const mp = text.match(/^\s*model_provider\s*=\s*"([^"]+)"/m)
  if (mp) out.push(`model_provider: ${trunc(mp[1])}`)
  const secs = [...text.matchAll(/^\[model_providers\.([A-Za-z0-9_.-]+)\]\s*$/gm)]
  if (secs.length) out.push(`model_providers: ${secs.map((s) => s[1]).join(', ')}`)
  for (const s of secs.slice(0, 6)) {
    const start = s.index + s[0].length
    const next = text.indexOf('[', start)
    const body = text.slice(start, next === -1 ? undefined : next)
    const bu = body.match(/^\s*base_url\s*=\s*"([^"]+)"/m)
    const ek = body.match(/^\s*env_key\s*=\s*"([^"]+)"/m)
    if (bu || ek) {
      out.push(`${s[1]}: ${bu ? `base_url ${trunc(bu[1])}` : ''}${bu && ek ? ' · ' : ''}${ek ? `key env ${ek[1]}` : ''}`)
    }
  }
  return out
}

function inspectYaml(text) {
  const out = []
  const lines = text.split(/\r?\n/)
  const modelNames = []
  const scalarRe = /^\s*(model|weak-model|weak_model|model_provider|active_provider|default_model|provider)\s*:\s*['"]?([^'"\s#]+)/
  const secretScalarRe = /^\s*([A-Za-z0-9_-]*(?:api[-_]key|token|secret)[A-Za-z0-9_-]*)\s*:\s*.+$/
  for (const line of lines) {
    const s = line.match(scalarRe)
    if (s) out.push(`${s[1]}: ${trunc(s[2])}`)
    const mn = line.match(/^\s*-\s*model_name\s*:\s*['"]?([^'"\s#]+)/)
    if (mn) modelNames.push(mn[1])
    const ak = line.match(/^\s*api_key\s*:\s*(.+)$/)
    if (ak) {
      const v = ak[1].trim().replace(/^['"]|['"]$/g, '')
      out.push(v.startsWith('os.environ/') ? `api_key: ${v}` : 'api_key: set (value redacted)')
      continue
    }
    const sec = line.match(secretScalarRe)
    if (sec) out.push(`${sec[1]}: set (value redacted)`)
  }
  if (modelNames.length) {
    out.push(`model_list: ${modelNames.slice(0, 6).join(', ')}${modelNames.length > 6 ? ` (+${modelNames.length - 6} more)` : ''}`)
  }
  const re = /^providers:\s*(#.*)?$/
  const pi = lines.findIndex((l) => re.test(l))
  if (pi !== -1) {
    const ids = []
    for (let i = pi + 1; i < lines.length; i += 1) {
      const l = lines[i]
      if (/^\S/.test(l) && l.trim() !== '') break
      const m = l.match(/^\s+([A-Za-z0-9_.-]+):\s*(?:[{}&#].*)?$/)
      if (m && !ids.includes(m[1])) ids.push(m[1])
    }
    if (ids.length) out.push(`providers: ${ids.join(', ')}`)
  }
  return out.slice(0, 12)
}

function inspectEnv(text) {
  const names = [...text.matchAll(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/gm)].map((m) => m[1])
  if (!names.length) return []
  const provider = names.filter(isProviderEnvName)
  if (provider.length) return [`provider env vars: ${provider.join(', ')}`]
  return [`${names.length} env vars (none provider-related)`]
}
