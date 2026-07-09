# syntax=docker/dockerfile:1

# ---- Сборка ----------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

# vite объявлен в devDependencies — им мы схлопываем две копии vite в одну.
# `--include=dev` здесь страховка, а не необходимость: проверено сборкой, что
# `npm ci --omit=dev` тоже проходит, потому что ту же версию vite требует Astro,
# а package-lock.json её фиксирует. Флаг оставлен на случай, если в
# devDependencies когда-нибудь окажется зависимость, нужная только для сборки:
# платформы деплоя любят подставлять `--omit=dev` без спроса.
RUN npm ci --include=dev --no-audit --no-fund

COPY . .

# Домен нужен именно здесь: Astro запекает его в og:image, canonical и sitemap.
# Dokploy передаёт значение через build-аргумент; дефолт — боевой домен.
ARG SITE_URL=https://scholnutrition.nutritionforyou.kz
ENV SITE_URL=${SITE_URL}

RUN npm run build

# ---- Раздача ---------------------------------------------------------------
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
