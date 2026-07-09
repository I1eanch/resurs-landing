import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves the site from /<repo>/. Docker/nginx serves it from /.
const forPages = process.env.DEPLOY_TARGET === 'pages';

export default defineConfig({
  site: forPages ? 'https://i1eanch.github.io' : 'https://resurs.school',
  base: forPages ? '/resurs-landing' : '/',
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: true },
  },
});
