import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// The site is served from a custom domain (ai.wombatepiclanding.studio), so
// GitHub Pages serves at the root "/". We therefore keep `base` at "/" even in
// CI. `site` is set to the custom domain so canonical/OG URLs resolve there.
const isCI = !!process.env.GITHUB_ACTIONS;

export default defineConfig({
  site: isCI ? 'https://ai.wombatepiclanding.studio' : 'http://localhost:4321',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
