# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim AS build
ARG KIMI_CODE_VERSION=2.5.2
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential \
    && npm install -g @moonshot-ai/kimi-code@${KIMI_CODE_VERSION} \
    && npm cache clean --force
FROM node:24.22.2-bookworm-slim
LABEL org.opencontainers.image.source="https://github.com/MoonshotAI/kimi-code"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /workspace
COPY --from=build /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=build /usr/local/bin/ /usr/local/bin/
USER node
WORKDIR /workspace
ENV TERM=xterm-256color \
    KIMI_CODE_NO_AUTO_UPDATE=1
RUN kimi --version
ENTRYPOINT ["kimi"]
