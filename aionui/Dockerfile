# syntax=docker/dockerfile:1
# v2.2.2 publishes source, but no AionUI installer/web assets on GitHub.
# Use its own standalone web packaging script; Electron is build-only.
FROM node:24.22.2-trixie-slim AS build
ARG AIONUI_VERSION=2.2.2
ARG BUN_VERSION=1.4.4
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git python3 build-essential libicu-dev \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g bun@${BUN_VERSION} \
    && npm cache clean --force
WORKDIR /src
ENV CI=true ELECTRON_SKIP_BINARY_DOWNLOAD=1 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN curl -fL --retry 3 "https://github.com/iOfficeAI/AionUi/archive/refs/tags/v${AIONUI_VERSION}.tar.gz" -o source.tar.gz \
    && tar -xzf source.tar.gz --strip-components=1 && rm source.tar.gz \
    && bun install --frozen-lockfile --ignore-scripts \
    && bun run package \
    && node scripts/pack-web-cli.js \
    && aionui_arch="$(node -p 'process.arch === "x64" ? "x86_64" : process.arch')" \
    && mkdir /runtime \
    && tar -xzf "dist-web-cli/aionui-web-${AIONUI_VERSION}-linux-${aionui_arch}.tar.gz" -C /runtime \
    && /runtime/aionui-web/aionui-web version

FROM node:24.22.2-trixie-slim
ARG CODEX_VERSION=0.166.0
LABEL org.opencontainers.image.source="https://github.com/iOfficeAI/AionUi"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git openssh-client ripgrep python3 libicu-dev libssl3t64 \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g @openai/codex@${CODEX_VERSION} \
    && npm cache clean --force \
    && install -d -o node -g node /workspace /home/node/.local /home/node/.local/bin /home/node/.aionui-web
# The backend may prepare/update managed resources alongside the bundle.
COPY --from=build --chown=node:node /runtime/aionui-web /opt/aionui
ENV NODE_ENV=production AIONUI_DATA_DIR=/home/node/.aionui-web \
    AIONUI_OPEN_BROWSER=false NPM_CONFIG_PREFIX=/home/node/.local
ENV PATH=/opt/aionui:/home/node/.local/bin:${PATH}
USER node
WORKDIR /workspace
COPY entrypoint.sh /usr/local/bin/aionui-entrypoint.sh
EXPOSE 25808
ENTRYPOINT ["sh", "/usr/local/bin/aionui-entrypoint.sh"]
CMD ["start", "--remote", "--port", "25808", "--no-open"]
