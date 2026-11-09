# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim AS build
ARG ZCODE_VERSION=3.17.1
ARG PNPM_VERSION=10.33.2
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git python3 build-essential cmake pkg-config \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm@${PNPM_VERSION} \
    && npm cache clean --force
WORKDIR /src
# Electron is not used by the packaged web server.
ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN curl -fL --retry 3 "https://github.com/zai-org/ZCode/archive/refs/tags/v${ZCODE_VERSION}.tar.gz" -o source.tar.gz \
    && tar -xzf source.tar.gz --strip-components=1 && rm source.tar.gz \
    && pnpm install --frozen-lockfile \
    && pnpm build:zcode --out-dir /output \
       --base-url "https://github.com/zai-org/ZCode/releases/download/v${ZCODE_VERSION}/" \
    && mkdir /runtime \
    && tar -xzf "/output/releases/${ZCODE_VERSION}/zcode-${ZCODE_VERSION}.tar.gz" -C /runtime \
    && test -f /runtime/zcode/bin/zcode.mjs

FROM node:24.22.2-bookworm-slim
LABEL org.opencontainers.image.source="https://github.com/zai-org/ZCode"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 libatomic1 \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /workspace
COPY --from=build /runtime/zcode /opt/zcode
USER node
WORKDIR /workspace
COPY entrypoint.sh /usr/local/bin/zcode-entrypoint.sh
EXPOSE 3030
ENTRYPOINT ["sh", "/usr/local/bin/zcode-entrypoint.sh"]
CMD ["--web", "--workspace", "/workspace", "--host", "0.0.0.0", "--port", "3030", "--no-open"]
