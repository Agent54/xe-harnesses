# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim
ARG PI_VERSION=1.5.0
LABEL org.opencontainers.image.source="https://github.com/earendil-works/pi"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g --ignore-scripts @earendil-works/pi-coding-agent@${PI_VERSION} \
    && npm cache clean --force \
    && install -d -o node -g node /workspace
USER node
WORKDIR /workspace
ENV TERM=xterm-256color
RUN pi --version
ENTRYPOINT ["pi"]
