// Builds install commands that mirror the repo-root install-skill.sh / install-agent.sh
// CLIs exactly (same flag names), driven by user-chosen parameters in the modal.

export type ToolKey =
  | 'claude'
  | 'codex'
  | 'cursor'
  | 'kilocode'
  | 'opencode'
  | 'kiro'
  | 'cline'
  | 'gemini'
  | 'kilo'
  | 'roo'
  | 'goose'
  | 'copilot'
  | 'vscode';

export type Kind = 'skill' | 'agent';
export type Platform = 'unix' | 'windows';
export type Scope = 'project' | 'global';

export interface BuildOptions {
  tool: ToolKey[];
  scope: Scope;
  platform: Platform;
  target?: string;
}

interface KindMeta {
  scriptBash: string;
  scriptPs1: string;
  tools: ToolKey[];
}

const SKILL_TOOLS: ToolKey[] = [
  'claude',
  'codex',
  'cursor',
  'kilocode',
  'opencode',
  'kiro',
  'cline',
  'gemini',
  'kilo',
  'roo',
  'goose',
  'copilot',
  'vscode',
];

const AGENT_TOOLS: ToolKey[] = [
  'claude',
  'opencode',
  'copilot',
  'kiro',
  'gemini',
  'kilocode',
  'kilo',
  'roo',
  'cline',
  'goose',
  'vscode',
];

export function toolsForKind(kind: Kind): ToolKey[] {
  return kind === 'skill' ? SKILL_TOOLS : AGENT_TOOLS;
}

const META: Record<Kind, KindMeta> = {
  skill: { scriptBash: 'install-skill.sh', scriptPs1: 'install-skill.ps1', tools: SKILL_TOOLS },
  agent: { scriptBash: 'install-agent.sh', scriptPs1: 'install-agent.ps1', tools: AGENT_TOOLS },
};

// Single-quote a Unix path, escaping any embedded single quotes via the
// 'foo'\''bar' shell idiom so user input cannot break out of the quotes.
function quoteUnix(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

// Double-quote a PowerShell path, escaping embedded double quotes by doubling them.
function quoteWindows(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

// The installers are served from the site root. Resolve the base URL at runtime so
// the generated command works both on the deployed site and on a local preview.
function publicBaseUrl(): string {
  if (typeof window === 'undefined') return 'https://ai.wombatepiclanding.studio';
  return `${window.location.origin}`;
}

export function buildCommand(kind: Kind, opts: BuildOptions): string {
  const meta = META[kind];
  const tools = opts.tool.length > 0 ? opts.tool.join(',') : meta.tools.join(',');
  const base = publicBaseUrl();
  const url = `${base}/${meta.scriptBash}`;

  if (opts.platform === 'windows') {
    const parts = [
      `irm ${quoteWindows(url)} -OutFile install-${meta.scriptPs1}`,
      `pwsh .\\install-${meta.scriptPs1} -Tool ${tools}`,
    ];
    if (opts.scope === 'global') {
      parts[1] += ' -Global';
    } else {
      const target = opts.target?.trim() || 'C:\\path\\to\\project';
      parts[1] += ` -Target ${quoteWindows(target)}`;
    }
    return parts.join('\n');
  }

  const parts = [
    `curl -fsSL ${url} -o /tmp/${meta.scriptBash}`,
    `bash /tmp/${meta.scriptBash} --tool ${tools}`,
  ];
  if (opts.scope === 'global') {
    parts[1] += ' --global';
  } else {
    const target = opts.target?.trim() || '/path/to/project';
    parts[1] += ` --target ${quoteUnix(target)}`;
  }
  return parts.join('\n');
}
