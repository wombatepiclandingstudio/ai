import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// The site is served from a custom domain, so GitHub Pages serves at the root "/"
// and `base` stays "/". The canonical/OG `site` URL is resolved WITHOUT
// hardcoding a domain:
//   1. PUBLIC_SITE_URL  - set in CI (e.g. from a GitHub Actions/Variables entry)
//   2. fallback         - the default GitHub Pages URL for this repo
//   3. localhost        - local dev
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0];
const isCI = !!process.env.GITHUB_ACTIONS;

const site =
  process.env.PUBLIC_SITE_URL ||
  (isCI && owner ? `https://${owner}.github.io` : 'http://localhost:4321');

export default defineConfig({
  site,
  base: '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
