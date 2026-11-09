# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim AS build
ARG BB_VERSION=0.48.1
ARG CODEX_VERSION=0.166.0
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential git \
    && npm install -g bb-app@${BB_VERSION} @openai/codex@${CODEX_VERSION} \
    && npm cache clean --force
FROM node:24.22.2-bookworm-slim
LABEL org.opencontainers.image.source="https://github.com/get-bb/bb"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git gh openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /workspace
COPY --from=build /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=build /usr/local/bin/ /usr/local/bin/
USER node
WORKDIR /workspace
EXPOSE 38886
ENTRYPOINT ["bb-app"]
CMD ["--server-bind-host", "0.0.0.0", "--server-port", "38886", "--no-in-app-updates"]
