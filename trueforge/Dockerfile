# syntax=docker/dockerfile:1
FROM node:24.22.2-bookworm-slim AS build
ARG TRUEFORGE_VERSION=0.183.0
WORKDIR /app
COPY public-origin.patch /public-origin.patch
RUN apt-get update && apt-get install -y --no-install-recommends patch python3 build-essential \
    && npm install --omit=dev @truefoundry/trueforge@${TRUEFORGE_VERSION} \
    && patch --batch --fuzz=0 -p1 < /public-origin.patch \
    && npm cache clean --force
FROM node:24.22.2-bookworm-slim
LABEL org.opencontainers.image.source="https://github.com/truefoundry/trueforge"
COPY --from=build --chown=node:node /app /app
ENV NODE_ENV=production STANDALONE=true HOST=0.0.0.0 PORT=8790
USER node
WORKDIR /app
EXPOSE 8790
CMD ["node", "node_modules/@truefoundry/trueforge/dist/main.js"]
