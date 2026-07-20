import { marked } from 'marked';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Configure a single marked instance that escapes any raw inline/block HTML in the
// source instead of passing it through. The skill/agent bodies are author-controlled
// docs, but escaping raw HTML prevents accidental or injected markup from becoming
// live DOM when we assign the result to innerHTML.
const renderer = new marked.Renderer();
renderer.html = (token: { text: string }) => escapeHtml(token.text);
marked.setOptions({ renderer, async: false });

export function renderMarkdown(src: string): string {
  return marked.parse(src) as string;
}

function initMdToggle(root: HTMLElement) {
  const article = root.querySelector<HTMLElement>('[data-md-article]')!;
  const sourceView = root.querySelector<HTMLElement>('[data-md-source-view]')!;
  const raw = article.dataset.mdSource ?? '';
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-md-mode]');

  article.innerHTML = renderMarkdown(raw);
  sourceView.textContent = raw;

  function setMode(mode: 'rendered' | 'source') {
    const isSource = mode === 'source';
    article.classList.toggle('hidden', isSource);
    sourceView.classList.toggle('hidden', !isSource);
    buttons.forEach((b) => {
      const active = b.dataset.mdMode === mode;
      b.classList.toggle('bg-indigo-500/20', active);
      b.classList.toggle('text-white', active);
      b.classList.toggle('text-slate-300', !active);
    });
  }

  buttons.forEach((b) =>
    b.addEventListener('click', () => setMode(b.dataset.mdMode as 'rendered' | 'source'))
  );
}

// Wire up every [data-md-toggle] found on the page. Each toggle lives inside a
// <main>, so we scope the lookup to that main to avoid cross-page collisions.
export function initMarkdownToggles() {
  document.querySelectorAll<HTMLElement>('[data-md-toggle]').forEach((t) => {
    const main = t.closest('main') as HTMLElement | null;
    if (main) initMdToggle(main);
  });
}
