import os from 'node:os'
import path from 'node:path'

function safeJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

const fakeEnv = safeJson(process.env.AICF_FAKE_ENV_JSON || '{}')

export function getenv(name) {
  if (Object.prototype.hasOwnProperty.call(fakeEnv, name)) return fakeEnv[name]
  return process.env[name]
}

export const PLATFORM = process.env.AICF_FAKE_PLATFORM || process.platform
export const HOME = process.env.AICF_FAKE_HOME || os.homedir()
export const XDG_CONFIG = getenv('XDG_CONFIG_HOME') || path.join(HOME, '.config')
export const XDG_DATA = getenv('XDG_DATA_HOME') || path.join(HOME, '.local', 'share')
export const XDG_CACHE = getenv('XDG_CACHE_HOME') || path.join(HOME, '.cache')

function vscodeConfigRoot(app) {
  if (PLATFORM === 'darwin') return path.join(HOME, 'Library', 'Application Support', app)
  if (PLATFORM === 'win32') {
    return path.join(getenv('APPDATA') || path.join(HOME, 'AppData', 'Roaming'), app)
  }
  return path.join(XDG_CONFIG, app)
}

export function resolveBase(base) {
  switch (base) {
    case 'home':
      return HOME
    case 'xdgConfig':
      return XDG_CONFIG
    case 'xdgData':
      return XDG_DATA
    case 'xdgCache':
      return XDG_CACHE
    case 'appData':
      return getenv('APPDATA') || path.join(HOME, 'AppData', 'Roaming')
    case 'programData':
      return getenv('ProgramData') || 'C:\\ProgramData'
    case 'programFiles':
      return getenv('ProgramFiles') || 'C:\\Program Files'
    case 'appSupport':
      return path.join(HOME, 'Library', 'Application Support')
    case '/':
      return '/'
    default:
      if (base.startsWith('vscode:')) return vscodeConfigRoot(base.slice(7))
      return base
  }
}

export const RELOCATION_VARS = [
  'CLAUDE_CONFIG_DIR',
  'CODEX_HOME',
  'GEMINI_CLI_HOME',
  'COPILOT_HOME',
  'OPENCODE_CONFIG',
  'OPENCODE_CONFIG_DIR',
  'GOOSE_PATH_ROOT',
  'KIRO_HOME',
  'CURSOR_CONFIG_DIR',
  'CLINE_DATA_DIR',
  'KILO_CONFIG',
  'KILO_CONFIG_DIR',
  'OLLAMA_MODELS',
  'HF_HOME',
  'HF_TOKEN_PATH',
  'XDG_CONFIG_HOME',
  'XDG_DATA_HOME',
]

export function activeRelocations() {
  return RELOCATION_VARS.filter((v) => getenv(v)).map((v) => ({ var: v, value: getenv(v) }))
}
