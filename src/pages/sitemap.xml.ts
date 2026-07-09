import type { APIRoute } from 'astro';

/**
 * Три страницы — отдельная интеграция ради них не нужна.
 * `404` в карту не попадает намеренно.
 */
const routes = [
  { path: '', priority: '1.0' },
  { path: 'oferta/', priority: '0.3' },
  { path: 'politika/', priority: '0.3' },
];

export const GET: APIRoute = ({ site }) => {
  const urls = routes
    .map(({ path, priority }) => {
      const loc = new URL(path, site).href;
      return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
