# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim AS build
ARG QWEN_CODE_VERSION=0.26.7
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential \
    && npm install -g @qwen-code/qwen-code@${QWEN_CODE_VERSION} \
    && npm cache clean --force
FROM node:24.22.2-bookworm-slim
LABEL org.opencontainers.image.source="https://github.com/QwenLM/qwen-code"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /workspace
COPY --from=build /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=build /usr/local/bin/ /usr/local/bin/
USER node
WORKDIR /workspace
EXPOSE 4170
ENTRYPOINT ["qwen"]
CMD ["serve", "--hostname", "0.0.0.0", "--port", "4170", "--workspace", "/workspace", "--require-auth", "--allow-origin", "http://localhost:4170", "--allow-origin", "http://127.0.0.1:4170"]
