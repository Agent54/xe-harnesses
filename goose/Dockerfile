# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim AS download
ARG GOOSE_VERSION=1.57.0
ARG TARGETARCH
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
    && case "$TARGETARCH" in \
       amd64) arch=x86_64; digest=10eb96cb6a159b6e1d38eeedbef6ab64cd28168aad91948f1fa5c34eefdf98e3 ;; \
       arm64) arch=aarch64; digest=c32605acfd560aeb2adbf17ec359cc0217e28022a7e647b35a6af5dcfca91749 ;; \
       *) exit 1 ;; esac \
    && curl -fL --retry 3 "https://github.com/aaif-goose/goose/releases/download/v${GOOSE_VERSION}/goose-${arch}-unknown-linux-gnu.tar.gz" -o /goose.tar.gz \
    && echo "${digest}  /goose.tar.gz" | sha256sum -c - \
    && mkdir /goose && tar -xzf /goose.tar.gz -C /goose \
    && install /goose/goose /usr/local/bin/goose
FROM node:24.22.2-bookworm-slim
LABEL org.opencontainers.image.source="https://github.com/aaif-goose/goose"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 libxcb1 libdbus-1-3 libssl3 \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /workspace
COPY --from=download /usr/local/bin/goose /usr/local/bin/goose
USER node
WORKDIR /workspace
ENV TERM=xterm-256color
ENTRYPOINT ["goose"]
CMD ["session"]
