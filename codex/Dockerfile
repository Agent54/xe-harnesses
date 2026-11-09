# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim
ARG CODEX_VERSION=0.166.0
LABEL org.opencontainers.image.source="https://github.com/openai/codex"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g @openai/codex@${CODEX_VERSION} \
    && npm cache clean --force \
    && install -d -o node -g node /workspace
USER node
WORKDIR /workspace
ENV TERM=xterm-256color
ENTRYPOINT ["codex"]
