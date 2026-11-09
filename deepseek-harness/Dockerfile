# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim AS build
ARG DSH_VERSION=0.2.2-alpha.3
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential git \
    && npm install -g @deepseek-ai/dsh@${DSH_VERSION} \
    && npm cache clean --force
FROM node:24.22.2-bookworm-slim
LABEL org.opencontainers.image.source="https://github.com/deepseek-ai/deepseek-harness"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /workspace
COPY --from=build /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=build /usr/local/bin/ /usr/local/bin/
USER node
WORKDIR /workspace
EXPOSE 3080
# DSH rejects wildcard addresses. Resolve the container's concrete interface
# at startup, keeping the upstream web server and browser-trust fence intact.
CMD ["sh", "-ec", "set -- $(hostname -i); public_host=\"$(node -p 'new URL(process.env.PUBLIC_URL).host')\"; exec dsh web --host \"$1\" --port 3080 --no-open --public-url \"$PUBLIC_URL\" --trusted-host \"$public_host\" localhost:3080 127.0.0.1:3080"]
