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

export function buildCommand(kind: Kind, opts: BuildOptions): string {
  const meta = META[kind];
  const tools = opts.tool.length > 0 ? opts.tool.join(',') : meta.tools.join(',');

  if (opts.platform === 'windows') {
    const parts = [`pwsh ${meta.scriptPs1} -Tool ${tools}`];
    if (opts.scope === 'global') {
      parts.push('-Global');
    } else {
      const target = opts.target?.trim() || 'C:\\path\\to\\project';
      parts.push(`-Target ${target}`);
    }
    return parts.join(' ');
  }

  const parts = [`bash ${meta.scriptBash} --tool ${tools}`];
  if (opts.scope === 'global') {
    parts.push('--global');
  } else {
    const target = opts.target?.trim() || '/path/to/project';
    parts.push(`--target ${target}`);
  }
  return parts.join(' ');
}
