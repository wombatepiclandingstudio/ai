import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

// This Astro project lives in `_astro/`, so the repo root is one level up.
const REPO_ROOT = join(process.cwd(), '..');

export const SKILLS_DIR = join(REPO_ROOT, 'skills');
export const AGENTS_DIR = join(REPO_ROOT, 'agents');

export interface Frontmatter {
  name?: string;
  description?: string;
  version?: string;
  license?: string;
  author?: string;
  model?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface ContentItem {
  slug: string;
  name: string;
  description: string;
  version?: string;
  license?: string;
  author?: string;
  model?: string;
  tags: string[];
  body: string;
  readme: string;
}

function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    return { data: {}, content: raw };
  }
  let data: Frontmatter = {};
  try {
    data = (parseYaml(match[1]) as Frontmatter) ?? {};
  } catch {
    data = {};
  }
  return { data, content: match[2] };
}

function summarize(text: string, max = 220): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

async function readDirSafe(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function buildItem(
  dir: string,
  slug: string,
  primaryFile: string
): Promise<ContentItem | null> {
  const base = join(dir, slug);
  const primaryPath = join(base, primaryFile);
  if (!existsSync(primaryPath)) return null;

  const raw = await readFile(primaryPath, 'utf-8');
  const { data, content } = parseFrontmatter(raw);
  const readme = await readFile(join(base, 'README.md'), 'utf-8').catch(() => '');

  return {
    slug,
    name: data.name ?? slug,
    description: data.description ? summarize(String(data.description)) : summarize(content),
    version: data.version ? String(data.version) : undefined,
    license: data.license ? String(data.license) : undefined,
    author: data.author ? String(data.author) : undefined,
    model: data.model ? String(data.model) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    body: content.trim(),
    readme: readme.trim(),
  };
}

export async function getSkills(): Promise<ContentItem[]> {
  const names = await readDirSafe(SKILLS_DIR);
  const items = await Promise.all(
    names.map((n) => buildItem(SKILLS_DIR, n, 'SKILL.md'))
  );
  return items.filter((i): i is ContentItem => i !== null);
}

export async function getAgents(): Promise<ContentItem[]> {
  const names = await readDirSafe(AGENTS_DIR);
  const items = await Promise.all(
    names.map((n) => buildItem(AGENTS_DIR, n, `${n}.md`))
  );
  return items.filter((i): i is ContentItem => i !== null);
}
