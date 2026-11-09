# LibreChat

Copy `.env.example` to `.env`, fill its four application secrets, and run `docker compose up --build -d`. Open [the LibreChat domain](https://librechat_harness-librechat.app.localhost). `PUBLIC_URL` sets both upstream `DOMAIN_CLIENT` and `DOMAIN_SERVER`, so login redirects, callbacks, secure-cookie decisions, and generated links use the HTTPS browser origin.

`TRUST_PROXY=1` matches one trusted TLS reverse-proxy hop; set it to the actual trusted hop count if your deployment differs. The proxy must preserve the public Host and send the correct `X-Forwarded-Proto: https`. Register any OAuth application with the callback URI LibreChat expects under this domain. Internal MongoDB traffic and health probes keep their container addresses.

This minimal stack includes the app and MongoDB; optional search, RAG, and admin-panel services remain omitted. No state is mounted, and container recreation deletes it. Image builds and provider/browser flows remain untested because Docker daemon access was declined.

Source: the pinned [environment settings](https://github.com/danny-avila/LibreChat/blob/v0.8.9-rc1/.env.example).

## Version and entry point

Pin: [0.8.9-rc1](https://github.com/danny-avila/LibreChat/releases/tag/v0.8.9-rc1), preview. Entry: [HTTPS app](https://librechat_harness-librechat.app.localhost) · [direct:3081](http://localhost:3081).

See [versions.json](../versions.json) for source verification dates.

generate the four secrets described in `.env.example`, register a local account, and enter provider credentials. This minimal stack includes MongoDB and the app; optional Meilisearch, RAG/vector database, and admin-panel services are omitted. Search is disabled. Its MongoDB 8.0.20 pin follows the upstream application stack.
