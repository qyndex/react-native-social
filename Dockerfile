# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS build
WORKDIR /app

# Build deps for any native modules pulled in at install time.
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Expo SDK 50+ requires `expo export --platform web`; the legacy `export:web`
# command was removed. app.json sets web.bundler=metro + web.output=static so
# this emits a static dist/ with index.html + JS bundles.
RUN npx expo export --platform web --output-dir dist

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# SPA fallback so expo-router deep-linked paths (e.g. /post/123) resolve on refresh.
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
