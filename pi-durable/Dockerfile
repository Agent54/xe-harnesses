# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim
ARG PI_VERSION=1.5.0
LABEL org.opencontainers.image.source="https://github.com/earendil-works/pi"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /app /workspace /home/node/data
WORKDIR /app
USER node
RUN npm install --omit=dev --no-audit --no-fund \
    @earendil-works/pi-durable@${PI_VERSION} @earendil-works/pi-ai@${PI_VERSION} @earendil-works/chord@${PI_VERSION} \
    && npm cache clean --force
COPY --chown=node:node server.mjs /app/server.mjs
RUN node --check /app/server.mjs
WORKDIR /workspace
EXPOSE 8080
CMD ["node", "/app/server.mjs"]
