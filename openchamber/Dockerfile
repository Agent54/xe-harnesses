# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim AS build
ARG OPENCHAMBER_VERSION=2.6.1
ARG OPENCODE_VERSION=2.2.5
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential \
    && npm install -g @openchamber/web@${OPENCHAMBER_VERSION} @opencode/cli@${OPENCODE_VERSION} \
    && npm cache clean --force
FROM node:24.22.2-bookworm-slim
LABEL org.opencontainers.image.source="https://github.com/openchamber/openchamber"
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client ripgrep python3 \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /workspace
COPY --from=build /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=build /usr/local/bin/ /usr/local/bin/
ENV OPENCHAMBER_HOST=0.0.0.0
USER node
WORKDIR /workspace
EXPOSE 3000
ENTRYPOINT ["openchamber"]
CMD ["serve", "--foreground", "--port", "3000"]
