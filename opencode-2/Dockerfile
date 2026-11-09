# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim
ARG OPENCODE_VERSION=2.2.5
LABEL org.opencontainers.image.source="https://github.com/anomalyco/opencode"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g @opencode/cli@${OPENCODE_VERSION} \
    && npm cache clean --force \
    && install -d -o node -g node /workspace
USER node
WORKDIR /workspace
EXPOSE 4096
ENTRYPOINT ["opencode"]
CMD ["serve", "--hostname", "0.0.0.0", "--port", "4096"]
