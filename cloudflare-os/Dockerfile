# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim
# Upstream has no releases; this is the main commit verified on 2026-11-04.
ARG CLOUDFLARE_OS_REF=a3ba4746b58f1ef8e2252f8bac6b6377099202f0
ARG PNPM_VERSION=11.17.0
LABEL org.opencontainers.image.source="https://github.com/cloudflare/cloudflare-os"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git patch python3 build-essential socat \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm@${PNPM_VERSION} \
    && npm cache clean --force \
    && install -d -o node -g node /app
USER node
WORKDIR /app
COPY public-origin.patch /public-origin.patch
RUN curl -fL --retry 3 "https://github.com/cloudflare/cloudflare-os/archive/${CLOUDFLARE_OS_REF}.tar.gz" -o source.tar.gz \
    && tar -xzf source.tar.gz --strip-components=1 && rm source.tar.gz \
    && patch --batch --fuzz=0 -p1 < /public-origin.patch \
    && pnpm install --frozen-lockfile \
    && pnpm exec vp run --cache '@gadgets/typed-storage#build' \
    && pnpm exec vp run --cache '@gadgets/workshop-frontend#build:assets'
ENV WRANGLER_SEND_METRICS=false VITE_BACKEND_HOST=localhost:8787
# Keep the internal Wrangler listener on loopback. PUBLIC_BASE_URL controls
# advertised links and patched gatekeeper callbacks; the SPA uses its own origin.
EXPOSE 8788
CMD ["sh", "-c", "socat TCP-LISTEN:8788,bind=0.0.0.0,reuseaddr,fork TCP:127.0.0.1:8787 & exec node scripts/run-dev-server.ts --serve-frontend-assets"]
