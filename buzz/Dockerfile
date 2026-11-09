# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim AS source
ARG BUZZ_REF=desktop-v0.5.28
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
    && mkdir /src \
    && curl -fL --retry 3 "https://github.com/block/buzz/archive/refs/tags/${BUZZ_REF}.tar.gz" \
       | tar -xz --strip-components=1 -C /src

FROM rust:1.95-bookworm AS rust-build
RUN apt-get update && apt-get install -y --no-install-recommends pkg-config libssl-dev ca-certificates git \
    && rm -rf /var/lib/apt/lists/*
COPY --from=source /src /src
WORKDIR /src
ENV SQLX_OFFLINE=true
RUN cargo build --release --locked -p buzz-relay -p buzz-admin -p buzz-acp -p buzz-cli -p buzz-dev-mcp \
    && strip target/release/buzz-relay target/release/buzz-admin target/release/buzz-acp \
       target/release/buzz target/release/buzz-dev-mcp

FROM node:24.22.2-bookworm-slim AS web-build
RUN npm install -g pnpm@11.4.0 && npm cache clean --force
COPY --from=source /src /src
WORKDIR /src
RUN pnpm install --frozen-lockfile --filter buzz-web --filter buzz-admin-web \
    && pnpm -C web build && pnpm -C admin-web build

FROM node:24.22.2-bookworm-slim AS runtime
LABEL org.opencontainers.image.source="https://github.com/block/buzz"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git openssh-client python3 ripgrep libdbus-1-3 libxcb1 libssl3 \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /workspace /data/git
COPY --from=rust-build /src/target/release/buzz-relay /usr/local/bin/buzz-relay
COPY --from=rust-build /src/target/release/buzz-admin /usr/local/bin/buzz-admin
COPY --from=rust-build /src/target/release/buzz-acp /usr/local/bin/buzz-acp
COPY --from=rust-build /src/target/release/buzz /usr/local/bin/buzz
COPY --from=rust-build /src/target/release/buzz-dev-mcp /usr/local/bin/buzz-dev-mcp
USER node
WORKDIR /workspace

FROM runtime AS goose-download
USER root
ARG GOOSE_VERSION=1.57.0
ARG TARGETARCH
RUN case "$TARGETARCH" in amd64) arch=x86_64 ;; arm64) arch=aarch64 ;; *) exit 1 ;; esac \
    && curl -fL --retry 3 "https://github.com/aaif-goose/goose/releases/download/v${GOOSE_VERSION}/goose-${arch}-unknown-linux-gnu.tar.gz" -o /goose.tar.gz \
    && mkdir /goose && tar -xzf /goose.tar.gz -C /goose \
    && install /goose/goose /usr/local/bin/goose

FROM runtime AS agent
COPY --from=goose-download /usr/local/bin/goose /usr/local/bin/goose
ENV BUZZ_ACP_AGENT_COMMAND=goose BUZZ_ACP_AGENT_ARGS=acp BUZZ_ACP_MCP_COMMAND=buzz-dev-mcp
ENTRYPOINT ["buzz-acp"]

FROM runtime AS relay
COPY --from=web-build /src/web/dist /srv/buzz/web
COPY --from=web-build /src/admin-web/dist /srv/buzz/admin-web
ENV BUZZ_WEB_DIR=/srv/buzz/web BUZZ_ADMIN_WEB_DIR=/srv/buzz/admin-web
EXPOSE 3000 8080
ENTRYPOINT ["buzz-relay"]
