/**
 * Склейка пути с базовым URL сайта.
 *
 * Сайт живёт либо в корне (Docker/nginx, `base: '/'`), либо в подпапке
 * (GitHub Pages, `base: '/resurs-landing'`). Astro отдаёт `BASE_URL`
 * ровно тем, что записано в конфиге, — БЕЗ завершающего слэша во втором
 * случае. Поэтому наивное `` `${BASE_URL}favicon.svg` `` даёт
 * `/resurs-landingfavicon.svg`, и страница молча теряет фавикон.
 *
 * `<Image>` и импорты ассетов Astro разруливает сам. Эта функция нужна
 * только там, где путь пишется руками: favicon, ссылки на юр. страницы.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return suffix ? `${base}/${suffix}` : `${base}/`;
}
