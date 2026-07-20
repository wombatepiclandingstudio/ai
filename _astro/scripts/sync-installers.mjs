// Build-time step:
// 1. Copy the canonical repo-root installers into _astro/public/ so the public copies
//    never drift from the source of truth.
// 2. Assert that the tool lists hardcoded in src/lib/build-install-cmd.ts match the
//    TOOL_PATHS keys declared in the installers. Fails the build on mismatch.
import { copyFile, readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const pairs = [
  ['install-skill.sh', 'install-skill.sh'],
  ['install-skill.ps1', 'install-skill.ps1'],
  ['install-agent.sh', 'install-agent.sh'],
  ['install-agent.ps1', 'install-agent.ps1'],
];

for (const [src, dest] of pairs) {
  const from = resolve(root, src);
  const to = resolve(root, '_astro', 'public', dest);
  try {
    await access(from);
  } catch {
    console.error(`[sync-installers] source not found: ${from}`);
    process.exit(1);
  }
  await copyFile(from, to);
  console.log(`[sync-installers] copied ${src} -> public/${dest}`);
}

function keysFromBash(src) {
  // Match: [claude]=".claude/skills"
  const re = /^\s*\[([a-z0-9]+)\]=/gm;
  const out = new Set();
  let m;
  while ((m = re.exec(src))) out.add(m[1]);
  return out;
}

const ts = await readFile(resolve(root, '_astro', 'src', 'lib', 'build-install-cmd.ts'), 'utf-8');
function tsArray(name) {
  const re = new RegExp(`const ${name}: ToolKey\\[\\] = \\[([\\s\\S]*?)\\];`);
  const block = ts.match(re);
  if (!block) return new Set();
  return new Set(
    block[1]
      .split(',')
      .map((s) => s.trim().replace(/'/g, ''))
      .filter(Boolean)
  );
}

const skillBash = await readFile(resolve(root, 'install-skill.sh'), 'utf-8');
const agentBash = await readFile(resolve(root, 'install-agent.sh'), 'utf-8');

const skillKeys = keysFromBash(skillBash);
const agentKeys = keysFromBash(agentBash);
const skillTs = tsArray('SKILL_TOOLS');
const agentTs = tsArray('AGENT_TOOLS');

function diff(a, b) {
  return [...a].filter((x) => !b.has(x));
}

const problems = [];
const sOnly = diff(skillTs, skillKeys);
const sMissing = diff(skillKeys, skillTs);
if (sOnly.length || sMissing.length)
  problems.push(
    `SKILL_TOOLS mismatch — in TS not installer: [${sOnly}], in installer not TS: [${sMissing}]`
  );
const aOnly = diff(agentTs, agentKeys);
const aMissing = diff(agentKeys, agentTs);
if (aOnly.length || aMissing.length)
  problems.push(
    `AGENT_TOOLS mismatch — in TS not installer: [${aOnly}], in installer not TS: [${aMissing}]`
  );

if (problems.length) {
  console.error('[sync-installers] tool list drift detected:');
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log('[sync-installers] tool lists match installers.');
