import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Derive GitHub Pages settings from the CI environment so the same source
// works locally (root '/') and on Pages (subpath '/<repo>/').
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0];
const isCI = !!process.env.GITHUB_ACTIONS;

export default defineConfig({
  site: isCI && owner ? `https://${owner}.github.io` : 'http://localhost:4321',
  base: isCI && repo ? `/${repo}/` : '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
