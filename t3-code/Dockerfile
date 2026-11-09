# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim
ARG T3_VERSION=0.1.7
ARG CODEX_VERSION=0.166.0
ARG OPENCODE_VERSION=2.2.5
ARG PI_VERSION=1.5.0
LABEL org.opencontainers.image.source="https://github.com/pingdotgg/t3code"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git gh openssh-client ripgrep python3 build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g t3@${T3_VERSION} @openai/codex@${CODEX_VERSION} \
       @opencode/cli@${OPENCODE_VERSION} @earendil-works/pi-coding-agent@${PI_VERSION} \
    && npm cache clean --force \
    && install -d -o node -g node /workspace /home/node/.local /home/node/.local/bin
# Provider installers and managed runtimes remain writable by the service user.
ENV NPM_CONFIG_PREFIX=/home/node/.local
ENV PATH=/home/node/.local/bin:${PATH}
COPY --chown=node:node server.mjs /opt/t3-code/server.mjs
USER node
WORKDIR /workspace
EXPOSE 3773
ENTRYPOINT ["node", "/opt/t3-code/server.mjs"]
