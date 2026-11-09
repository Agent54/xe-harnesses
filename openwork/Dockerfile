# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim
ARG OPENWORK_VERSION=0.18.64
LABEL org.opencontainers.image.source="https://github.com/different-ai/openwork"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g openwork-server@${OPENWORK_VERSION} \
    && npm cache clean --force \
    && install -d -o node -g node /workspace /home/node/.local /home/node/.local/bin \
       /home/node/.openwork
# The published Node bundle contains the SPA and plugins. The upstream web
# launcher downloads its release-tested engine into this user's home on first boot.
ENV NODE_ENV=production OPENWORK_NO_UPDATE_CHECK=1 NPM_CONFIG_PREFIX=/home/node/.local
ENV PATH=/home/node/.local/bin:${PATH}
USER node
WORKDIR /workspace
COPY entrypoint.sh /usr/local/bin/openwork-entrypoint.sh
EXPOSE 8780
ENTRYPOINT ["sh", "/usr/local/bin/openwork-entrypoint.sh"]
CMD ["web", "--host", "0.0.0.0", "--port", "8780", "--no-bootstrap-token"]
