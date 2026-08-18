const e = (base, rel, kind, note = '', extra = {}) => ({ base, rel, kind, note, ...extra })

export const TOOLS = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    docs: 'https://code.claude.com/docs/en/settings',
    user: [
      e('home', ['.claude', 'settings.json'], 'model-config', 'model + provider env settings', {
        envDir: { var: 'CLAUDE_CONFIG_DIR', rel: ['settings.json'] },
      }),
      e('home', ['.claude.json'], 'state', 'account + per-project state'),
    ],
    project: [
      { segments: ['.claude', 'settings.json'], kind: 'model-config' },
      { segments: ['.claude', 'settings.local.json'], kind: 'model-config', note: 'personal, usually gitignored' },
      { segments: ['.mcp.json'], kind: 'mcp', note: 'MCP servers only' },
    ],
    system: {
      darwin: [
        e('appSupport', ['ClaudeCode', 'managed-settings.json'], 'policy', 'enterprise-managed settings'),
        e('appSupport', ['ClaudeCode', 'managed-settings.d'], 'policy', 'managed drop-in dir', { dir: true }),
      ],
      linux: [
        e('/', ['etc', 'claude-code', 'managed-settings.json'], 'policy', 'enterprise-managed settings'),
        e('/', ['etc', 'claude-code', 'managed-settings.d'], 'policy', 'managed drop-in dir', { dir: true }),
      ],
      win32: [
        e('programFiles', ['ClaudeCode', 'managed-settings.json'], 'policy', 'enterprise-managed settings'),
      ],
    },
  },
  {
    id: 'codex',
    name: 'Codex CLI',
    docs: 'https://developers.openai.com/codex/config-reference',
    user: [
      e('home', ['.codex', 'config.toml'], 'model-config', 'model, model_provider, [model_providers.*]', {
        envDir: { var: 'CODEX_HOME', rel: ['config.toml'] },
      }),
      e('home', ['.codex', 'auth.json'], 'state', 'auth credentials', {
        envDir: { var: 'CODEX_HOME', rel: ['auth.json'] },
      }),
    ],
    project: [
      { segments: ['.codex', 'config.toml'], kind: 'model-config', note: 'provider/model keys are ignored in project files (user-level only)' },
    ],
    system: {
      linux: [e('/', ['etc', 'codex', 'config.toml'], 'model-config', 'system-wide defaults (lowest precedence)')],
    },
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    docs: 'https://google-gemini.github.io/gemini-cli/docs/get-started/configuration.html',
    user: [
      e('home', ['.gemini', 'settings.json'], 'model-config', 'model.name + auth settings', {
        envDir: { var: 'GEMINI_CLI_HOME', rel: ['.gemini', 'settings.json'] },
      }),
      e('home', ['.gemini', 'oauth_creds.json'], 'state', 'OAuth credentials'),
      e('home', ['.env'], 'env', 'auto-loaded .env (also read by many other tools)'),
    ],
    project: [
      { segments: ['.gemini', 'settings.json'], kind: 'model-config', note: 'overrides user settings' },
    ],
    system: {
      darwin: [
        e('appSupport', ['GeminiCli', 'system-defaults.json'], 'policy', 'system defaults'),
        e('appSupport', ['GeminiCli', 'settings.json'], 'policy', 'system overrides'),
      ],
      linux: [
        e('/', ['etc', 'gemini-cli', 'system-defaults.json'], 'policy', 'system defaults'),
        e('/', ['etc', 'gemini-cli', 'settings.json'], 'policy', 'system overrides'),
      ],
      win32: [
        e('programData', ['gemini-cli', 'system-defaults.json'], 'policy', 'system defaults'),
        e('programData', ['gemini-cli', 'settings.json'], 'policy', 'system overrides'),
      ],
    },
  },
  {
    id: 'copilot-cli',
    name: 'GitHub Copilot CLI',
    docs: 'https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference',
    user: [
      e('home', ['.copilot', 'settings.json'], 'model-config', 'model + per-subagent models', {
        envDir: { var: 'COPILOT_HOME', rel: ['settings.json'] },
      }),
      e('home', ['.copilot', 'config.json'], 'state', 'auto-managed state (auth, plugins)', {
        envDir: { var: 'COPILOT_HOME', rel: ['config.json'] },
      }),
      e('home', ['.copilot', 'mcp-config.json'], 'mcp', 'MCP servers', {
        envDir: { var: 'COPILOT_HOME', rel: ['mcp-config.json'] },
      }),
    ],
    project: [
      { segments: ['.github', 'copilot', 'settings.json'], kind: 'model-config', note: 'committed; can pin the repo model' },
      { segments: ['.github', 'copilot', 'settings.local.json'], kind: 'model-config', note: 'gitignored' },
      { segments: ['.vscode', 'mcp.json'], kind: 'mcp', note: 'VS Code Copilot MCP' },
    ],
    system: {
      darwin: [
        e('appSupport', ['GitHubCopilot', 'managed-settings.json'], 'policy', 'MDM-managed settings'),
      ],
      linux: [
        e('/', ['etc', 'github-copilot', 'managed-settings.json'], 'policy', 'MDM-managed settings'),
      ],
      win32: [
        e('programFiles', ['GitHubCopilot', 'managed-settings.json'], 'policy', 'MDM-managed settings'),
      ],
    },
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    docs: 'https://opencode.ai/docs/config/',
    user: [
      e('xdgConfig', ['opencode', 'opencode.json'], 'model-config', 'model, provider map, disabled_providers', {
        envFile: { var: 'OPENCODE_CONFIG' },
      }),
      e('xdgConfig', ['opencode', 'opencode.jsonc'], 'model-config', 'jsonc variant', {
        envFile: { var: 'OPENCODE_CONFIG' },
      }),
    ],
    project: [
      { file: 'opencode.json', kind: 'model-config' },
      { file: 'opencode.jsonc', kind: 'model-config' },
      { segments: ['.opencode', 'opencode.json'], kind: 'model-config' },
      { segments: ['.opencode', 'opencode.jsonc'], kind: 'model-config' },
    ],
    system: {
      darwin: [
        e('appSupport', ['opencode', 'opencode.json'], 'policy', 'managed settings'),
        e('appSupport', ['opencode', 'opencode.jsonc'], 'policy', 'managed settings'),
      ],
      linux: [
        e('/', ['etc', 'opencode', 'opencode.json'], 'policy', 'managed settings'),
        e('/', ['etc', 'opencode', 'opencode.jsonc'], 'policy', 'managed settings'),
      ],
      win32: [
        e('programData', ['opencode', 'opencode.json'], 'policy', 'managed settings'),
        e('programData', ['opencode', 'opencode.jsonc'], 'policy', 'managed settings'),
      ],
    },
  },
  {
    id: 'kilo-code',
    name: 'Kilo Code',
    docs: 'https://kilo.ai/docs/getting-started/settings',
    user: [
      e('xdgConfig', ['kilo', 'kilo.jsonc'], 'model-config', 'model, provider map (deep-merges legacy names)', {
        envFile: { var: 'KILO_CONFIG' },
        envDir: { var: 'KILO_CONFIG_DIR', rel: ['kilo.jsonc'] },
      }),
      e('xdgConfig', ['kilo', 'kilo.json'], 'model-config', 'merged if present'),
      e('xdgConfig', ['kilo', 'opencode.json'], 'model-config', 'legacy name'),
      e('xdgConfig', ['kilo', 'opencode.jsonc'], 'model-config', 'legacy name'),
      e('xdgData', ['kilo', 'auth.json'], 'state', 'credentials (mode 0600)'),
      e('vscode:Code', ['User', 'globalStorage', 'kilocode.kilo-code', 'settings', 'mcp_settings.json'], 'mcp', 'legacy extension storage (EOL 2026-07-31)'),
    ],
    project: [
      { file: 'kilo.jsonc', kind: 'model-config' },
      { file: 'kilo.json', kind: 'model-config' },
      { segments: ['.kilo', 'kilo.jsonc'], kind: 'model-config' },
      { segments: ['.kilo', 'kilo.json'], kind: 'model-config' },
      { segments: ['.kilo', 'tui.json'], kind: 'ui' },
    ],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    docs: 'https://cursor.com/docs/mcp',
    note: 'model selection & BYOK keys are managed via the Settings UI / team dashboard',
    user: [
      e('home', ['.cursor', 'mcp.json'], 'mcp', 'global MCP', {
        envDir: { var: 'CURSOR_CONFIG_DIR', rel: ['mcp.json'] },
      }),
      e('home', ['.cursor', 'cli-config.json'], 'settings', 'Cursor CLI config', {
        envDir: { var: 'CURSOR_CONFIG_DIR', rel: ['cli-config.json'] },
      }),
      e('home', ['.cursor', 'permissions.json'], 'policy', 'mcpAllowlist (enterprise)', {
        envDir: { var: 'CURSOR_CONFIG_DIR', rel: ['permissions.json'] },
      }),
      e('vscode:Cursor', ['User', 'settings.json'], 'editor-settings', 'editor settings (model keys not documented here)'),
    ],
    project: [
      { segments: ['.cursor', 'mcp.json'], kind: 'mcp' },
      { segments: ['.cursor', 'cli.json'], kind: 'settings', note: 'CLI permissions' },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    docs: 'https://docs.windsurf.com/windsurf/cascade/mcp',
    note: 'model config is UI-managed; config_config.json is undocumented/community-known',
    user: [
      e('home', ['.codeium', 'windsurf', 'mcp_config.json'], 'mcp', 'global MCP'),
      e('home', ['.codeium', 'windsurf', 'config_config.json'], 'editor-settings', 'model/provider selection (undocumented)'),
      e('vscode:Windsurf', ['User', 'settings.json'], 'editor-settings'),
    ],
    project: [
      { segments: ['.windsurf', 'mcp_config.json'], kind: 'mcp', note: 'officially MCP is global-only' },
    ],
  },
  {
    id: 'cline',
    name: 'Cline',
    docs: 'https://docs.cline.bot/getting-started/config',
    note: 'project-level config is rules-only; IDE-install API keys live in VS Code SecretStorage (OS keychain)',
    user: [
      e('home', ['.cline', 'data', 'settings', 'providers.json'], 'model-config', 'API keys + provider/model config (values redacted)', {
        envDir: { var: 'CLINE_DATA_DIR', rel: ['settings', 'providers.json'] },
      }),
      e('home', ['.cline', 'data', 'settings', 'global-settings.json'], 'settings', 'global behavior settings', {
        envDir: { var: 'CLINE_DATA_DIR', rel: ['settings', 'global-settings.json'] },
      }),
      e('home', ['.cline', 'mcp.json'], 'mcp', 'CLI MCP'),
      e('vscode:Code', ['User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'], 'mcp', 'legacy IDE storage'),
    ],
    project: [],
  },
  {
    id: 'roo-code',
    name: 'Roo Code',
    docs: 'https://roocodeinc.github.io/Roo-Code/',
    note: 'provider profiles & API keys are stored in VS Code SecretStorage, not files; extension shut down 2026-05',
    user: [
      e('vscode:Code', ['User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'mcp_settings.json'], 'mcp', 'global MCP'),
      e('vscode:Code', ['User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'custom_modes.yaml'], 'modes'),
    ],
    project: [
      { segments: ['.roo', 'mcp.json'], kind: 'mcp' },
      { segments: ['.roomodes'], kind: 'modes' },
    ],
  },
  {
    id: 'continue',
    name: 'Continue',
    docs: 'https://docs.continue.dev/customize/deep-dives/configuration',
    user: [
      e('home', ['.continue', 'config.yaml'], 'model-config', 'models, mcpServers, rules'),
      e('home', ['.continue', 'config.json'], 'model-config', 'legacy JSON config'),
    ],
    project: [
      { segments: ['.continue', 'config.yaml'], kind: 'model-config', note: 'real provider/model config (overrides global)' },
      { segments: ['.continue', 'config.json'], kind: 'model-config', note: 'legacy' },
    ],
  },
  {
    id: 'goose',
    name: 'Goose',
    docs: 'https://github.com/block/goose/blob/main/documentation/docs/guides/config-files.md',
    note: 'API keys normally live in the OS keyring; .goosehints is prompt-only (no project provider config)',
    user: [
      e('xdgConfig', ['goose', 'config.yaml'], 'model-config', 'active_provider + per-provider model', {
        envDir: { var: 'GOOSE_PATH_ROOT', rel: ['config', 'config.yaml'] },
        only: ['darwin', 'linux'],
      }),
      e('xdgConfig', ['goose', 'secrets.yaml'], 'secrets', 'API keys when keyring is disabled', {
        envDir: { var: 'GOOSE_PATH_ROOT', rel: ['config', 'secrets.yaml'] },
        only: ['darwin', 'linux'],
      }),
      e('appData', ['Block', 'goose', 'config', 'config.yaml'], 'model-config', '', { only: ['win32'] }),
      e('appData', ['Block', 'goose', 'config', 'secrets.yaml'], 'secrets', '', { only: ['win32'] }),
    ],
    project: [],
  },
  {
    id: 'amp',
    name: 'Amp',
    docs: 'https://ampcode.com/manual/configuration.md',
    note: 'no provider/model keys — Amp serves its own hosted models via account login',
    user: [
      e('xdgConfig', ['amp', 'settings.json'], 'settings', 'behavior settings (amp.* keys)'),
      e('xdgConfig', ['amp', 'settings.jsonc'], 'settings', 'behavior settings (amp.* keys)'),
    ],
    project: [
      { segments: ['.amp', 'settings.json'], kind: 'settings' },
      { segments: ['.amp', 'settings.jsonc'], kind: 'settings' },
    ],
    system: {
      darwin: [e('appSupport', ['ampcode', 'managed-settings.json'], 'policy', 'enterprise-deployed settings')],
      linux: [e('/', ['etc', 'ampcode', 'managed-settings.json'], 'policy', 'enterprise-deployed settings')],
      win32: [e('programData', ['ampcode', 'managed-settings.json'], 'policy', 'enterprise-deployed settings')],
    },
  },
  {
    id: 'kiro',
    name: 'Kiro',
    docs: 'https://kiro.dev/docs/reference/settings/',
    user: [
      e('home', ['.kiro', 'settings', 'cli.json'], 'model-config', 'chat.defaultModel / chat.modelDefaults', {
        envDir: { var: 'KIRO_HOME', rel: ['settings', 'cli.json'] },
      }),
      e('home', ['.kiro', 'settings', 'mcp.json'], 'mcp', 'MCP servers', {
        envDir: { var: 'KIRO_HOME', rel: ['settings', 'mcp.json'] },
      }),
    ],
    project: [
      { segments: ['.kiro', 'settings', 'cli.json'], kind: 'model-config', note: 'workspace model/effort defaults' },
      { segments: ['.kiro', 'settings', 'mcp.json'], kind: 'mcp' },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    docs: 'https://docs.ollama.com/faq',
    user: [
      e('home', ['.ollama'], 'data', 'runtime home: models (blobs+manifests), keys, server.json', { dir: true }),
      e('home', ['.ollama', 'server.json'], 'settings', 'server settings'),
      e('home', ['.ollama', 'models'], 'models', 'model registry (manifests/)', {
        dir: true,
        envDir: { var: 'OLLAMA_MODELS', rel: [] },
      }),
    ],
    system: {
      linux: [e('/', ['usr', 'share', 'ollama', '.ollama'], 'data', 'systemd service user home', { dir: true })],
    },
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    docs: 'https://lmstudio.ai/docs/app/advanced/import-model',
    user: [
      e('home', ['.lmstudio'], 'data', 'app home: models/, extensions/, conversations/', { dir: true }),
      e('home', ['.lmstudio', 'models'], 'models', 'downloaded models', { dir: true }),
      e('home', ['.lmstudio-home-pointer'], 'pointer', 'redirects the home dir when moved'),
      e('xdgCache', ['lm-studio'], 'data', 'legacy 0.2.x location', { dir: true }),
    ],
    project: [],
  },
  {
    id: 'litellm',
    name: 'LiteLLM',
    docs: 'https://docs.litellm.ai/docs/proxy/config_settings',
    note: 'no default user config — the proxy takes --config <file>; DB mode stores models in Postgres',
    user: [],
    project: [
      { file: 'litellm_config.yaml', kind: 'model-config', note: 'model_list + provider api_key refs' },
      { file: 'litellm_config.yml', kind: 'model-config', note: 'model_list + provider api_key refs' },
    ],
  },
  {
    id: 'aider',
    name: 'Aider',
    docs: 'https://aider.chat/docs/config/aider_conf.html',
    user: [
      e('home', ['.aider.conf.yml'], 'model-config', 'model, weak-model, api keys (redacted)'),
      e('home', ['.aider.model.settings.yml'], 'model-config', 'per-model overrides'),
      e('home', ['.aider.model.metadata.json'], 'model-config', 'token-cost metadata'),
    ],
    project: [
      { file: '.aider.conf.yml', kind: 'model-config' },
      { file: '.aider.model.settings.yml', kind: 'model-config' },
      { file: '.aider.model.metadata.json', kind: 'model-config' },
    ],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    docs: 'https://huggingface.co/docs/huggingface_hub/package_reference/environment_variables',
    user: [
      e('xdgCache', ['huggingface', 'token'], 'state', 'hf auth token', {
        envFile: { var: 'HF_TOKEN_PATH' },
        envDir: { var: 'HF_HOME', rel: ['token'] },
      }),
      e('xdgCache', ['huggingface', 'hub'], 'models', 'model/dataset cache (models--org--name)', {
        dir: true,
        envDir: { var: 'HF_HOME', rel: ['hub'] },
      }),
      e('home', ['.huggingface', 'token'], 'state', 'legacy pre-2023 location'),
    ],
    project: [],
  },
  {
    id: 'jan',
    name: 'Jan',
    docs: 'https://www.jan.ai/docs/desktop/data-folder',
    user: [
      e('appSupport', ['Jan', 'data'], 'data', 'Jan data folder: models/ (model.yml), assistants/, threads/', { dir: true, only: ['darwin'] }),
      e('xdgData', ['Jan', 'data'], 'data', 'Jan data folder: models/ (model.yml), assistants/, threads/', { dir: true, only: ['linux'] }),
      e('xdgConfig', ['Jan', 'data'], 'data', 'legacy docs location', { dir: true, only: ['linux'] }),
      e('appData', ['Jan', 'data'], 'data', 'Jan data folder: models/ (model.yml), assistants/, threads/', { dir: true, only: ['win32'] }),
    ],
    project: [],
  },
  {
    id: 'generic',
    name: 'Generic (.env)',
    note: 'dotenv convention — many tools read these for provider API keys',
    user: [],
    project: [
      { file: '.env', kind: 'env', note: 'provider API keys possible — names only, values never shown' },
    ],
  },
]

export const TOOL_INDEX = new Map(TOOLS.map((t) => [t.id, t]))
