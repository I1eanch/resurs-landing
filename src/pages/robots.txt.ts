import type { APIRoute } from 'astro';

/**
 * robots.txt собирается из `site`, а не пишется руками: домен задан в одном
 * месте (astro.config.mjs ← SITE_URL), и sitemap не разъедется с ним.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap.xml', site).href;

  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
