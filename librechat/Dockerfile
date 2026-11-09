# syntax=docker/dockerfile:1
FROM node:24.22.2-alpine AS build
ARG LIBRECHAT_VERSION=0.8.9-rc1
RUN apk add --no-cache ca-certificates curl git python3 build-base
WORKDIR /app
RUN curl -fL --retry 3 "https://codeload.github.com/danny-avila/LibreChat/tar.gz/refs/tags/v${LIBRECHAT_VERSION}" \
    | tar -xz --strip-components=1 \
    && touch .env \
    && npm ci --no-audit --no-fund \
    && NODE_OPTIONS=--max-old-space-size=6144 npm run frontend \
    && npm prune --omit=dev \
    && npm cache clean --force
FROM node:24.22.2-alpine
LABEL org.opencontainers.image.source="https://github.com/danny-avila/LibreChat"
RUN apk add --no-cache ca-certificates git python3 py3-pip bash jemalloc
# Same extended MCP tooling as the release's upstream Dockerfile.
COPY --from=ghcr.io/astral-sh/uv:0.9.5 /uv /uvx /usr/local/bin/
COPY --from=build --chown=node:node /app /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3080 \
    LD_PRELOAD=/usr/lib/libjemalloc.so.2 SCARF_ANALYTICS=false
USER node
WORKDIR /app
RUN mkdir -p client/public/images logs uploads skill data
EXPOSE 3080
CMD ["npm", "run", "backend"]
