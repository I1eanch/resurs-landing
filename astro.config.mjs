import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * Домен нужен НА ЭТАПЕ СБОРКИ: из него Astro строит абсолютный `og:image`,
 * `canonical` и `sitemap.xml`. Задаётся переменной SITE_URL — в Dokploy это
 * build-аргумент, локально можно просто `SITE_URL=… npm run build`.
 *
 * Значение по умолчанию — боевой домен, чтобы `npm run build` без переменной
 * не собрал молча сайт с битым og:image (мы на этом уже обжигались).
 */
const site = process.env.SITE_URL || 'https://scholnutrition.nutritionforyou.kz';

export default defineConfig({
  site,
  base: '/',
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: true },
  },
});
